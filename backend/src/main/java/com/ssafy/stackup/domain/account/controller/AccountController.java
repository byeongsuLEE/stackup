package com.ssafy.stackup.domain.account.controller;

import com.ssafy.stackup.common.exception.ResourceNotFoundException;
import com.ssafy.stackup.domain.account.dto.*;
import com.ssafy.stackup.domain.account.entity.Account;
import com.ssafy.stackup.domain.account.service.AccountService;
import com.ssafy.stackup.domain.account.service.TransactionsService;
import com.ssafy.stackup.domain.account.service.TransferService;
import com.ssafy.stackup.domain.account.service.WonAuthService;
import com.ssafy.stackup.domain.user.entity.AuthUser;
import com.ssafy.stackup.domain.user.entity.User;
import com.ssafy.stackup.domain.user.repository.UserRepository;
import com.ssafy.stackup.domain.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<AccountResponse> findALL(@AuthUser User user) {
        Long userId = user.getId();
        List<Account> accounts = accountService.getAccountsByUserId(userId);
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
    public void generateKey(@AuthUser User user){
        String email = user.getEmail();
        accountService.generateAccountKey(email);
    }

    @GetMapping("/update")
    public void updateAccount(@AuthUser User user){
        Long userId = user.getId();
        System.out.println(userId);
        accountService.fetchAndStoreAccountData(userId);
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
    public List<?> getTransaction(@PathVariable Long accountId, @AuthUser User user) throws Exception {
        Long userId = user.getId();
        Account account = accountService.getAccount(accountId);
        String accountNo = EncryptionUtil.decrypt(account.getAccountNum());
        return transactionsService.fetchTransactions(accountId, accountNo, userId);
    }

//    @PostMapping("/{accountId}/transfer")
//    public void accountTransfer(@RequestBody TransferRequest request, @PathVariable Long accountId,@AuthUser User user) throws Exception {
//        Long userId = user.getId();
//        Account account = accountService.getAccount(accountId);
//        String accountNo = EncryptionUtil.decrypt(account.getAccountNum());
//        System.out.println(accountNo);
//        System.out.println(request.getDepositAccount());
//        System.out.println(request.getTransactionBalance());
//        transferService.fetchTransfer(request.getDepositAccount(), accountNo, request.getTransactionBalance(), userId);
//    }

    @PostMapping("/transfer")
    public void accountTrans(@RequestBody TransferRequest request, @AuthUser User user) throws Exception {
        Long freelancerId = request.getFreelancerId();
        User client = userRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("클라이언트가 존재하지 않음"));
        User freelancer = userRepository.findById(freelancerId)
                .orElseThrow(()-> new ResourceNotFoundException("프리랜서가 존재하지 않음"));
        if (freelancer.getMainAccount() == null) {
            throw new IllegalArgumentException("프리랜서 계좌 번호가 존재하지 않습니다.");
        }
        if (client.getMainAccount() == null) {
            throw new IllegalArgumentException("클라이언트 계좌 번호가 존재하지 않습니다.");
        }
        String freelancerAccountNo = EncryptionUtil.decrypt(freelancer.getMainAccount());
        String clientAccountNo = EncryptionUtil.decrypt(client.getMainAccount());
        transferService.fetchTransfer(freelancerAccountNo, clientAccountNo, request.getTransactionBalance(), client.getId());
    }

    @PostMapping("/auth/{accountId}")
    public void wonAuth(@PathVariable Long accountId, @AuthUser User user) throws Exception {
        Long userId = user.getId();
        Account account = accountService.getAccount(accountId);
        String accountNo = EncryptionUtil.decrypt(account.getAccountNum());
        wonAuthService.fetchWonAuth(accountNo, userId);
    }

    @PostMapping("/{accountId}/checkCode")
    public void wonCheck(@RequestBody CheckCodeRequest request, @PathVariable Long accountId, @AuthUser User user) throws Exception {
        Long userId = user.getId();
        Account account = accountService.getAccount(accountId);
        String accountNo = EncryptionUtil.decrypt(account.getAccountNum());
        wonAuthService.fetchWonCheck(accountNo, request.getCode(), userId);
    }

    @PostMapping("/password")
    public ResponseEntity<String> setSecondPassword(@RequestBody SecondPasswordRequest request, @AuthUser User user){
        Long userId = user.getId();
        String secondPassword = request.getSecondPassword();

        if (secondPassword == null || secondPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("비밀번호가 필요합니다.");
        }

        // 비밀번호를 암호화하고 저장
        accountService.setSecondPassword(userId, secondPassword);

        return ResponseEntity.ok("2차 비밀번호가 성공적으로 저장되었습니다.");
    }

    @GetMapping("/password")
    public ResponseEntity<String> checkSecondPassword(@RequestBody SecondPasswordRequest request,@AuthUser User user){
        Long userId = user.getId();
        String secondPassword = request.getSecondPassword();
        if (secondPassword == null || secondPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("비밀번호가 필요합니다.");
        }

        boolean isPasswordCorrect = accountService.checkSecondPassword(userId, secondPassword);
        if (isPasswordCorrect) {
            return ResponseEntity.ok("비밀번호가 일치합니다.");
        } else {
            return ResponseEntity.status(401).body("비밀번호가 일치하지 않습니다.");
        }
    }

    @GetMapping("/password/check")
    public ResponseEntity<?> checkPassword(@AuthUser User user){
        String secondPassword = user.getSecondPassword();
        if (secondPassword == null || secondPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("비밀번호가 존재하지 않습니다");
        } else {
            return ResponseEntity.ok(" 비밀번호가 존재합니다.");
        }
    }

    @PostMapping("/main/{accountId}")
    public ResponseEntity<?> setMainAccount(@PathVariable Long accountId, @AuthUser User user) throws Exception {
        Long userId = user.getId();
        Account account = accountService.getAccount(accountId);
        String accountNo = EncryptionUtil.decrypt(account.getAccountNum());

        user.setMainAccount(EncryptionUtil.encrypt(accountNo));
        userRepository.save(user);
        return ResponseEntity.ok("메인 계좌 설정 성공");
    }

    @GetMapping("/main")
    public ResponseEntity<String> getMainAccount(@AuthUser User user) throws Exception {
        Long userId = user.getId();
        String account = EncryptionUtil.decrypt(user.getMainAccount());
        return ResponseEntity.ok(account);
    }

    
}
