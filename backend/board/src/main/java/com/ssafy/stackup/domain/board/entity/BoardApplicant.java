package com.ssafy.stackup.domain.board.entity;

import com.ssafy.stackup.domain.user.entity.Freelancer;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "applicant")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardApplicant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "freelancer_id", nullable = false)
    private Freelancer freelancer;

    @ManyToOne
    @JoinColumn(name = "board_id")
    private Board board;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date appliedDate;

    @PrePersist
    protected void onApply() {
        appliedDate = new Date(); // 신청 시점 기록
    }

    //프로젝트 시작 후 채택한 지원자만 프로젝트 id를 가지고있 음
    private Long freelancerProjectId;


    @Column(nullable = false)
    private boolean isPassed;


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



    public boolean getIsPassed() {
        return isPassed;
    }

    public void updateIsPassed(){
        this.isPassed = true;
    }


    public void updateFreelancerProjectId(Long freelancerProjectId) {
        this.freelancerProjectId= freelancerProjectId;
    }
}
