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

    @Column(nullable = false)
    private boolean isPassed;

    public Boolean getIsPassed() {
        return isPassed;
    }

    public void updateIsPassed(){
        this.isPassed = true;
    }

}
