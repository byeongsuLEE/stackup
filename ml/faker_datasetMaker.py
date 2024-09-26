# import random
# from faker import Faker
# import json

# # 1. Faker 객체를 한국어 로케일로 초기화
# fake = Faker('ko_KR')

# # 2. 엔티티 리스트 정의
# languages = ["Python", "JavaScript", "Java", "C#", "Ruby", "Go", "Swift", "Kotlin", "TypeScript"]
# frameworks = ["Django", "React", "Angular", "Vue.js", "Spring", ".NET", "Rails", "Flask", "Laravel"]
# libraries = ["NumPy", "Pandas", "TensorFlow", "PyTorch", "Lodash", "jQuery", "Bootstrap", "Scikit-learn", "Express"]
# tools = ["Git", "Docker", "Kubernetes", "Jenkins", "VS Code", "PyCharm", "Webpack", "Babel", "Postman"]

# # 3. 라벨 리스트 및 매핑 정의
# label_list = ["O", "LANGUAGE", "FRAMEWORK", "LIBRARY", "TOOL"]
# label_to_id = {label: idx for idx, label in enumerate(label_list)}
# id_to_label = {idx: label for label, idx in label_to_id.items()}

# def generate_sentence_with_entities(num_entities=3):
#     """
#     기본 한국어 문장을 생성하고, 무작위로 엔티티를 삽입합니다.
    
#     Args:
#         num_entities (int): 삽입할 엔티티의 수
    
#     Returns:
#         tuple: (words, entities)
#             - words (list): 단어 리스트
#             - entities (list): (엔티티, 엔티티 타입) 튜플 리스트
#     """
#     # Faker를 사용하여 기본 한국어 문장 생성
#     sentence = fake.sentence(nb_words=10)
#     words = sentence.split()
    
#     # 엔티티 종류 선택
#     entity_types = ['LANGUAGE', 'FRAMEWORK', 'LIBRARY', 'TOOL']
    
#     # 삽입할 엔티티 선택
#     entities = []
#     inserted_entities = set()  # 중복 삽입 방지를 위한 집합
    
#     for _ in range(num_entities):
#         entity_type = random.choice(entity_types)
#         if entity_type == 'LANGUAGE':
#             entity = random.choice(languages)
#         elif entity_type == 'FRAMEWORK':
#             entity = random.choice(frameworks)
#         elif entity_type == 'LIBRARY':
#             entity = random.choice(libraries)
#         elif entity_type == 'TOOL':
#             entity = random.choice(tools)
        
#         # 동일한 엔티티가 이미 삽입되지 않았는지 확인
#         if entity not in inserted_entities:
#             entities.append((entity, entity_type))
#             inserted_entities.add(entity)
    
#     # 무작위 위치에 엔티티 삽입
#     for entity, entity_type in entities:
#         insert_position = random.randint(0, len(words))
#         words.insert(insert_position, entity)
    
#     return words, entities

# def label_sentence(words, entities):
#     """
#     각 단어에 대해 정수 라벨을 부여합니다.
    
#     Args:
#         words (list): 단어 리스트
#         entities (list): (엔티티, 엔티티 타입) 튜플 리스트
    
#     Returns:
#         list: 각 단어에 대한 정수 라벨 리스트
#     """
#     labels = [label_to_id["O"]] * len(words)
#     for entity, entity_type in entities:
#         for i, word in enumerate(words):
#             if word == entity:
#                 labels[i] = label_to_id.get(entity_type, 0)  # 해당 엔티티 타입의 정수 라벨을 할당
#     return labels

# def create_dataset(num_samples=10000, max_entities=7):
#     """
#     지정된 수만큼의 데이터 샘플을 생성합니다.
    
#     Args:
#         num_samples (int): 생성할 샘플의 수
#         max_entities (int): 각 샘플당 최대 엔티티 수
    
#     Returns:
#         list: 생성된 데이터 샘플 리스트
#     """
#     dataset = []
#     for _ in range(num_samples):
#         words, entities = generate_sentence_with_entities(num_entities=random.randint(1, max_entities))
#         labels = label_sentence(words, entities)
#         dataset.append({
#             "tokens": words,
#             "ner_tags": labels
#         })
#     return dataset

# def save_dataset(dataset, file_path):
#     """
#     데이터셋을 JSONL 파일로 저장합니다.
    
#     Args:
#         dataset (list): 데이터 샘플 리스트
#         file_path (str): 저장할 파일 경로
#     """
#     with open(file_path, 'w', encoding='utf-8') as f:
#         for data in dataset:
#             json_line = json.dumps(data, ensure_ascii=False)
#             f.write(json_line + '\n')

