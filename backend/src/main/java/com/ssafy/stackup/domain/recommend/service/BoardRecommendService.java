package com.ssafy.stackup.domain.recommend.service;

import com.ssafy.stackup.domain.board.entity.Board;
import com.ssafy.stackup.domain.recommend.repository.BoardElasticsearchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class BoardRecommendService {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final BoardElasticsearchRepository boardElasticsearchRepository;

    public BoardRecommendService(KafkaTemplate<String, String> kafkaTemplate, BoardElasticsearchRepository boardElasticsearchRepository) {
        this.kafkaTemplate = kafkaTemplate;
        this.boardElasticsearchRepository = boardElasticsearchRepository;
    }

    public void searchSimilarBoards(String description) {
        // Kafka로 검색 요청 전송
        kafkaTemplate.send("search-description-topic", description);
    }

//    @KafkaListener(topics = "search-description-topic", groupId = "search-group")
//    public void consumeSearchRequest(String description) {
//        // description을 BERT 임베딩으로 변환 후 Elasticsearch에서 검색
//        List<Board> similarBoards = searchInElasticsearch(description);
//        kafkaTemplate.send("search-results-topic", similarBoards.toString());
//    }

//    private List<Board> searchInElasticsearch(String description) {
//        // 유사한 Board 검색 로직 (벡터 검색)
//        List<Double> embedding = getEmbeddingFromFlask(description); // Flask로 임베딩 요청
//        return boardElasticsearchRepository.searchByEmbedding(embedding);
//    }
//
//    private List<Double> getEmbeddingFromFlask(String description) {
//        // Flask 서버로 임베딩 요청
//        String url = "http://localhost:5000/embed";
//        Map<String, String> request = Map.of("description", description);
//        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
//        return (List<Double>) response.getBody().get("embedding");
//    }
}
