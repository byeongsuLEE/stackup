import requests
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util
import joblib
import numpy as np
import pandas as pd
from confluent_kafka import Producer
import json
from tensorflow.keras.models import load_model as keras_load_model
from sklearn.preprocessing import MinMaxScaler
import logging
# from flask_cors import CORS

app = Flask(__name__)
# CORS(app)
# SBERT 모델 로드
model1 = SentenceTransformer('snunlp/KR-SBERT-V40K-klueNLI-augSTS')

# Spring Boot 서버로부터 Board 데이터 가져오기
def get_boards_from_spring():
    response = requests.get("https://stackup.live/api/board/search-all")
    return response.json()

@app.route('/flask')
def hello():
    return "Hello, Flask!"

@app.route('/flask/hi')
def hi():
    print("flask 연결 테스트")
    return "hi page"

@app.route('/flask/similar', methods=['POST'])
def find_similar_boards():
    data = request.json
    query_description = data['description']

    # Spring Boot 서버에서 모든 Board 데이터 가져오기
    board_data = get_boards_from_spring()

    # 모든 게시글의 description 임베딩
    board_descriptions = [board['description'] for board in board_data['data']]
    board_embeddings = model1.encode(board_descriptions, convert_to_tensor=True)

    # 쿼리 description 임베딩
    query_embedding = model1.encode(query_description, convert_to_tensor=True)

    # 코사인 유사도 계산
    cosine_scores = util.pytorch_cos_sim(query_embedding, board_embeddings).cpu().numpy()

    # 유사도가 높은 순으로 정렬하여 상위 1개 게시글 선택
    similar_indices = cosine_scores.argsort()[0][::-1][0] 
    similar_board = board_data['data'][similar_indices]

    return jsonify(similar_board)

# Kafka 프로듀서 설정
conf = {'bootstrap.servers': '34.64.190.133:9092'}
producer = Producer(conf)

# 로그 설정
logging.basicConfig(filename='error.log', level=logging.ERROR)

# 머신러닝 모델 로딩
MODEL_PATH = 'ml/trained_model/autoencoder_model.h5'
scaler_path = 'ml/trained_model/scaler_model.pkl'  # 기존 학습에 사용된 스케일러 파일 경로

# 재학습에 필요한 데이터 설정
RETRAIN_THRESHOLD = 1000  # 재학습할 때 필요한 데이터 수
normal_data_cache = []  # 정상 데이터를 캐시할 리스트

PERCENTILE_THRESHOLD = 60

def load_model():
    try:
        model = keras_load_model(MODEL_PATH)
    except FileNotFoundError:
        print(f"Model file not found at {MODEL_PATH}")
        model = None
    except Exception as e:
        print(f"Error loading model: {e}")
        model = None
    return model

model = load_model()

# 결측값 처리 함수
def check_missing_values(data):
    for key in data:
        if data[key] is None or pd.isna(data[key]):
            if key == 'deposit' or key == 'period':
                median_value = np.median([d for d in data[key] if d is not None])
                data[key] = median_value
            else:
                data[key] = 0  # 기본값 0으로 대체
    return data

# 동적 임계값 설정 함수 (백분위수 + 평균/표준편차 기반)
def dynamic_threshold(mse):
    threshold_percentile = np.percentile(mse, PERCENTILE_THRESHOLD)
    mean_mse = np.mean(mse)
    std_mse = np.std(mse)
    threshold_std = mean_mse + 3 * std_mse
    return max(threshold_percentile, threshold_std)

