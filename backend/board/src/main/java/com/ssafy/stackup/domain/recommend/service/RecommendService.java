package com.ssafy.stackup.domain.recommend.service;

import com.ssafy.stackup.domain.board.entity.Board;
import com.ssafy.stackup.domain.board.entity.BoardFramework;
import com.ssafy.stackup.domain.board.entity.BoardLanguage;
import com.ssafy.stackup.domain.recommend.entity.Recommend;
import com.ssafy.stackup.domain.recommend.repository.BoardElasticsearchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecommendService {

    private final BoardElasticsearchRepository boardElasticsearchRepository;

    @Autowired
    public RecommendService(BoardElasticsearchRepository boardElasticsearchRepository) {
        this.boardElasticsearchRepository = boardElasticsearchRepository;
    }

    // Fuzzy matching을 사용하여 게시글 찾기
//    public List<Recommend> findBoardsByDescriptionFuzzy(String description) {
//        System.out.println(description);
//        if (description == null || description.trim().isEmpty()) {
//            // 빈 값인 경우 빈 리스트 반환
//            return List.of();
//        }
//        return boardElasticsearchRepository.fuzzyFindByDescription(description);
//    }

    public List<Recommend> findSimilarBoards(String userInput) {
        // Fuzzy query 사용
        List<Recommend> results = boardElasticsearchRepository.findByDescriptionLike(userInput);
        return results;
    }

    public List<Recommend> findSimilarRecommendations(double[] descriptionVector) {
        // descriptionVector를 사용하여 유사한 Recommend를 찾음
        return boardElasticsearchRepository.findByDescriptionVector(descriptionVector);
    }

    public List<String> recommendClassificationAndFrameworkAndLanguage(String recommendId) {
        Recommend recommend = boardElasticsearchRepository.findById(recommendId)
                .orElseThrow(() -> new RuntimeException("추천 정보를 찾을 수 없습니다."));

        // 추천된 classification, frameworks, languages 리턴
        String classification = recommend.getClassification();
        List<String> frameworks = recommend.getFrameworks().stream()
                .map(boardFramework -> boardFramework.getFramework().getName()) // BoardFramework의 getName 메서드 호출
                .toList();
        List<String> languages = recommend.getLanguages().stream()
                .map(boardLanguage -> boardLanguage.getLanguage().getName()) // BoardLanguage의 getName 메서드 호출
                .toList();

        // 여기에 추천 정보를 조합하는 로직 추가 가능
        return List.of(classification, String.join(", ", frameworks), String.join(", ", languages));
    }
}
