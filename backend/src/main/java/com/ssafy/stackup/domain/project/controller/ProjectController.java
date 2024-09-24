package com.ssafy.stackup.domain.project.controller;

import com.ssafy.stackup.common.exception.CustomException;
import com.ssafy.stackup.common.response.ApiResponse;
import com.ssafy.stackup.common.response.ErrorCode;
import com.ssafy.stackup.domain.project.dto.response.ProjectInfoResponseDto;
import com.ssafy.stackup.domain.project.dto.request.ProjectStartRequestDto;
import com.ssafy.stackup.domain.project.dto.request.SignRequest;
import com.ssafy.stackup.domain.project.dto.response.ProjectSignResponseDto;
import com.ssafy.stackup.domain.project.entity.Project;
import com.ssafy.stackup.domain.project.entity.ProjectStatus;
import com.ssafy.stackup.domain.project.repository.ProjectRepository;
import com.ssafy.stackup.domain.project.service.ProjectService;
import com.ssafy.stackup.domain.project.service.SignatureService;
import com.ssafy.stackup.domain.user.entity.*;
import com.ssafy.stackup.domain.user.repository.FreelancerProjectRepository;
import com.ssafy.stackup.domain.user.service.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/project")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final SignatureService signatureService;
    private final UserServiceImpl userService;
    private final ProjectRepository projectRepository;
    //등록
    @PostMapping("/previous-project")
    public ResponseEntity<ApiResponse<String>> registerPreviousProject(            @RequestParam(value = "certificateFile") MultipartFile certificateFile,
                                                                                   @RequestParam(value = "title") String title,
                                                                                   @RequestParam(value = "period") Long period) {

        projectService.registerPreviousProject(certificateFile,title,period);
        return  ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("프로젝트 등록 성공"));
    }


    @GetMapping("/info")
    public ResponseEntity<ApiResponse<List<ProjectInfoResponseDto>>> getAllProjects(@AuthUser User user) {
        List<ProjectInfoResponseDto> projects  = projectService.getAllProjects(user);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success(projects));
    }


    @GetMapping("/info/{projectId}")
    public ResponseEntity<ApiResponse<ProjectInfoResponseDto>> getProject(@PathVariable Long projectId) {
       ProjectInfoResponseDto projectInfoResponseDto  = projectService.getProjectInfo(projectId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success(projectInfoResponseDto));
    }


    /**
     * 프로젝트 등록
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-22
     * @ 설명     : 프로젝트 시작하기 누르면 등록
     * @return

     */
    @PostMapping("/start")
    public ResponseEntity<ApiResponse<ProjectInfoResponseDto>> startProject(@AuthUser User user,@RequestBody ProjectStartRequestDto projectStartRequestDto){
        ProjectInfoResponseDto project  = projectService.startProject(user, projectStartRequestDto);

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(project));
    }

    @PostMapping("/{projectId}/contract/sign")
    public ResponseEntity<ApiResponse<Boolean>> verifySignature(@PathVariable Long projectId, @RequestBody SignRequest signRequest, @AuthUser User user){
        Long userId = user.getId();
        Project project = projectRepository.findById(projectId).orElse(null);

        try{
            String loggedInUserAddress = userService.getUserAddress(userId);

            // 요청에서 서명한 지갑 주소와 로그인한 사용자의 지갑 주소 비교
            if (!user.getUserAddress().equalsIgnoreCase(loggedInUserAddress)) {
                return ResponseEntity.badRequest().body(ApiResponse.error(HttpStatus.BAD_REQUEST,false,"지갑 주소가 일치하지 않습니다."));
            }
            // 서명 검증
            boolean isValid = signatureService.verifySignature(
                    signRequest.getMessage(),
                    signRequest.getSignature(),
                    user.getUserAddress()
            );
            if (isValid) {
                // 프로젝트 ID를 가져와서 해당 프로젝트의 서명 상태를 업데이트
                boolean isAllSigned = updateProjectSignatureStatus(projectId, user);

                //모두 서명이 완료 되었으면 true 보내주기
                if(isAllSigned) return ResponseEntity.ok(ApiResponse.success(true,"서명이 유효하고 모든 서명이 완료 되었습니다."));
                return ResponseEntity.ok(ApiResponse.success(false,"서명이 유효합니다."));
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.error(HttpStatus.BAD_REQUEST,false,"유효하지 않은 서명입니다."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,"Error verifying signature: " + e.getMessage()));

        }
    }

    private FreelancerProjectRepository freelancerProjectRepository;

    // 프로젝트 서명 상태 업데이트 메서드

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

            currentProject.updateStatus(ProjectStatus.PROGRESS); // 상태 변경
            return true;
        }
        return false;
    }




}
