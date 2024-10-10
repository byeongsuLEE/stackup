package com.ssafy.stackup.domain.board.controller;

import com.ssafy.stackup.domain.board.dto.BoardSummaryDTO;
import com.ssafy.stackup.domain.board.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

@RestController
@RequestMapping("/board/detect/illegal/{boardId}")
public class DetectionController {

    @Autowired
    private BoardRepository boardRepository;

    private final BlockingQueue<String> analysisResultsQueue = new LinkedBlockingQueue<>();
    private final RestTemplate restTemplate = new RestTemplate();

    @KafkaListener(topics = "analysis", groupId = "analysis2")
    public void listen(String message) {
        analysisResultsQueue.offer(message);
    }



    @GetMapping
    public ResponseEntity<String> detectIllegal(@PathVariable Long boardId) {
        // 데이터베이스에서 프로젝트 정보 조회
//        Board board = boardRepository.findBoardFieldsById(boardId);
        BoardSummaryDTO board = boardRepository.findBoardFieldsById(boardId);
        if (board == null) {
            return ResponseEntity.badRequest().body("Project not found");
        }

        // Flask 서버에 데이터 전송
        String flaskUrl = "https://stackup.live/flask/analyze";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);

        // level 값을 매핑하는 코드 추가
        int levelValue;
        switch (board.getLevel()) {
            case JUNIOR:
                levelValue = 1; // 주니어
                break;
            case MID:
                levelValue = 2; // 미드 레벨
                break;
            case SENIOR:
                levelValue = 3; // 시니어
                break;
            default:
                levelValue = 0; // 레벨 미선택
                break;
        }
        String requestData = String.format(
                "{ \"boardId\": %d, \"period\": %s, \"deposit\": %d, \"level\": %s }",
                 board.getBoardId(), board.getPeriod(), board.getDeposit(), levelValue
        );
        System.out.println("Request Body: " + requestData);

        HttpEntity<String> requestEntity = new HttpEntity<>(requestData, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(flaskUrl, HttpMethod.POST, requestEntity, String.class);
            System.out.println(response.getBody());
            if (response.getStatusCode().is2xxSuccessful()) {
                // Kafka에서 결과 수신
                String result = analysisResultsQueue.take();  // 결과를 가져옵니다
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.status(response.getStatusCode()).body("Failed to process request");
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); // 복구 가능
            return ResponseEntity.status(500).body("Error retrieving result");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error processing request");
        }
    }
}
