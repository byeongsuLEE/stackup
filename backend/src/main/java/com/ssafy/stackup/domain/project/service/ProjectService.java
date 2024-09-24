package com.ssafy.stackup.domain.project.service;

import com.ssafy.stackup.domain.project.dto.response.ProjectInfoResponseDto;
import com.ssafy.stackup.domain.project.dto.request.ProjectStartRequestDto;
import com.ssafy.stackup.domain.user.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProjectService {
    void registerPreviousProject(MultipartFile certificateFile, String title, Long period);

    List<ProjectInfoResponseDto> getAllProjects(User user);

    ProjectInfoResponseDto startProject(User user, ProjectStartRequestDto freelancerIdList);

    ProjectInfoResponseDto getProjectInfo(Long projectId);
}
