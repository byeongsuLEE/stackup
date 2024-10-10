# import os
# import json
# import joblib
# import numpy as np
# import pandas as pd
# from flask import Flask, request, jsonify
# from confluent_kafka import Producer
# from tensorflow.keras.models import Model, load_model
# from tensorflow.keras.layers import Input, Dense
# from sklearn.preprocessing import MinMaxScaler

# app = Flask(__name__)

# # Kafka 프로듀서 설정
# KAFKA_BOOTSTRAP_SERVERS = 'localhost:9092'
# KAFKA_TOPIC = 'analysis_results'

# conf = {'bootstrap.servers': KAFKA_BOOTSTRAP_SERVERS}
# producer = Producer(conf)

# # 경로 설정
# DATA_PATH = './result.json'
# ANOMALY_RESULT_PATH = './res/anomaly_detection_result.json'
# SCALER_PATH = './scaler.save'
# MODEL_PATH = 'autoencoder_model.h5'

# # Autoencoder 모델 초기화 또는 로드
# def initialize_autoencoder(input_dim, encoding_dim=16):
#     if os.path.exists(MODEL_PATH):
#         autoencoder = load_model(MODEL_PATH)
#         print("기존 Autoencoder 모델을 로드했습니다.")
#     else:
#         input_layer = Input(shape=(input_dim,))
#         encoder = Dense(encoding_dim, activation='relu')(input_layer)
#         decoder = Dense(input_dim, activation='sigmoid')(encoder)
#         autoencoder = Model(inputs=input_layer, outputs=decoder)
#         autoencoder.compile(optimizer='adam', loss='mean_squared_error')
#         print("새로운 Autoencoder 모델을 초기화했습니다.")
#     return autoencoder

# # 스케일러 초기화 또는 로드
# def initialize_scaler():
#     if os.path.exists(SCALER_PATH):
#         scaler = joblib.load(SCALER_PATH)
#         print("기존 스케일러를 로드했습니다.")
#     else:
#         scaler = MinMaxScaler()
#         print("새로운 스케일러를 초기화했습니다.")
#     return scaler

# # 데이터 불러오기
# def load_existing_data():
#     if os.path.exists(DATA_PATH):
#         data = pd.read_json(DATA_PATH)
#         print("기존 데이터를 로드했습니다.")
#     else:
#         data = pd.DataFrame(columns=['totalPrice', 'price_per_day'])
#         print("기존 데이터가 없어서 새로운 데이터프레임을 생성했습니다.")
#     return data

# # 새로운 프로젝트 데이터 전처리
# def preprocess_new_project(new_project_data):
#     new_data = pd.DataFrame([new_project_data])

#     # 'price'와 'period'를 숫자로 변환
#     new_data['price'] = new_data['price'].replace('[^0-9]', '', regex=True).astype(float)
#     new_data['period'] = new_data['period'].replace('[^0-9]', '', regex=True).astype(float)

#     # 'totalPrice'와 'price_per_day' 계산
#     def calculate_prices(row):
#         price_str = row['pricetype']
#         price = row['price']
#         period = row['period']

#         if "월" in price_str:
#             total_price = price * (period / 30)
#         elif "원" in price_str:
#             total_price = price
#         else:
#             total_price = np.nan

#         if pd.notnull(total_price) and period > 0:
#             price_per_day = total_price / period
#         else:
#             price_per_day = np.nan

#         return pd.Series({'totalPrice': total_price, 'price_per_day': price_per_day})

#     new_data[['totalPrice', 'price_per_day']] = new_data.apply(calculate_prices, axis=1)

#     # NaN 값 처리 (필요 시)
#     new_data = new_data[['totalPrice', 'price_per_day']].dropna()

#     return new_data

# # 재구성 오차 계산 함수
# def compute_reconstruction_error(original, reconstructed):
#     mse = np.mean(np.power(original - reconstructed, 2), axis=1)
#     return mse

# # 이상 감지 함수
# def detect_anomalies(scaled_data, model, threshold):
#     reconstructed_data = model.predict(scaled_data)
#     mse = compute_reconstruction_error(scaled_data, reconstructed_data)
#     anomalies = mse > threshold
#     return anomalies, mse

# # 임계값 설정 함수
# def set_threshold(model, scaler, training_data, percentile=95):
#     if training_data.empty:
#         print("학습할 데이터가 없습니다.")
#         return None

#     scaled_data = scaler.transform(training_data[['totalPrice', 'price_per_day']])
#     reconstructed = model.predict(scaled_data)
#     mse = compute_reconstruction_error(scaled_data, reconstructed)
#     threshold = np.percentile(mse, percentile)
#     print(f"설정된 임계값 (퍼센타일 {percentile}): {threshold}")
#     return threshold

# # 모델 학습 및 저장 함수
# def train_autoencoder(autoencoder, scaler, data, epochs=50, batch_size=32):
#     scaled_features = scaler.transform(data[['totalPrice', 'price_per_day']])
#     train_size = int(len(scaled_features) * 0.8)
#     train_data = scaled_features[:train_size]
#     val_data = scaled_features[train_size:]

#     autoencoder.fit(
#         train_data, train_data,
#         epochs=epochs,
#         batch_size=batch_size,
#         validation_data=(val_data, val_data),
#         verbose=1
#     )

