package com.ssafy.stackup.domain.evaluation.service;

import com.ssafy.stackup.common.exception.CustomException;
import com.ssafy.stackup.common.response.ErrorCode;
import com.ssafy.stackup.domain.board.entity.BoardApplicant;
import com.ssafy.stackup.domain.board.repository.BoardApplicantRepository;
import com.ssafy.stackup.domain.evaluation.dto.EvaluationRequestDto;
import com.ssafy.stackup.domain.evaluation.entity.Evaluation;
import com.ssafy.stackup.domain.evaluation.repository.EvaluationRepository;
import com.ssafy.stackup.domain.project.entity.Project;
import com.ssafy.stackup.domain.project.repository.ProjectRepository;
import com.ssafy.stackup.domain.user.entity.EvaluationType;
import com.ssafy.stackup.domain.user.entity.Freelancer;
import com.ssafy.stackup.domain.user.entity.FreelancerProject;
import com.ssafy.stackup.domain.user.entity.User;
import com.ssafy.stackup.domain.user.repository.FreelancerProjectRepository;
import com.ssafy.stackup.domain.user.repository.FreelancerRepository;
import com.ssafy.stackup.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * 작성자   : user
 * 작성날짜 : 2024-09-23
 * 설명    :
 */

@Service
@RequiredArgsConstructor
public class EvaluationServiceImpl implements EvaluationService{

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final EvaluationRepository evaluationRepository;
    private final FreelancerRepository freelancerRepository;
    private final FreelancerProjectRepository freelancerProjectRepository;
    private final BoardApplicantRepository boardApplicantRepository;

    /**
     * 평가 하기
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-24
     * @ 설명     :
     * @param evaluationRequestDto
     * @param evaluator 평가하는사람
     */
    @Override
    public void addEvaluation(EvaluationRequestDto evaluationRequestDto, User evaluator) {

        //평가받는사람
        User user = userRepository.findById(evaluationRequestDto.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Project project= projectRepository.findById(evaluationRequestDto.getProjectId())
                .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));


        Freelancer freelancer = null;
        //평가하는 사람 입장
        if(evaluator.isClient()){
            freelancer = freelancerRepository.findById(evaluationRequestDto.getUserId())
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        }
        else{
            freelancer = freelancerRepository.findById(evaluator.getId())
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        }

        FreelancerProject freelancerProject = freelancerProjectRepository.findByProjectAndFreelancer(project,freelancer)
                .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));


        BoardApplicant boardApplicant = boardApplicantRepository.findByFreelancer_IdAndBoard_BoardId(freelancer.getId(),project.getBoard().getBoardId());

        if(evaluator.isClient()){

            if(evaluationRequestDto.getType() == EvaluationType.MIDDLE){
                freelancerProject.updateMiddleClientEvaluated();
                boardApplicant.updateMiddleClientEvaluated();
            }else{
                freelancerProject.updateFinalClientEvaluated();
                boardApplicant.updateFinalClientEvaluated();
            }
        }
        else{
            if(evaluationRequestDto.getType() == EvaluationType.MIDDLE){
                freelancerProject.updateMiddleFreelancerEvaluated();
                boardApplicant.updateMiddleFreelancerEvaluated();

            }else{
                freelancerProject.updateFinalFreelancerEvaluated();
                boardApplicant.updateFinalFreelancerEvaluated();
            }
        }



        Evaluation evaluation = Evaluation.builder()
                .evaluator(evaluator)
                .user(user)
                .type(evaluationRequestDto.getType())
                .authorityFreedomScore(evaluationRequestDto.getAuthorityFreedomScore())
                .project(project)
                .careerBenefitScore(evaluationRequestDto.getCareerBenefitScore())
                .legalTermsScore(evaluationRequestDto.getLegalTermsScore())
                .progressScore(evaluationRequestDto.getProgressScore())
                .reqChangeFreqScore(evaluationRequestDto.getReqChangeFreqScore())
                .reqClarityScore(evaluationRequestDto.getReqClarityScore())
                .responseTimeScore(evaluationRequestDto.getResponseTimeScore())
                .shortReview(evaluationRequestDto.getShortReview())
                .build();


        evaluationRepository.save(evaluation);
        freelancerProjectRepository.save(freelancerProject);
        boardApplicantRepository.save(boardApplicant);

        //총점
        Double newScore = calculateTotalScoreWithWeight(evaluationRequestDto);

        Double totalScore = (user.getTotalScore()*user.getEvaluatedCount() + newScore) / (user.getEvaluatedCount()+1);

        user.updateTotalScore(totalScore);
        userRepository.save(user);

    }

    /**
     * 점수 합산
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-24
     * @ 설명     : 가중치를 이용한 점수 합산
     * @param dto
     * @return

     */
    public Double calculateTotalScoreWithWeight(EvaluationRequestDto dto) {
        Double totalScore = 0.0;

        // 중간 평가일 경우 (3개 항목만 사용)
        if (dto.getType() == EvaluationType.MIDDLE) {
            totalScore = (dto.getResponseTimeScore() * 0.4)   // 응답 시간 40%
                    + (dto.getReqChangeFreqScore() * 0.3)    // 요구사항 변경 빈도 30%
                    + (dto.getReqClarityScore() * 0.3);      // 요구사항 명확성 30%
        }

        // 최종 평가일 경우 (모든 항목 사용)
        else if (dto.getType() == EvaluationType.FINAL) {
            totalScore = (dto.getResponseTimeScore() * 0.15)   // 응답 시간 15%
                    + (dto.getReqChangeFreqScore() * 0.1)      // 요구사항 변경 빈도 10%
                    + (dto.getReqClarityScore() * 0.15)        // 요구사항 명확성 15%
                    + (dto.getProgressScore() * 0.2)           // 진행 점수 20%
                    + (dto.getCareerBenefitScore() * 0.2)      // 경력 도움 20%
                    + (dto.getAuthorityFreedomScore() * 0.1)   // 자유도 10%
                    + (dto.getLegalTermsScore() * 0.1);        // 계약서 타당성 10%
        }

        return totalScore;
    }


}
