# pip install flask scikit-learn numpy pandas confluent-kafka

from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
from confluent_kafka import Producer
import json
from tensorflow.keras.models import load_model as keras_load_model
from sklearn.preprocessing import MinMaxScaler

app = Flask(__name__)

# Kafka 프로듀서 설정
conf = {'bootstrap.servers': 'localhost:9092'}
producer = Producer(conf)

# 머신러닝 모델 로딩
MODEL_PATH = './trained_model/autoencoder_model.h5'
# def load_model():
#     try:
#         model = joblib.load(MODEL_PATH)
#     except FileNotFoundError:
#         model = None
#     return model
def load_model():
    try:
        model = keras_load_model(MODEL_PATH)
    except FileNotFoundError:
        model = None
    return model

model = load_model()

# 전처리 함수 정의
def preprocess_data(data):
    # 필요한 필드 추출
    required_fields = ['period', 'deposit', 'level']
    data = {key: data[key] for key in required_fields}
    
    # 거래 금액과 거래 기간 데이터 추출 및 전처리
    total_price = np.array(data['deposit']).reshape(-1, 1)  # deposit 열을 사용
    period = np.array(data['period']).reshape(-1, 1)  # period 열을 사용하여 기간 데이터 추출

    # 거래 금액을 거래 기간으로 나누어 일일 거래 금액(price_per_day) 계산
    price_per_day = total_price / period

    # 거래 금액과 일일 거래 금액을 결합한 새로운 특징 데이터
    features = np.hstack((total_price, price_per_day))

    # 데이터 정규화
    scaler = MinMaxScaler()
    scaled_features = scaler.fit_transform(features)
    
    return scaled_features

# 재구성 오차 계산 함수
def compute_reconstruction_error(original, reconstructed):
    mse = np.mean(np.power(original - reconstructed, 2), axis=1)
    return mse

@app.route('/api/analyze', methods=['POST'])
def analyze():
    global model
    data = request.json # New project
    
    # 데이터 출력
    print("Received data:", data)
    
    # 데이터 유효성 검사
    required_fields = ['period', 'deposit', 'level', 'boardId']
    for field in required_fields:
        if field not in data:
            print(f"Missing field: {field}")
            return jsonify({'error': f'Missing field: {field}'}), 400

    # 데이터 전처리
    processed_data = preprocess_data(data)
    print("Processed data for prediction:", processed_data)

    if model is not None:
        try:
            # 예측
            reconstructed_data = model.predict(processed_data)
            mse = compute_reconstruction_error(processed_data, reconstructed_data)
            
            # 임계값 설정 (예: 재구성 오차의 95% 분위수)
            threshold = np.percentile(mse, 95)  # 임계값은 필요에 따라 조정
            anomalies = mse > threshold
            
            # Kafka로 결과 전송
            message = json.dumps({
                'boardId': data['boardId'],
                'is_anomaly': anomalies.tolist(),
                'reconstruction_error': mse.tolist()
            })
            print("Sending message to Kafka:", message)
            producer.produce('analysis_results', message)
            producer.flush()
            return jsonify({'status': 'Analysis in progress'}), 202
        except Exception as e:
            print(f"Prediction error: {e}")
            return jsonify({'error': 'Prediction failed'}), 500
    else:
        return jsonify({'error': 'Model not found'}), 404
if __name__ == '__main__':
    app.run(port=5000)


# # Zookeeper 실행
# zookeeper-server-start.sh config/zookeeper.properties

# # Kafka 브로커 실행
# kafka-server-start.sh config/server.properties

# # Kafka 토픽 생성
# kafka-topics.sh --create --topic analysis_results --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1

# 현재는 임계값 계산을 하지 않고 95%로 고정 => 임계값 계산 필요

# kafka로 보내는 message 예시
# 1. 정상적인 요청
# {
#     "status": "Analysis in progress"
# }

# 2. 필드가 누락된 요청
# {
#     "error": "Missing field: level"
# }

# 3. 예측 실패
# {
#     "error": "Prediction failed"
# }

# 4. 모델이 로드되지 않은 경우
# {
#     "error": "Model not found"
# }

# 5. 이상 거래로 판단된 경우
# {
#     "boardId": "12345",
#     "is_anomaly": [true],
#     "reconstruction_error": [0.015]
# }

# 6. 정상 거래로 판단된 경우
# {
#     "boardId": "12345",
#     "is_anomaly": [false],
#     "reconstruction_error": [0.001]
# }
