# import pandas as pd
# import json
# import statsmodels.api as sm
# import matplotlib.pyplot as plt
# import numpy as np
# from statsmodels.stats.outliers_influence import variance_inflation_factor
# from statsmodels.stats.diagnostic import het_breuschpagan
# from statsmodels.stats.stattools import durbin_watson
# from scipy.stats import probplot

# # 데이터 불러오기
# data = pd.read_json('./result.json')

# # 가격 데이터에 대한 통계 분석 (총 금액, 일일 금액 고려)
# price_stats = data[['price', 'totalPrice', 'price_per_day']].describe()

# # IQR (Interquartile Range) 계산
# Q1 = price_stats.loc['25%', 'price']
# Q3 = price_stats.loc['75%', 'price']
# IQR = Q3 - Q1

# # 이상값 감지 (총 금액 및 일일 금액 기준 적용)
# outliers_price = data[(data['price'] < (Q1 - 1.5 * IQR)) | (data['price'] > (Q3 + 1.5 * IQR))]
# outliers_total_price = data[(data['totalPrice'] < (price_stats.loc['25%', 'totalPrice'] - 1.5 * (price_stats.loc['75%', 'totalPrice'] - price_stats.loc['25%', 'totalPrice']))) |
#                             (data['totalPrice'] > (price_stats.loc['75%', 'totalPrice'] + 1.5 * (price_stats.loc['75%', 'totalPrice'] - price_stats.loc['25%', 'totalPrice'])))]
# outliers_price_per_day = data[(data['price_per_day'] < (price_stats.loc['25%', 'price_per_day'] - 1.5 * (price_stats.loc['75%', 'price_per_day'] - price_stats.loc['25%', 'price_per_day']))) |
#                               (data['price_per_day'] > (price_stats.loc['75%', 'price_per_day'] + 1.5 * (price_stats.loc['75%', 'price_per_day'] - price_stats.loc['25%', 'price_per_day'])))]

# # 이상값 합치기 (중복 제거)
# outliers_combined = pd.concat([outliers_price, outliers_total_price, outliers_price_per_day])[['title', 'price', 'totalPrice', 'price_per_day']].drop_duplicates()

# def identify_anomaly_with_values(row, price_stats):
#     price_IQR = price_stats.loc['75%', 'price'] - price_stats.loc['25%', 'price']
#     totalPrice_IQR = price_stats.loc['75%', 'totalPrice'] - price_stats.loc['25%', 'totalPrice']
#     pricePerDay_IQR = price_stats.loc['75%', 'price_per_day'] - price_stats.loc['25%', 'price_per_day']
    
#     if row['price'] < (price_stats.loc['25%', 'price'] - 1.5 * price_IQR):
#         return f"예상 가격이 평균보다 매우 낮음 (예상 가격: {row['price']}, 하한: {price_stats.loc['25%', 'price'] - 1.5 * price_IQR})"
#     elif row['price'] > (price_stats.loc['75%', 'price'] + 1.5 * price_IQR):
#         return f"예상 가격이 평균보다 매우 높음 (예상 가격: {row['price']}, 상한: {price_stats.loc['75%', 'price'] + 1.5 * price_IQR})"
#     elif row['totalPrice'] < (price_stats.loc['25%', 'totalPrice'] - 1.5 * totalPrice_IQR):
#         return f"총 금액이 평균보다 매우 낮음 (총 금액: {row['totalPrice']}, 하한: {price_stats.loc['25%', 'totalPrice'] - 1.5 * totalPrice_IQR})"
#     elif row['totalPrice'] > (price_stats.loc['75%', 'totalPrice'] + 1.5 * totalPrice_IQR):
#         return f"총 금액이 평균보다 매우 높음 (총 금액: {row['totalPrice']}, 상한: {price_stats.loc['75%', 'totalPrice'] + 1.5 * totalPrice_IQR})"
#     elif row['price_per_day'] < (price_stats.loc['25%', 'price_per_day'] - 1.5 * pricePerDay_IQR):
#         return f"일일 금액이 평균보다 매우 낮음 (일일 금액: {row['price_per_day']}, 하한: {price_stats.loc['25%', 'price_per_day'] - 1.5 * pricePerDay_IQR})"
#     elif row['price_per_day'] > (price_stats.loc['75%', 'price_per_day'] + 1.5 * pricePerDay_IQR):
#         return f"일일 금액이 평균보다 매우 높음 (일일 금액: {row['price_per_day']}, 상한: {price_stats.loc['75%', 'price_per_day'] + 1.5 * pricePerDay_IQR})"
#     return '예산 이상치 발견'

