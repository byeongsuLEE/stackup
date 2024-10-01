package com.ssafy.stackup.domain.board.service;

import com.ssafy.stackup.common.exception.ResourceNotFoundException;
import com.ssafy.stackup.domain.board.dto.BoardApplicantRequest;
import com.ssafy.stackup.domain.board.dto.BoardCreateRequest;
import com.ssafy.stackup.domain.board.dto.BoardFindAllResponse;
import com.ssafy.stackup.domain.board.entity.Board;
import com.ssafy.stackup.domain.board.entity.BoardApplicant;
import com.ssafy.stackup.domain.board.entity.BoardFramework;
import com.ssafy.stackup.domain.board.entity.BoardLanguage;
import com.ssafy.stackup.domain.board.repository.BoardApplicantRepository;
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
import com.ssafy.stackup.domain.recommend.entity.Recommend;
import com.ssafy.stackup.domain.recommend.repository.BoardElasticsearchRepository;
import com.ssafy.stackup.domain.recommend.service.RecommendationService;
import com.ssafy.stackup.domain.user.entity.Client;
import com.ssafy.stackup.domain.user.entity.Freelancer;
import com.ssafy.stackup.domain.user.repository.FreelancerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import javax.swing.text.html.Option;
import java.util.*;
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

    @Autowired
    private FreelancerRepository freelancerRepository;

    @Autowired
    private BoardApplicantRepository boardApplicantRepository;

    @Autowired
    private BoardElasticsearchRepository boardElasticsearchRepository;
    @Autowired
    private RecommendationService recommendationService;

    //모집글 목록 조회
    @Transactional(readOnly = true)
    public List<BoardFindAllResponse> getboards() {
        List<Board> boards = boardRepository.findAll();
        return boards.stream()
                .map(BoardFindAllResponse::new)
                .collect(Collectors.toList());
    }

    //조건에 맞는 게시글 조회
    @Transactional(readOnly = true)
    public List<BoardFindAllResponse> findBoardsByConditions(Boolean worktype, String deposit, String classification) {
        List<Board> boards = boardRepository.findByConditions(worktype, deposit, classification);
        return boards.stream()
                .map(BoardFindAllResponse::new)
                .collect(Collectors.toList());
    }

    //모집글 상세 조회
    @Transactional(readOnly = true)
    public Board findByBoardId(Long boardId){
        return  boardRepository.findById(boardId)
                .orElseThrow(()-> new ResourceNotFoundException("게시글이 존재하지 않음"));
    }

    //모집글 삭제
    public void deleteBoard(Long boardId){
        Board board = boardRepository.findById(boardId)
                .orElseThrow(()-> new ResourceNotFoundException("게시글이 존재하지 않음"));

        boardRepository.delete(board);
    }

    @Transactional(readOnly = true)
    public List<BoardFindAllResponse> findBoardsByIds(Set<Long> boardIds) {
        // boardIds 리스트를 사용하여 각 boardId에 해당하는 Board를 찾기
        List<Board> boards = boardIds.stream()
                .map(boardId -> boardRepository.findById(boardId)
                        .orElseThrow(() -> new ResourceNotFoundException("게시글이 존재하지 않음: " + boardId)))
                .collect(Collectors.toList());

        return boards.stream()
                .map(BoardFindAllResponse::new)
                .collect(Collectors.toList());
    }



    //모집글 작성
    public BoardFindAllResponse createBoard(Board board, List<BoardFrameworkUpdateRequest> frameworkRequests, List<BoardLanguageUpdateRequest> languageRequests, Client client) {
        board.setClient(client);
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
//                    .board(board)
                    .build();
            frameworks.add(boardFramework);
        }
       board.setBoardFrameworks(frameworks);

//        List<String> languageNames = new ArrayList<>();

        for(Long languageId : uniqueLanguageIds) {
            Language language = languageRepository.findById(languageId)
                    .orElseThrow(() -> new ResourceNotFoundException("언어가 존재하지 않음"));
            BoardLanguage boardLanguage = BoardLanguage.builder()
                    .language(language)
//                    .board(board)
                    .build();
            languages.add(boardLanguage);
//            languageNames.add(language.getName());
        }
        board.setBoardLanguages(languages);

        // 벡터 생성 요청
        double[] descriptionVector = generateVector(board.getDescription());

        Recommend recommend = new Recommend();
        recommend.setClassification(board.getClassification());
        recommend.setDescription(board.getDescription());
        recommend.setFrameworks(board.getBoardFrameworks());
        recommend.setLanguages(board.getBoardLanguages());
//        recommend.setLanguages(languageNames);
//        recommend.setFrameworks(frameworkNames);
        recommend.setLevel(board.getLevel());
        recommend.setTitle(board.getTitle());
        recommend.setDeposit(board.getDeposit());
        recommend.setDescriptionVector(descriptionVector);


        Board result = boardRepository.save(board);

        recommend.setBoardId(result.getBoardId());
        boardElasticsearchRepository.save(recommend);

        return new BoardFindAllResponse(board);
    }

    @Transactional(readOnly = true)
    public List<FrameworkRequest> findFrameworks(Long boardId) {
        return frameworkService.findFrameworkByBoardId(boardId).stream()
                .map(FrameworkRequest::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void applyToBoard(Long boardId, Long freelancerId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));
        Freelancer freelancer = freelancerRepository.findById(freelancerId)
                .orElseThrow(() -> new RuntimeException("Freelancer not found"));

        BoardApplicant boardApplicant = new BoardApplicant();
        boardApplicant.setBoard(board);
        boardApplicant.setFreelancer(freelancer);

        // Add boardApplicant to the board's list
        board.getBoardApplicants().add(boardApplicant);
        boardApplicantRepository.save(boardApplicant);
    }

    public List<BoardApplicantRequest> getApplicantListByBoardId(Long boardId) {
        List<BoardApplicant> applicants = boardApplicantRepository.findByBoard_BoardId(boardId);
        return applicants.stream()
                .map(BoardApplicantRequest::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateIsCharged(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));
        board.setIsCharged(true);
        boardRepository.save(board);
    }

    private final RestTemplate restTemplate;

    private double[] generateVector(String description) {
        // Flask 서버로 벡터 생성 요청
        String flaskUrl = "http://localhost:5000/vectorize"; // Flask 서버 URL
        // JSON 형식으로 description을 감싸기
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("description", description);

        return restTemplate.postForObject(flaskUrl, requestBody, double[].class);
    }

}
