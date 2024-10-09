package com.ssafy.stackup.domain.account.service;

import com.ssafy.stackup.common.exception.CustomException;
import com.ssafy.stackup.domain.account.dto.EncryptionUtil;
import com.ssafy.stackup.domain.account.dto.User;
import com.ssafy.stackup.domain.account.entity.Account;
import com.ssafy.stackup.domain.account.repository.AccountRepository;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
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
import static com.ssafy.stackup.domain.account.service.AccountService.createHeaders;

@Service
public class TransactionsService {

    @Value("${USER_SERVICE_URL}")
    private String USER_SERVICE_URL; // User 서비스의 API URL

    @Autowired
    private AccountRepository accountRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    // 난수 생성기 설정
    private static final SecureRandom random = new SecureRandom();


    @Autowired
    private AccountService accountService;

    public String getApikey() {
        String url = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/app/reIssuedApiKey";

        // JSON 본문 생성
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("managerId" , "choho97@naver.com");

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody);

        // POST 요청 보내기
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, Map.class);

        //        String key = response.getBody().get("apikey").toString();
        // 응답 본문에서 apiKey 추출
        if (response.getBody() != null && response.getBody().containsKey("apiKey")) {
            String key = response.getBody().get("apiKey").toString();
            return key;
        }

        return null;
    }
    private String apikey;

//    private String apikey = "13d8a1c9199348928f01b0591c325460";

    public List<Map<String, String>> fetchTransactions (Long accountId, String accountNo, User user , HttpServletRequest request) {
        String url = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/inquireTransactionHistoryList";


        String accountKey = user.getAccountKey();
        String email = user.getEmail();

        apikey = getApikey();
//
//        if (accountKey == null) {
//            System.out.println("accountKey 없음");
//            // account_key가 없으면 새로운 key를 발급받아 저장
//            accountKey = accountService.searchAccountKey(email);
//            user.setAccountKey(accountKey);
//
//            HttpHeaders headers = createHeaders(request);
//            HttpEntity<User> requestEntity = new HttpEntity<>(user, headers);
//
//            ResponseEntity<String> response = restTemplate.exchange(USER_SERVICE_URL+"/accountKey", HttpMethod.POST, requestEntity, String.class);
//            if(response.getStatusCode() != HttpStatus.OK) {
//                throw new CustomException(USER_NOT_FOUND);
//            }
//
//        }

        // 현재 날짜와 시간 가져오기
        String transmissionDate = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        String transmissionTime = LocalTime.now().format(DateTimeFormatter.ofPattern("HHmmss"));

        // 난수 생성
        String institutionTransactionUniqueNo = generateRandomNumberString(20);

        Map<String, String> dates = accountRepository.findDatesByAccountId(accountId);
        String startDate = dates.get("startDate");
        String endDate = dates.get("endDate");
//        String accountNo = dates.get("accountNo");

//        System.out.println(startDate);

        // 요청 헤더 생성
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apiName", "inquireTransactionHistoryList");
        headers.set("transmissionDate", transmissionDate);
        headers.set("transmissionTime", transmissionTime);
        headers.set("institutionCode", "00100");
        headers.set("fintechAppNo", "001");
        headers.set("apiServiceCode", "inquireTransactionHistoryList");
        headers.set("institutionTransactionUniqueNo", institutionTransactionUniqueNo);
        headers.set("apiKey", apikey);
        headers.set("userKey", accountKey);

        // JSON 본문 생성
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("Header", Map.of(
                "apiName", "inquireTransactionHistoryList",
                "transmissionDate", transmissionDate,
                "transmissionTime", transmissionTime,
                "institutionCode", "00100",
                "fintechAppNo", "001",
                "apiServiceCode", "inquireTransactionHistoryList",
                "institutionTransactionUniqueNo", institutionTransactionUniqueNo,
                "apiKey", apikey,
                "userKey", accountKey
        ));
        requestBody.put("accountNo", accountNo); // 실제 계좌번호를 사용
        requestBody.put("startDate", startDate);
        requestBody.put("endDate", endDate);
        requestBody.put("transactionType", "A"); // 필요에 따라 설정
        requestBody.put("orderByType", "DESC"); // 필요에 따라 설정
//        requestBody.put("REC", Collections.emptyList()); // 필요한 경우 적절한 REC 필드 값을 추가

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        // POST 요청 보내기
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, Map.class);

        // 응답 데이터에서 REC 부분 추출
        Map<String, Object> responseBody = response.getBody();
        if (responseBody == null) {
            throw new RuntimeException("Response body is null");
        }

        Object recObject = responseBody.get("REC");
        if (!(recObject instanceof Map)) {
            throw new RuntimeException("Expected REC to be a Map, but found: " + recObject.getClass().getSimpleName());
        }

        Map<String, Object> recMap = (Map<String, Object>) recObject;
        Object listObject = recMap.get("list");
        if (!(listObject instanceof List)) {
            throw new RuntimeException("Expected REC list to be a List, but found: " + listObject.getClass().getSimpleName());
        }

        // List<Map<String, String>>로 캐스팅
        List<Map<String, String>> recList = (List<Map<String, String>>) listObject;

        return recList;

        // 응답 데이터에서 REC 부분 추출
//        List<Map<String, String>> recList = (List<Map<String, String>>) response.getBody().get("REC");
//
//        return recList;
    }


    private String generateRandomNumberString(int length) {
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
}