# # 특이사항 구체적으로 추가 (수치 포함)
# outliers_combined['특이사항'] = outliers_combined.apply(lambda row: identify_anomaly_with_values(row, price_stats), axis=1)

# # 'level' 열의 고유 값 확인 및 매핑 업데이트
# unique_levels = data['level'].dropna().unique()
# nan_count = int(data['level'].isna().sum())  # numpy int64를 int로 변환
# level_counts = data['level'].value_counts().to_dict()
# level_counts['NaN'] = nan_count

# print("Unique levels in data:", unique_levels)
# print("Level counts including NaN:", level_counts)

# # Level 매핑 (기존 매핑과 다를 수 있음)
# level_mapping = {'주니어': 1, '미드 레벨': 2, '시니어': 3}
# data['level_numeric'] = data['level'].map(level_mapping)

# # 스킬 개수 추가 (빈 리스트나 null 값 처리)
# data['skills_count'] = data['skills'].apply(lambda x: len(x) if isinstance(x, list) else 0)

# # Null 값 처리 (예: 'level_numeric'이 NaN인 경우 제거)
# data = data.dropna(subset=['level_numeric', 'totalPrice'])

# # 상호작용 변수 추가: 레벨과 스킬 개수 간의 상호작용 효과
# data['interaction'] = data['level_numeric'] * data['skills_count']

# # 레벨, 스킬 개수, 상호작용 변수 간의 선형 회귀 분석을 위한 데이터 전처리
# level_total_price_skills = data[['level_numeric', 'skills_count', 'interaction', 'totalPrice']].dropna()
# X = level_total_price_skills[['level_numeric', 'skills_count', 'interaction']]
# y = level_total_price_skills['totalPrice']
# X = sm.add_constant(X)  # 상수 추가

# # 선형 회귀 모델 생성 및 학습
# model = sm.OLS(y, X).fit()

# # 모델 적합도 지표 출력
# print(f'R-squared: {model.rsquared}')
# print(f'Adj. R-squared: {model.rsquared_adj}')

# # F-statistic과 p-value 출력
# print(f'F-statistic: {model.fvalue}')
# print(f'Prob (F-statistic): {model.f_pvalue}')

# # 다중공선성 검사 (VIF)
# vif_data = pd.DataFrame()
# vif_data["feature"] = X.columns
# vif_data["VIF"] = [variance_inflation_factor(X.values, i) for i in range(X.shape[1])]
# print(vif_data)

# # 잔차 분석
# residuals = model.resid

# # 잔차 정규성 검정 (Q-Q plot)
# plt.figure(figsize=(6, 4))
# probplot(residuals, dist="norm", plot=plt)
# plt.title("Q-Q Plot of Residuals")
# plt.show()

# # 잔차의 등분산성 검정 (Breusch-Pagan test)
# _, pval, __, f_pval = het_breuschpagan(residuals, model.model.exog)
# print(f'Heteroscedasticity Test p-value: {pval}')

# # 잔차의 독립성 검정 (Durbin-Watson test)
# dw_stat = durbin_watson(residuals)
# print(f'Durbin-Watson statistic: {dw_stat}')

# # 비선형 관계 탐색: 레벨과 스킬 개수의 제곱을 추가하여 비선형 효과 모델링
# data['level_numeric_sq'] = data['level_numeric'] ** 2
# data['skills_count_sq'] = data['skills_count'] ** 2

# # 비선형 회귀 분석을 위한 데이터 준비
# X_nonlin = data[['level_numeric', 'skills_count', 'interaction', 'level_numeric_sq', 'skills_count_sq']]
# X_nonlin = sm.add_constant(X_nonlin)
# model_nonlin = sm.OLS(y, X_nonlin).fit()

# # 회귀 결과 보기 좋게 저장하기 위한 함수
# def format_regression_summary(summary):
#     lines = summary.splitlines()
#     if len(lines) < 15:  # Ensure we have enough lines to extract information
#         return {"error": "Unexpected summary format"}
    
