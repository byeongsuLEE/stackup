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
    }
}
