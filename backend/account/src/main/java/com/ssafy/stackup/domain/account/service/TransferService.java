package com.ssafy.stackup.domain.account.service;

import com.ssafy.stackup.common.exception.CustomException;
import com.ssafy.stackup.domain.account.dto.User;
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
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import static com.ssafy.stackup.common.response.ErrorCode.USER_NOT_SET_SECOND_PASSWORD;
import static com.ssafy.stackup.domain.account.service.AccountService.createHeaders;

@Service
public class TransferService {

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

    public Map<String, Object> fetchTransfer(String depositAccount, String withdrawAccount, String transactionBalance, User user, HttpServletRequest httpServletRequest) {
        String url = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/updateDemandDepositAccountTransfer";
        String accountKey = user.getAccountKey();
        String email = user.getEmail();

        apikey = getApikey();

//        if (accountKey == null) {
//            System.out.println("accountKey 없음");
//            // account_key가 없으면 새로운 key를 발급받아 저장
//            accountKey = accountService.searchAccountKey(email);
//            user.setAccountKey(accountKey);
//
//            HttpHeaders headers = createHeaders(httpServletRequest);
//            // 요청 엔터티 생성 (헤더 + 바디)
//            HttpEntity<User> requestEntity = new HttpEntity<>(user, headers);
//
//            // POST 요청 보내기 (응답을 Map으로 받음)
//            ResponseEntity<String> response = restTemplate.exchange(USER_SERVICE_URL+"/info/second-password", HttpMethod.PATCH, requestEntity, String.class);
//            if(response.getStatusCode() != HttpStatus.OK) {
//
//
//                throw new CustomException(USER_NOT_SET_SECOND_PASSWORD);
//            }
//        }

        // 현재 날짜와 시간 가져오기
        String transmissionDate = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        String transmissionTime = LocalTime.now().format(DateTimeFormatter.ofPattern("HHmmss"));

        // 난수 생성
        String institutionTransactionUniqueNo = accountService.generateRandomNumberString(20);

        // 요청 헤더 생성
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apiName", "updateDemandDepositAccountTransfer");
        headers.set("transmissionDate", transmissionDate);
        headers.set("transmissionTime", transmissionTime);
        headers.set("institutionCode", "00100");
        headers.set("fintechAppNo", "001");
        headers.set("apiServiceCode", "updateDemandDepositAccountTransfer");
        headers.set("institutionTransactionUniqueNo", institutionTransactionUniqueNo);
        headers.set("apiKey", apikey);
        headers.set("userKey", accountKey);

        // JSON 본문 생성
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("Header", Map.of(
                "apiName", "updateDemandDepositAccountTransfer",
                "transmissionDate", transmissionDate,
                "transmissionTime", transmissionTime,
                "institutionCode", "00100",
                "fintechAppNo", "001",
                "apiServiceCode", "updateDemandDepositAccountTransfer",
                "institutionTransactionUniqueNo", institutionTransactionUniqueNo,
                "apiKey", apikey,
                "userKey", accountKey
        ));
        requestBody.put("depositAccountNo", depositAccount); // 입급할 계좌번호
        requestBody.put("depositTransactionSummary", "(수시입출금) : 입금(이체)");
        requestBody.put("transactionBalance",transactionBalance);
        requestBody.put("withdrawalAccountNo", withdrawAccount);
        requestBody.put("withdrawalTransactionSummary","(수시입출금) : 출금(이체)");
        System.out.println(requestBody);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        // POST 요청 보내기
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, Map.class);

        Map<String, Object> responseBody = response.getBody();

        return requestBody;
    }
}