#     # Extract key elements from the regression summary
#     formatted_summary = {
#         "Dep. Variable": lines[0].split(":")[1].strip() if ":" in lines[0] else "N/A",
#         "Model": lines[1].split(":")[1].strip() if ":" in lines[1] else "N/A",
#         "Method": lines[2].split(":")[1].strip() if ":" in lines[2] else "N/A",
#         "R-squared": lines[3].split(":")[1].strip() if ":" in lines[3] else "N/A",
#         "Adj. R-squared": lines[4].split(":")[1].strip() if ":" in lines[4] else "N/A",
#         "F-statistic": lines[5].split(":")[1].strip().split()[0] if ":" in lines[5] else "N/A",
#         "Prob (F-statistic)": lines[5].split(":")[1].strip().split()[-1] if ":" in lines[5] else "N/A",
#         "Log-Likelihood": lines[7].split(":")[1].strip() if ":" in lines[7] else "N/A",
#         "No. Observations": lines[8].split(":")[1].strip().split()[0] if ":" in lines[8] else "N/A",
#         "AIC": lines[9].split(":")[1].strip() if ":" in lines[9] else "N/A",
#         "BIC": lines[10].split(":")[1].strip() if ":" in lines[10] else "N/A",
#         "coef": [line.strip() for line in lines[13:17] if line.strip()]  # Coefficients table, adjust to match output format
#     }
#     return formatted_summary

# # 회귀 결과 저장
# regression_summary = format_regression_summary(model.summary().as_text())
# regression_summary_nonlin = format_regression_summary(model_nonlin.summary().as_text())

# # 결과를 JSON 파일로 저장
# result = {
#     '가격 통계 요약': price_stats.to_dict(),
#     '이상값 프로젝트': outliers_combined[['title', 'price', 'totalPrice', 'price_per_day', '특이사항']].to_dict(orient='records'),
#     '유일한 레벨 목록': list(unique_levels),
#     '레벨 개수': level_counts,
#     '회귀분석 요약': regression_summary,
#     '비선형 회귀분석 요약': regression_summary_nonlin,
#     'VIF': vif_data.to_dict(orient='records'),
#     '잔차 분석': {
#         'Durbin-Watson': dw_stat,
#         'Breusch-Pagan p-value': pval
#     }
# }

# # analysis.json 파일로 저장
# with open('./analysisGPT.json', 'w', encoding='utf-8') as f:
#     json.dump(result, f, ensure_ascii=False, indent=4)

# result['이상값 프로젝트'][:5]  # 일부 결과 출력 (확인용)
import pandas as pd
import json
import statsmodels.api as sm
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from statsmodels.stats.outliers_influence import variance_inflation_factor
from scipy import stats

# 데이터 불러오기
data = pd.read_json('../res/result.json')

# 가격 데이터에 대한 통계 분석 (총 금액, 일일 금액 고려)
price_stats = data[['price', 'totalPrice', 'price_per_day']].describe()

# IQR (Interquartile Range) 계산
Q1 = price_stats.loc['25%', 'price']
Q3 = price_stats.loc['75%', 'price']
IQR = Q3 - Q1

# 이상값 감지 (총 금액 및 일일 금액 기준 적용)
outliers_price = data[(data['price'] < (Q1 - 1.5 * IQR)) | (data['price'] > (Q3 + 1.5 * IQR))]
outliers_total_price = data[(data['totalPrice'] < (price_stats.loc['25%', 'totalPrice'] - 1.5 * (price_stats.loc['75%', 'totalPrice'] - price_stats.loc['25%', 'totalPrice']))) |
                            (data['totalPrice'] > (price_stats.loc['75%', 'totalPrice'] + 1.5 * (price_stats.loc['75%', 'totalPrice'] - price_stats.loc['25%', 'totalPrice'])))]
outliers_price_per_day = data[(data['price_per_day'] < (price_stats.loc['25%', 'price_per_day'] - 1.5 * (price_stats.loc['75%', 'price_per_day'] - price_stats.loc['25%', 'price_per_day']))) |
                              (data['price_per_day'] > (price_stats.loc['75%', 'price_per_day'] + 1.5 * (price_stats.loc['75%', 'price_per_day'] - price_stats.loc['25%', 'price_per_day'])))]

# 이상값 합치기 (중복 제거)
outliers_combined = pd.concat([outliers_price, outliers_total_price, outliers_price_per_day])[['title', 'price', 'totalPrice', 'price_per_day']].drop_duplicates()

