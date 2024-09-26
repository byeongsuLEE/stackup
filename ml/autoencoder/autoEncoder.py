import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt
import json

# 데이터 불러오기
data = pd.read_json('../res/result.json')

# 거래 금액과 거래 기간 데이터 추출 및 전처리
total_price = data['totalPrice'].values.reshape(-1, 1)  # totalPrice 열을 사용
period = data['period'].values.reshape(-1, 1)  # period 열을 사용하여 기간 데이터 추출

# 거래 금액을 거래 기간으로 나누어 일일 거래 금액(price_per_day) 계산
price_per_day = total_price / period

# 거래 금액과 일일 거래 금액을 결합한 새로운 특징 데이터
features = np.hstack((total_price, price_per_day))

# 데이터 정규화
scaler = MinMaxScaler()
scaled_features = scaler.fit_transform(features)

# Autoencoder 모델을 위한 데이터 분할
train_size = int(len(scaled_features) * 0.8)  # 80%는 학습용 데이터
train_data = scaled_features[:train_size]
test_data = scaled_features[train_size:]

print(f"Train shape: {train_data.shape}, Test shape: {test_data.shape}")

# Autoencoder 모델 정의
input_dim = train_data.shape[1]  # 입력 차원 (2차원: totalPrice와 price_per_day)
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
    epochs=50,
    batch_size=32,
    validation_data=(test_data, test_data),
    verbose=1
)

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
threshold = np.percentile(mse, 95)
print(f"Threshold for anomaly detection: {threshold}")

# 이상 거래 감지
anomalies = mse > threshold
anomaly_indices = np.where(anomalies)[0]

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
    'Reconstruction Error Distribution': mse.tolist()
}

# 결과를 JSON 파일로 저장
with open('..res/autoencoder/anomaly_detection_result.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=4)

print("분석이 완료되었습니다. 결과는 anomaly_detection_result.json 파일에서 확인할 수 있습니다.")
