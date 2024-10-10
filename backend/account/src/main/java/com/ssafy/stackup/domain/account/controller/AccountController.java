package com.ssafy.stackup.domain.account.controller;

import co.elastic.clients.elasticsearch.nodes.Http;
import com.ssafy.stackup.common.exception.ResourceNotFoundException;
import com.ssafy.stackup.domain.account.dto.*;
import com.ssafy.stackup.domain.account.entity.Account;
import com.ssafy.stackup.domain.account.service.AccountService;
//import com.ssafy.stackup.domain.account.service.TransactionsService;
//import com.ssafy.stackup.domain.account.service.TransferService;
//import com.ssafy.stackup.domain.account.service.WonAuthService;
import com.ssafy.stackup.domain.account.service.TransactionsService;
import com.ssafy.stackup.domain.account.service.TransferService;
import com.ssafy.stackup.domain.account.service.WonAuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/account")
public class AccountController {

    @Autowired
    private AccountService accountService;
    @Autowired
    private TransactionsService transactionsService;
    @Autowired
    private WonAuthService wonAuthService;

   @Autowired
    private TransferService transferService;


    @GetMapping
    public List<AccountResponse> findALL(HttpServletRequest request) {

        User user = getUserDetailInfo(request);
        List<Account> accounts = accountService.getAccountsByUserId(user.getId(), request);
//        return accounts.stream()
//                .map(this::ConvertResponse)
//                .toList();
        // 중복을 제거할 Set 생성
        Set<String> seenAccountNums = new HashSet<>();

        // 중복을 제거한 리스트 생성
        List<AccountResponse> uniqueAccountResponses = accounts.stream()
                .filter(account -> seenAccountNums.add(account.getAccountNum())) // 중복된 accountNum은 Set에 추가되지 않음
                .map(this::ConvertResponse)
                .collect(Collectors.toList());

        return uniqueAccountResponses;
    }

    private AccountResponse ConvertResponse(Account account){
        AccountResponse accountResponse = new AccountResponse();
        accountResponse.setAccountId(account.getAccountId());
        accountResponse.setAccountName(account.getAccountName());
        accountResponse.setBankCode(account.getBankCode());
        accountResponse.setCreatedDate(account.getCreatedDate());
        accountResponse.setExpiryDate(account.getExpiryDate());

        // 암호화된 계좌번호 복호화
        try {
            String decryptedAccountNum = EncryptionUtil.decrypt(account.getAccountNum());
            accountResponse.setAccountNum(decryptedAccountNum);
        } catch (Exception e) {
            e.printStackTrace();
            accountResponse.setAccountNum("Unknown");
        }

        accountResponse.setBalnace(account.getBalance());
        return accountResponse;
    }

    //개발용 은행키 발급
    @PostMapping("/key")
    public void generateKey(HttpServletRequest request){
        User user = getUserDetailInfo(request);

        String email = user.getEmail();
        accountService.generateAccountKey(email);
    }

