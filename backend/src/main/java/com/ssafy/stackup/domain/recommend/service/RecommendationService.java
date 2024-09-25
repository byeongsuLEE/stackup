package com.ssafy.stackup.domain.recommend.service;

import com.ssafy.stackup.domain.board.entity.Board;
import com.ssafy.stackup.domain.board.entity.Level;
import com.ssafy.stackup.domain.board.repository.BoardRepository;
import com.ssafy.stackup.domain.recommend.entity.Recommend;
import com.ssafy.stackup.domain.recommend.repository.BoardElasticsearchRepository;
import com.ssafy.stackup.domain.user.entity.Freelancer;
import com.ssafy.stackup.domain.user.repository.FreelancerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.IndexOperations;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    @Autowired
    private final FreelancerRepository freelancerRepository;
    @Autowired
    private final BoardElasticsearchRepository boardElasticsearchRepo;
    @Autowired
    private final BoardRepository boardRepository;

    public List<Recommend> findRecommend () {
        // Elasticsearch에 있는 모든 Board를 가져와 출력
        return StreamSupport.stream(boardElasticsearchRepo.findAll().spliterator(), false)
                .collect(Collectors.toList());
    }

    public Recommend findById (String id) {
        return boardElasticsearchRepo.findById(id).orElse(null);
    }

    public Set<Long> recommendBoardsForFreelancer(Long freelancerId) {
        // 1. 프리랜서 정보 가져오기
        Freelancer freelancer = freelancerRepository.findById(freelancerId)
                .orElseThrow(() -> new IllegalArgumentException("프리랜서를 찾을 수 없습니다."));
        System.out.println(freelancer.getClassification());

        List<Recommend> recommendListByClassification = boardElasticsearchRepo.findByClassification(freelancer.getClassification()).stream().toList();
//        System.out.println(recommendListByClassification.size());
        //
//         2. 프리랜서가 사용하는 언어에 맞는 보드 추천
        Set<String> languages = freelancer.getLanguages().stream()
                .map(language -> language.getLanguage().getName())
                .collect(Collectors.toSet());
        System.out.println(languages);
        // 각 언어별로 추천 검색
        Set<Recommend> recommendedBoardsByLanguage = new HashSet<>();
        for (String language : languages) {
            List<Recommend> recommendsByLanguage = boardElasticsearchRepo.findByLanguages(language);
            System.out.println(recommendsByLanguage.size()+ "언어" + language);
            recommendedBoardsByLanguage.addAll(recommendsByLanguage);
        }

//        // 3. 프리랜서가 사용하는 프레임워크에 맞는 보드 추천
        Set<String> frameworks = freelancer.getFrameworks().stream()
                .map(framework -> framework.getFramework().getName())
                .collect(Collectors.toSet());
        // 각 프레임워크별로 추천 검색
        Set<Recommend> recommendedBoardsByFramework = new HashSet<>();
        for (String framework : frameworks) {
            List<Recommend> recommendsByFramework = boardElasticsearchRepo.findByFrameworks(framework);
            recommendedBoardsByFramework.addAll(recommendsByFramework);
        }
//
        // 4. 프리랜서의 경력 연수에 맞는 레벨을 계산하여 보드 추천
        Integer careerYear = freelancer.getCareerYear();
        Level freelancerLevel = getLevelByCareerYear(careerYear);
        System.out.println(freelancerLevel);

        // 프리랜서 경력에 맞는 보드 추천
        List<Recommend> recommendedBoardsByLevel = boardElasticsearchRepo.findByLevel(freelancerLevel);


        // 추천된 모든 보드들을 하나의 리스트로 합침
        Set<Recommend> recommendedBoards = new HashSet<>(recommendedBoardsByLanguage);
//        recommendedBoards.addAll(recommendListByClassification);
//        recommendedBoards.addAll(recommendedBoardsByFramework);
//        recommendedBoards.addAll(recommendedBoardsByLevel);
//        recommendedBoards.addAll(recommendedBoardsByLanguage);

        List<Board> boards = new ArrayList<>();

        Set<Long> boardIds = recommendedBoards.stream()
                .map(Recommend::getBoardId) // Recommend 객체에서 boardId를 추출
                .collect(Collectors.toSet());
        System.out.println(boardIds);
//        for (Long boardId : boardIds) {
//            boards.add(boardRepository.findById(boardId).orElse(null));
//        }

        // 2. boardId로 BoardRepository를 통해 Board 리스트 조회
//        List<Board> boards = boardRepository.findAllById(boardIds);

        // 3. 조회된 Board 리스트 반환
        return boardIds;

//        return new ArrayList<>(recommendedBoards);
    }

    private Level getLevelByCareerYear(int careerYear) {
        for (Level level : Level.values()) {
            if (level.matches(careerYear)) {
                return level;
            }
        }
        throw new IllegalArgumentException("적절한 레벨을 찾을 수 없습니다.");
    }
