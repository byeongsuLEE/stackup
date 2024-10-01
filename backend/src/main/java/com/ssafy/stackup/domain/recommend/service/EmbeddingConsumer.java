package com.ssafy.stackup.domain.recommend.service;

import com.ssafy.stackup.domain.board.entity.Board;
import com.ssafy.stackup.domain.recommend.entity.Recommend;
import com.ssafy.stackup.domain.recommend.repository.BoardElasticsearchRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class EmbeddingConsumer {
    private final RestTemplate restTemplate = new RestTemplate();
    private final BoardElasticsearchRepository boardElasticsearchRepository;

    public EmbeddingConsumer(BoardElasticsearchRepository boardElasticsearchRepository) {
        this.boardElasticsearchRepository = boardElasticsearchRepository;
    }

    @KafkaListener(topics = "board-description-topic", groupId = "embedding-group")
    public void consumeDescription(String description) {
        // Flask 서버로 임베딩 생성 요청
        String url = "http://localhost:5000/embed";
        Map<String, String> request = Map.of("description", description);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
        List<Double> embedding = (List<Double>) response.getBody().get("embedding");

        // Elasticsearch에 임베딩 저장
//        Board board = new Board();
        Recommend recommend = new Recommend();
        recommend.setDescription(description);
        recommend.setDescriptionVector(embedding);
        boardElasticsearchRepository.save(recommend);
    }
}
