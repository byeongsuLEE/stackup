"""
NER 모델 학습을 위한 전체 파이프라인 코드

주요 기능:
1. 데이터셋 로드 및 레이블 매핑 정의
2. 레이블 검증
3. 검증 세트에서 일관성 없는 예제 제거
4. 전처리 함수 정의 및 적용 (토크나이저와 레이블 정렬)
5. 문제 있는 예제 로깅 및 저장
6. 동적 패딩을 위한 데이터 콜레이터 설정
7. 모델 초기화 및 학습 설정
8. 모델 학습 및 저장
"""

import json
import logging
from datasets import load_dataset, Dataset, DatasetDict
from transformers import (
    AutoTokenizer,
    DataCollatorForTokenClassification,
    AutoModelForTokenClassification,
    TrainingArguments,
    Trainer,
)
import evaluate  # evaluate 라이브러리 임포트
import os
from sklearn.utils.class_weight import compute_class_weight
import numpy as np
import torch
import random
import copy

# ============================
# 1. 기본 설정 및 로깅 설정
# ============================

# 로깅 설정
logging.basicConfig(
    format="%(asctime)s - %(levelname)s - %(name)s -   %(message)s",
    datefmt="%m/%d/%Y %H:%M:%S",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

# ==================================
# 2. 토크나이저 초기화
# ==================================
# 사전 훈련된 토크나이저 로드
tokenizer = AutoTokenizer.from_pretrained("beomi/KcELECTRA-base")

# ==================================
# 3. 데이터셋 로드 및 레이블 매핑 정의
# ==================================

# 데이터셋 로드 (JSONL 파일 사용)
dataset = load_dataset('json', data_files={
    'train': 'train_data.jsonl',
    'validation': 'validation_data.jsonl'
})

# 레이블 리스트 정의 (BIO 태깅 제거)
label_list = ["O", "LANGUAGE", "FRAMEWORK", "LIBRARY", "TOOL"]
num_labels = len(label_list)

# 레이블 매핑 생성
label_to_id = {label: idx for idx, label in enumerate(label_list)}
id_to_label = {idx: label for label, idx in label_to_id.items()}

# =================================
# 4. 레이블 검증 함수 정의
# =================================

def verify_labels(dataset, split, label_to_id):
    """
    데이터셋의 레이블이 유효한지 검증합니다.
    """
    invalid_labels = set()
    for example in dataset[split]:
        for tag in example['ner_tags']:
            if tag not in label_to_id.values() and tag != -100:
                invalid_labels.add(tag)
    if invalid_labels:
        logger.warning(f"{split} 세트에서 유효하지 않은 레이블 인덱스: {invalid_labels}")
    else:
        logger.info(f"{split} 세트의 모든 레이블 인덱스가 유효합니다.")

# 레이블 검증 수행
verify_labels(dataset, 'train', label_to_id)
verify_labels(dataset, 'validation', label_to_id)

# =====================================
# 5. 데이터 일관성 검사 및 정제
# =====================================

def remove_inconsistent_examples(dataset, split):
    """
    지정된 분할(split)에서 tokens과 ner_tags의 길이가 일치하지 않는 예제를 제거합니다.
    """
    initial_count = len(dataset[split])
    dataset_filtered = dataset[split].filter(lambda x: len(x['tokens']) == len(x['ner_tags']))
    final_count = len(dataset_filtered)
    removed_count = initial_count - final_count
    logger.info(f"{split} 세트에서 일치하지 않는 예제 {removed_count}개를 제거했습니다.")
    return dataset_filtered

# 검증 세트에서 일관성 없는 예제 제거
dataset['validation'] = remove_inconsistent_examples(dataset, 'validation')

# 확장된 엔티티 교체 맵 정의
languages = [
    "Python", "JavaScript", "Java", "C#", "Ruby", "Go", "Swift", "Kotlin", "TypeScript",
    "C++", "C", "PHP", "Rust", "Scala", "Perl", "R", "Objective-C", "Lua", "Groovy",
    "Elixir", "Clojure", "Haskell", "Dart", "Julia", "MATLAB", "Shell", "Fortran", "Erlang", "OCaml", 
    "VHDL", "Verilog", "Solidity", "F#", "Assembly", "COBOL", "Ada", "Tcl"
]

frameworks = [
    "Django", "React", "Angular", "Vue.js", "Spring", ".NET", "Rails", "Flask", "Laravel",
    "Express", "Ruby on Rails", "ASP.NET", "Ember.js", "Svelte", "Meteor", "Symfony",
    "CodeIgniter", "CakePHP", "Gin", "Echo", "Bottle", "Phoenix", "FastAPI", "NestJS",
    "Nuxt.js", "Next.js", "Quasar", "Electron", "Ionic", "Flutter", "Backbone.js",
    "Struts", "Play", "Tornado", "Web2py"
]

libraries = [
    "NumPy", "Pandas", "TensorFlow", "PyTorch", "Lodash", "jQuery", "Bootstrap", "Scikit-learn",
    "React Native", "Redux", "BeautifulSoup", "Requests", "Matplotlib", "Seaborn", "D3.js",
    "Three.js", "Ant Design", "Chakra UI", "Socket.IO", "Axios", "Moment.js", "Immutable.js",
    "Leaflet", "Gatsby", "Chart.js", "Highcharts", "Plotly", "Keras", "Tornado", "Scrapy", 
    "Huggingface Transformers", "OpenCV", "NLTK", "SpaCy", "XGBoost", "LightGBM"
]

tools = [
    "Git", "Docker", "Kubernetes", "Jenkins", "VSCode", "PyCharm", "Webpack", "Babel", "Postman", 
    "Sourcetree", "VisualStudio", "IntelliJ IDEA", "Atom", "SublimeText", "Eclipse", "NetBeans", "JIRA", 
    "Trello", "Slack", "Figma", "Photoshop", "Illustrator", "Blender", "Canva", "Heroku", "AWS", "Azure", 
    "GoogleCloudPlatform", "Ansible", "Terraform", "Prometheus", "Grafana", "CircleCI", "TravisCI", "Vagrant", 
    "Maven", "Gradle", "npm", "Yarn", "Pipenv", "Conda", "Homebrew", "Bitbucket", "GitHub", "GitLab", "OpenShift", 
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "RabbitMQ", "Kafka", "Celery", "Gunicorn", "uWSGI", 
    "Nginx", "Apache", "Lighttpd", "Airflow", "Databricks", "Docker Compose", "SonarQube", "Splunk", "Tableau", 
    "PowerBI", "QlikView"
]

# 템플릿 예시 확장 (구체적이고 복잡한 문장 포함)
templates = [
    "저는 {LANGUAGE} 와 {FRAMEWORK} 를 사용하여 풀스택 애플리케이션을 개발했습니다.",
    "최근에 {TOOL} 을(를) 사용하여 DevOps 파이프라인을 구축했습니다.",
    "{LANGUAGE} 와 {LIBRARY} 를 활용해 데이터 처리 및 머신러닝 모델링을 수행했습니다.",
    "{FRAMEWORK} 와 {TOOL} 를 사용하여 클라우드 기반 애플리케이션을 배포했습니다.",
    "{LIBRARY} 를 이용해 복잡한 시각화 작업을 간편하게 수행했습니다.",
    "{LANGUAGE} 와 {FRAMEWORK} 을(를) 활용하여 대규모 웹 서비스를 구축했습니다.",
    "{TOOL} 을 사용해 CI/CD 파이프라인을 자동화하고 배포 속도를 높였습니다.",
    "{LIBRARY} 와 {FRAMEWORK} 를 결합하여 고성능 API를 개발했습니다.",
    "프로젝트에서 {LANGUAGE} 와 {TOOL} 를 활용해 배포 프로세스를 간소화했습니다.",
    "{FRAMEWORK} 을 사용해 모놀리식 애플리케이션을 마이크로서비스 아키텍처로 전환했습니다.",
    "{LIBRARY} 를 사용해 실시간 데이터 스트리밍을 처리했습니다.",
    "{TOOL} 을 사용하여 컨테이너 관리 및 오케스트레이션을 자동화했습니다.",
    "저는 {LANGUAGE} 와 {FRAMEWORK} 를 사용하여 실시간 메시징 시스템을 구현했습니다.",
    "{LIBRARY} 를 활용해 텍스트 마이닝 및 자연어 처리 모델을 구축했습니다.",
    "{FRAMEWORK} 와 {TOOL} 를 결합하여 효율적인 개발 환경을 마련했습니다.",
    "{LANGUAGE} 와 {LIBRARY} 를 사용하여 대용량 데이터를 처리했습니다.",
    "저는 {TOOL} 을 사용하여 복잡한 배포 환경을 자동화했습니다.",
    "{FRAMEWORK} 와 {LIBRARY} 를 이용해 고도화된 사용자 인터페이스를 구축했습니다.",
    "프로젝트의 핵심 부분에 {LANGUAGE} 와 {LIBRARY} 를 도입하여 퍼포먼스를 개선했습니다.",
    "{TOOL} 을 이용해 클라우드 인프라 관리를 자동화했습니다.",
    "{LANGUAGE} 와 {LIBRARY} 를 활용해 대규모 데이터 분석 파이프라인을 구축했습니다.",
    "{FRAMEWORK} 을 통해 RESTful API를 손쉽게 구축했습니다.",
    "{LIBRARY} 를 사용해 데이터 전처리를 수행하고, 머신러닝 모델링을 위한 준비를 마쳤습니다."
]


# ============================
# 6. 데이터 증강 함수 정의
# ============================

def replace_entity(example, entity_map):
    new_example = copy.deepcopy(example)
    for i, token in enumerate(new_example['tokens']):
        if new_example['ner_tags'][i] in entity_map:
            new_example['tokens'][i] = random.choice(entity_map[new_example['ner_tags'][i]])
    return new_example

# 엔티티 교체 맵 정의
entity_replacement_map = {
    1: languages,   # LANGUAGE
    2: frameworks,  # FRAMEWORK
    3: libraries,   # LIBRARY
    4: tools        # TOOL
}

# 동의어 교체 맵 확장
synonym_map = {
    "빠르다": ["신속하다", "빨리", "속도가 빠르다", "속도가 높다", "즉각적이다"],
    "개발": ["구현", "제작", "코딩", "프로그래밍", "애플리케이션 구축", "시스템 설계"],
    "프로젝트": ["작업", "과제", "일정", "업무", "개발 프로젝트", "캠페인", "플랜"]
}

# 증강된 데이터 샘플 생성
def generate_augmented_examples():
    for _ in range(100):  # 100개 샘플 생성
        template = random.choice(templates)
        lang = random.choice(languages)
        frame = random.choice(frameworks)
        lib = random.choice(libraries)
        tool = random.choice(tools)
        augmented_sentence = template.format(LANGUAGE=lang, FRAMEWORK=frame, LIBRARY=lib, TOOL=tool)
        print(augmented_sentence)

generate_augmented_examples()

# =======================================
# 7. 전처리 함수 정의 및 개선
# =======================================

def tokenize_and_align_labels_with_logging(examples):
    """
    토크나이징 및 레이블 정렬을 수행하며, 문제 있는 예제를 로깅하고 저장합니다.
    """
    tokenized_inputs = tokenizer(
        examples["tokens"],
        truncation=True,
        is_split_into_words=True,
        padding=False,
        max_length=512,  # 필요에 따라 조정
        add_special_tokens=False  # 특수 토큰 비활성화
    )
    
    labels = []
    problematic_examples = []
    for i, label in enumerate(examples["ner_tags"]):
        word_ids = tokenized_inputs.word_ids(batch_index=i)
        max_word_id = max([w for w in word_ids if w is not None], default=-1)
        if max_word_id >= len(label):
            logger.warning(f"word_idx {max_word_id} out of range for example {i}")
            logger.warning(f"예제 {i}의 tokens: {examples['tokens'][i]}")
            logger.warning(f"예제 {i}의 ner_tags: {label}")
            logger.warning(f"예제 {i}의 word_ids: {word_ids}\n")
            problematic_examples.append({
                "example_idx": i,
                "tokens": examples['tokens'][i],
                "ner_tags": label,
                "word_ids": word_ids
            })
        
        previous_word_idx = None
        label_ids = []
        for word_idx in word_ids:
            if word_idx is None:
                label_ids.append(-100)
            elif word_idx != previous_word_idx:
                if word_idx < len(label):
                    label_ids.append(label[word_idx])
                else:
                    label_ids.append(-100)  # 범위를 벗어나면 패딩값 -100을 추가
            else:
                label_ids.append(-100)
            previous_word_idx = word_idx
        labels.append(label_ids)
    
    tokenized_inputs["labels"] = labels
    
    # 문제 있는 예제를 파일에 저장
    if problematic_examples:
        with open("problematic_validation_examples_v5.json", "w", encoding="utf-8") as f:
            json.dump(problematic_examples, f, ensure_ascii=False, indent=4)
        logger.info(f"문제 있는 예제를 problematic_validation_examples_v5.json 파일에 저장했습니다.")
    
    return tokenized_inputs

# ==========================================
# 8. 전처리 함수 적용
# ==========================================

# 데이터셋 전처리 (토큰화 및 레이블 정렬)
tokenized_datasets = DatasetDict({
    'train': dataset['train'].map(
        tokenize_and_align_labels_with_logging,
        batched=True,
        remove_columns=dataset['train'].column_names
    ),
    'validation': dataset['validation'].map(
        tokenize_and_align_labels_with_logging,
        batched=True,
        remove_columns=dataset['validation'].column_names
    )
})

# ================================================
# 9. 동적 패딩을 위한 데이터 콜레이터 설정
# ================================================

data_collator = DataCollatorForTokenClassification(
    tokenizer,
    padding='longest',  # 동적 패딩
    max_length=None,
    label_pad_token_id=-100
)

# ================================================
# 10. 클래스 가중치 계산 (데이터 불균형 해결)
# ================================================

# NER 태그 추출
ner_tags_list = [entry['ner_tags'] for entry in dataset['train']]
ner_tags = [tag for sublist in ner_tags_list for tag in sublist]

# 가중치 계산
class_weights = compute_class_weight('balanced', classes=np.unique(ner_tags), y=ner_tags)
class_weights_dict = {i: weight for i, weight in enumerate(class_weights)}

# =======================================
# 11. 모델 초기화
# =======================================

# 사전 훈련된 모델 로드 및 라벨 설정
model = AutoModelForTokenClassification.from_pretrained(
    "beomi/KcELECTRA-base",
    num_labels=num_labels,
    id2label=id_to_label,
    label2id=label_to_id
)

# =======================================
# 12. 평가 메트릭 정의
# =======================================

# 평가 메트릭 로드
metric = evaluate.load("seqeval")

def compute_metrics(p):
    """
    모델의 예측 결과를 평가 메트릭으로 계산합니다.
    """
    predictions, labels = p
    predictions = predictions.argmax(axis=2)

    true_labels = [
        [id_to_label[l] for l in label if l != -100]
        for label in labels
    ]
    true_predictions = [
        [id_to_label[p] for (p, l) in zip(prediction, label) if l != -100]
        for prediction, label in zip(predictions, labels)
    ]

    results = metric.compute(predictions=true_predictions, references=true_labels)
    return {
        "precision": results.get("overall_precision", 0.0),
        "recall": results.get("overall_recall", 0.0),
        "f1": results.get("overall_f1", 0.0),
        "accuracy": results.get("overall_accuracy", 0.0),
    }

# =======================================
# 13. 훈련 인자 설정
# =======================================

training_args = TrainingArguments(
    output_dir="./ml_results",              # 출력 디렉토리
    evaluation_strategy="epoch",           # 평가 주기
    learning_rate=3e-5,                     # 학습률
    per_device_train_batch_size=32,         # 훈련 배치 사이즈
    per_device_eval_batch_size=16,          # 검증 배치 사이즈
    num_train_epochs=5,                     # 에폭 수
    weight_decay=0.01,                      # 가중치 감소
    logging_dir='./ml_results/v5/logs',     # 로그 디렉토리
    logging_steps=10,                       # 로깅 스텝
    save_total_limit=2,                     # 최대 저장 체크포인트 수
    save_strategy="epoch",                  # 저장 전략
    load_best_model_at_end=True,            # 학습 종료 시 최고 모델 로드
    metric_for_best_model="f1",             # 최고 모델 선정 기준
)

# =======================================
# 14. WeightedLossTrainer 정의 (가중치 적용)
# =======================================

class WeightedLossTrainer(Trainer):
    def compute_loss(self, model, inputs, return_outputs=False):
        labels = inputs.get("labels")
        # Compute class weights loss
        loss_fct = torch.nn.CrossEntropyLoss(weight=torch.tensor(list(class_weights_dict.values()), dtype=torch.float).to(model.device))
        outputs = model(**inputs)
        logits = outputs.get("logits")
        loss = loss_fct(logits.view(-1, self.model.config.num_labels), labels.view(-1))
        return (loss, outputs) if return_outputs else loss

# =======================================
# 15. Trainer 초기화
# =======================================

trainer = WeightedLossTrainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_datasets["train"],
    eval_dataset=tokenized_datasets["validation"],
    tokenizer=tokenizer,
    compute_metrics=compute_metrics,
    data_collator=data_collator  # DataCollator 추가
)

# =======================================
# 16. 모델 학습
# =======================================

trainer.train()

# =======================================
# 17. 모델 평가 및 저장
# =======================================

eval_results = trainer.evaluate()
print(f"Evaluation results: {eval_results}")

with open('./ml_results/v5/eval_results.json', 'w', encoding='utf-8') as f:
    json.dump(eval_results, f, ensure_ascii=False, indent=4)

# =======================================
# 18. 모델 저장
# =======================================

save_directory = "./ml_results/v5/fine-tuned-KcELECTRA-NER/fine-tuned-KcELECTRA-NER_v5"
os.makedirs(save_directory, exist_ok=True)

trainer.save_model(save_directory)
tokenizer.save_pretrained(save_directory)
logger.info(f"모델을 {save_directory}에 저장했습니다.")