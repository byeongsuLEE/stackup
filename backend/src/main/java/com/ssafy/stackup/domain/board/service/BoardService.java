package com.ssafy.stackup.domain.board.service;

import com.ssafy.stackup.common.exception.ResourceNotFoundException;
import com.ssafy.stackup.domain.board.dto.BoardCreateRequest;
import com.ssafy.stackup.domain.board.dto.BoardFindAllResponse;
import com.ssafy.stackup.domain.board.entity.Board;
import com.ssafy.stackup.domain.board.entity.BoardFramework;
import com.ssafy.stackup.domain.board.entity.BoardLanguage;
import com.ssafy.stackup.domain.board.repository.BoardRepository;
import com.ssafy.stackup.domain.framework.dto.BoardFrameworkUpdateRequest;
import com.ssafy.stackup.domain.framework.dto.FrameworkRequest;
import com.ssafy.stackup.domain.framework.entity.Framework;
import com.ssafy.stackup.domain.framework.repository.BoardFrameworkRepository;
import com.ssafy.stackup.domain.framework.repository.FrameworkRepository;
import com.ssafy.stackup.domain.framework.service.FrameworkService;
import com.ssafy.stackup.domain.language.dto.BoardLanguageUpdateRequest;
import com.ssafy.stackup.domain.language.entity.Language;
import com.ssafy.stackup.domain.language.repository.BoardLanguageRepository;
import com.ssafy.stackup.domain.language.repository.LanguageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class BoardService {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private FrameworkRepository frameworkRepository;

    private BoardFrameworkRepository boardFrameworkRepository;

    @Autowired
    private LanguageRepository languageRepository;

    private BoardLanguageRepository boardLanguageRepository;
    @Autowired
    private FrameworkService frameworkService;

    //모집글 목록 조회
    @Transactional(readOnly = true)
    public List<?> getboards(){
        return boardRepository.findAll();
    }

    //모집글 상세 조회
    @Transactional(readOnly = true)
    public Board findByBoardId(Long boardId){
        return  boardRepository.findById(boardId)
                .orElseThrow(()-> new ResourceNotFoundException("Board not found"));
    }


    //모집글 작성
    public BoardFindAllResponse createBoard(Board board, List<BoardFrameworkUpdateRequest> frameworkRequests, List<BoardLanguageUpdateRequest> languageRequests) {

        List<BoardFramework> frameworks = new ArrayList<>();
        List<BoardLanguage> languages = new ArrayList<>();

        Set<Long> uniqueFrameworkIds = frameworkRequests.stream()
                .map(BoardFrameworkUpdateRequest::getFrameworkId)
                .collect(Collectors.toSet());

        Set<Long> uniqueLanguageIds = languageRequests.stream()
                .map(BoardLanguageUpdateRequest::getLanguageId)
                .collect(Collectors.toSet());

        for(Long frameworkId : uniqueFrameworkIds) {
            Framework framework = frameworkRepository.findById(frameworkId)
                    .orElseThrow(() -> new ResourceNotFoundException("프레임워크가 존재하지 않음"));
            BoardFramework boardFramework = BoardFramework.builder()
                    .framework(framework)
                    .board(board)
                    .build();
            frameworks.add(boardFramework);
        }
        board.setBoardFrameworks(frameworks);

        for(Long languageId : uniqueLanguageIds) {
            Language language = languageRepository.findById(languageId)
                    .orElseThrow(() -> new ResourceNotFoundException("언어가 존재하지 않음"));
            BoardLanguage boardLanguage = BoardLanguage.builder()
                    .language(language)
                    .board(board)
                    .build();
            languages.add(boardLanguage);
        }
        board.setBoardLanguages(languages);
        log.info("Saving board with frameworks and languages: {}", board);
        log.info("frameworks:",frameworkRequests.toString());

        boardRepository.save(board);

        return new BoardFindAllResponse(board);
    }

    @Transactional(readOnly = true)
    public List<FrameworkRequest> findFrameworks(Long boardId) {
        return frameworkService.findFrameworkByBoardId(boardId).stream()
                .map(FrameworkRequest::new)
                .collect(Collectors.toList());
    }
}