def identify_anomaly_with_values(row, price_stats):
    price_IQR = price_stats.loc['75%', 'price'] - price_stats.loc['25%', 'price']
    totalPrice_IQR = price_stats.loc['75%', 'totalPrice'] - price_stats.loc['25%', 'totalPrice']
    pricePerDay_IQR = price_stats.loc['75%', 'price_per_day'] - price_stats.loc['25%', 'price_per_day']
    
    if row['price'] < (price_stats.loc['25%', 'price'] - 1.5 * price_IQR):
        return f"예상 가격이 평균보다 매우 낮음 (예상 가격: {row['price']}, 하한: {price_stats.loc['25%', 'price'] - 1.5 * price_IQR})"
    elif row['price'] > (price_stats.loc['75%', 'price'] + 1.5 * price_IQR):
        return f"예상 가격이 평균보다 매우 높음 (예상 가격: {row['price']}, 상한: {price_stats.loc['75%', 'price'] + 1.5 * price_IQR})"
    elif row['totalPrice'] < (price_stats.loc['25%', 'totalPrice'] - 1.5 * totalPrice_IQR):
        return f"총 금액이 평균보다 매우 낮음 (총 금액: {row['totalPrice']}, 하한: {price_stats.loc['25%', 'totalPrice'] - 1.5 * totalPrice_IQR})"
    elif row['totalPrice'] > (price_stats.loc['75%', 'totalPrice'] + 1.5 * totalPrice_IQR):
        return f"총 금액이 평균보다 매우 높음 (총 금액: {row['totalPrice']}, 상한: {price_stats.loc['75%', 'totalPrice'] + 1.5 * totalPrice_IQR})"
    elif row['price_per_day'] < (price_stats.loc['25%', 'price_per_day'] - 1.5 * pricePerDay_IQR):
        return f"일일 금액이 평균보다 매우 낮음 (일일 금액: {row['price_per_day']}, 하한: {price_stats.loc['25%', 'price_per_day'] - 1.5 * pricePerDay_IQR})"
    elif row['price_per_day'] > (price_stats.loc['75%', 'price_per_day'] + 1.5 * pricePerDay_IQR):
        return f"일일 금액이 평균보다 매우 높음 (일일 금액: {row['price_per_day']}, 상한: {price_stats.loc['75%', 'price_per_day'] + 1.5 * pricePerDay_IQR})"
    return '예산 이상치 발견'

# 특이사항 구체적으로 추가 (수치 포함)
outliers_combined['특이사항'] = outliers_combined.apply(lambda row: identify_anomaly_with_values(row, price_stats), axis=1)

# 'level' 열의 고유 값 확인 및 매핑 업데이트
unique_levels = data['level'].dropna().unique()
nan_count = int(data['level'].isna().sum())  # numpy int64를 int로 변환
level_counts = data['level'].value_counts().to_dict()
level_counts['NaN'] = nan_count

print("Unique levels in data:", unique_levels)
print("Level counts including NaN:", level_counts)

# Level 매핑 (기존 매핑과 다를 수 있음)
level_mapping = {'주니어': 1, '미드 레벨': 2, '시니어': 3}
data['level_numeric'] = data['level'].map(level_mapping)

# 스킬 개수 추가 (빈 리스트나 null 값 처리)
data['skills_count'] = data['skills'].apply(lambda x: len(x) if isinstance(x, list) else 0)

# Null 값 처리 (예: 'level_numeric'이 NaN인 경우 제거)
data = data.dropna(subset=['level_numeric', 'totalPrice'])

# 레벨과 총 금액, 스킬 개수 간의 선형 회귀 분석을 위한 데이터 전처리
level_total_price_skills = data[['level_numeric', 'skills_count', 'totalPrice']].dropna()
X = level_total_price_skills[['level_numeric', 'skills_count']]
y = level_total_price_skills['totalPrice']
X = sm.add_constant(X)  # 상수 추가

# 선형 회귀 모델 생성 및 학습
model = sm.OLS(y, X).fit()

