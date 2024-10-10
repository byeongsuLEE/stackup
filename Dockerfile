# Python 3.10 버전으로 베이스 이미지 변경
FROM python:3.10-slim

# 작업 디렉토리 설정
WORKDIR /app

# requirements.txt 복사 및 설치
COPY ./requirements.txt . 
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Flask 애플리케이션 코드 복사
COPY . .

# Flask 서버 실행
ENV FLASK_APP=app.py
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]