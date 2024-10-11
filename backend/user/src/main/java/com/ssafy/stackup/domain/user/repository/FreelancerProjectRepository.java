package com.ssafy.stackup.domain.user.repository;

import com.ssafy.stackup.domain.project.entity.Project;
import com.ssafy.stackup.domain.user.entity.Freelancer;
import com.ssafy.stackup.domain.user.entity.FreelancerProject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * 작성자   : user
 * 작성날짜 : 2024-09-22
 * 설명    :
 */
public interface FreelancerProjectRepository extends JpaRepository<FreelancerProject, Long> {

    List<FreelancerProject> findAllByProjectId(Long projectId);


    // Project와 Freelancer로 FreelancerProject 찾기
    Optional<FreelancerProject> findByProjectAndFreelancer(Project project, Freelancer freelancer);

}