    @GetMapping("/update")
    public  ResponseEntity<List<Object>> updateAccount(HttpServletRequest request){
        User user = getUserDetailInfo(request);

        try {
            accountService.fetchAndStoreAccountData(user,request);
            // 성공적인 경우에는 필요한 데이터를 리턴하거나 OK 상태를 리턴
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            // 에러 발생 시 로그를 남기고 빈 배열 리턴
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ArrayList<>());
        }

    }
    @GetMapping("/{accountId}")
    public AccountResponse getAccount(@PathVariable Long accountId) throws Exception {
        Account account = accountService.getAccount(accountId);
        String accountNo = EncryptionUtil.decrypt(account.getAccountNum());
        return ConvertResponse(account);
    }

    @GetMapping("/decrypt/{accountId}")
    public String getDecryptedAccountNum(@PathVariable Long accountId) {
        return accountService.decryptAccountNum(accountId);
    }

    @GetMapping("/transactions/{accountId}")
    public List<?> getTransaction(@PathVariable Long accountId,HttpServletRequest request) throws Exception {
        User user = getUserDetailInfo(request);
        Account account = accountService.getAccount(accountId);
        String accountNo = EncryptionUtil.decrypt(account.getAccountNum());
        return transactionsService.fetchTransactions(accountId, accountNo, user, request);
    }


    @Transactional
    @PostMapping("/transfer")
    public void accountTransfer(@RequestBody TransferRequest request,HttpServletRequest httpServletRequest) throws Exception {


        User client = getUserDetailInfo(httpServletRequest);
        Long freelancerId = request.getFreelancerId();

        User freelancer = accountService.getDetailUserInfo(freelancerId, httpServletRequest);
        if (freelancer.getMainAccount() == null) {
            throw new IllegalArgumentException("프리랜서 계좌 번호가 존재하지 않습니다.");
        }
        if (client.getMainAccount() == null) {
            throw new IllegalArgumentException("클라이언트 계좌 번호가 존재하지 않습니다.");
        }
        String freelancerAccountNo = EncryptionUtil.decrypt(freelancer.getMainAccount());
        String clientAccountNo = EncryptionUtil.decrypt(client.getMainAccount());
        transferService.fetchTransfer(freelancerAccountNo, clientAccountNo, request.getTransactionBalance(), client,httpServletRequest);
    }





    @PostMapping("/auth/{accountId}")
    public void wonAuth(@PathVariable Long accountId, HttpServletRequest request) throws Exception {

        User user = getUserDetailInfo(request);
        Account account = accountService.getAccount(accountId);
        String accountNo = EncryptionUtil.decrypt(account.getAccountNum());
        wonAuthService.fetchWonAuth(accountNo, user, request);
    }

    @PostMapping("/{accountId}/checkCode")
    public void wonCheck(@RequestBody CheckCodeRequest request, @PathVariable Long accountId,HttpServletRequest httpServletRequest) throws Exception {
        User user = getUserDetailInfo(httpServletRequest);
        Account account = accountService.getAccount(accountId);
        String accountNo = EncryptionUtil.decrypt(account.getAccountNum());
        wonAuthService.fetchWonCheck(accountNo, request.getCode(), user,httpServletRequest);
    }

    @PostMapping("/password")
    public ResponseEntity<String> setSecondPassword(@RequestBody SecondPasswordRequest request, HttpServletRequest httpServletRequest){
        User user = getUserDetailInfo(httpServletRequest);
        String secondPassword = request.getSecondPassword();

        if (secondPassword == null || secondPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("비밀번호가 필요합니다.");
        }

        // 비밀번호를 암호화하고 저장
        accountService.setSecondPassword(user, secondPassword,httpServletRequest);

        return ResponseEntity.ok("2차 비밀번호가 성공적으로 저장되었습니다.");
    }

    @PostMapping("/check/password")
    public ResponseEntity<String> checkSecondPassword(@RequestBody SecondPasswordRequest request,HttpServletRequest httpServletRequest){

        User user = getUserDetailInfo(httpServletRequest);
        String secondPassword = request.getSecondPassword();
        if (secondPassword == null || secondPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("비밀번호가 필요합니다.");
        }

        boolean isPasswordCorrect = accountService.checkSecondPassword(user, secondPassword);
        if (isPasswordCorrect) {
            return ResponseEntity.ok("비밀번호가 일치합니다.");
        } else {
            return ResponseEntity.status(401).body("비밀번호가 일치하지 않습니다.");
        }
    }

    @GetMapping("/password/check")
    public ResponseEntity<?> confirmPassword(HttpServletRequest request) throws Exception {
        User user = getUserDetailInfo(request);
        String secondPassword = user.getSecondPassword();
        if (secondPassword == null || secondPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("비밀번호가 존재하지 않습니다");
        } else {
            return ResponseEntity.ok(" 비밀번호가 존재합니다.");
        }
    }


    @PostMapping("/main/{accountId}")
    public ResponseEntity<?> setMainAccount(@PathVariable Long accountId, HttpServletRequest request) throws Exception {
         User user = getUserDetailInfo(request);
        Long userId = user.getId();
        accountService.setMainAccount(accountId, user , request);

        return ResponseEntity.ok("메인 계좌 설정 성공");
    }



    @GetMapping("/main")
    public ResponseEntity<Object> getMainAccount(HttpServletRequest request) throws Exception {
        User user = getUserDetailInfo(request);

        // user.getMainAccount() 값이 null 또는 빈 문자열인지 확인
        if (user.getMainAccount() == null || user.getMainAccount().isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("메인 계좌가 없습니다");
            return ResponseEntity.ok(new String[]{});

        }
        // 계좌가 존재하는 경우 복호화
        String account = EncryptionUtil.decrypt(user.getMainAccount());

        return ResponseEntity.ok(account);
    }

    /**
     *  user service에 있는 user 가져오기
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-10-05
     * @ 설명     :
     * @return
     */
    public User getUserDetailInfo(HttpServletRequest request){
        User user = getUserSimpleInfo(request);
        user = accountService.getDetailUserInfo(user.getId(), request);
        return  user;
    }

    /**
     * jwt 인증 후 저장된 간단한 UserDto 가져오기
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-10-05
     * @ 설명     :
     * @return
     */
    public User getUserSimpleInfo(HttpServletRequest request){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal(); //user과 userType만 있는 jwt 정보
        return  user;
    }

    
}
