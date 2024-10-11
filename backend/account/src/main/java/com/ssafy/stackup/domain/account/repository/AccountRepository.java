package com.ssafy.stackup.domain.account.repository;

import com.ssafy.stackup.domain.account.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface AccountRepository extends JpaRepository<Account, Long> {
    @Query("SELECT a.createdDate AS startDate, a.expiryDate AS endDate, a.accountNum AS accountNo FROM Account a WHERE a.accountId = :accountId")
    Map<String, String> findDatesByAccountId(@Param("accountId") Long accountId);

    Account findByAccountNum(String accountNum);

    List<Account> findByUserId(Long userId);
}
