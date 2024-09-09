package com.ssafy.stackup.domain.board.repository;

import com.ssafy.stackup.domain.board.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long>{
    @Query("SELECT b FROM Board b WHERE (:worktype IS NULL OR b.worktype = :worktype) " +
            "AND (:deposit IS NULL OR b.deposit = :deposit) " +
            "AND (:classification IS NULL OR b.classification = :classification)")
    List<Board> findByConditions(
            @Param("worktype") Boolean worktype,
            @Param("deposit") String deposit,
            @Param("classification") String classification);
}
