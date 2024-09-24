package com.ssafy.stackup.domain.account.dto;

import lombok.Data;

@Data
public class TransferRequest {
    private String depositAccount;
    private String transactionBalance;
}
