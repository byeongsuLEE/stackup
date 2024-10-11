package com.ssafy.stackup.domain.account.entity;


import com.ssafy.stackup.domain.account.dto.User;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;

    private String bankName;
    private String accountName;
    private String bankCode;
    private String createdDate;
    private String expiryDate;
    private String accountNum;
    private Long balance;

    private Long userId;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id") // 외래 키 컬럼명
//    private User user; // 계좌의 주인
}
