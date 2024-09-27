import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import precision_score, recall_score, f1_score
import matplotlib.pyplot as plt
import json
import joblib

# 데이터 불러오기
data = pd.read_json('../res/result.json')

# 결측값 처리 함수 (중간값 또는 평균값으로 대체)
def handle_missing_values(data):
    data['totalPrice'].fillna(data['totalPrice'].median(), inplace=True)
    data['period'].fillna(data['period'].median(), inplace=True)
    # 'level' 필드에서 숫자가 아닌 값 제거 후 평균값으로 대체
    data['level'] = pd.to_numeric(data['level'], errors='coerce')  # 문자열을 NaN으로 변환
    data['level'] = data['level'].fillna(data['level'].mean())  # 결측값을 평균값으로 대체
    return data

# 레벨 전처리 함수
def preprocess_level(data):
    # 주니어, 미드 레벨, 시니어만 추출
    level_map = {
        "주니어": 1,
        "미드 레벨": 2,
        "시니어": 3
    }
    data['level'] = data['level'].map(level_map)
    data['level'].fillna(0, inplace=True)  # 매핑되지 않은 값은 0으로 대체
    return data

# 레벨 전처리
data = handle_missing_values(data)
data = preprocess_level(data)

# 거래 금액과 거래 기간 데이터 추출 및 전처리
total_price = data['totalPrice'].values.reshape(-1, 1)  # totalPrice 열을 사용
period = data['period'].values.reshape(-1, 1)  # period 열을 사용하여 기간 데이터 추출
level = data['level'].values.reshape(-1, 1)  # level 열 추가

# 거래 금액을 거래 기간으로 나누어 일일 거래 금액(price_per_day) 계산
price_per_day = total_price / period

# 거래 금액과 일일 거래 금액을 결합한 새로운 특징 데이터
features = np.hstack((total_price, price_per_day, level))

# 데이터 정규화
scaler = MinMaxScaler()
scaled_features = scaler.fit_transform(features)

# Autoencoder 모델을 위한 데이터 분할
train_size = int(len(scaled_features) * 0.8)  # 80%는 학습용 데이터
train_data = scaled_features[:train_size]
test_data = scaled_features[train_size:]

print(f"Train shape: {train_data.shape}, Test shape: {test_data.shape}")

# Autoencoder 모델 정의
input_dim = train_data.shape[1]  # 입력 차원 (3차원: totalPrice, price_per_day, level)
encoding_dim = 16  # 임베딩 차원 (압축 차원)

# 인코더 정의
input_layer = Input(shape=(input_dim,))
encoder = Dense(encoding_dim, activation='relu')(input_layer)

# 디코더 정의
decoder = Dense(input_dim, activation='sigmoid')(encoder)

# Autoencoder 모델 구성
autoencoder = Model(inputs=input_layer, outputs=decoder)
autoencoder.compile(optimizer='adam', loss='mean_squared_error')

# 모델 학습
history = autoencoder.fit(
    train_data, train_data,
    epochs=150,
    batch_size=32,
    validation_data=(test_data, test_data),
    verbose=1
)

# 학습된 scaler 저장
scaler_path = '../trained_model/scaler_model.pkl'
joblib.dump(scaler, scaler_path)

# 학습된 모델 저장
autoencoder.save('../trained_model/autoencoder_model.h5')

# 재구성 오차 계산 함수
def compute_reconstruction_error(original, reconstructed):
    mse = np.mean(np.power(original - reconstructed, 2), axis=1)
    return mse

# 테스트 데이터에 대한 재구성 오차 계산
test_pred = autoencoder.predict(test_data)
mse = compute_reconstruction_error(test_data, test_pred)

# 임계값 설정 (예: 재구성 오차의 95% 분위수)
threshold = np.percentile(mse, 85)
print(f"Threshold for anomaly detection: {threshold}")

# 이상 거래 감지
anomalies = mse > threshold
anomaly_indices = np.where(anomalies)[0]

# True Labels 설정 (정상 데이터는 0, 이상치는 1로 설정)
true_labels = np.concatenate([np.zeros(len(test_data) - len(anomaly_indices)), np.ones(len(anomaly_indices))])

# 예측된 라벨 설정 (임계값을 넘으면 1, 그렇지 않으면 0)
pred_labels = (mse > threshold).astype(int)

# Precision, Recall, F1 Score 계산
precision = precision_score(true_labels, pred_labels)
recall = recall_score(true_labels, pred_labels)
f1 = f1_score(true_labels, pred_labels)


print(f"Detected anomalies at indices: {anomaly_indices}")

# 시각화
plt.figure(figsize=(10, 6))
plt.hist(mse, bins=50, alpha=0.6, color='blue', label='Reconstruction Error')
plt.axvline(threshold, color='red', linestyle='--', label='Anomaly Threshold')
plt.xlabel('Reconstruction Error')
plt.ylabel('Frequency')
plt.title('Reconstruction Error Distribution')
plt.legend()
plt.show()

# 분석 결과 저장 수정 필요 => 이상 프로젝트 여부만 보내주기(in eng)
result = {
    'Detected Anomalies Indices': anomaly_indices.tolist(),
    'Threshold for Anomaly Detection': threshold,
    'Reconstruction Error Distribution': mse.tolist(),
    'Precision': precision,
    'Recall': recall,
    'F1 Score': f1
}

# 결과를 JSON 파일로 저장
with open('../res/autoencoder/anomaly_detection_result.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=4)

print("분석이 완료되었습니다. 결과는 anomaly_detection_result.json 파일에서 확인할 수 있습니다.")

