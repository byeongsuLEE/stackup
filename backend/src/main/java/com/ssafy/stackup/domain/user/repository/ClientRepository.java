package com.ssafy.stackup.domain.user.repository;

import com.ssafy.stackup.domain.user.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByEmail(String email);
}
