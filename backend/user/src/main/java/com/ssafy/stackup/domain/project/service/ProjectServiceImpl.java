package com.ssafy.stackup.domain.project.service;


import com.ssafy.stackup.common.exception.CustomException;
import com.ssafy.stackup.common.response.ApiResponse;
import com.ssafy.stackup.common.response.ErrorCode;
import com.ssafy.stackup.common.s3.service.S3ImageUpLoadService;
import com.ssafy.stackup.common.util.UserUtil;
import com.ssafy.stackup.domain.board.entity.Board;
import com.ssafy.stackup.domain.board.entity.BoardApplicant;
import com.ssafy.stackup.domain.board.entity.BoardFramework;
import com.ssafy.stackup.domain.board.entity.BoardLanguage;
import com.ssafy.stackup.domain.board.repository.BoardApplicantRepository;
import com.ssafy.stackup.domain.board.repository.BoardRepository;
import com.ssafy.stackup.domain.project.dto.ContractInfoResponseDto;
import com.ssafy.stackup.domain.project.dto.request.ProjectContractInfoRequestDto;
import com.ssafy.stackup.domain.project.dto.request.SignRequest;
import com.ssafy.stackup.domain.project.dto.response.ProjectInfoResponseDto;
import com.ssafy.stackup.domain.project.dto.request.ProjectStartRequestDto;
import com.ssafy.stackup.domain.project.dto.response.ProjectStepCheckResponseDto;
import com.ssafy.stackup.domain.project.entity.Project;
import com.ssafy.stackup.domain.project.entity.ProjectStatus;
import com.ssafy.stackup.domain.project.entity.ProjectStep;
import com.ssafy.stackup.domain.project.repository.ProjectRepository;
import com.ssafy.stackup.domain.user.dto.response.ClientResponseDto;
import com.ssafy.stackup.domain.user.entity.Client;
import com.ssafy.stackup.domain.user.entity.Freelancer;
import com.ssafy.stackup.domain.user.entity.User;
import com.ssafy.stackup.domain.user.entity.FreelancerProject;
import com.ssafy.stackup.domain.user.repository.ClientRepository;
import com.ssafy.stackup.domain.user.repository.FreelancerProjectRepository;
import com.ssafy.stackup.domain.user.repository.FreelancerRepository;
import com.ssafy.stackup.domain.user.service.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static com.ssafy.stackup.domain.project.entity.ProjectStatus.PROGRESS;


@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final S3ImageUpLoadService s3ImageUpLoadService;
    private final FreelancerRepository freelancerRepository;

    private final FreelancerProjectRepository freelancerProjectRepository;
    private final SignatureService signatureService;
    private final UserServiceImpl userService;

    private final BoardRepository boardRepository;
    private final BoardApplicantRepository boardApplicantRepository;
    private final ClientRepository clientRepository;

    @Override
    public void registerPreviousProject(MultipartFile certificateFile, String title, String startDate, String endDate, Long userId) {

        try {
            String certificateUrl = s3ImageUpLoadService.uploadImage(certificateFile);
            Project project = Project.builder()
                    .status(ProjectStatus.BEFORE)
                    .title(title)
                    .previousProjectStartDate(startDate)
                    .previousProjectEndDate(endDate)
                    .previousProjectEndRegistFreelancerId(userId)
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

        if (board.getProject() != null) {
            throw new CustomException(ErrorCode.PROJECT_ALREADY_EXISTS);
        }

        //프로젝트 등록
        Project project = Project.builder()
                .title(board.getTitle())
                .period(board.getPeriod())
                .client(board.getClient())
                .step(ProjectStep.PLANNING)
                .board(board)
                .status(ProjectStatus.PENDING)
                .build();


        project= projectRepository.save(project);

        // 지원자의 상태를 합격으로 변경
        for (Long freelancerId : request.getFreelancerIdList()) {
            BoardApplicant applicant = boardApplicantRepository.findByFreelancer_IdAndBoard_BoardId(freelancerId, request.getBoardId());


            FreelancerProject freelancerProject = FreelancerProject.builder()
                    .contractCreated(false)
                    .freelancerSigned(false)
                    .contractEndDate(board.getDeadline())
                    .contractStartDate(board.getStartDate())
                    .contractCompanyName(board.getClient().getBusinessName())
                    .project(project)
                    .freelancer(applicant.getFreelancer())
                    .build();


            FreelancerProject savedFreelancerProject = freelancerProjectRepository.save(freelancerProject);

            applicant.updateIsPassed();
            applicant.updateFreelancerProjectId(savedFreelancerProject.getId());
            boardApplicantRepository.save(applicant);
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
                .boardId(project.getBoard().getBoardId())
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
                .certificateUrl(project.getCertificateUrl())
                .freelancerStepConfirmed(project.isFreelancerStepConfirmed())
                .clientStepConfirmed(project.isClientStepConfirmed())
                .build();

        return projectInfoResponseDto;
    }


    /**
     * 서명 하기
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-10-07
     * @ 설명     : 서명값 저장 후 클라이언트
     * @param freelancerProjectId
     * @param signRequest
     * @param user
     * @return
     */
    @Override
    public ResponseEntity<ApiResponse<String>> saveSignature(Long freelancerProjectId, SignRequest signRequest, User user) {


        FreelancerProject freelancerProject = freelancerProjectRepository.findById(freelancerProjectId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));

        if( user.isClient()){
            freelancerProject.updateClientSigned();
            freelancerProject.updateClientSignatureValue(signRequest.getSignature());
        }else{
            freelancerProject.updateFreelancerSigned();
            freelancerProject.updateFreelancerSignatureValue(signRequest.getSignature());
        }

        freelancerProject = freelancerProjectRepository.save(freelancerProject);

        // 두명다 서명을 했으면 프로젝트의 상태를 변경해보도록합시다.

        Project project =freelancerProject.getProject();
        if(project.isAllFreelancersSigned()){
            project.updateStatus(PROGRESS);
            projectRepository.save(project);
            return  ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(" 모든 지원자 및 클라이언트가 서명 완료되었습니다."));
        }
        return  ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success("해당 유저 서명 완료, 모든 서명이 완료되지 않았습니다."));
    }



