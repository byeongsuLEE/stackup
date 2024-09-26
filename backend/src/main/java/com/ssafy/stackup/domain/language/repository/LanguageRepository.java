package com.ssafy.stackup.domain.language.repository;
import com.ssafy.stackup.domain.language.entity.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LanguageRepository extends JpaRepository<Language, Long> {

    List<Language> findAllByOrderByIdDesc();

//    @Query("SELECT l FROM Language l JOIN FETCH BoardLanguage bl ON l.id = bl.language.id WHERE bl.board.boardId = :boardId")
//    List<Language> findLanguagesByBoardId(@Param("boardId") Long boardId);

    Optional<Language> findByName(String name);
}
