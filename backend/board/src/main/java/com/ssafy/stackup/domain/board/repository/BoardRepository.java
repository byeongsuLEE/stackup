package com.ssafy.stackup.domain.board.repository;

import com.ssafy.stackup.domain.board.dto.BoardSummaryDTO;
import com.ssafy.stackup.domain.board.entity.Board;
import com.ssafy.stackup.domain.framework.entity.Framework;
import com.ssafy.stackup.domain.language.entity.Language;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

//@Repository("BoardJpaRepo")
public interface BoardRepository extends JpaRepository<Board, Long>{
    @Query("SELECT b FROM Board b WHERE " +
            "(:worktype IS NULL OR b.worktype = :worktype) " +
            "AND (" +
            "(:deposit = '1' AND b.deposit < 500) " +
            "OR (:deposit = '2' AND b.deposit >= 500 AND b.deposit < 1000) " +
            "OR (:deposit = '3' AND b.deposit >= 1000 AND b.deposit < 5000) " +
            "OR (:deposit = '4' AND b.deposit >= 5000 AND b.deposit < 10000) " +
            "OR (:deposit = '5' AND b.deposit >= 10000) " +
            "OR (:deposit IS NULL)" +  // Allow for no filter if deposit is null
            ") " +
            "AND (:classification IS NULL OR b.classification = :classification)")
    List<Board> findByConditions(
            @Param("worktype") Boolean worktype,
            @Param("deposit") String deposit,
            @Param("classification") String classification);

    @EntityGraph(attributePaths = {"boardFrameworks", "boardLanguages", "boardApplicants"})
    Optional<Board> findById(Long id);

    List<Framework> findFrameworksByBoardId(Long boardId);
    List<Language> findLanguagesByBoardId(Long boardId);

    @Query("SELECT new com.ssafy.stackup.domain.board.dto.BoardSummaryDTO(b.boardId, b.period, b.deposit, b.level) " +
            "FROM Board b WHERE b.boardId = :id")
    BoardSummaryDTO findBoardFieldsById(@Param("id") Long id);


    List<Board> findByClient_Id(Long id);

    @Query("SELECT b FROM Board b WHERE b.deadline > :today")
    Page<Board> findAllByDeadlineAfter(LocalDate today, Pageable pageable);
}
