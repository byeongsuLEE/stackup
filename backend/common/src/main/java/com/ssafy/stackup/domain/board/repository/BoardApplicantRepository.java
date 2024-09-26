package com.ssafy.stackup.domain.board.repository;

import com.ssafy.stackup.domain.board.entity.BoardApplicant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardApplicantRepository extends JpaRepository<BoardApplicant, Long> {
    List<BoardApplicant> findByBoard_BoardId(Long boardId);
    BoardApplicant findByFreelancer_IdAndBoard_BoardId(Long freelancerId, Long boardId);
}
