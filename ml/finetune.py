# import torch
# from transformers import (
#     AutoTokenizer, 
#     AutoModelForTokenClassification, 
#     TrainingArguments, 
#     Trainer, 
#     DataCollatorForTokenClassification
# )
# from datasets import load_dataset, DatasetDict
# import evaluate  # evaluate 라이브러리 임포트
# import json
# import os

# # 1. 디렉토리 생성
# os.makedirs("./ml_results/v2", exist_ok=True)

# # 2. 모델과 토크나이저 로드
# tokenizer = AutoTokenizer.from_pretrained("beomi/KcELECTRA-base")

# # 3. 라벨 리스트 정의 (BIO 태깅 제거)
# label_list = ["O", "LANGUAGE", "FRAMEWORK", "LIBRARY", "TOOL"]
# num_labels = len(label_list)

# # 4. 모델 로드 및 라벨 설정
# model = AutoModelForTokenClassification.from_pretrained("beomi/KcELECTRA-base", num_labels=num_labels)

# # 라벨 매핑 정의
# label_to_id = {label: idx for idx, label in enumerate(label_list)}
# id_to_label = {idx: label for label, idx in label_to_id.items()}

# model.config.id2label = id_to_label
# model.config.label2id = label_to_id

# # 5. 데이터셋 로드 (JSONL 파일 사용)
# dataset = load_dataset('json', data_files={
#     'train': 'train_data.jsonl',
#     'validation': 'validation_data.jsonl'
# })


# # 6. 데이터셋 전처리 함수 정의
# def tokenize_and_align_labels(examples):
#     tokenized_inputs = tokenizer(
#         examples["tokens"],
#         truncation=True,
#         is_split_into_words=True,
#         padding=False,
#         max_length=128,
#         add_special_tokens=False  # 특수 토큰 비활성화
#     )
    
#     labels = []
#     for i, label in enumerate(examples["ner_tags"]):
#         word_ids = tokenized_inputs.word_ids(batch_index=i)
#         previous_word_idx = None
#         label_ids = []
#         for word_idx in word_ids:
#             if word_idx is None:
#                 label_ids.append(-100)
#             elif word_idx != previous_word_idx:
#                 if word_idx < len(label):
#                     label_ids.append(label[word_idx])
#                 else:
#                     print(f"Warning: word_idx {word_idx} out of range for example {i}")
#                     label_ids.append(-100)
#             else:
#                 label_ids.append(-100)
#             previous_word_idx = word_idx
#         labels.append(label_ids)

#     tokenized_inputs["labels"] = labels
#     return tokenized_inputs



# # 7. 데이터셋 전처리
# tokenized_datasets = DatasetDict({
#     'train': dataset['train'].map(tokenize_and_align_labels, batched=True),
#     'validation': dataset['validation'].map(tokenize_and_align_labels, batched=True)
# })

# # 8. 데이터셋의 레이블 분포 확인 함수 추가
# def get_label_distribution(dataset_split):
#     label_counts = {label: 0 for label in label_list}
#     for tags in dataset_split['labels']:
#         for tag in tags:
#             if tag != -100 and tag < num_labels:
#                 label_counts[id_to_label[tag]] += 1
#     return label_counts

# # 레이블 분포 출력
# train_label_distribution = get_label_distribution(tokenized_datasets["train"])
# val_label_distribution = get_label_distribution(tokenized_datasets["validation"])
# print(f"훈련 세트 레이블 분포: {train_label_distribution}")
# print(f"검증 세트 레이블 분포: {val_label_distribution}")

# # 9. 데이터 검토 (전처리된 데이터 샘플 출력 및 길이 확인)
# print("\n전처리된 훈련 데이터 샘플:")
# for i in range(3):
#     example = tokenized_datasets["train"][i]
#     print(f"Sample {i+1}:")
#     print(example)
#     print(f"input_ids 길이: {len(example['input_ids'])}, labels 길이: {len(example['labels'])}\n")

# print("\n전처리된 검증 데이터 샘플:")
# for i in range(3):
#     example = tokenized_datasets["validation"][i]
#     print(f"Sample {i+1}:")
#     print(example)
#     print(f"input_ids 길이: {len(example['input_ids'])}, labels 길이: {len(example['labels'])}\n")

# # 10. 평가 메트릭 정의
# metric = evaluate.load("seqeval")  # evaluate 라이브러리 사용

# def compute_metrics(p):
#     predictions, labels = p
#     predictions = predictions.argmax(axis=2)

#     true_labels = [
#         [id_to_label[l] for l in label if l != -100]
#         for label in labels
#     ]
#     true_predictions = [
#         [id_to_label[p] for (p, l) in zip(prediction, label) if l != -100]
#         for prediction, label in zip(predictions, labels)
#     ]

#     results = metric.compute(predictions=true_predictions, references=true_labels)
#     return {
#         "precision": results.get("overall_precision", 0.0),
#         "recall": results.get("overall_recall", 0.0),
#         "f1": results.get("overall_f1", 0.0),
#         "accuracy": results.get("overall_accuracy", 0.0),
#     }

