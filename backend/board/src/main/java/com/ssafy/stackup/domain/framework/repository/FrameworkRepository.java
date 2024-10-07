package com.ssafy.stackup.domain.framework.repository;

import com.ssafy.stackup.domain.framework.entity.Framework;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FrameworkRepository extends JpaRepository<Framework, Long> {

    List<Framework> findAllByOrderByIdDesc();

//    @Query("SELECT f FROM Framework f JOIN FETCH BoardFramework bf ON f.id = bf.framework.id WHERE bf.board.boardId = :boardId")
//    List<Framework> findFrameworksByBoardId(@Param("boardId") Long boardId);
//List<Framework> findByBoardFrameworks_Board_BoardId(Long boardId);

    Optional<Framework> findByName(String name);

}
