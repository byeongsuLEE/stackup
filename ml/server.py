# from flask import Flask, request, jsonify
# import joblib
# import numpy as np
# import pandas as pd
# from confluent_kafka import Producer
# import json
# from tensorflow.keras.models import load_model as keras_load_model
# from sklearn.preprocessing import MinMaxScaler
# import logging

# # Kafka 프로듀서 설정
# conf = {'bootstrap.servers': '34.64.190.133:9092'}
# producer = Producer(conf)

# # 로그 설정
# logging.basicConfig(filename='error.log', level=logging.ERROR)

# # 머신러닝 모델 로딩
# MODEL_PATH = './trained_model/autoencoder_model.h5'
# scaler_path = './trained_model/scaler_model.pkl'  # 기존 학습에 사용된 스케일러 파일 경로

# # 재학습에 필요한 데이터 설정
# RETRAIN_THRESHOLD = 1000  # 재학습할 때 필요한 데이터 수
# normal_data_cache = []  # 정상 데이터를 캐시할 리스트

# PERCENTILE_THRESHOLD = 85

# def load_model():
#     try:
#         model = keras_load_model(MODEL_PATH)
#     except FileNotFoundError:
#         print(f"Model file not found at {MODEL_PATH}")
#         model = None
#     except Exception as e:
#         print(f"Error loading model: {e}")
#         model = None
#     return model

# model = load_model()

# # 결측값 처리 함수
# def check_missing_values(data):
#     for key in data:
#         if data[key] is None or pd.isna(data[key]):
#             if key == 'deposit' or key == 'period':
#                 median_value = np.median([d for d in data[key] if d is not None])
#                 data[key] = median_value
#             else:
#                 data[key] = 0  # 기본값 0으로 대체
#     return data

# # 동적 임계값 설정 함수 (백분위수 + 평균/표준편차 기반)
# def dynamic_threshold(mse):
#     threshold_percentile = np.percentile(mse, PERCENTILE_THRESHOLD)
#     mean_mse = np.mean(mse)
#     std_mse = np.std(mse)
#     threshold_std = mean_mse + 3 * std_mse
#     # 두 임계값 중 큰 값을 선택 (혹은 더 적합한 방식으로 선택 가능)
#     return max(threshold_percentile, threshold_std)

# # 전처리 함수 정의
# def preprocess_data(data, scaler):
#     data = check_missing_values(data)  # 결측값 처리
#     # 필요한 필드 추출
#     required_fields = ['period', 'deposit', 'level']
#     data = {key: data[key] for key in required_fields}

#     # 레벨 전처리
#     # data = preprocess_level(data)

#     # 거래 금액과 거래 기간 데이터 추출 및 전처리
#     total_price = np.array(data['deposit']).reshape(-1, 1)  # deposit 열을 사용
#     period = np.array(data['period']).reshape(-1, 1)  # period 열을 사용하여 기간 데이터 추출
#     level = np.array(data['level']).reshape(-1, 1)  # level 추가

#     # 거래 금액을 거래 기간으로 나누어 일일 거래 금액(price_per_day) 계산
#     price_per_day = total_price / period

#     # 거래 금액, 일일 거래 금액, 레벨을 결합한 새로운 특징 데이터
#     features = np.hstack((total_price, price_per_day, level))

#     # 기존 학습 시 사용된 스케일러로 정규화
#     scaled_features = scaler.transform(features)

#     return scaled_features

# # 재구성 오차 계산 함수
# def compute_reconstruction_error(original, reconstructed):
#     mse = np.mean(np.power(original - reconstructed, 2), axis=1)
#     return mse

# # 재학습 함수
# def retrain_model():
#     global normal_data_cache, model
#     if len(normal_data_cache) >= RETRAIN_THRESHOLD:
#         new_data = np.vstack(normal_data_cache)
#         epochs = max(1, min(10, len(normal_data_cache) // 1000))  # 데이터 양에 따라 동적으로 에포크 수 조정 (1~10 에포크)
#         model.fit(new_data, new_data, epochs=epochs, batch_size=32)  # 재학습 수행
#         model.save(MODEL_PATH)  # 재학습된 모델 저장
#         normal_data_cache = []  # 캐시 초기화
#         print(f"Model retrained with new data. Epochs: {epochs}")

# @app.route('/flask/api/analyze', methods=['POST'])
# def analyze():
#     global model, normal_data_cache
#     data = request.json # New project
    
#     # 데이터 출력
#     print("Received data:", data)
    
#     # 데이터 유효성 검사
#     required_fields = ['period', 'deposit', 'level', 'boardId']
#     for field in required_fields:
#         if field not in data:
#             print(f"Missing field: {field}")
#             return jsonify({'error': f'Missing field: {field}'}), 400

#     # 필드 값 유효성 검사
#     if data['period'] <= 0 or data['deposit'] <= 0:
#         return jsonify({'error': 'Invalid period or deposit value'}), 400

#     try:
#         # 스케일러 로딩 및 예외 처리 추가
#         try:
#             scaler = joblib.load(scaler_path)
#         except FileNotFoundError:
#             return jsonify({'error': 'Scaler not found'}), 404
#         except Exception as e:
#             logging.error(f"Error loading scaler: {str(e)}")
#             return jsonify({'error': 'Scaler loading failed'}), 500

#         # 데이터 전처리
#         processed_data = preprocess_data(data, scaler)
#         print("Processed data for prediction:", processed_data)

#         if model is not None:
#             try:
#                 # 예측
#                 reconstructed_data = model.predict(processed_data)
#                 mse = compute_reconstruction_error(processed_data, reconstructed_data)

#                 # 임계값 동적 계산 (기존 데이터의 95% 분위수)
#                 threshold = dynamic_threshold(mse)  # 95가 아닌 변수를 사용
#                 anomalies = mse > threshold

#                 # Kafka로 결과 전송
#                 message = json.dumps({
#                     'boardId': data['boardId'],
#                     'is_anomaly': anomalies.tolist(),
#                     'reconstruction_error': mse.tolist()
#                 })

#                 # Kafka로 메시지 전송 및 콜백 설정
#                 producer.produce('analysis_results', message, callback=delivery_report)
#                 producer.flush()

#                 # 정상 데이터인 경우에만 캐시에 저장
#                 if not any(anomalies):
#                     normal_data_cache.append(processed_data)
#                     retrain_model()  # 캐시에 데이터가 1000개 이상이면 재학습
                
#                 return jsonify({'status': 'Analysis in progress'}), 202

#             except Exception as e:
#                 logging.error(f"Prediction error: {str(e)}")
#                 return jsonify({'error': 'Prediction failed'}), 500
#         else:
#             return jsonify({'error': 'Model not found'}), 404
#     except Exception as e:
#         print(f"Processing error: {e}")
#         logging.error(f"Processing error: {str(e)}")
#         return jsonify({'error': 'Processing failed'}), 500

# # Kafka 메시지 전송 후 콜백 함수
# def delivery_report(err, msg):
#     if err is not None:
#         logging.error(f"Message delivery failed: {err}")
#         print(f"Message delivery failed: {err}")
#     else:
#         print(f"Message delivered to {msg.topic()} [{msg.partition()}]")

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000)
