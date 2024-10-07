# 베이스 이미지 선택 (Python 3.9)
FROM python:3.9-slim

# 작업 디렉토리 설정
WORKDIR /app

# ml 디렉토리에 있는 requirements.txt 파일 복사
COPY ml/requirements.txt . 

# pip 업그레이드 후 필요 라이브러리 설치
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt --verbose

# Flask 애플리케이션 코드 복사
COPY . .

# Flask 서버 실행
CMD ["flask", "run", "--host=0.0.0.0"]
