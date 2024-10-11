package com.ssafy.stackup.domain.account.service;

import com.ssafy.stackup.common.exception.CustomException;
import com.ssafy.stackup.common.exception.ResourceNotFoundException;
import com.ssafy.stackup.common.jwt.TokenProvider;
import com.ssafy.stackup.common.response.ApiResponse;
import com.ssafy.stackup.domain.account.dto.EncryptionUtil;
import com.ssafy.stackup.domain.account.dto.User;
import com.ssafy.stackup.domain.account.entity.Account;
import com.ssafy.stackup.domain.account.repository.AccountRepository;
import com.ssafy.stackup.domain.account.util.SecondUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.ssafy.stackup.common.response.ErrorCode.USER_NOT_FOUND;
import static com.ssafy.stackup.common.response.ErrorCode.USER_NOT_SET_SECOND_PASSWORD;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    private final RestTemplate restTemplate = new RestTemplate();


    @Value("${USER_SERVICE_URL}")
    private String USER_SERVICE_URL; // User 서비스의 API URL
    // 난수 생성기 설정
    private static final SecureRandom random = new SecureRandom();
    private TokenProvider tokenProvider;


//    private String apikey = "13d8a1c9199348928f01b0591c325460";

    @Transactional(readOnly = true)
    public List<Account> getAccountsByUserId(Long userId, HttpServletRequest request) {
        //        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, Map.class);
        User userDto = getDetailUserInfo(userId, request);
        return accountRepository.findByUserId(userDto.getId());
    }

    public User getDetailUserInfo(Long userId, HttpServletRequest request) {
        HttpHeaders headers = createHeaders(request);
        HttpEntity<?> httpEntity = new HttpEntity<>(headers);

        System.out.println("Request URL: " + USER_SERVICE_URL);
        System.out.println("Authorization Header: " + headers.get("Authorization"));

        String url = USER_SERVICE_URL + "info"+ "/"+userId;
        ResponseEntity<ApiResponse<User>> response = restTemplate.exchange(url, HttpMethod.GET, httpEntity, new ParameterizedTypeReference<ApiResponse<User>>() {
        });
        if (response.getStatusCode().is2xxSuccessful()) {
            ApiResponse<User> apiResponse = response.getBody();
            User user = apiResponse.getData(); // ApiResponse 내부의 데이터를 꺼냄
            return user;
        } else {
            throw new ResourceNotFoundException("user를 가져올 수 없습니다.");
        }
    }


    public String getApikey() {
        String url = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/app/reIssuedApiKey";

        // JSON 본문 생성
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("managerId", "choho97@naver.com");

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody);

        // POST 요청 보내기
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, Map.class);

