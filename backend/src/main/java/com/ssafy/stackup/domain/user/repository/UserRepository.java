package com.ssafy.stackup.domain.user.repository;

import com.ssafy.stackup.domain.user.entity.Client;
import com.ssafy.stackup.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByEmail(String email);
    User findByUserAddress(String userAddress);
}