# # 4. 데이터셋 생성
# train_dataset = create_dataset(num_samples=10000)

# # 5. 데이터셋 저장
# save_dataset(train_dataset, 'train_data.jsonl')

# # 데이터셋 확인
# print("학습용 데이터셋 예시:", train_dataset[0])
import random
import json

# 1. 엔티티 리스트 정의
# 프로그래밍 언어 리스트 확장
languages = [
    "Python", "JavaScript", "Java", "C#", "Ruby", "Go", "Swift", "Kotlin", "TypeScript",
    "C++", "C", "PHP", "Rust", "Scala", "Perl", "R", "Objective-C", "Lua", "Groovy",
    "Elixir", "Clojure", "Haskell", "Dart", "Julia", "MATLAB", "Shell"
]

# 프레임워크 리스트 확장
frameworks = [
    "Django", "React", "Angular", "Vue.js", "Spring", ".NET", "Rails", "Flask", "Laravel",
    "Express", "Ruby on Rails", "ASP.NET", "Ember.js", "Svelte", "Meteor", "Symfony",
    "CodeIgniter", "CakePHP", "Gin", "Echo", "Bottle", "Phoenix", "FastAPI", "NestJS",
    "Nuxt.js", "Next.js"
]

# 라이브러리 리스트 확장
libraries = [
    "NumPy", "Pandas", "TensorFlow", "PyTorch", "Lodash", "jQuery", "Bootstrap", "Scikit-learn",
    "Express", "React Native", "Redux", "BeautifulSoup", "Requests", "Matplotlib", "Seaborn",
    "D3.js", "Three.js", "Ant Design", "Chakra UI", "Socket.IO", "Axios", "Moment.js",
    "Immutable.js", "Leaflet", "Gatsby"
]

# 도구 리스트 확장
tools = [
    "Git", "Docker", "Kubernetes", "Jenkins", "VSCode", "PyCharm", "Webpack", "Babel",
    "Postman", "Sourcetree", "VisualStudio", "IntelliJIDEA", "Atom", "SublimeText",
    "Eclipse", "NetBeans", "JIRA", "Trello", "Slack", "Figma", "Photoshop", "Illustrator",
    "Blender", "Canva", "Heroku", "AWS", "Azure", "GoogleCloudPlatform", "Ansible",
    "Terraform", "Prometheus", "Grafana", "CircleCI", "TravisCI", "Vagrant", "Maven",
    "Gradle", "npm", "Yarn", "Pipenv", "Conda", "Homebrew", "Bitbucket", "GitHub",
    "GitLab", "OpenShift", "Vagrant", "PostgreSQL", "MySQL", "MongoDB", "Redis",
    "Elasticsearch", "RabbitMQ", "Kafka", "Celery", "Gunicorn", "uWSGI", "Nginx",
    "Apache", "Lighttpd"
]

# 2. 라벨 리스트 및 매핑 정의
label_list = ["O", "LANGUAGE", "FRAMEWORK", "LIBRARY", "TOOL"]
label_to_id = {label: idx for idx, label in enumerate(label_list)}
id_to_label = {idx: label for label, idx in label_to_id.items()}

# 3. 엔티티 타입별 복수형 매핑 정의
plural_map = {
    "LANGUAGE": "languages",
    "FRAMEWORK": "frameworks",
    "LIBRARY": "libraries",
    "TOOL": "tools"
}

