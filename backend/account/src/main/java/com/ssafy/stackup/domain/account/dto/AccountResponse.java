package com.ssafy.stackup.domain.account.dto;

import lombok.Data;

@Data
public class AccountResponse {
    private Long accountId;
    private String accountName;
    private String bankCode;
    private String accountNum;
    private String createdDate;
    private String expiryDate;
    private Long balnace;
}
