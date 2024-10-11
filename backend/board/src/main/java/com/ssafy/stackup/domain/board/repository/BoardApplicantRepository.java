package com.ssafy.stackup.domain.board.repository;

import com.ssafy.stackup.domain.board.entity.Board;
import com.ssafy.stackup.domain.board.entity.BoardApplicant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BoardApplicantRepository extends JpaRepository<BoardApplicant, Long> {
    List<BoardApplicant> findByBoard_BoardId(Long boardId);
    BoardApplicant findByFreelancer_IdAndBoard_BoardId(Long freelancerId, Long boardId);
    List<BoardApplicant> findByBoard_BoardIdAndIsPassedTrue(Long boardId);


    // user_id로 board 검색
    @Query("SELECT ba.board FROM BoardApplicant ba WHERE ba.freelancer.id = :userId")
    List<Board> findBoardsByUserId(@Param("userId") Long userId);
}
