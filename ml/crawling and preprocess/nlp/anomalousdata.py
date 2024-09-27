import random
import json
from faker import Faker

fake = Faker()

languages = [
    "Python", "JavaScript", "Java", "C#", "Ruby", "Go", "Swift", "Kotlin", "TypeScript",
    "C++", "C", "PHP", "Rust", "Scala", "Perl", "R", "Objective-C", "Lua", "Groovy",
    "Elixir", "Clojure", "Haskell", "Dart", "Julia", "MATLAB", "Shell"
]

frameworks = [
    "Django", "React", "Angular", "Vue.js", "Spring", ".NET", "Rails", "Flask", "Laravel",
    "Express", "Ruby on Rails", "ASP.NET", "Ember.js", "Svelte", "Meteor", "Symfony",
    "CodeIgniter", "CakePHP", "Gin", "Echo", "Bottle", "Phoenix", "FastAPI", "NestJS",
    "Nuxt.js", "Next.js"
]

libraries = [
    "NumPy", "Pandas", "TensorFlow", "PyTorch", "Lodash", "jQuery", "Bootstrap", "Scikit-learn",
    "Express", "React Native", "Redux", "BeautifulSoup", "Requests", "Matplotlib", "Seaborn",
    "D3.js", "Three.js", "Ant Design", "Chakra UI", "Socket.IO", "Axios", "Moment.js",
    "Immutable.js", "Leaflet", "Gatsby"
]

tools = [
    "Git", "Docker", "Kubernetes", "Jenkins", "VSCode", "PyCharm", "Webpack", "Babel",
    "Postman", "Sourcetree", "VisualStudio", "IntelliJIDEA", "Atom", "SublimeText",
    "Eclipse", "NetBeans", "JIRA", "Trello", "Slack", "Figma", "Photoshop", "Illustrator",
    "Blender", "Canva", "Heroku", "AWS", "Azure", "GoogleCloudPlatform", "Ansible",
    "Terraform", "Prometheus", "Grafana", "CircleCI", "TravisCI", "Vagrant", "Maven",
    "Gradle", "npm", "Yarn", "Pipenv", "Conda", "Homebrew", "Bitbucket", "GitHub",
    "GitLab", "OpenShift", "PostgreSQL", "MySQL", "MongoDB", "Redis",
    "Elasticsearch", "RabbitMQ", "Kafka", "Celery", "Gunicorn", "uWSGI", "Nginx",
    "Apache", "Lighttpd"
]

# 이상치 예시 유형 생성 함수
def generate_anomalous_data():
    data = {}
    
    # 제목과 기술 스택 관련 정보
    data['title'] = fake.job() + " 개발"
    data['type'] = random.choice(["프론트엔드 개발자", "백엔드 개발자", "풀스택 개발자", "AI 개발자"])
    
    # 가격과 기간에서 이상치를 추가
    data['pricetype'] = f"월 금액{random.randint(10000000, 50000000)}원/월"  # 비정상적으로 높은 월 금액
    data['price'] = random.uniform(10000000, 50000000)  # 비정상적으로 높은 월 금액
    data['period'] = random.uniform(1, 30)  # 비정상적으로 짧은 기간

    # level 필드에서 이상치 추가 (결측치 포함)
    data['level'] = random.choice(["주니어", "미드 레벨", "시니어", None])  # 일부 결측치는 null

    # 기술 스택에서 경력 무관 + 특정 기술 추가
    random_skills = random.sample(languages + frameworks + libraries + tools, 3)
    data['skills'] = [skill + " · 경력 무관" for skill in random_skills]

    # 위치 관련 정보
    data['location'] = fake.address()

    # totalPrice와 price_per_day 계산
    data['totalPrice'] = data['price'] * (data['period'] / 30)  # 총 가격
    data['price_per_day'] = data['totalPrice'] / data['period']  # 일일 가격

    # 비정상적인 price_per_day 추가 (무작위로 높은 일일 가격)
    if random.random() < 0.5:  # 50% 확률로 비정상적인 일일 금액
        data['price_per_day'] = random.uniform(500000, 1000000)  # 비정상적으로 높은 일일 가격

    return data

# 500개의 이상치 데이터 생성
anomalous_data = [generate_anomalous_data() for _ in range(500)]

# JSON 파일로 저장 (결측치는 null로 표시됨)
with open("anomalous_data.json", "w", encoding="utf-8") as f:
    json.dump(anomalous_data, f, ensure_ascii=False, indent=4, default=lambda x: None if x is None else x)

print("500개의 이상치 데이터 생성 완료")