//        try{
//            String loggedInUserAddress = userService.getUserAddress(userId);
//
//            if(loggedInUserAddress ==null  || user.getUserAddress() == null){
//                throw new CustomException(ErrorCode.ADDRESS_NOT_REGISTER);
//            }
//
//
//            // 요청에서 서명한 지갑 주소와 로그인한 사용자의 지갑 주소 비교  ==> 나중에 추가해야함!!@
//            if (!user.getUserAddress().equalsIgnoreCase(loggedInUserAddress)) {
//                return ResponseEntity.badRequest().body(ApiResponse.error(HttpStatus.BAD_REQUEST,false,"지갑 주소가 일치하지 않습니다."));
//            }
//            // 서명 검증
//            boolean isValid = signatureService.verifySignature(
//                    signRequest.getMessage(),
//                    signRequest.getSignature(),
//                    user.getUserAddress()
//            );
//            if (isValid) {
//                // 프로젝트 ID를 가져와서 해당 프로젝트의 서명 상태를 업데이트
//                boolean isAllSigned = updateProjectSignatureStatus(projectId, user);
//
//                //모두 서명이 완료 되었으면 true 보내주기
//                if(isAllSigned) return ResponseEntity.ok(ApiResponse.success(true,"서명이 유효하고 모든 서명이 완료 되었습니다."));
//                return ResponseEntity.ok(ApiResponse.success(false,"서명이 유효합니다."));
//            } else {
//                return ResponseEntity.badRequest().body(ApiResponse.error(HttpStatus.BAD_REQUEST,false,"유효하지 않은 서명입니다."));
//            }
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,"Error verifying signature: " + e.getMessage()));
//
//        }


    /**
     * 프로젝트 단계 확인
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-24
     * @ 설명  :
     * 1. 프리랜서와 클라이언트가 프로젝트의 진행 사항을 확인
     * 2. 유저가 클라이언트 일 경우 프로젝트의 단계 다음으로 변경
     * 3. 프로젝트의 상태에 따라 상호평가를 진행
     * @param projectId
     * @param user
     */
    @Override
    public ProjectStepCheckResponseDto projectStepCheck(Long projectId, User user) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(()-> new CustomException(ErrorCode.PROJECT_NOT_FOUND));

        boolean isUserAllStepChecked = isUserAllStepChecked(projectId,user,project);
        return changeProjectStep(project.getStep(), isUserAllStepChecked, project);
    }

    /**
     * 계약서 작성
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-10-01
     * @ 설명     :
     * @param requestDto
     */
    @Override
    public void contractSubmit(ProjectContractInfoRequestDto requestDto) {
        FreelancerProject freelancerProject = freelancerProjectRepository.findById(requestDto.getFreelancerProjectId())
                .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));

        freelancerProject.updateContractCreated(true);
        freelancerProject.updateContractStartDate(requestDto.getContractStartDate());
        freelancerProject.updateContractEndDate(requestDto.getContractEndDate());
        freelancerProject.updateContractDownPayment(requestDto.getContractDownPayment());
        freelancerProject.updateContractFinalPayment(requestDto.getContractFinalPayment());
        freelancerProject.updateContractCompanyName(requestDto.getContractCompanyName());
        freelancerProject.updateContractAdditionalTerms(requestDto.getContractAdditionalTerms());
        freelancerProject.updateContractTotalAmount(requestDto.getContractTotalAmount());
        freelancerProject.updateContractConfidentialityClause(requestDto.getContractConfidentialityClause());

        freelancerProject.updatePeriod(requestDto.getPeriod());
        freelancerProject.updateCandidateName(requestDto.getCandidateName());
        freelancerProject.updateProjectName(requestDto.getProjectName());
        freelancerProjectRepository.save(freelancerProject);

    }



    @Transactional(readOnly = true)
    @Override
    public ContractInfoResponseDto getContractInfo(Long freelancerProjectId, Long userId) {

        FreelancerProject freelancerProject = freelancerProjectRepository.findById(freelancerProjectId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));

        ContractInfoResponseDto contractInfoResponseDto = ContractInfoResponseDto.builder()
                .contractAdditionalTerms(freelancerProject.getContractAdditionalTerms())
                .contractConfidentialityClause(freelancerProject.getContractConfidentialityClause())
                .contractCompanyName(freelancerProject.getContractCompanyName())
                .contractDownPayment(freelancerProject.getContractDownPayment())
                .contractEndDate(freelancerProject.getContractEndDate())
                .contractCreated(freelancerProject.isContractCreated())
                .freelancerProjectId(freelancerProjectId)
                .contractStartDate(freelancerProject.getContractStartDate())
                .contractFinalPayment(freelancerProject.getContractFinalPayment())
                .contractTotalAmount(freelancerProject.getContractTotalAmount())
                .projectName(freelancerProject.getProjectName())
                .candidateName(freelancerProject.getCandidateName())
                .period(freelancerProject.getPeriod())
                .build();


        return contractInfoResponseDto;
    }


    /**
     *
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-24
     * @ 설명     : 서명 여부 업데이트 및 프로젝트 상태 변경

     * @param projectId
     * @param user
     * @return true : 모두 서명완료 , false 모두 서명 x
     */
    private boolean updateProjectSignatureStatus(Long projectId, User user) {
        // 프로젝트 리포지토리 가져오기 (주입 필요)
        FreelancerProject project = freelancerProjectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("프로젝트를 찾을 수 없습니다."));
        if(user.getRoles().contains("ROLE_FREELANCER")) {
            project.setFreelancerSigned(true);

        }else{
            project.setClientSigned(true);
        }


        // 변경 사항 저장
        freelancerProjectRepository.save(project);

        // 모든 프로젝트_프리랜서 각각 두명의 모두 서명이 완료되면 project pending -> progress로 변경
        List<FreelancerProject> allFreelancerProjects = freelancerProjectRepository.findAllByProjectId(projectId);

        boolean isAllSigned = true;
        for( FreelancerProject freelancerProject : allFreelancerProjects) {
            if(!(freelancerProject.isFreelancerSigned() && freelancerProject.isClientSigned())) {
                isAllSigned = false;
                break;
            }

        }

        //모두 전자서명이 완료될 경우에 프로젝트 상태 업데이트
        if(isAllSigned){
            Project currentProject = projectRepository.findById(projectId)
                    .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));

            currentProject.updateStatus(PROGRESS); // 상태 변경
            return true;
        }
        return false;
    }

    /**
     * @param user
     * @param projectType
     * @return
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-21
     * @ 설명     : 나의 페이지에서 사용할 프로젝트들 가져오기
     */
    @Override
    public List<ProjectInfoResponseDto> getAllProjects(User user, String projectType) {


        if(user.isClient()){

            List<Board> clientBoardList = boardRepository.findByClient_Id(user.getId());
            List<ProjectInfoResponseDto> projectInfoResponseDtos = new ArrayList<>();

            List<Project> clientProjectList = clientBoardList.stream()
                            .map(Board::getProject)
                    .filter(Objects::nonNull)
                    .filter(project -> project.getStatus().equals(ProjectStatus.valueOf(projectType.toUpperCase())))
                    .collect(Collectors.toList());

            boolean isMyProjectConfirmed = false;

            for(Project project : clientProjectList) {
                if(!project.getStatus().name().equals(projectType)) continue;
                isMyProjectConfirmed = project.isClientStepConfirmed();
                ProjectInfoResponseDto projectInfoResponseDto= ProjectInfoResponseDto.builder()
                        .isMyProjectStepConfirmed(isMyProjectConfirmed)
                        .clientStepConfirmed(isMyProjectConfirmed)
                        .freelancerStepConfirmed(project.isFreelancerStepConfirmed())
                        .projectId(project.getId())
                        .status(project.getStatus())
                        .step(project.getStep())
                        .title(project.getTitle())
                        .startDate(project.getBoard().getStartDate())
                        .period(project.getBoard().getPeriod())
                        .deadline(project.getBoard().getDeadline())
                        .upload(project.getBoard().getUpload())
                        .classification(project.getBoard().getClassification())
                        .boardId(project.getBoard().getBoardId())
                        .build();


                projectInfoResponseDto.updateClient(project);
                projectInfoResponseDtos.add(projectInfoResponseDto);

            }
            return projectInfoResponseDtos;
        }


        // 프리랜서일 경우
        Freelancer freelancer = freelancerRepository.findById(user.getId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));


        List<Project> projects = new ArrayList<>();
        List<ProjectInfoResponseDto> projectInfoResponseDtos = new ArrayList<>();
        if(projectType.equals("BEFORE")){
            ProjectStatus projectStatus = ProjectStatus.valueOf(projectType.toUpperCase());
            projects = projectRepository.findByStatus(projectStatus);
            for(Project project : projects) {
                if(user.getId() == project.getPreviousProjectEndRegistFreelancerId()) continue;
                ProjectInfoResponseDto projectInfoResponseDto= ProjectInfoResponseDto.builder()
                        .status(ProjectStatus.BEFORE)
                        .title(project.getTitle())
                        .period(project.getPeriod())
                        .certificateUrl(project.getCertificateUrl())
                        .build();

                projectInfoResponseDtos.add(projectInfoResponseDto);

            }
            return projectInfoResponseDtos;
        }
        else{
            Set<FreelancerProject> freelancerProjects = freelancer.getFreelancerProjects();

            projects = UserUtil.getProjects(freelancerProjects);

            boolean isMyProjectConfirmed = false;
            for(Project project : projects) {
                if(!project.getStatus().name().equals(projectType)) continue;


                FreelancerProject freelancerProject = freelancerProjects.stream()
                        .filter(fp -> fp.getProject().getId().equals(project.getId())
                                && fp.getFreelancer().getId().equals(user.getId()))
                        .findFirst()
                        .orElse(null);

                isMyProjectConfirmed    = project.isFreelancerStepConfirmed();
                ProjectInfoResponseDto projectInfoResponseDto= ProjectInfoResponseDto.builder()
                        .isClientContractSigned(freelancerProject.isClientSigned())
                        .isFreelancerContractSigned(freelancerProject.isFreelancerSigned())
                        .isMyProjectStepConfirmed(isMyProjectConfirmed)
                        .clientStepConfirmed(project.isClientStepConfirmed())
                        .freelancerStepConfirmed(isMyProjectConfirmed)
                        .freelancerProjectId(freelancerProject.getId())
                        .projectId(project.getId())
                        .status(project.getStatus())
                        .step(project.getStep())
                        .title(project.getTitle())
                        .startDate(project.getBoard().getStartDate())
                        .period(project.getBoard().getPeriod())
                        .deadline(project.getBoard().getDeadline())
                        .upload(project.getBoard().getUpload())
                        .classification(project.getBoard().getClassification())
                        .build();
                projectInfoResponseDto.updateClient(project);
                projectInfoResponseDtos.add(projectInfoResponseDto);

            }
            return projectInfoResponseDtos;
        }

    }

    private ProjectStepCheckResponseDto changeProjectStep(ProjectStep currentStep, boolean isUserAllStepChecked, Project project) {
        if(isUserAllStepChecked){
            currentStep = project.nextProjectStep();
            project.resetUserStepConfirmed();
        }
        projectRepository.save(project);

        return ProjectStepCheckResponseDto.builder()
                .isChangeProjectStep(isUserAllStepChecked)
                .currentStep(currentStep)
                .build();
    }


    private boolean isUserAllStepChecked(Long projectId, User user, Project project) {
        if(user.isClient()){
            project.updateIsClientStepConfirmed();
        }else{
            project.updateIsFreelancerConfirmed();
        }
        return project.checkUsersConfirm();
    }


    public List<Long> getFreelancerProjectIds(Project project) {
        // freelancerProjectList가 null인지 확인하고, null이면 빈 리스트를 반환
        if (project.getFreelancerProjectList() == null) {
            return Collections.emptyList();
        }

        // freelancerProjectList에서 null 값도 처리하여 안전하게 ID 추출
        return project.getFreelancerProjectList().stream()
                .filter(Objects::nonNull) // null인 FreelancerProject 제외
                .map(FreelancerProject::getId) // FreelancerProject의 id 추출
                .collect(Collectors.toList()); // 리스트로 변환
    }
}