# 전처리 함수 정의
def preprocess_data(data, scaler):
    data = check_missing_values(data)
    required_fields = ['period', 'deposit', 'level']
    data = {key: data[key] for key in required_fields}

    total_price = np.array(data['deposit']).reshape(-1, 1)
    period = np.array(data['period']).reshape(-1, 1)
    level = np.array(data['level']).reshape(-1, 1)

    month = np.where(period >= 31, period // 30, 1)
    price_per_day = (total_price / period) * month

    features = np.hstack((total_price, price_per_day, level))

    scaled_features = scaler.transform(features)

    return scaled_features

# 일일 거래 금액 계산 함수
def calculate_price_per_day(data):
    total_price = data['deposit']
    period = data['period']
    month = period // 30 if period >= 31 else 1
    price_per_day = (total_price / period) * month
    return price_per_day

# 이상 탐지 함수
def detect_anomalies_with_additional_conditions(price_per_day):
    if price_per_day <= 5 or price_per_day >= 100:
        return [True]  # 이상 거래
    else:
        return [False]  # 정상 거래

# 재구성 오차 계산 함수
def compute_reconstruction_error(original, reconstructed):
    mse = np.mean(np.power(original - reconstructed, 2), axis=1)
    return mse

# 재학습 함수
def retrain_model():
    global normal_data_cache, model
    if len(normal_data_cache) >= RETRAIN_THRESHOLD:
        new_data = np.vstack(normal_data_cache)
        epochs = max(1, min(10, len(normal_data_cache) // 1000))
        model.fit(new_data, new_data, epochs=epochs, batch_size=32)
        model.save(MODEL_PATH)
        normal_data_cache = []
        print(f"Model retrained with new data. Epochs: {epochs}")

@app.route('/flask/analyze', methods=['POST'])
def analyze():
    global model, normal_data_cache
    data = request.json
    
    print("Received data:", data)
    
    required_fields = ['period', 'deposit', 'level', 'boardId']
    for field in required_fields:
        if field not in data:
            print(f"Missing field: {field}")
            return jsonify({'error': f'Missing field: {field}'}), 400

    if data['period'] <= 0 or data['deposit'] <= 0:
        return jsonify({'error': 'Invalid period or deposit value'}), 400

    try:
        try:
            scaler = joblib.load(scaler_path)
        except FileNotFoundError:
            return jsonify({'error': 'Scaler not found'}), 404
        except Exception as e:
            logging.error(f"Error loading scaler: {str(e)}")
            return jsonify({'error': 'Scaler loading failed'}), 500

        processed_data = preprocess_data(data, scaler)
        price_per_day = calculate_price_per_day(data)
        print("Processed data for prediction:", processed_data)

        if model is not None:
            try:
                reconstructed_data = model.predict(processed_data)
                print(reconstructed_data)
                mse = compute_reconstruction_error(processed_data, reconstructed_data)

                threshold = dynamic_threshold(mse)
                anomalies_mse = mse > threshold
                anomalies_conditions = detect_anomalies_with_additional_conditions(price_per_day)

                # 이상 거래 여부 결정 (둘 중 하나라도 True이면 이상 거래로 간주)
                is_anomaly = [any(anomalies_mse) or any(anomalies_conditions)]

                # Kafka로 결과 전송
                message = json.dumps({
                    'boardId': data['boardId'],
                    'is_anomaly': is_anomaly,
                    'reconstruction_error': mse.tolist()
                })

                producer.produce('analysis', message, callback=delivery_report)
                producer.flush()

                if not any(is_anomaly):
                    normal_data_cache.append(processed_data)
                    retrain_model()

                return jsonify({'status': 'Analysis in progress'}), 202

            except Exception as e:
                logging.error(f"Prediction error: {str(e)}")
                return jsonify({'error': 'Prediction failed'}), 500
        else:
            return jsonify({'error': 'Model not found'}), 404
    except Exception as e:
        print(f"Processing error: {e}")
        logging.error(f"Processing error: {str(e)}")
        return jsonify({'error': 'Processing failed'}), 500

# Kafka 메시지 전송 후 콜백 함수
def delivery_report(err, msg):
    if err is not None:
        logging.error(f"Message delivery failed: {err}")
        print(f"Message delivery failed: {err}")
    else:
        print(f"Message delivered to {msg.topic()} [{msg.partition()}]")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
