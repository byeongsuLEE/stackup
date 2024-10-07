package com.ssafy.stackup.domain.project.repository;

import com.ssafy.stackup.domain.project.entity.Project;
import com.ssafy.stackup.domain.project.entity.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByStatus(ProjectStatus status);
}
