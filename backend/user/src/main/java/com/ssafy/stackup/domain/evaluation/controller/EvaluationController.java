package com.ssafy.stackup.domain.evaluation.controller;

import com.ssafy.stackup.common.response.ApiResponse;
import com.ssafy.stackup.domain.evaluation.dto.EvaluationRequestDto;
import com.ssafy.stackup.domain.evaluation.service.EvaluationServiceImpl;
import com.ssafy.stackup.domain.user.entity.AuthUser;
import com.ssafy.stackup.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 작성자   : user
 * 작성날짜 : 2024-09-23
 * 설명    :
 */
@RestController
@RequestMapping("user/evaluation")
@RequiredArgsConstructor
public class EvaluationController {


    private final EvaluationServiceImpl evaluationService;


    /**
     *
     * 모든 평가는 여기서 이루어집니다.
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-23
     * @ 설명     :
     * @param evaluationRequestDto 평가 정보
     * @param evaluator 평가 하는 사람
     * @return

     */
    @PostMapping("/project-user")
    public ResponseEntity<ApiResponse<String>> addEvaluation(@RequestBody EvaluationRequestDto evaluationRequestDto, @AuthUser User evaluator) {
        evaluationService.addEvaluation(evaluationRequestDto,evaluator);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success("평가 완료 되었습니다."));
    }



}
