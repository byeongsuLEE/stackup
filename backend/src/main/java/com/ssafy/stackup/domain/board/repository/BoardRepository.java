package com.ssafy.stackup.domain.board.repository;

import com.ssafy.stackup.domain.board.entity.Board;
import com.ssafy.stackup.domain.framework.entity.Framework;
import com.ssafy.stackup.domain.language.entity.Language;
import com.ssafy.stackup.domain.user.entity.Freelancer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository("BoardJpaRepo")
public interface BoardRepository extends JpaRepository<Board, Long>{
//    @Query("SELECT b FROM Board b WHERE (:worktype IS NULL OR b.worktype = :worktype) " +
//            "AND (:deposit IS NULL OR b.deposit = :deposit) " +
//            "AND (:classification IS NULL OR b.classification = :classification)")
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

    @Query("select b from Board b " +
            "left join fetch b.boardLanguages " +
            "left join fetch b.boardFrameworks " +
            "where b.boardId = :id")
    Optional<Board> findById(@Param("id") Long id);

    List<Framework> findFrameworksByBoardId(Long boardId);
    List<Language> findLanguagesByBoardId(Long boardId);

//    List<Board> findByBoardLanguagesInAndBoardFrameworksInAndLevel(List<String> languages, List<String> frameworks, String level);
}