# 4. 한국어 문장 템플릿 정의 (엔티티와 조사 사이에 공백 추가)
templates = [
    "저는 {LANGUAGE} 과 {FRAMEWORK} 를 사용하여 프로젝트를 진행했습니다.",
    "오늘은 {LANGUAGE} 를 배우고, {LIBRARY} 를 활용했습니다.",
    "{TOOL} 을 이용해 개발 환경을 설정했습니다.",
    "이번 주말에는 {FRAMEWORK} 와 {LIBRARY} 에 대해 공부할 예정입니다.",
    "개발에 {LANGUAGE} 과 {TOOL} 을 사용했습니다.",
    "저는 주로 {LANGUAGE} 를 사용하며, {FRAMEWORK} 를 선호합니다.",
    "프로젝트를 위해 {LANGUAGE} , {FRAMEWORK} , 그리고 {LIBRARY} 를 도입했습니다.",
    "{TOOL} 을 사용하여 코드 관리를 효율적으로 수행했습니다.",
    "{LANGUAGE} 와 {LIBRARY} 를 결합하여 강력한 애플리케이션을 개발했습니다.",
    "최근에 {FRAMEWORK} 와 {TOOL} 을 배우기 시작했습니다.",
    "{LANGUAGE} 는 {FRAMEWORK} 와 함께 사용할 때 더욱 강력합니다.",
    "개발 과정에서 {LIBRARY} 를 사용하여 데이터 처리를 간소화했습니다.",
    "{TOOL} 을 활용하여 CI/CD 파이프라인을 구축했습니다.",
    "저는 {LANGUAGE} 에 익숙하며, {FRAMEWORK} 로 웹 애플리케이션을 개발합니다.",
    "{LANGUAGE} 와 {LIBRARY} 는 데이터 분석에 매우 유용합니다.",
    "프로젝트의 프론트엔드에는 {FRAMEWORK} 를, 백엔드에는 {LANGUAGE} 를 사용했습니다.",
    "{TOOL} 을 사용하여 컨테이너화를 구현했습니다.",
    "{LANGUAGE} 을(를) 사용하여 효율적인 스크립트를 작성했습니다.",
    "저는 {FRAMEWORK} 와 {LIBRARY} 를 활용하여 복잡한 기능을 구현했습니다.",
    "{TOOL} 을 통해 팀원들과의 협업을 강화했습니다.",
    "{LANGUAGE} 와 {TOOL} 을 함께 사용하면 개발 속도가 빨라집니다.",
    "저는 {FRAMEWORK} 를 사용하여 RESTful API를 구축했습니다.",
    "{LANGUAGE} 는 {LIBRARY} 와 결합하여 머신러닝 모델을 개발하는 데 이상적입니다.",
    "프로젝트에 {FRAMEWORK} 와 {TOOL} 을 도입하여 효율성을 높였습니다.",
    "{LANGUAGE} 을(를) 사용하여 데이터베이스와의 상호작용을 처리했습니다.",
    "저는 {LIBRARY} 를 활용하여 시각화를 구현했습니다.",
    "{TOOL} 을 사용하여 애플리케이션을 배포했습니다.",
    "저는 {LANGUAGE} 과 {FRAMEWORK} 를 사용하여 모바일 앱을 개발했습니다.",
    "{LIBRARY} 는 {LANGUAGE} 와 함께 사용할 때 더욱 강력해집니다.",
    "{TOOL} 을 활용하여 코드 품질을 유지했습니다.",
    "{LANGUAGE} 를 사용하여 서버 사이드 로직을 구현했습니다.",
    "저는 {FRAMEWORK} 와 {LIBRARY} 를 사용하여 사용자 인터페이스를 개발했습니다.",
    "{TOOL} 을 사용하여 로그 관리를 효율화했습니다.",
    "{LANGUAGE} 과 {LIBRARY} 를 사용하여 데이터 분석을 수행했습니다.",
    "저는 {FRAMEWORK} 를 사용하여 실시간 애플리케이션을 개발했습니다.",
    "{TOOL} 을 활용하여 애플리케이션의 성능을 모니터링했습니다.",
    "{LANGUAGE} 을(를) 사용하여 자동화 스크립트를 작성했습니다.",
    "저는 {LIBRARY} 를 사용하여 이미지 처리를 구현했습니다.",
    "{TOOL} 을 이용해 배포 프로세스를 자동화했습니다.",
    "프로젝트에 {FRAMEWORK} 와 {TOOL} 을 도입하여 개발 효율을 높였습니다.",
    "{LANGUAGE} 과 {FRAMEWORK} 를 사용하여 웹 애플리케이션을 구축했습니다.",
    "{LIBRARY} 를 사용하여 데이터 시각화를 구현했습니다.",
    "{TOOL} 을 사용하여 버전 관리를 체계화했습니다.",
    "저는 {LANGUAGE} 을(를) 사용하여 백엔드 로직을 개발했습니다.",
    "{FRAMEWORK} 와 {LIBRARY} 를 결합하여 복잡한 기능을 구현했습니다.",
    "{TOOL} 을 활용하여 코드 리뷰 프로세스를 개선했습니다.",
    "{LANGUAGE} 와 {LIBRARY} 는 데이터 과학 프로젝트에 이상적입니다.",
    "저는 {FRAMEWORK} 를 사용하여 마이크로서비스 아키텍처를 구현했습니다.",
    "{TOOL} 을 사용하여 애플리케이션을 모니터링했습니다.",
    "{LANGUAGE} 을(를) 사용하여 API 통신을 처리했습니다.",
    "저는 {LIBRARY} 를 사용하여 자연어 처리를 구현했습니다.",
    "{TOOL} 을 이용해 테스트 자동화를 구현했습니다.",
    "프로젝트에 {FRAMEWORK} 와 {TOOL} 을 도입하여 개발 속도를 높였습니다.",
    "{LANGUAGE} 와 {FRAMEWORK} 를 사용하여 대규모 애플리케이션을 구축했습니다.",
    "{LIBRARY} 를 사용하여 데이터 전처리를 수행했습니다.",
    "{TOOL} 을 사용하여 지속적인 통합을 구현했습니다.",
    "저는 {LANGUAGE} 을(를) 사용하여 서버를 구축했습니다.",
    "{FRAMEWORK} 와 {LIBRARY} 를 결합하여 효율적인 개발을 진행했습니다.",
    "{TOOL} 을 활용하여 개발 환경을 최적화했습니다.",
    "{LANGUAGE} 와 {LIBRARY} 를 사용하여 데이터 분석 파이프라인을 구축했습니다.",
    "저는 {FRAMEWORK} 를 사용하여 실시간 데이터 처리를 구현했습니다.",
    "{TOOL} 을 사용하여 애플리케이션의 안정성을 확보했습니다.",
    "{LANGUAGE} 을(를) 사용하여 스크립트 자동화를 수행했습니다.",
    "저는 {LIBRARY} 를 활용하여 머신러닝 모델을 개발했습니다.",
    "{TOOL} 을 이용해 배포 프로세스를 간소화했습니다.",
    "프로젝트에 {FRAMEWORK} 와 {TOOL} 을 도입하여 개발 효율을 극대화했습니다.",
    "{LANGUAGE} 와 {FRAMEWORK} 를 사용하여 웹 서비스를 구축했습니다.",
    "{LIBRARY} 를 사용하여 데이터 시각화 대시보드를 구현했습니다.",
    "{TOOL} 을 사용하여 버전 관리와 협업을 효율화했습니다.",
    "저는 {LANGUAGE} 을(를) 사용하여 백엔드 API를 개발했습니다.",
    "{FRAMEWORK} 와 {LIBRARY} 를 결합하여 고성능 애플리케이션을 구현했습니다.",
    "{TOOL} 을 활용하여 코드 품질을 유지하고 향상시켰습니다.",
    "{LANGUAGE} 와 {LIBRARY} 는 데이터 과학과 분석에 매우 유용합니다.",
    "저는 {FRAMEWORK} 를 사용하여 마이크로서비스 아키텍처를 구현했습니다.",
    "{TOOL} 을 사용하여 애플리케이션의 성능을 모니터링했습니다.",
    "{LANGUAGE} 을(를) 사용하여 API 통신을 처리했습니다.",
    "저는 {LIBRARY} 를 사용하여 자연어 처리를 구현했습니다.",
    "{TOOL} 을 이용해 테스트 자동화를 구현했습니다.",
    "프로젝트에 {FRAMEWORK} 와 {TOOL} 을 도입하여 개발 속도를 높였습니다.",
    "{LANGUAGE} 와 {FRAMEWORK} 를 사용하여 대규모 애플리케이션을 구축했습니다.",
    "{LIBRARY} 를 사용하여 데이터 전처리를 수행했습니다.",
    "{TOOL} 을 사용하여 지속적인 통합을 구현했습니다.",
    "저는 {LANGUAGE} 을(를) 사용하여 서버를 구축했습니다.",
    "{FRAMEWORK} 와 {LIBRARY} 를 결합하여 효율적인 개발을 진행했습니다.",
    "{TOOL} 을 활용하여 개발 환경을 최적화했습니다.",
    "{LANGUAGE} 와 {LIBRARY} 를 사용하여 데이터 분석 파이프라인을 구축했습니다.",
    "저는 {FRAMEWORK} 를 사용하여 실시간 데이터 처리를 구현했습니다.",
    "{TOOL} 을 사용하여 애플리케이션의 안정성을 확보했습니다.",
    "{LANGUAGE} 을(를) 사용하여 스크립트 자동화를 수행했습니다.",
    "저는 {LIBRARY} 를 활용하여 머신러닝 모델을 개발했습니다.",
    "{TOOL} 을 이용해 배포 프로세스를 간소화했습니다.",
    "프로젝트에 {FRAMEWORK} 와 {TOOL} 을 도입하여 개발 효율을 극대화했습니다.",
    "{LANGUAGE} 와 {FRAMEWORK} 를 사용하여 웹 서비스를 구축했습니다.",
    "{LIBRARY} 를 사용하여 데이터 시각화 대시보드를 구현했습니다.",
    "{TOOL} 을 사용하여 버전 관리와 협업을 효율화했습니다.",
    "저는 {LANGUAGE} 을(를) 사용하여 백엔드 API를 개발했습니다.",
    "{FRAMEWORK} 와 {LIBRARY} 를 결합하여 고성능 애플리케이션을 구현했습니다.",
    "{TOOL} 을 활용하여 코드 품질을 유지하고 향상시켰습니다.",
    "{LANGUAGE} 와 {LIBRARY} 는 데이터 과학과 분석에 매우 유용합니다.",
    "저는 {FRAMEWORK} 를 사용하여 마이크로서비스 아키텍처를 구현했습니다.",
    "{TOOL} 을 사용하여 애플리케이션의 성능을 모니터링했습니다.",
    "{LANGUAGE} 을(를) 사용하여 API 통신을 처리했습니다.",
    "저는 {LIBRARY} 를 사용하여 자연어 처리를 구현했습니다.",
    "{TOOL} 을 이용해 테스트 자동화를 구현했습니다.",
    "프로젝트에 {FRAMEWORK} 와 {TOOL} 을 도입하여 개발 속도를 높였습니다.",
    "{LANGUAGE} 와 {FRAMEWORK} 를 사용하여 대규모 애플리케이션을 구축했습니다.",
    "{LIBRARY} 를 사용하여 데이터 전처리를 수행했습니다.",
    "{TOOL} 을 사용하여 지속적인 통합을 구현했습니다.",
    "저는 {LANGUAGE} 을(를) 사용하여 서버를 구축했습니다.",
    "{FRAMEWORK} 와 {LIBRARY} 를 결합하여 효율적인 개발을 진행했습니다.",
    "{TOOL} 을 활용하여 개발 환경을 최적화했습니다.",
    "{LANGUAGE} 와 {LIBRARY} 를 사용하여 데이터 분석 파이프라인을 구축했습니다.",
    "저는 {FRAMEWORK} 를 사용하여 실시간 데이터 처리를 구현했습니다.",
    "{TOOL} 을 사용하여 애플리케이션의 안정성을 확보했습니다.",
    "{LANGUAGE} 을(를) 사용하여 스크립트 자동화를 수행했습니다.",
    "저는 {LIBRARY} 를 활용하여 머신러닝 모델을 개발했습니다.",
    "{TOOL} 을 이용해 배포 프로세스를 간소화했습니다.",
    "프로젝트에 {FRAMEWORK} 와 {TOOL} 을 도입하여 개발 효율을 극대화했습니다.",
    "{LANGUAGE} 와 {FRAMEWORK} 를 사용하여 웹 서비스를 구축했습니다.",
    "{LIBRARY} 를 사용하여 데이터 시각화 대시보드를 구현했습니다.",
    "{TOOL} 을 사용하여 버전 관리와 협업을 효율화했습니다.",
    "저는 {LANGUAGE} 을(를) 사용하여 백엔드 API를 개발했습니다.",
    "{FRAMEWORK} 와 {LIBRARY} 를 결합하여 고성능 애플리케이션을 구현했습니다.",
    "{TOOL} 을 활용하여 코드 품질을 유지하고 향상시켰습니다.",
    "{LANGUAGE} 와 {LIBRARY} 는 데이터 과학과 분석에 매우 유용합니다.",
    "저는 {FRAMEWORK} 를 사용하여 마이크로서비스 아키텍처를 구현했습니다.",
    "{TOOL} 을 사용하여 애플리케이션의 성능을 모니터링했습니다.",
    "{LANGUAGE} 을(를) 사용하여 API 통신을 처리했습니다.",
    "저는 {LIBRARY} 를 사용하여 자연어 처리를 구현했습니다.",
    "{TOOL} 을 이용해 테스트 자동화를 구현했습니다.",
    "프로젝트에 {FRAMEWORK} 와 {TOOL} 을 도입하여 개발 속도를 높였습니다.",
    "{LANGUAGE} 와 {FRAMEWORK} 를 사용하여 대규모 애플리케이션을 구축했습니다.",
    "{LIBRARY} 를 사용하여 데이터 전처리를 수행했습니다.",
    "{TOOL} 을 사용하여 지속적인 통합을 구현했습니다.",
    "저는 {LANGUAGE} 을(를) 사용하여 서버를 구축했습니다.",
    "{FRAMEWORK} 와 {LIBRARY} 를 결합하여 효율적인 개발을 진행했습니다.",
    "{TOOL} 을 활용하여 개발 환경을 최적화했습니다.",
    "{LANGUAGE} 와 {LIBRARY} 를 사용하여 데이터 분석 파이프라인을 구축했습니다.",
    "저는 {FRAMEWORK} 를 사용하여 실시간 데이터 처리를 구현했습니다.",
    "{TOOL} 을 사용하여 애플리케이션의 안정성을 확보했습니다.",
    "{LANGUAGE} 을(를) 사용하여 스크립트 자동화를 수행했습니다.",
    "저는 {LIBRARY} 를 활용하여 머신러닝 모델을 개발했습니다.",
    "{TOOL} 을 이용해 배포 프로세스를 간소화했습니다.",
    "프로젝트에 {FRAMEWORK} 와 {TOOL} 을 도입하여 개발 효율을 극대화했습니다.",
    "{LANGUAGE} 와 {FRAMEWORK} 를 사용하여 웹 서비스를 구축했습니다.",
    "{LIBRARY} 를 사용하여 데이터 시각화 대시보드를 구현했습니다.",
    "{TOOL} 을 사용하여 버전 관리와 협업을 효율화했습니다."
]

