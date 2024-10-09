# 1단계: 빌드 단계
FROM node:16 AS build

# 작업 디렉토리 설정
WORKDIR /app/frontend

# 패키지 파일 복사 및 의존성 설치
COPY frontend/package*.json ./
RUN npm install

# 나머지 애플리케이션 코드 복사
COPY frontend/. .

# 블록체인 파일 복사
COPY blockchain/NFT/build/contracts/MyNFT.json /app/blockchain/NFT/build/contracts/

# React 애플리케이션 빌드
RUN npm run build

# 2단계: NGINX로 정적 파일 서빙
FROM nginx:alpine

# 빌드된 결과물을 NGINX 정적 파일 경로로 복사
COPY --from=build /app/frontend/dist /usr/share/nginx/html

# NGINX 설정 파일 복사 (nginx.conf 파일이 있다면 추가)
COPY nginx.conf /etc/nginx/nginx.conf

# 포트 80 노출
EXPOSE 80

# NGINX 서버 시작
CMD ["nginx", "-g", "daemon off;"]
