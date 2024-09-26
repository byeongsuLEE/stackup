package com.ssafy.stackup.domain.evaluation.service;

import com.ssafy.stackup.domain.evaluation.dto.EvaluationRequestDto;
import com.ssafy.stackup.domain.user.entity.User;

/**
 * 작성자   : user
 * 작성날짜 : 2024-09-23
 * 설명    :
 */
public interface EvaluationService {

    void addEvaluation(EvaluationRequestDto evaluationRequestDto, User evaluator);
}
