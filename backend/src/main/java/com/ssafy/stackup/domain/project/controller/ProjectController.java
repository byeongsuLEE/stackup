package com.ssafy.stackup.domain.project.controller;

import com.ssafy.stackup.common.exception.CustomException;
import com.ssafy.stackup.common.response.ApiResponse;
import com.ssafy.stackup.common.response.ErrorCode;
import com.ssafy.stackup.common.util.UserUtil;
import com.ssafy.stackup.domain.project.dto.ProjectInfoResponseDto;
import com.ssafy.stackup.domain.project.dto.request.ProjectStartRequestDto;
import com.ssafy.stackup.domain.project.dto.request.SignRequest;
import com.ssafy.stackup.domain.project.entity.Project;
import com.ssafy.stackup.domain.project.repository.ProjectRepository;
import com.ssafy.stackup.domain.project.service.ProjectService;
import com.ssafy.stackup.domain.project.service.SignatureService;
import com.ssafy.stackup.domain.user.dto.response.FreelancerResponseDto;
import com.ssafy.stackup.domain.user.entity.*;
import com.ssafy.stackup.domain.user.repository.ClientRepository;
import com.ssafy.stackup.domain.user.repository.FreelancerProjectRepository;
import com.ssafy.stackup.domain.user.repository.FreelancerRepository;
import com.ssafy.stackup.domain.user.service.UserService;
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

    @Autowired
    private ProjectRepository projectRepository;
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

    @PostMapping("/sign/{projectId}")
    public ResponseEntity<String> verifySignature(@PathVariable Long projectId,@RequestBody SignRequest signRequest, @AuthUser User user){
        Long userId = user.getId();
        Project project = projectRepository.findById(projectId).orElse(null);

        try{
            String loggedInUserAddress = userService.getUserAddress(userId);

            // 요청에서 서명한 지갑 주소와 로그인한 사용자의 지갑 주소 비교
            if (!user.getUserAddress().equalsIgnoreCase(loggedInUserAddress)) {
                return ResponseEntity.badRequest().body("서명이 일치하지 않습니다.");
            }
            // 서명 검증
            boolean isValid = signatureService.verifySignature(
                    signRequest.getMessage(),
                    signRequest.getSignature(),
                    user.getUserAddress()
            );
            if (isValid) {
                // 프로젝트 ID를 가져와서 해당 프로젝트의 서명 상태를 업데이트
                updateProjectSignatureStatus(projectId, user);

                return ResponseEntity.ok("서명이 유효합니다.");
            } else {
                return ResponseEntity.badRequest().body("유효하지 않은 서명입니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error verifying signature: " + e.getMessage());
        }
    }

    private FreelancerProjectRepository freelancerProjectRepository;

    // 프로젝트 서명 상태 업데이트 메서드
    private void updateProjectSignatureStatus(Long projectId, User user) {
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
    }

}
