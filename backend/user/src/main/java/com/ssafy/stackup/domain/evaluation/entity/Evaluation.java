package com.ssafy.stackup.domain.evaluation.entity;

import com.ssafy.stackup.domain.project.entity.Project;
import com.ssafy.stackup.domain.user.entity.EvaluationType;
import com.ssafy.stackup.domain.user.entity.User;
import com.ssafy.stackup.domain.user.entity.UserType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 작성자   : 이병수
 * 작성날짜 : 2024-09-23
 * 설명    : 상호 평가 엔티티
 */

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "evaluation_id", unique = true, nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;  //평가 받는 사람

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluator_id")
    private User evaluator; //평가하는 사람

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;


    // 응답시간 점수
    @Column(name = "response_time_score", nullable = true)
    private Double responseTimeScore;

    // 요청사항 변경 빈도
    @Column(name = "req_change_freq_score", nullable = true)
    private Double reqChangeFreqScore;

    // 요청사항 명확성
    @Column(name = "req_clarity_score", nullable = true)
    private Double reqClarityScore;

    // 진행 점수
    @Column(name = "progress_score", nullable = true)
    private Double progressScore;

    // 경력 도움 점수
    @Column(name = "career_benefit_score", nullable = true)
    private Double careerBenefitScore;

    // 자유도 점수
    @Column(name = "authority_freedom_score", nullable = true)
    private Double authorityFreedomScore;

    // 계약서 타당성 점수
    @Column(name = "legal_terms_score", nullable = true)
    private Double legalTermsScore;

    // 한줄 평
    @Column(name = "short_review", nullable = true)
    private String shortReview;

    // 평가 타입 (중간 평가, 최종 평가)
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = true)
    private EvaluationType type;

    // 사용자 타입 (프리랜서, 클라이언트)
    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = true)
    private UserType userType;


}
