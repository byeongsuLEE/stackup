package com.ssafy.stackup.domain.account.service;

import com.ssafy.stackup.domain.account.dto.EncryptionUtil;
import com.ssafy.stackup.domain.account.entity.Account;
import com.ssafy.stackup.domain.account.repository.AccountRepository;
import com.ssafy.stackup.domain.user.entity.User;
import com.ssafy.stackup.domain.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

@Service
public class WonAuthService {

    @Autowired
    private AccountRepository accountRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    // 난수 생성기 설정
    private static final SecureRandom random = new SecureRandom();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountService accountService;

    public void fetchWonAuth (String accountNo, Long userId) {
        String url = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/accountAuth/openAccountAuth";

        User user = userRepository.findById(userId).orElse(null);

        String accountKey = user.getAccountKey();
        String email = user.getEmail();

        if (accountKey == null) {
            System.out.println("accountKey 없음");
            // account_key가 없으면 새로운 key를 발급받아 저장
            accountKey = accountService.searchAccountKey(email);
            user.setAccountKey(accountKey);
            userRepository.save(user);
        }

        // 현재 날짜와 시간 가져오기
        String transmissionDate = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        String transmissionTime = LocalTime.now().format(DateTimeFormatter.ofPattern("HHmmss"));

        // 난수 생성
        String institutionTransactionUniqueNo = generateRandomNumberString(20);

        // 요청 헤더 생성
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apiName", "openAccountAuth");
        headers.set("transmissionDate", transmissionDate);
        headers.set("transmissionTime", transmissionTime);
        headers.set("institutionCode", "00100");
        headers.set("fintechAppNo", "001");
        headers.set("apiServiceCode", "openAccountAuth");
        headers.set("institutionTransactionUniqueNo", institutionTransactionUniqueNo);
        headers.set("apiKey", "ef9d38e608d64bc1817e0ab47aa757ba");
        headers.set("userKey", "85ea7b07-cc04-42f2-93d8-287aa13b9a7f");

        // JSON 본문 생성
        Map<String, Object> requestBody = new HashMap<>();

        requestBody.put("Header", Map.of(
                "apiName", "openAccountAuth",
                "transmissionDate", transmissionDate,
                "transmissionTime", transmissionTime,
                "institutionCode", "00100",
                "fintechAppNo", "001",
                "apiServiceCode", "openAccountAuth",
                "institutionTransactionUniqueNo", institutionTransactionUniqueNo,
                "apiKey", "ef9d38e608d64bc1817e0ab47aa757ba",
                "userKey", "85ea7b07-cc04-42f2-93d8-287aa13b9a7f"
        ));

        requestBody.put("accountNo", accountNo); // 실제 계좌번호를 사용
        requestBody.put("authText", "STACKUP");

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        // POST 요청 보내기
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, Map.class);

    }

    public void fetchWonCheck(String accountNo, String authCode, Long userId) {
        String url = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/accountAuth/checkAuthCode";

        User user = userRepository.findById(userId).orElse(null);

        String accountKey = user.getAccountKey();
        String email = user.getEmail();

        if (accountKey == null) {
            System.out.println("accountKey 없음");
            // account_key가 없으면 새로운 key를 발급받아 저장
            accountKey = accountService.searchAccountKey(email);
            user.setAccountKey(accountKey);
            userRepository.save(user);
        }

        String transmissionDate = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        String transmissionTime = LocalTime.now().format(DateTimeFormatter.ofPattern("HHmmss"));

        String institutionTransactionUniqueNo = generateRandomNumberString(20);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apiName", "checkAuthCode");
        headers.set("transmissionDate", transmissionDate);
        headers.set("transmissionTime", transmissionTime);
        headers.set("institutionCode", "00100");
        headers.set("fintechAppNo", "001");
        headers.set("apiServiceCode", "checkAuthCode");
        headers.set("institutionTransactionUniqueNo", institutionTransactionUniqueNo);
        headers.set("apiKey", "ef9d38e608d64bc1817e0ab47aa757ba");
        headers.set("userKey", "85ea7b07-cc04-42f2-93d8-287aa13b9a7f");

        // JSON 본문 생성
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("Header", Map.of(
                "apiName", "checkAuthCode",
                "transmissionDate", transmissionDate,
                "transmissionTime", transmissionTime,
                "institutionCode", "00100",
                "fintechAppNo", "001",
                "apiServiceCode", "checkAuthCode",
                "institutionTransactionUniqueNo", institutionTransactionUniqueNo,
                "apiKey", "ef9d38e608d64bc1817e0ab47aa757ba",
                "userKey", "85ea7b07-cc04-42f2-93d8-287aa13b9a7f"
        ));
        requestBody.put("accountNo", accountNo);
        requestBody.put("authText", "STACKUP");
        requestBody.put("authCode", authCode);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);

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
