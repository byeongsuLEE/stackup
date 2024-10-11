package com.ssafy.stackup.domain.board.controller;

import com.ssafy.stackup.common.exception.CustomException;
import com.ssafy.stackup.common.response.ApiResponse;
import com.ssafy.stackup.common.response.ErrorCode;
import com.ssafy.stackup.domain.board.dto.*;
import com.ssafy.stackup.domain.board.entity.Board;
import com.ssafy.stackup.domain.board.repository.BoardApplicantRepository;
import com.ssafy.stackup.domain.board.repository.BoardRepository;
import com.ssafy.stackup.domain.board.service.BoardService;
import com.ssafy.stackup.domain.recommend.entity.Recommend;
import com.ssafy.stackup.domain.recommend.service.RecommendationService;
import com.ssafy.stackup.domain.user.entity.AuthUser;
import com.ssafy.stackup.domain.user.entity.Client;
import com.ssafy.stackup.domain.user.entity.User;
import com.ssafy.stackup.domain.user.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/board")
public class BoardController {

    @Autowired
    private BoardService boardService;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private RecommendationService recommendationService;
    @Autowired
    private BoardRepository boardRepository;


    @GetMapping("/client/{userId}")
    public ResponseEntity<ApiResponse<?>> getBoard(@PathVariable Long userId) {
        List<?> boards = boardService.getMyBoards(userId);
        return ResponseEntity.ok(ApiResponse.success(boards));
    }

//    @GetMapping
//    public ResponseEntity<?> findAllBoards(){
//        List<?> boards = boardService.getboards();
//        return ResponseEntity.ok().body(ApiResponse.success(boards));
//    }

    @GetMapping
    public ResponseEntity<?> findAllBoards(Pageable pageable) {
        Page<Board> boards = boardService.findAll(pageable);

        List<BoardFindAllResponse> responseList = boards.stream()
                .map(BoardFindAllResponse::new)
                .collect(Collectors.toList());

        Page<BoardFindAllResponse> pages = new PageImpl<>(responseList, pageable, boards.getTotalElements());
        PageResponse result = new PageResponse(pages);

        return ResponseEntity.ok(result);

    }

    @GetMapping("/recommend-list")
    public List<Recommend> findAllRecommendations(){
//        List<?> recommends = recommendationService.findRecommend();
//        return ResponseEntity.ok().body(ApiResponse.success(recommends));
        return recommendationService.findRecommend();
    }

    //모집글 상세 조회
    @GetMapping("/{boardId}")
    public ResponseEntity<?> findBoardById(@PathVariable Long boardId){
        Board board = boardService.findByBoardId(boardId);
        return ResponseEntity.ok().body(ApiResponse.success(new BoardFindOneResponse(board)));
    }

    //모집글 삭제
    @DeleteMapping("/{boardId}")
    public ResponseEntity<?> deleteBoard(@PathVariable Long boardId){
        boardService.deleteBoard(boardId);
        return ResponseEntity.ok().body(ApiResponse.success("모집글 삭제 성공"));
    }


    @PostMapping
    public ResponseEntity<?> createBoard(@RequestBody BoardCreateRequest request, @AuthUser User user) {
        Client client = clientRepository.findById(user.getId())
                .orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));
