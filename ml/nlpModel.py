# from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
# import torch

# # 모델과 토크나이저 로드
# tokenizer = AutoTokenizer.from_pretrained("beomi/KcELECTRA-base")
# model = AutoModelForTokenClassification.from_pretrained("beomi/KcELECTRA-base")

# # NER 파이프라인 설정
# nlp = pipeline("ner", model=model, tokenizer=tokenizer, aggregation_strategy="simple")

# def extract_entities(text, desired_labels=None):
#     """
#     텍스트에서 원하는 라벨의 엔티티를 추출합니다.

#     Args:
#         text (str): 분석할 텍스트.
#         desired_labels (list, optional): 추출할 엔티티 라벨 리스트. 기본값은 None (모든 엔티티 추출).

#     Returns:
#         list: 추출된 엔티티 리스트.
#     """
#     entities = nlp(text)
#     if desired_labels:
#         extracted = [entity['word'].lower() for entity in entities if entity['entity_group'] in desired_labels]
#     else:
#         extracted = [entity['word'].lower() for entity in entities]
    
#     # 중복 제거 (순서 유지)
#     seen = set()
#     unique_extracted = []
#     for item in extracted:
#         if item not in seen:
#             seen.add(item)
#             unique_extracted.append(item)
#     return unique_extracted

# # 실제 사용 예시: 라벨 확인 후 설정
# desired_labels = ["LANGUAGE", "FRAMEWORK", "TECH"]  # 모델에 맞게 조정

# # 예시 데이터
# freelancers = [
#     {
#         "id": 1,
#         "name": "싸피",
#         "phone": "010-1234-5678",
#         "email": "ssafy@naver.com",
#         "framework": ["spring", "vue.js"],
#         "language": ["react", "java"],
#         "portfolioURL": "http://portfolio.example.com",
#         "selfIntroduction": "저는 Python과 Django를 사용한 웹 개발 경험이 있습니다.",
#         "address": "서울시 강남구",
#         "totalScore": 4.5,
#         "careerYear": 5,
#         "reportedCount": 0,
#         "classification": "웹 개발",
#         "githubId": "ssafy_github"
#     }
# ]

# projects = [
#     {
#         "id": "1",
#         "title": "웹 애플리케이션 개발",
#         "description": "React와 Spring을 사용하여 웹 애플리케이션을 개발합니다.",
#         "classification": "웹 개발",
#         "framework": ["spring", "vue.js"],
#         "language": ["react", "java"],
#         "deposit": "100만원",
#         "startDate": "2024-10-01",
#         "period": "6개월",
#         "recruits": 3,
#         "applicants": 10,
#         "worktype": True,  # True: 재택, False: 상주
#         "company": "ABC Corp",
#         "requirements": "React와 Spring에 능숙한 개발자",
#         "rate": 5,
#         "is_charged": True,
#         "address": "서울시 서초구",
#         "deadline": "2024-09-30",
#         "upload": "2024-09-01"
#     }
# ]

# # 프리랜서의 주요 기술 추출
# for freelancer in freelancers:
#     freelancer['extracted_skills'] = extract_entities(freelancer['selfIntroduction'], desired_labels)

# # 프로젝트의 주요 요구사항 추출
# for project in projects:
#     project['extracted_requirements'] = extract_entities(project['description'], desired_labels)

# print("프리랜서 추출된 스킬:", freelancers[0]['extracted_skills'])
# print("프로젝트 추출된 요구사항:", projects[0]['extracted_requirements'])
from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline

# 모델과 토크나이저 로드
tokenizer = AutoTokenizer.from_pretrained("beomi/KcELECTRA-base")
model = AutoModelForTokenClassification.from_pretrained("beomi/KcELECTRA-base")

# 모델의 라벨 정보 확인
print("Model Labels:", model.config.id2label)
