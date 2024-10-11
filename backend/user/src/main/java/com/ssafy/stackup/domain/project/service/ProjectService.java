package com.ssafy.stackup.domain.project.service;

import com.ssafy.stackup.common.response.ApiResponse;
import com.ssafy.stackup.domain.project.dto.ContractInfoResponseDto;
import com.ssafy.stackup.domain.project.dto.request.ProjectContractInfoRequestDto;
import com.ssafy.stackup.domain.project.dto.request.SignRequest;
import com.ssafy.stackup.domain.project.dto.response.ProjectInfoResponseDto;
import com.ssafy.stackup.domain.project.dto.request.ProjectStartRequestDto;
import com.ssafy.stackup.domain.project.dto.response.ProjectStepCheckResponseDto;
import com.ssafy.stackup.domain.user.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProjectService {
    void registerPreviousProject(MultipartFile certificateFile, String title, String startDate, String endDate, Long userId);

    List<ProjectInfoResponseDto> getAllProjects(User user, String projectType);

    ProjectInfoResponseDto startProject(User user, ProjectStartRequestDto freelancerIdList);

    ProjectInfoResponseDto getProjectInfo(Long projectId);

    ResponseEntity<ApiResponse<String>> saveSignature(Long projectId, SignRequest signRequest, User user);

    ProjectStepCheckResponseDto projectStepCheck(Long projectId, User user);

    void contractSubmit(ProjectContractInfoRequestDto projectContractInfoRequestDto);

    ContractInfoResponseDto getContractInfo(Long freelancerProjectId, Long id);
}
