package com.ssafy.stackup.domain.recommend.service;

import com.ssafy.stackup.domain.recommend.entity.Recommend;
import com.ssafy.stackup.domain.recommend.repository.BoardElasticsearchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class KafkaConsumerService {
    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private BoardElasticsearchRepository boardElasticsearchRepository;

    @KafkaListener(topics = "description-topic", groupId = "recommendation-group")
    public List<Recommend> listen(String description) {
        System.out.println(description);
        // Flask 서버로 벡터 생성 요청
        String flaskUrl = "http://localhost:5000/vectorize"; // Flask 서버 URL

        // JSON 형식으로 description을 감싸기
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("description", description);

        double[] vectorResponse = restTemplate.postForObject(flaskUrl, requestBody, double[].class);

        if (vectorResponse != null) {
            // 벡터를 사용하여 Elasticsearch에서 추천 결과 검색
            List<Recommend> recommendations = findSimilarRecommendations(vectorResponse);

            // 추천 결과를 사용하여 필요한 작업 수행
            // 예: 사용자에게 결과 반환, 로그 기록 등
            // ...
            return recommendations;
        }
        return null;
    }

    public List<Recommend> findSimilarRecommendations(double[] descriptionVector) {
        System.out.println(descriptionVector[0]);
        // Elasticsearch에서 유사한 추천 결과 검색
        return boardElasticsearchRepository.findByDescriptionVector(descriptionVector);
    }
}
