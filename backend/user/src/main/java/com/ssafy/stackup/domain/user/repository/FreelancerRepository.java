package com.ssafy.stackup.domain.user.repository;

import com.ssafy.stackup.domain.user.entity.Freelancer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

/**
 * 작성자   : user
 * 작성날짜 : 2024-09-08
 * 설명    :
 */
public interface FreelancerRepository extends JpaRepository<Freelancer, Long> {
    Optional<Freelancer> findByEmail(String email);


    @Query("select f from Freelancer f " +
            "left join fetch f.languages " +
            "left join fetch f.frameworks " +
            "where f.id = :id")
    Optional<Freelancer> findById(@Param("id") Long id);



    Optional<Freelancer> findByGithubId(String githubId);

//    List<Freelancer> findByLanguagesInAndFrameworksInAndCareerYear(String languages, String frameworks, Integer careerYear);
}