# # 11. 훈련 인자 설정 (배치 크기 조정 가능, 동적 패딩 사용 시)
# training_args = TrainingArguments(
#     output_dir="./ml_results",
#     eval_strategy="epoch",  # 'evaluation_strategy' 대신 'eval_strategy' 사용
#     learning_rate=2e-5,
#     per_device_train_batch_size=16,  # 필요 시 조정
#     per_device_eval_batch_size=16,   # 필요 시 조정
#     num_train_epochs=3,
#     weight_decay=0.01,
#     save_total_limit=2,              # 저장할 체크포인트 수 제한
#     save_strategy="epoch",           # 매 에폭마다 체크포인트 저장
#     logging_dir='./ml_results/v2/logs',  # 로그 디렉토리 설정
#     logging_steps=100,               # 로그 출력 빈도 조정 (필요 시 조정)
#     load_best_model_at_end=True,     # 가장 좋은 모델을 마지막에 로드
#     metric_for_best_model="f1",      # 가장 좋은 모델 선정 기준
# )

# # 12. DataCollator 정의
# data_collator = DataCollatorForTokenClassification(tokenizer)

# # 13. Trainer 초기화
# trainer = Trainer(
#     model=model,
#     args=training_args,
#     train_dataset=tokenized_datasets["train"],
#     eval_dataset=tokenized_datasets["validation"],
#     tokenizer=tokenizer,
#     compute_metrics=compute_metrics,
#     data_collator=data_collator,  # DataCollator 추가
# )

# # 14. 모델 훈련
# trainer.train()

# # 15. 모델 평가
# eval_results = trainer.evaluate()
# print(f"Evaluation results: {eval_results}")

# # 16. 평가 결과를 JSON 파일로 저장 (선택 사항)
# with open('./ml_results/v2/eval_results.json', 'w', encoding='utf-8') as f:
#     json.dump(eval_results, f, ensure_ascii=False, indent=4)

# # 17. 모델 저장
# trainer.save_model("./ml_results/v2/fine-tuned-KcELECTRA-NER/fine-tuned-KcELECTRA-NER_v2")
# finetune.py

# -*- coding: utf-8 -*-
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
# 2. 라이브러리 업데이트 (옵션)
# ==================================
# 필요 시 주석을 해제하고 실행하세요.
# !pip install --upgrade transformers datasets evaluate

# ==========================================
# 3. 데이터셋 로드 및 레이블 매핑 정의
# ==========================================

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

# =====================================
# 6. 전처리 함수 정의 및 개선
# =====================================

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
                "tokens": examples["tokens"][i],
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
        with open("problematic_validation_examples.json", "w", encoding="utf-8") as f:
            json.dump(problematic_examples, f, ensure_ascii=False, indent=4)
        logger.info(f"문제 있는 예제를 problematic_validation_examples.json 파일에 저장했습니다.")
    
    return tokenized_inputs

# ==========================================
# 7. 토크나이저 초기화
# ==========================================

# 사전 훈련된 토크나이저 로드
tokenizer = AutoTokenizer.from_pretrained("beomi/KcELECTRA-base")

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

# =======================================
# 10. 모델 초기화
# =======================================

# 사전 훈련된 모델 로드 및 라벨 설정
model = AutoModelForTokenClassification.from_pretrained(
    "beomi/KcELECTRA-base",
    num_labels=num_labels,
    id2label=id_to_label,
    label2id=label_to_id
)

# =======================================
# 11. 평가 메트릭 정의
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
# 12. 훈련 인자 설정
# =======================================

training_args = TrainingArguments(
    output_dir="./ml_results",              # 출력 디렉토리
    evaluation_strategy="epoch",           # 평가 주기
    learning_rate=2e-5,                     # 학습률
    per_device_train_batch_size=16,         # 훈련 배치 사이즈
    per_device_eval_batch_size=16,          # 검증 배치 사이즈
    num_train_epochs=5,                     # 에폭 수
    weight_decay=0.01,                      # 가중치 감소
    logging_dir='./ml_results/v3/logs',     # 로그 디렉토리
    logging_steps=10,                       # 로깅 스텝
    save_total_limit=2,                     # 최대 저장 체크포인트 수
    save_strategy="epoch",                  # 저장 전략
    load_best_model_at_end=True,            # 학습 종료 시 최고 모델 로드
    metric_for_best_model="f1",             # 최고 모델 선정 기준
)

# =======================================
# 13. Trainer 초기화
# =======================================

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_datasets["train"],
    eval_dataset=tokenized_datasets["validation"],
    tokenizer=tokenizer,
    compute_metrics=compute_metrics,
    data_collator=data_collator,  # DataCollator 추가
)

# =======================================
# 14. 모델 학습
# =======================================

trainer.train()

# =======================================
# 15. 모델 평가 및 저장
# =======================================

eval_results = trainer.evaluate()
print(f"Evaluation results: {eval_results}")

with open('./ml_results/v3/eval_results.json', 'w', encoding='utf-8') as f:
    json.dump(eval_results, f, ensure_ascii=False, indent=4)

# =======================================
# 16. 모델 저장
# =======================================

save_directory = "./ml_results/v3/fine-tuned-KcELECTRA-NER/fine-tuned-KcELECTRA-NER_v3"
os.makedirs(save_directory, exist_ok=True)

trainer.save_model(save_directory)
tokenizer.save_pretrained(save_directory)
logger.info(f"모델을 {save_directory}에 저장했습니다.")
