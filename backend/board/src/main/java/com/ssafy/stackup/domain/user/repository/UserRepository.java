package com.ssafy.stackup.domain.user.repository;

import com.ssafy.stackup.domain.user.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {



    Optional<User> findByEmail(String email);
    Optional<User> findByUserAddress(String userAddress);

    // 연관된 projects와 roles을 즉시 로드
    @EntityGraph(attributePaths = {"evaluations", "roles"})
    Optional<User> findById(Long id);
}
