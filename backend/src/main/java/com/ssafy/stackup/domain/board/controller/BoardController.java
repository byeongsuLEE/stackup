package com.ssafy.stackup.domain.board.controller;

import com.ssafy.stackup.common.response.ApiResponse;
import com.ssafy.stackup.domain.board.dto.BoardCreateRequest;
import com.ssafy.stackup.domain.board.dto.BoardFindAllResponse;
import com.ssafy.stackup.domain.board.dto.BoardFindOneResponse;
import com.ssafy.stackup.domain.board.entity.Board;
import com.ssafy.stackup.domain.board.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/board")
public class BoardController {

    @Autowired
    private BoardService boardService;

    @GetMapping
    public ResponseEntity<?> findAllBoards(){
        List<?> boards = boardService.getboards();
        return ResponseEntity.ok().body(ApiResponse.success(boards));
    }

    //모집글 상세 조회
    @GetMapping("/{boardId}")
    public ResponseEntity<?> findBoardById(@PathVariable Long boardId){
        Board board = boardService.findByBoardId(boardId);
        return ResponseEntity.ok().body(ApiResponse.success(new BoardFindOneResponse(board)));
    }

    @PostMapping
    public ResponseEntity<?> createBoard(@RequestBody BoardCreateRequest request) {

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
                .deadline(request.getDeadline())
                .upload(request.getUpload())
                .build();

        BoardFindAllResponse result = boardService.createBoard(board, request.getFrameworks(), request.getLanguages());

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
}
