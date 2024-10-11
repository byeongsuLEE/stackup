package com.ssafy.stackup.domain.board.dto;

import com.ssafy.stackup.domain.board.entity.BoardApplicant;
import com.ssafy.stackup.domain.user.entity.Freelancer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class BoardApplicantRequest {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Double totalScore;
    private Integer reportedCount;
    private Boolean isPassed;
    private String portfolioUrl;
    private Long freelancerProjectId;
    private boolean freelancerSigned;
    private boolean clientSigned;

    private boolean isMiddleClientEvaluated;//  클라리언트가 중간평가를 했는지?
    private boolean isMiddleFreelancerEvaluated;
    private boolean isFinalClientEvaluated;//
    private boolean isFinalFreelancerEvaluated;



    public BoardApplicantRequest(BoardApplicant boardApplicant) {
        Freelancer freelancer = boardApplicant.getFreelancer();
        this.id = freelancer.getId();
        this.name = freelancer.getName();
        this.email = freelancer.getEmail();
        this.phone = freelancer.getPhone();
        this.totalScore = freelancer.getTotalScore();
        this.reportedCount = freelancer.getReportedCount();
//        boardApplicant.get
        this.isPassed = boardApplicant.getIsPassed(); // BoardApplicant에서 isPassed 가져오기
        this.portfolioUrl = freelancer.getPortfolioUrl();
        this.freelancerProjectId = boardApplicant.getFreelancerProjectId();
        this.isMiddleClientEvaluated = boardApplicant.isMiddleClientEvaluated();
        this.isMiddleFreelancerEvaluated= boardApplicant.isMiddleFreelancerEvaluated();
        this.isFinalClientEvaluated = boardApplicant.isFinalClientEvaluated();
        this.isFinalFreelancerEvaluated = boardApplicant.isFinalFreelancerEvaluated();

    }

    public  void updateFreelancerSigned(boolean freelancerSigned) {
        this.freelancerSigned = freelancerSigned;
    }

    public void updateClientSinged(boolean clientSigned) {
        this.clientSigned = clientSigned;
    }


}
