package com.ssafy.stackup.domain.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;


@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContractInfoResponseDto {

    private Long freelancerProjectId;
    private boolean contractCreated; // 계약서 작성 여부
    private Date contractStartDate; // 계약 시작일
    private Date contractEndDate; // 계약 종료일
    private Long contractTotalAmount; // 총 계약 금액
    private Long contractDownPayment; // 착수금
    private Long contractFinalPayment; // 잔금
    private String contractCompanyName; // 회사명 (클라이언트)
    private String contractConfidentialityClause; // 비밀 유지 조항
    private String contractAdditionalTerms; // 추가 특약 사항
    private String period;
    private String candidateName;
    private String projectName;
}
