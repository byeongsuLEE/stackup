package com.ssafy.stackup.domain.project.service;


import com.ssafy.stackup.common.exception.CustomException;
import com.ssafy.stackup.common.response.ErrorCode;
import com.ssafy.stackup.common.s3.service.S3ImageUpLoadService;
import com.ssafy.stackup.common.util.UserUtil;
import com.ssafy.stackup.domain.board.entity.Board;
import com.ssafy.stackup.domain.board.entity.BoardApplicant;
import com.ssafy.stackup.domain.board.entity.BoardFramework;
import com.ssafy.stackup.domain.board.entity.BoardLanguage;
import com.ssafy.stackup.domain.board.repository.BoardApplicantRepository;
import com.ssafy.stackup.domain.board.repository.BoardRepository;
import com.ssafy.stackup.domain.project.dto.response.ProjectInfoResponseDto;
import com.ssafy.stackup.domain.project.dto.request.ProjectStartRequestDto;
import com.ssafy.stackup.domain.project.entity.Project;
import com.ssafy.stackup.domain.project.entity.ProjectStatus;
import com.ssafy.stackup.domain.project.entity.ProjectStep;
import com.ssafy.stackup.domain.project.repository.ProjectRepository;
import com.ssafy.stackup.domain.user.entity.Freelancer;
import com.ssafy.stackup.domain.user.entity.User;
import com.ssafy.stackup.domain.user.entity.FreelancerProject;
import com.ssafy.stackup.domain.user.repository.FreelancerProjectRepository;
import com.ssafy.stackup.domain.user.repository.FreelancerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;


@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final S3ImageUpLoadService s3ImageUpLoadService;
    private final FreelancerRepository freelancerRepository;
    private final BoardApplicantRepository boardApplicantRepository;
    private final BoardRepository boardRepository;
    private final FreelancerProjectRepository freelancerProjectRepository;

    @Override
    public void registerPreviousProject(MultipartFile certificateFile, String title, Long period) {


        try {
            String certificateUrl = s3ImageUpLoadService.uploadImage(certificateFile);
            Project project = Project.builder()
                    .title(title)
                    .period(title)
                    .certificateUrl(certificateUrl)
                    .build();

            projectRepository.save(project);

        }
        catch (IOException e) {
            throw new CustomException(ErrorCode.IOEXCEPTION);
        }

    }

    /**
     *
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-22
     * @ 설명     :프로젝트 모집글에서 진행하기 누를 시 프로젝트 등록하기
     * @return
     */
    @Override
    public ProjectInfoResponseDto startProject(User user, ProjectStartRequestDto request) {

        Board board = boardRepository.findById(request.getBoardId())
                .orElseThrow(()-> new CustomException(ErrorCode.BOARD_NOT_FOUND));

        //프로젝트 등록
        Project project = Project.builder()
                .client(board.getClient())
                .step(ProjectStep.PLANNING)
                .board(board)
                .title(board.getTitle())
                .period(board.getPeriod())
                .status(ProjectStatus.PENDING)
                .build();

        project= projectRepository.save(project);


        // 지원자의 상태를 합격으로 변경
        for (Long freelancerId : request.getFreelancerIdList()) {
            BoardApplicant applicant = boardApplicantRepository.findByFreelancer_IdAndBoard_BoardId(freelancerId, request.getBoardId());
            applicant.updateIsPassed();
            boardApplicantRepository.save(applicant);

            FreelancerProject freelancerProject = FreelancerProject.builder()
                    .freelancerSigned(false)
                    .project(project)
                    .freelancer(applicant.getFreelancer())
                    .build();


            freelancerProjectRepository.save(freelancerProject);
        }

        ProjectInfoResponseDto response = ProjectInfoResponseDto.builder()
                .projectId(project.getId())
                .title(board.getTitle())
                .period(board.getPeriod())
                .classification(board.getClassification())
                .status(project.getStatus())
                .build();


        return response;
    }

    @Override
    public ProjectInfoResponseDto getProjectInfo(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(()-> new CustomException(ErrorCode.PROJECT_NOT_FOUND));

        Board board = project.getBoard();
        List<BoardFramework> boardFrameworks = board.getBoardFrameworks();
        List<BoardLanguage> boardLanguages = board.getBoardLanguages();

        List<String> boardFrameworkList = UserUtil.getBoardFrameworks(boardFrameworks);
        List<String> boardLanguageList = UserUtil.getBoardLanguages(boardLanguages);


        ProjectInfoResponseDto projectInfoResponseDto = ProjectInfoResponseDto.builder()
                .projectId(project.getId())
                .title(project.getTitle())
                .status(project.getStatus())
                .step(project.getStep())
                .classification(board.getClassification())
                .languages(boardLanguageList)
                .frameworks(boardFrameworkList)
                .level(board.getLevel())
                .period(board.getPeriod())
                .deadline(board.getDeadline())
                .deposit(board.getDeposit())
                .recruits(board.getRecruits())
                .startDate(board.getStartDate())
                .isCharged(board.getIsCharged())
                .worktype(board.getWorktype())
                .applicants(board.getApplicants())
                .upload(board.getUpload())
                .build();

        return projectInfoResponseDto;
    }

    /**
     *
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-21
     * @ 설명     : 나의 페이지에서 사용할 프로젝트들 가져오기
     * @param user
     * @return
     */
    @Override
    public List<ProjectInfoResponseDto> getAllProjects(User user) {

        Freelancer freelancer = freelancerRepository.findById(user.getId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Set<FreelancerProject> freelancerProjects = freelancer.getFreelancerProjects();
        List<Project> projects = UserUtil.getProjects(freelancerProjects);

        List<ProjectInfoResponseDto> projectInfoResponseDtos = new ArrayList<>();

        for(Project project : projects) {
            ProjectInfoResponseDto projectInfoResponseDto= ProjectInfoResponseDto.builder()
                    .projectId(project.getId())
                    .status(project.getStatus())
                    .title(project.getTitle())
                    .startDate(project.getBoard().getStartDate())
                    .period(project.getBoard().getPeriod())
                    .classification(project.getBoard().getClassification())
                    .build();

            projectInfoResponseDtos.add(projectInfoResponseDto);
            //sdfdsfsdfsfdsfdsdsasdadsadsaddsafdsa
        }
        return projectInfoResponseDtos;
    }
}
