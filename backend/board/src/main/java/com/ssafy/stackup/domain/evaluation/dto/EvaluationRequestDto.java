package com.ssafy.stackup.domain.evaluation.dto;

import com.ssafy.stackup.domain.user.entity.EvaluationType;
import com.ssafy.stackup.domain.user.entity.UserType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 작성자   : user
 * 작성날짜 : 2024-09-23
 * 설명    :
 */

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class EvaluationRequestDto {


    //평가받는 사람 id
    private Long userId;
    private Long projectId;
    private Double responseTimeScore;
    private Double reqChangeFreqScore;
    private Double reqClarityScore;
    private Double progressScore;

    // 경력 도움 점수
    private Double careerBenefitScore;
    // 자유도 점수
    private Double authorityFreedomScore;

    // 계약서 타당성 점수
    private Double legalTermsScore;

    // 한줄 평
    private String shortReview;

    // 평가 타입 (중간 평가, 최종 평가)
    private EvaluationType type;

    // 사용자 타입 (프리랜서, 클라이언트)
    private UserType userType;

}