def label_sentence_bio(words, entities):
    """
    B-와 I- 태그를 사용하여 라벨을 부여합니다.
    
    Args:
        words (list): 단어 리스트
        entities (list): (엔티티, 엔티티 타입) 튜플 리스트
    
    Returns:
        list: 각 단어에 대한 라벨 리스트
    """
    labels = ["O"] * len(words)
    for entity, entity_type in entities:
        entity_words = entity.split()
        for i in range(len(words)):
            # 엔티티가 다단어일 경우
            if words[i:i+len(entity_words)] == entity_words:
                labels[i] = f"B-{entity_type}"
                for j in range(1, len(entity_words)):
                    labels[i+j] = f"I-{entity_type}"
    return labels

def generate_sentence_with_entities_bio():
    """
    템플릿을 사용하여 문장을 생성하고, B-와 I- 태그를 부여합니다.
    
    Returns:
        tuple: (words, labels)
    """
    template = random.choice(templates)
    # 엔티티 삽입
    sentence = template.format(
        LANGUAGE=random.choice(languages),
        FRAMEWORK=random.choice(frameworks),
        LIBRARY=random.choice(libraries),
        TOOL=random.choice(tools)
    )
    words = sentence.split()
    
    # 엔티티 추출
    entities = []
    for entity_type in ["LANGUAGE", "FRAMEWORK", "LIBRARY", "TOOL"]:
        entity_plural = plural_map[entity_type]
        for entity in globals()[entity_plural]:
            if entity in words:
                entities.append((entity, entity_type))
    
    # 라벨링
    labels = label_sentence_bio(words, entities)
    
    return words, labels

