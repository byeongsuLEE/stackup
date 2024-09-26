package com.ssafy.stackup.domain.project.repository;

import com.ssafy.stackup.domain.project.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}
