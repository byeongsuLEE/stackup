package com.ssafy.stackup.domain.project.controller;

import com.ssafy.stackup.common.exception.CustomException;
import com.ssafy.stackup.common.response.ApiResponse;
import com.ssafy.stackup.common.response.ErrorCode;
import com.ssafy.stackup.domain.project.dto.response.ProjectInfoResponseDto;
import com.ssafy.stackup.domain.project.dto.request.ProjectStartRequestDto;
import com.ssafy.stackup.domain.project.dto.request.SignRequest;
import com.ssafy.stackup.domain.project.dto.response.ProjectSignResponseDto;
import com.ssafy.stackup.domain.project.dto.response.ProjectStepCheckResponseDto;
import com.ssafy.stackup.domain.project.entity.Project;
import com.ssafy.stackup.domain.project.entity.ProjectStatus;
import com.ssafy.stackup.domain.project.entity.ProjectStep;
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


    /**
     * 계약서 전자 서명하기
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-24
     * @ 설명     : 계약서 전자 서명하기
     * @param projectId
     * @param signRequest
     * @param user
     * @return
     */
    @PostMapping("/{projectId}/contract/sign")
    public ResponseEntity<ApiResponse<Boolean>> verifySignature(@PathVariable Long projectId, @RequestBody SignRequest signRequest, @AuthUser User user){

        return projectService.verifySignature(projectId,signRequest,user);
    }


    @PatchMapping("/{projectId}/step/check")
    public ResponseEntity<ApiResponse<ProjectStepCheckResponseDto>> projectStepCheck(@PathVariable Long projectId ,@AuthUser User user){
        ProjectStepCheckResponseDto projectStepCheckResponseDto = projectService.projectStepCheck(projectId, user);
        String message = "프로젝트 확인이 완료 되었습니다.";
        if(projectStepCheckResponseDto.isChangeProjectStep()){
            message = "프로젝트 확인 완료 및 프로젝트 단계가 변경되었습니다.";
        }
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(projectStepCheckResponseDto,message));
    }




}
