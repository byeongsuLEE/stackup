//package com.ssafy.stackup.domain.recommend.controller;
//
//import com.ssafy.stackup.domain.recommend.dto.DescriptionRequest;
//import com.ssafy.stackup.domain.recommend.entity.Recommend;
//import com.ssafy.stackup.domain.recommend.service.KafkaProducerService;
//import com.ssafy.stackup.domain.recommend.service.RecommendService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/recommendations")
//public class RecommendController {
//
//    @Autowired
//    private KafkaProducerService kafkaProducerService;
//
////    @Autowired
////    private KafkaConsumerService kafkaConsumerService;
//
//    @Autowired
//    private RecommendService recommendService;
//
//    // Fuzzy matching 검색 API
//    @PostMapping("/search")
//    public List<Recommend> searchBoards(@RequestBody DescriptionRequest request) {
//        System.out.println(request);
//        return recommendService.findSimilarBoards(request.getDescription());
//    }
//
//    @PostMapping("/request")
//    public ResponseEntity<String> requestRecommendations(@RequestBody String description) {
//        kafkaProducerService.sendDescription(description);
//        return ResponseEntity.ok("추천 요청이 전송되었습니다.");
//    }
//
//    @PostMapping("/generate")
//    public List<Recommend> getRecommendations(@RequestBody DescriptionRequest request) {
//        String description = request.getDescription();
//
//        // description을 사용하여 추천 결과 생성 요청
////        List<Recommend> recommendations = kafkaConsumerService.listen(description);
//
//        // 추천 결과를 반환
//        if (recommendations != null && !recommendations.isEmpty()) {
//            return recommendations;
//        } else {
//            // 추천 결과가 없을 경우 빈 리스트 반환
//            return List.of(); // 또는 null을 반환하여 204 No Content를 유도할 수 있습니다.
//        }
//    }
//
//}
//
