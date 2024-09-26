import pandas as pd
import re
import json

# 파일 로드
file_path = './wishket_projects.json'
data = pd.read_json(file_path)

# 'price'와 'period'를 숫자로 변환
data['price'] = data['price'].replace('[^0-9]', '', regex=True).astype(float)
data['period'] = data['period'].replace('[^0-9]', '', regex=True).astype(float)

# 'totalPrice'와 'price/day' 계산 함수 정의
def calculate_prices(row):
    price_str = row['pricetype']  # pricetype 문자열 사용
    price = row['price']  # price 값
    period = row['period']  # period 값
    
    if "월" in price_str:  # "원/월"이 포함된 경우
        total_price = price * (period / 30)
    elif "원" in price_str:  # "원"이 포함된 경우
        total_price = price
    else:
        total_price = None  # 계산할 수 없는 경우
    
    # 일별 가격 계산
    if total_price is not None and period > 0:
        price_per_day = total_price / period
    else:
        price_per_day = None

    # 디버깅 출력
    if total_price is not None and price_per_day is not None:
        print(f"Calculated for {row['title']}: Total Price = {total_price}, Price/Day = {price_per_day}")
    else:
        print(f"Could not calculate for {row['title']} (pricetype: {price_str}, price: {price}, period: {period})")
    
    return pd.Series({'totalPrice': total_price, 'price_per_day': price_per_day})

# 'totalPrice'와 'price_per_day' 열 추가
data[['totalPrice', 'price_per_day']] = data.apply(calculate_prices, axis=1)

# 결과를 JSON 파일로 저장
result_file_path = '../res/result.json'
data.to_json(result_file_path, orient='records', force_ascii=False)

print(f"\nResults have been saved to {result_file_path}")