//        if (!(user instanceof Client)) {
//            return ResponseEntity.badRequest().body("Invalid user type");
//        }
//
//        Client client = (Client) user;
//        if (!(user instanceof Freelancer)) {
//            return ResponseEntity.badRequest().body("Invalid user type");
//        }
//
//        Freelancer freelancer = (Freelancer) user;

        Board board = Board.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .classification(request.getClassification())
                .boardFrameworks(new ArrayList<>())
                .boardLanguages(new ArrayList<>())
                .deposit(request.getDeposit())
                .startDate(request.getStartDate())
                .period(request.getPeriod())
                .recruits(request.getRecruits())
                .applicants(request.getApplicants())
                .worktype(request.getWorktype())
                .requirements(request.getRequirements())
                .isCharged(request.getIsCharged())
                .address(request.getAddress())
                .level(request.getLevel())
                .deadline(request.getDeadline())
                .upload(request.getUpload())
                .client(client)
                .build();

        BoardFindAllResponse result = boardService.createBoard(board, request.getFrameworks(), request.getLanguages(), client);

        return ResponseEntity.ok().body(ApiResponse.success(result));
    }

    @GetMapping("/search")
    public ResponseEntity<?> conditionedBoards(
            @RequestParam(value = "worktype", required = false) Boolean worktype,
            @RequestParam(value = "deposit", required = false) String deposit,
            @RequestParam(value = "classification", required = false) String classification){
//        BoardFindAllResponse result = boardService.findBoardsByConditions(worktype, deposit, classification);
        List<?> boards = boardService.findBoardsByConditions(worktype, deposit, classification);
//        List<BoardFindAllResponse> responseList = boards.stream()
//                .map(BoardFindAllResponse::new)
//                .collect(Collectors.toList());
        return ResponseEntity.ok().body(ApiResponse.success(boards));
    }

    @PostMapping("/{boardId}/apply")
    public ResponseEntity<?> applyToBoard(@PathVariable Long boardId, @AuthUser User user){
        Long freelancerId = user.getId();
        boardService.applyToBoard(boardId, freelancerId);
        return ResponseEntity.ok("지원완료");
    }

    @GetMapping("/{boardId}/applicant-list")
    public List<BoardApplicantRequest> getApplicantList(@PathVariable Long boardId) {
        return boardService.getApplicantListByBoardId(boardId);
    }

    @GetMapping("/{boardId}/selected-applicant-list")
    public List<BoardApplicantRequest> getSelectedApplicantList(@PathVariable Long boardId) {
        return boardService.getSelectedApplicantListByBoardId(boardId);
    }

    @PostMapping("/{boardId}/payment-success")
    public ResponseEntity<?> handlePaymentSuccess(@PathVariable Long boardId, @RequestBody PaymentSuccessRequest request) {
        try {
            // Optional: You can verify the payment status by contacting the payment gateway (e.g., with IMP UID)
            // For now, we'll assume the payment is successful and proceed to update the board

            boardService.updateIsCharged(boardId);
            return ResponseEntity.ok().body(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     *
     *
     * @ 작성자   : 김연지
     * @ 작성일   : 2024-09-26
     * @ 설명     : 프리랜서 스킬셋(대분류, 언어, 프레임워크, 경력) 기반으로 일감(board)추천
     * @param user
     * @return
     */
    @GetMapping("/recommend")
    public Set<Recommend> recommendBoards(@AuthUser User user) {
        Long freelancerId = user.getId();
        Set<Recommend> recommendBoards = recommendationService.recommendBoardsForFreelancer(freelancerId);
        return recommendBoards;
    }

    @Autowired
    BoardApplicantRepository boardApplicantRepository;

    /**
     *
     * @ 작성자   : 김연지
     * @ 작성일   : 2024-09-29
     * @ 설명     : 프리랜서가 지원한 board 전체 조회
     * @param user
     * @return
     */
    @GetMapping("/apply-list")
    public List<BoardFindAllResponse> applyBoards(@AuthUser User user) {
        Long userId = user.getId();
        List<Board> boards = boardApplicantRepository.findBoardsByUserId(userId);
        return boards.stream()
                .map(BoardFindAllResponse::new)
                .collect(Collectors.toList());
    }

    /**
     *
     * @ 작성자   : 김연지
     * @ 작성일   : 2024-10-08
     * @ 설명     : 지원한 board들을 작성한 client 조회
     * @param user
     * @return
     */

    @GetMapping("/apply-client")
    public List<BoardClientResponse> applyClients(@AuthUser User user) {
        Long userId = user.getId();
        List<Board> boards = boardApplicantRepository.findBoardsByUserId(userId);
        return boards.stream()
                .map(BoardClientResponse::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/myboard")
    public List<BoardClientResponse> myBoards(@AuthUser User user) {
        Long userId = user.getId();
        System.out.println(userId);
        List<Board> boards = boardRepository.findByClient_Id(userId);
        return boards.stream()
                .map(BoardClientResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * 
     * @ 작성자   : 김연지
     * @ 작성일   : 2024-10-01
     * @ 설명     : description이 유사한 board를 찾아 해당 classification, framework, language를 리턴
     * @param requestBody
     * @return
     */

    @PostMapping("/search")
    public ResponseEntity<BoardSearchResponse> searchBoards(@RequestBody Map<String, String> requestBody) {
        String description = requestBody.get("description");

        // Flask 서버로 요청 보내기
        BoardSearchResponse similarBoard = boardService.findSimilarBoards(description);

        return ResponseEntity.ok(similarBoard);
    }

    @GetMapping("/search-all")
    public ResponseEntity<?> findALlDescription() {
        List<BoardSearchResponse> descriptions = boardService.getDescription();
        return ResponseEntity.ok().body(ApiResponse.success(descriptions));
    }

}