# 회귀 결과 보기 좋게 저장하기 위한 함수
def format_regression_summary(summary):
    lines = summary.splitlines()
    if len(lines) < 15:  # Ensure we have enough lines to extract information
        return {"error": "Unexpected summary format"}
    
    # Extract key elements from the regression summary
    formatted_summary = {
        "Dep. Variable": lines[0].split(":")[1].strip() if ":" in lines[0] else "N/A",
        "Model": lines[1].split(":")[1].strip() if ":" in lines[1] else "N/A",
        "Method": lines[2].split(":")[1].strip() if ":" in lines[2] else "N/A",
        "R-squared": lines[3].split(":")[1].strip() if ":" in lines[3] else "N/A",
        "Adj. R-squared": lines[4].split(":")[1].strip() if ":" in lines[4] else "N/A",
        "F-statistic": lines[5].split(":")[1].strip().split()[0] if ":" in lines[5] else "N/A",
        "Prob (F-statistic)": lines[5].split(":")[1].strip().split()[-1] if ":" in lines[5] else "N/A",
        "Log-Likelihood": lines[7].split(":")[1].strip() if ":" in lines[7] else "N/A",
        "No. Observations": lines[8].split(":")[1].strip().split()[0] if ":" in lines[8] else "N/A",
        "AIC": lines[9].split(":")[1].strip() if ":" in lines[9] else "N/A",
        "BIC": lines[10].split(":")[1].strip() if ":" in lines[10] else "N/A",
        "coef": [line.strip() for line in lines[13:17] if line.strip()]  # Coefficients table, adjust to match output format
    }
    return formatted_summary

# 회귀 결과 저장
regression_summary = format_regression_summary(model.summary().as_text())

# 다중공선성 검사: VIF 계산
vif_data = pd.DataFrame()
vif_data["feature"] = X.columns
vif_data["VIF"] = [variance_inflation_factor(X.values, i) for i in range(len(X.columns))]

# 잔차 분석
residuals = model.resid
fitted_values = model.fittedvalues

# 정규성 검정
_, normality_p_value = stats.normaltest(residuals)

# 등분산성 검정 (Breusch-Pagan 테스트)
_, homoscedasticity_p_value, _, _ = sm.stats.diagnostic.het_breuschpagan(residuals, X)

# 독립성 검정 (Durbin-Watson 테스트)
durbin_watson = sm.stats.stattools.durbin_watson(residuals)

# 상호작용 효과를 포함한 모델
X_interaction = X.copy()
X_interaction['level_skills_interaction'] = X_interaction['level_numeric'] * X_interaction['skills_count']
model_interaction = sm.OLS(y, X_interaction).fit()

# 비선형 관계 탐색을 위한 다항 회귀
X_polynomial = X.copy()
X_polynomial['level_squared'] = X_polynomial['level_numeric'] ** 2
X_polynomial['skills_squared'] = X_polynomial['skills_count'] ** 2
model_polynomial = sm.OLS(y, X_polynomial).fit()

# 결과를 JSON 파일로 저장
result = {
    '가격 통계 요약': price_stats.to_dict(),
    '이상값 프로젝트': outliers_combined[['title', 'price', 'totalPrice', 'price_per_day', '특이사항']].to_dict(orient='records'),
    '유일한 레벨 목록': list(unique_levels),
    '레벨 개수': level_counts,
    '회귀분석 요약': regression_summary,
    '다중공선성 (VIF)': vif_data.to_dict(orient='records'),
    '잔차 분석': {
        '정규성 검정 p-value': normality_p_value,
        '등분산성 검정 p-value': homoscedasticity_p_value,
        'Durbin-Watson 통계량': durbin_watson
    },
    '상호작용 효과 모델 요약': format_regression_summary(model_interaction.summary().as_text()),
    '다항 회귀 모델 요약': format_regression_summary(model_polynomial.summary().as_text())
}

# analysis.json 파일로 저장
with open('../res/analysis/analysisCLAUDE.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=4)

# 시각화
plt.figure(figsize=(12, 8))
plt.subplot(221)
plt.scatter(fitted_values, residuals)
plt.title('Residuals vs Fitted')
plt.xlabel('Fitted values')
plt.ylabel('Residuals')

plt.subplot(222)
stats.probplot(residuals, dist="norm", plot=plt)
plt.title('Q-Q plot')

plt.subplot(223)
sns.histplot(residuals, kde=True)
plt.title('Residuals Distribution')

plt.subplot(224)
sns.scatterplot(x='level_numeric', y='totalPrice', hue='skills_count', data=level_total_price_skills)
plt.title('Total Price vs Level and Skills')

plt.tight_layout()
plt.savefig('residual_analysis.png')
plt.close()

print("분석이 완료되었습니다. 결과는 analysis.json 파일과 residual_analysis.png 이미지에서 확인할 수 있습니다.")