def create_dataset_bio(num_samples=1000):
    """
    B-와 I- 태그를 사용하여 데이터셋을 생성합니다.
    
    Args:
        num_samples (int): 생성할 샘플의 수
    
    Returns:
        list: 생성된 데이터 샘플 리스트
    """
    dataset = []
    for _ in range(num_samples):
        words, labels = generate_sentence_with_entities_bio()
        # 숫자 라벨로 변환
        numeric_labels = []
        for label in labels:
            if label.startswith("B-") or label.startswith("I-"):
                label_type = label.split("-")[1]
                numeric_labels.append(label_to_id.get(label_type, 0))
            else:
                numeric_labels.append(label_to_id["O"])
        dataset.append({
            "tokens": words,
            "ner_tags": numeric_labels
        })
    return dataset

def save_dataset(dataset, file_path):
    """
    데이터셋을 JSONL 파일로 저장합니다.
    
    Args:
        dataset (list): 데이터 샘플 리스트
        file_path (str): 저장할 파일 경로
    """
    with open(file_path, 'w', encoding='utf-8') as f:
        for data in dataset:
            json_line = json.dumps(data, ensure_ascii=False)
            f.write(json_line + '\n')

# 5. 데이터셋 생성 및 저장
train_dataset = create_dataset_bio(num_samples=10000)

save_dataset(train_dataset, 'train_data.jsonl')

# 데이터셋 확인
print("학습용 데이터셋 예시:", train_dataset[0])