//    @Qualifier("freelancerElasticsearchRepo")
//    private final FreelancerElasticsearchRepository freelancerRepository;
//    private final BoardElasticsearchRepository boardRepository;
//
//    public List<Board> recommendBoardsForFreelancer(Long freelancerId) {
//        Freelancer freelancer = freelancerRepository.findById(freelancerId).orElse(null);
//        if (freelancer == null) {
//            return List.of(); // 프리랜서가 없으면 빈 리스트 반환
//        }
//
//        // 프리랜서 속성 가져오기
//        String classification = freelancer.getClassification();
//        Set<String> languages = freelancer.getLanguages().stream()
//                .map(lang -> lang.getLanguage().getName())
//                .collect(Collectors.toSet());
//        Set<String> frameworks = freelancer.getFrameworks().stream()
//                .map(framework -> framework.getFramework().getName())
//                .collect(Collectors.toSet());
//        Integer careerYear = freelancer.getCareerYear();
////        Level level = freelancer.getLevel(); // 프리랜서의 레벨 추가
//
////        return boardRepository.findAll().stream()
////                .filter(board -> matchesBoardCriteria(board, classification, languages, frameworks, careerYear))
////                .collect(Collectors.toList());
//        // findAll() 호출 후 Iterable을 Stream으로 변환
//        return StreamSupport.stream(boardRepository.findAll().spliterator(), false)
//                .filter(board -> matchesBoardCriteria(board, classification, languages, frameworks, careerYear))
//                .collect(Collectors.toList());
//    }
//
//    private boolean matchesBoardCriteria(Board board, String classification, Set<String> languages, Set<String> frameworks, Integer careerYear) {
//        int matchCount = 0; // 일치하는 조건 수 카운트
//
//        // 분류가 일치하는지 확인
//        if (classification != null && classification.equals(board.getClassification())) {
//            matchCount++;
//        }
//
//        // 요구 스킬셋 확인
//        boolean languagesMatch = languages.stream().anyMatch(lang -> board.getBoardLanguages().stream()
//                .map(boardLanguage -> boardLanguage.getLanguage().getName())
//                .collect(Collectors.toSet())
//                .contains(lang));
//
//        boolean frameworksMatch = frameworks.stream().anyMatch(framework -> board.getBoardFrameworks().stream()
//                .map(boardFramework -> boardFramework.getFramework().getName())
//                .collect(Collectors.toSet())
//                .contains(framework));
//
//        if (languagesMatch) {
//            matchCount++;
//        }
//        if (frameworksMatch) {
//            matchCount++;
//        }
//
//        Level level = board.getLevel();
//
//        // 레벨에 따른 요구 경력 확인
//        if (level != null && isCareerYearMatching(careerYear, level)) {
//            matchCount++;
//        }
//
//        // 3개 이상의 조건이 일치하는지 확인
//        return matchCount >= 3;
//    }
//
//    // 레벨과 경력 연수를 비교하는 메서드
//    private boolean isCareerYearMatching(Integer careerYear, Level level) {
//        switch (level) {
//            case JUNIOR:
//                return careerYear < 3; // 3년 미만
//            case MID:
//                return careerYear >= 3 && careerYear < 7; // 3년 이상 7년 미만
//            case SENIOR:
//                return careerYear >= 7; // 7년 이상
//            default:
//                return false;
//        }
//    }

}
