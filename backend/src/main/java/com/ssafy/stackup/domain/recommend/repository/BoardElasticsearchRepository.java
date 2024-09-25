package com.ssafy.stackup.domain.recommend.repository;

import com.ssafy.stackup.domain.board.entity.Board;
import com.ssafy.stackup.domain.board.entity.Level;
import com.ssafy.stackup.domain.recommend.entity.Recommend;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository("boardElasticsearchRepo")
//@Component
public interface BoardElasticsearchRepository extends ElasticsearchRepository<Recommend, String> {
    List<Recommend> findByClassification(String classification);


    //언어에 따른 검색
//    @Query("{\"nested\": {\"path\": \"languages.language\", \"query\": {\"terms\": {\"languages.language.name\": ?0}}}}")
//    List<Recommend> findByLanguages_Language_NameIn(Set<String> languages);
    List<Recommend> findByLanguages(String language);

    //프레임워크에 따른 검색
    List<Recommend> findByFrameworks(String framework);

    // 검색 조건으로 경력 연수 (careerYear)을 기준으로 프리랜서에게 적합한 board 목록을 찾는 메서드
    List<Recommend> findByLevel(Level level);

    // 경력 연수로 보드 추천 (경력 범위에 맞는 게시물 추천)
//    List<Board> findByCareerYearBetween(Integer minCareerYear, Integer maxCareerYear);
//    // 프레임워크에 따른 검색
//    List<Board> findByBoardFrameworks_Framework_NameIn(Set<String> frameworks);
//
//    // 경력 연수와 레벨에 따른 검색
//    List<Board> findByLevelAndCareerYearBetween(String level, Integer minCareerYear, Integer maxCareerYear);
}
