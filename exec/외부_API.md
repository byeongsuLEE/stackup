```markdown
# 2. 외부 서비스 정리

## 1. Github API

- **사용 용도**: GitHub OAuth2를 통한 사용자 인증 및 로그인.
- **사용하는 GitHub API 엔드포인트**:
    - 사용자 정보 조회: `https://api.github.com/user`
    - 리다이렉트 uri :  `redirect-uri: "https://stackup.live/api/user/login/oauth2/code/github`
- **설정 파일 위치**: `application.yml` 또는 `application.properties`에서 OAuth2 관련 GitHub API 설정 확인.
- **관련 코드**:
    - 사용자 로그인 처리: `com.ssafy.common.ouath2.service.CustomOAuth2UserService` 클래스.

## 2. PortOne API

- **사용 용도**: 결제 처리 서비스 (예: 카드 결제, 송금 등).
- **설정 파일 위치**: `application.yml`에서 API 키 및 시크릿 설정.
- api url : https://cdn.iamport.kr/js/iamport.payment-1.2.0.js`
- **관련 코드**:
    - 프론트 결제 api 코드 : `frontend\src\pages\PullupPage.tsx` 
    - 결제 처리: `com.ssafy.stackup.domain.board` 클래스.

## 3. SSAFY 금융 API

- **사용 용도**: SSAFY Wallet을 사용한 사용자 지갑 관리 및 트랜잭션 처리.
- **접근 정보**:
- **사용하는 SSAFY Wallet API 엔드포인트**:
    - 유저 키 : `POST api/account/key`
- **설정 파일 위치**: `backend account service`에서 지갑 API 관련 설정.
- **관련 코드**:
    - 계좌 처리: `com.ssafy.stackup.domaina.account.service` 클래스.
```

[외부서비스.md](https://prod-files-secure.s3.us-west-2.amazonaws.com/28d7c3ce-495d-4e32-9623-2146749d7e09/7497d6ef-5819-48ac-ad98-f1499d51ef69/%EC%99%B8%EB%B6%80%EC%84%9C%EB%B9%84%EC%8A%A4.md)
