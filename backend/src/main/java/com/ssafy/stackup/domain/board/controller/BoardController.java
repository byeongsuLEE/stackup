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

@RestController
@RequestMapping("/board")
public class BoardController {

    @Autowired
    private BoardService boardService;

    @GetMapping
    public ResponseEntity<?> findAllBoards(){
        List<?> boards = boardService.getboards();
        return ResponseEntity.ok(boards);
    }

    //모집글 상세 조회
    @GetMapping("/{boardId}")
    public ResponseEntity<?> findBoardById(@PathVariable Long boardId){
        Board board = boardService.findByBoardId(boardId);
        return ResponseEntity.ok(new BoardFindOneResponse(board));
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
}