//        String key = response.getBody().get("apikey").toString();
        // 응답 본문에서 apiKey 추출
        if (response.getBody() != null && response.getBody().containsKey("apiKey")) {
            String key = response.getBody().get("apiKey").toString();
            System.out.println("api : " + key);
            return key;
        }

        return null;
    }

    private String apikey;

    @Transactional
    public void fetchAndStoreAccountData(User user, HttpServletRequest request) {
        String url = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/inquireDemandDepositAccountList";

        apikey = getApikey();

        String accountKey = user.getAccountKey();
        String email = user.getEmail();
        System.out.println("//////////////////////email :" + email);

        if (accountKey == null) {
            System.out.println("accountKey 없음");
            // account_key가 없으면 새로운 key를 발급받아 저장
            accountKey = searchAccountKey(email);
            System.out.println("accountKey 111: " + accountKey);
            user.setAccountKey(accountKey);

            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("accountKey", accountKey); // accountKey 변수에 값 할당

            HttpHeaders headers = createHeaders(request);
            HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);

            // POST 요청 보내기 (응답을 Map으로 받음)
            ResponseEntity<String> response = restTemplate.exchange(
                    USER_SERVICE_URL + user.getId() + "/accountKey",
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            if(response.getStatusCode() != HttpStatus.OK) {
                throw new CustomException(USER_NOT_FOUND);
            }
            System.out.println("accountKey 222: " + accountKey);
        }

        // 현재 날짜와 시간 가져오기
        String transmissionDate = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        String transmissionTime = LocalTime.now().format(DateTimeFormatter.ofPattern("HHmmss"));


        // 난수 생성
        String institutionTransactionUniqueNo = generateRandomNumberString(20);

        // 요청 헤더 생성
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apiName", "inquireDemandDepositAccountList");
        headers.set("transmissionDate", transmissionDate);
        headers.set("transmissionTime", transmissionTime);
        headers.set("institutionCode", "00100");
        headers.set("fintechAppNo", "001");
        headers.set("apiServiceCode", "inquireDemandDepositAccountList");
        headers.set("institutionTransactionUniqueNo", institutionTransactionUniqueNo);
        headers.set("apiKey", apikey);
        headers.set("userKey", accountKey);

        // JSON 본문 생성
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("Header", Map.of(
                "apiName", "inquireDemandDepositAccountList",
                "transmissionDate", transmissionDate,
                "transmissionTime", transmissionTime,
                "institutionCode", "00100",
                "fintechAppNo", "001",
                "apiServiceCode", "inquireDemandDepositAccountList",
                "institutionTransactionUniqueNo", institutionTransactionUniqueNo,
                "apiKey", apikey,
                "userKey", accountKey
        ));
        requestBody.put("REC", Collections.emptyList()); // 필요한 경우 적절한 REC 필드 값을 추가

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);



        // POST 요청 보내기
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, Map.class);

        // 응답 데이터에서 REC 부분 추출
        List<Map<String, String>> recList = (List<Map<String, String>>) response.getBody().get("REC");

        for (Map<String, String> rec : recList) {
            try {
                String encryptedAccountNum = EncryptionUtil.encrypt(rec.get("accountNo"));
                if (encryptedAccountNum == null) {
                    continue; // 암호화 실패 시 현재 계좌는 무시
                }

                Account existingAccount = accountRepository.findByAccountNum(encryptedAccountNum);
                if (existingAccount != null) {
                    // 중복 계좌가 있을 경우 정보 업데이트
                    existingAccount.setBankName(rec.get("bankName"));
                    existingAccount.setAccountName(rec.get("accountName"));
                    existingAccount.setBankCode(rec.get("bankCode"));
                    existingAccount.setCreatedDate(rec.get("accountCreatedDate"));
                    existingAccount.setExpiryDate(rec.get("accountExpiryDate"));

                    // accountBalance를 String에서 long으로 변환하여 저장
                    try {
                        long balance = Long.parseLong(rec.get("accountBalance"));
                        existingAccount.setBalance(balance);
                    } catch (NumberFormatException e) {
                        e.printStackTrace();
                        // 로그를 남기거나 적절한 예외 처리를 할 수 있습니다.
                        existingAccount.setBalance(0L); // 변환 실패 시 기본값 설정
                    }

                    existingAccount.setUserId(user.getId());
                    accountRepository.save(existingAccount);
                } else {
                    // 중복 계좌가 없을 경우 새 계좌 저장
                    Account newAccount = new Account();
                    newAccount.setBankName(rec.get("bankName"));
                    newAccount.setAccountName(rec.get("accountName"));
                    newAccount.setBankCode(rec.get("bankCode"));
                    newAccount.setCreatedDate(rec.get("accountCreatedDate"));
                    newAccount.setExpiryDate(rec.get("accountExpiryDate"));
                    newAccount.setAccountNum(encryptedAccountNum);

                    // accountBalance를 String에서 long으로 변환하여 저장
                    try {
                        long balance = Long.parseLong(rec.get("accountBalance"));
                        newAccount.setBalance(balance);
                    } catch (NumberFormatException e) {
                        e.printStackTrace();
                        // 로그를 남기거나 적절한 예외 처리를 할 수 있습니다.
                        newAccount.setBalance(0L); // 변환 실패 시 기본값 설정
                    }

                    newAccount.setUserId(user.getId());
                    accountRepository.save(newAccount);
                }
            } catch (Exception e) {
                e.printStackTrace();
                // 계좌 정보를 저장하는 도중 발생한 예외 처리
            }

        }
    }

    public String searchAccountKey(String email) {
        String url = "https://finopenapi.ssafy.io/ssafy/api/v1/member/search";
        // 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        apikey = getApikey();

        // JSON 본문 생성
        Map<String, String> requestBody = new HashMap<>();

        requestBody.put("apiKey", apikey);
        requestBody.put("userId", email);

        // 요청 엔터티 생성 (헤더 + 바디)
        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);

        // POST 요청 보내기 (응답을 Map으로 받음)
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, Map.class);

        // 응답 바디에서 userKey 추출
        Map<String, Object> responseMap = response.getBody();
        if (responseMap != null && responseMap.containsKey("userKey")) {
            return responseMap.get("userKey").toString(); // userKey만 반환
        }

        return null; // userKey가 없을 경우
    }

    public String generateAccountKey(String email) {



        String url = "https://finopenapi.ssafy.io/ssafy/api/v1/member/";
        // 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // JSON 본문 생성
        Map<String, String> requestBody = new HashMap<>();
        apikey = getApikey();

        System.out.println(apikey);

        requestBody.put("apiKey", apikey);
        requestBody.put("userId", email);

        // 요청 엔터티 생성 (헤더 + 바디)
        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);


        // POST 요청 보내기 (응답을 Map으로 받음)
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, Map.class);

        // 응답 바디에서 userKey 추출
        Map<String, Object> responseMap = response.getBody();
        if (responseMap != null && responseMap.containsKey("userKey")) {
            return responseMap.get("userKey").toString(); // userKey만 반환
        }

        return null; // userKey가 없을 경우
    }


    public Account getAccount(Long id) {
        return accountRepository.findById(id).orElse(null);
    }

    public String decryptAccountNum(Long id) {
        Account account = getAccount(id);
        if (account != null) {
            try {
                return EncryptionUtil.decrypt(new String(account.getAccountNum()));
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }
        return null;
    }

    public String generateRandomNumberString(int length) {
        // 생성할 난수 문자열의 길이 설정
        if (length <= 0) {
            throw new IllegalArgumentException("Length must be greater than 0");
        }

        // 난수 문자열 생성
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(random.nextInt(10)); // 0~9 사이의 숫자를 추가
        }

        return sb.toString();
    }

    // 2차 비밀번호 저장
    public void setSecondPassword(User user, String secondPassword , HttpServletRequest request) {
            String encryptedPassword = SecondUtil.encrypt(secondPassword);
            user.setSecondPassword(encryptedPassword);
            // 요청 엔터티 생성 (헤더 + 바디)
        HttpHeaders headers = createHeaders(request);
        HttpEntity<User> requestEntity = new HttpEntity<>(user, headers);

            // POST 요청 보내기 (응답을 Map으로 받음)
            ResponseEntity<String> response = restTemplate.exchange(USER_SERVICE_URL+"info/second-password", HttpMethod.POST, requestEntity, String.class);
            if(response.getStatusCode() != HttpStatus.OK) {


                throw new CustomException(USER_NOT_SET_SECOND_PASSWORD);
            }

    }

    // 2차 비밀번호 확인
    public boolean checkSecondPassword(User user, String rawPassword) {
        if (user != null) {
            String encodedPassword = user.getSecondPassword();
            return SecondUtil.matches(rawPassword, encodedPassword);
        }
        return false; // 사용자를 찾을 수 없거나 비밀번호 불일치 시 false 반환
    }

    @Transactional
    public void setMainAccount(Long accountId, User user, HttpServletRequest request) throws Exception {
        Account account = getAccount(accountId);
        String accountNo = EncryptionUtil.decrypt(account.getAccountNum());

        user.setMainAccount(EncryptionUtil.encrypt(accountNo));

        HttpHeaders headers = createHeaders(request);
        HttpEntity<User> requestEntity = new HttpEntity<>(user, headers);

        // POST 요청 보내기 (응답을 Map으로 받음)
        ResponseEntity<String> response = restTemplate.exchange(USER_SERVICE_URL+"info/main-account", HttpMethod.POST
                , requestEntity, String.class);
        if(response.getStatusCode() != HttpStatus.OK) {


            throw new CustomException(USER_NOT_SET_SECOND_PASSWORD);
        }


    }

    public static HttpHeaders createHeaders(HttpServletRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", request.getHeader("Authorization"));
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

}