#     autoencoder.save(MODEL_PATH)
#     print("Autoencoder 모델을 학습하고 저장했습니다.")

# # 초기화 단계
# existing_data = load_existing_data()
# scaler = initialize_scaler()

# if not existing_data.empty:
#     scaler.fit(existing_data[['totalPrice', 'price_per_day']])
#     joblib.dump(scaler, SCALER_PATH)
#     print("스케일러를 기존 데이터에 맞춰 피팅하고 저장했습니다.")
# else:
#     # 빈 데이터프레임인 경우 스케일러는 나중에 새로운 데이터가 들어올 때 피팅됩니다.
#     pass

# autoencoder = initialize_autoencoder(input_dim=2)

# if not existing_data.empty and os.path.exists(MODEL_PATH):
#     threshold = set_threshold(autoencoder, scaler, existing_data)
# else:
#     threshold = None
#     print("임계값을 설정할 수 없습니다. 모델을 학습시켜야 합니다.")

# # Flask 엔드포인트 정의
# @app.route('/detect_anomaly', methods=['POST'])
# def detect_anomaly():
#     global existing_data, scaler, autoencoder, threshold

#     try:
#         # 클라이언트로부터 JSON 데이터 수신
#         new_project_data = request.json
#         print(f"새로운 프로젝트 데이터 수신: {new_project_data}")

#         # 데이터 전처리
#         processed_new_data = preprocess_new_project(new_project_data)
#         if processed_new_data.empty:
#             return jsonify({"error": "전처리된 데이터가 비어 있습니다."}), 400

#         # 스케일링
#         if os.path.exists(SCALER_PATH):
#             scaler = joblib.load(SCALER_PATH)
#         else:
#             scaler = MinMaxScaler()
#             scaler.fit(existing_data[['totalPrice', 'price_per_day']])
#             joblib.dump(scaler, SCALER_PATH)
#             print("스케일러를 새로 피팅하고 저장했습니다.")

#         scaled_new_data = scaler.transform(processed_new_data)

#         # 모델 로드
#         if os.path.exists(MODEL_PATH):
#             autoencoder = load_model(MODEL_PATH)
#         else:
#             return jsonify({"error": "Autoencoder 모델이 존재하지 않습니다."}), 500

#         # 임계값 설정 (없을 경우)
#         if threshold is None:
#             threshold = set_threshold(autoencoder, scaler, existing_data)
#             if threshold is None:
#                 # 학습을 먼저 수행
#                 existing_data = pd.concat([existing_data, processed_new_data], ignore_index=True)
#                 scaler.fit(existing_data[['totalPrice', 'price_per_day']])
#                 joblib.dump(scaler, SCALER_PATH)
#                 train_autoencoder(autoencoder, scaler, existing_data)
#                 threshold = set_threshold(autoencoder, scaler, existing_data)
#                 if threshold is None:
#                     return jsonify({"error": "임계값 설정 실패."}), 500

#         # 이상 감지
#         anomalies, mse = detect_anomalies(scaled_new_data, autoencoder, threshold)
#         is_anomaly = anomalies[0]  # 단일 프로젝트이므로 첫 번째 값 사용
#         mse_value = float(mse[0])

#         response = {
#             "anomaly": bool(is_anomaly),
#             "mse": mse_value,
#             "threshold": float(threshold)
#         }

#         if is_anomaly:
#             # 이상 프로젝트인 경우 알림 및 모델 업데이트
#             print("이상 프로젝트가 감지되었습니다.")

#             # Kafka로 이상 메시지 전송
#             board_id = new_project_data.get('boardId', 'unknown')
#             message = json.dumps({'boardId': board_id, 'anomaly': True, 'mse': mse_value})
#             print("Sending anomaly message to Kafka:", message)
#             producer.produce(KAFKA_TOPIC, message)
#             producer.flush()

#             # 이상 프로젝트를 기존 데이터에 추가
#             existing_data = pd.concat([existing_data, processed_new_data], ignore_index=True)
#             scaler.fit(existing_data[['totalPrice', 'price_per_day']])
#             joblib.dump(scaler, SCALER_PATH)
#             train_autoencoder(autoencoder, scaler, existing_data)

#             # 임계값 재설정
#             threshold = set_threshold(autoencoder, scaler, existing_data)

#             response["message"] = "이상 프로젝트가 감지되었습니다. 모델을 업데이트했습니다."
#         else:
#             # 정상 프로젝트인 경우 모델 업데이트만
#             existing_data = pd.concat([existing_data, processed_new_data], ignore_index=True)
#             scaler.fit(existing_data[['totalPrice', 'price_per_day']])
#             joblib.dump(scaler, SCALER_PATH)
#             train_autoencoder(autoencoder, scaler, existing_data)

#             # 임계값 재설정
#             threshold = set_threshold(autoencoder, scaler, existing_data)

#             response["message"] = "정상 프로젝트입니다. 모델을 업데이트했습니다."

#         # 데이터 저장
#         existing_data.to_json(DATA_PATH, orient='records', force_ascii=False)
#         print("기존 데이터가 업데이트되었습니다.")

#         return jsonify(response), 200

#     except Exception as e:
#         print(f"에러 발생: {e}")
#         return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     # 필요 시 디렉토리 생성
#     if not os.path.exists('./res'):
#         os.makedirs('./res')
#     app.run(host='0.0.0.0', port=5000, debug=True)
