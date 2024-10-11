package com.ssafy.stackup.domain.user.entity;


import com.ssafy.stackup.domain.project.entity.Project;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FreelancerProject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch =FetchType.LAZY)
    @JoinColumn(name = "freelancer_id")
    private Freelancer freelancer;

    @ManyToOne(fetch = FetchType.LAZY , cascade = CascadeType.ALL)
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(name = "freelancer_signed")
    private boolean freelancerSigned;

    @Column (name = "client_signed")
    private boolean clientSigned;

    @Column (name = "freelancer_signatrue_value")
    private String freelancerSignatureValue;

    @Column (name = "client_signature_value")
    private String clientSignatureValue;

    @Column(name = "nft_contract_url")
    private String nftContractUrl;

    @Column(name = "nft_contract_hash")
    private String nftContractHash;  // NFT 계약서의 해시값

    @Column(name = "nft_certificate_url")
    private String nftCertificateUrl;

    @Column(name = "nft_certificate_hash")
    private String nftCertificateHash;  // 경력 증명서의 해시값


    @Column(name = "contract_created")
    private boolean contractCreated; // 계약서 작성 여부

    @Column(name = "contract_start_date")
    private Date contractStartDate; // 계약 시작일

    @Column(name = "contract_end_date")
    private Date contractEndDate; // 계약 종료일

    @Column(name = "contract_total_amount")
    private Long contractTotalAmount; // 총 계약 금액

    @Column(name = "contract_down_payment")
    private Long contractDownPayment; // 착수금

    @Column(name = "contract_final_payment")
    private Long contractFinalPayment; // 잔금

    @Column(name = "contract_company_name")
    private String contractCompanyName; // 회사명 (클라이언트)

    @Column(name = "contract_confidentiality_clause", columnDefinition = "TEXT")
    private String contractConfidentialityClause; // 비밀 유지 조항

    @Column(name = "contract_additional_terms", columnDefinition = "TEXT")
    private String contractAdditionalTerms; // 추가 특약 사항

    private String period;

    private String candidateName;

    private String projectName;


    private boolean isMiddleClientEvaluated;//  클라리언트가 중간평가를 했는지?
    private boolean isMiddleFreelancerEvaluated;
    private boolean isFinalClientEvaluated;//
    private boolean isFinalFreelancerEvaluated;


    public void updateMiddleClientEvaluated() {
        this.isMiddleClientEvaluated = true;
    }
    public void updateMiddleFreelancerEvaluated() {
        this.isMiddleFreelancerEvaluated = true;
    }
    public void updateFinalClientEvaluated() {
        this.isFinalClientEvaluated = true;
    }
    public void updateFinalFreelancerEvaluated() {
        this.isFinalFreelancerEvaluated = true;
    }


    public void updatePeriod(String period) {
        this.period = period;
    }

    public void updateCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }
    public void updateProjectName(String projectName) {
        this.projectName = projectName;
    }

    // 클라이언트가 계약서 작성
// 계약 시작일 업데이트
    public void updateContractStartDate(Date contractStartDate) {
        this.contractStartDate = contractStartDate;
    }

    // 계약 종료일 업데이트
    public void updateContractEndDate(Date contractEndDate) {
        this.contractEndDate = contractEndDate;
    }

    // 총 계약 금액 업데이트
    public void updateContractTotalAmount(Long contractTotalAmount) {
        this.contractTotalAmount = contractTotalAmount;
    }

    // 착수금 업데이트
    public void updateContractDownPayment(Long contractDownPayment) {
        this.contractDownPayment = contractDownPayment;
    }

    // 잔금 업데이트
    public void updateContractFinalPayment(Long contractFinalPayment) {
        this.contractFinalPayment = contractFinalPayment;
    }

    // 회사명 업데이트
    public void updateContractCompanyName(String contractCompanyName) {
        this.contractCompanyName = contractCompanyName;
    }

    // 비밀 유지 조항 업데이트
    public void updateContractConfidentialityClause(String contractConfidentialityClause) {
        this.contractConfidentialityClause = contractConfidentialityClause;
    }

    // 추가 특약 사항 업데이트
    public void updateContractAdditionalTerms(String contractAdditionalTerms) {
        this.contractAdditionalTerms = contractAdditionalTerms;
    }

    // 계약서 작성 여부 업데이트
    public void updateContractCreated(boolean contractCreated) {
        this.contractCreated = contractCreated;
    }


    public void setFreelancerSigned(boolean freelancerSigned) {
        this.freelancerSigned = freelancerSigned;
    }

    public void setClientSigned(boolean clientSigned) {
        this.clientSigned = clientSigned;
    }


    public  void updateFreelancerSigned() {
        this.freelancerSigned = true;
    }

    public void updateClientSigned() {
        this.clientSigned = true;
    }

    public void updateClientSignatureValue(String clientSignatureValue) {
        this.clientSignatureValue = clientSignatureValue;
    }

    public void updateFreelancerSignatureValue(String freelancerSignatureValue) {
        this.freelancerSignatureValue = freelancerSignatureValue;
    }

    /**
     * 서명 여부 확인 메서드
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-24
     * @ 설명     :
     * @return
     */
    public boolean checkUsersSignConfirm(){
        return this.freelancerSigned && this.clientSigned;
    }




}
