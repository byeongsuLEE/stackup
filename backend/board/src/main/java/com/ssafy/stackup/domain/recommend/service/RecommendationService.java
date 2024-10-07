package com.ssafy.stackup.domain.recommend.service;

import com.ssafy.stackup.domain.board.entity.Level;
import com.ssafy.stackup.domain.board.repository.BoardRepository;
import com.ssafy.stackup.domain.recommend.entity.Recommend;
import com.ssafy.stackup.domain.recommend.repository.BoardElasticsearchRepository;
import com.ssafy.stackup.domain.user.entity.Freelancer;
import com.ssafy.stackup.domain.user.repository.FreelancerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
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

    public Set<Recommend> recommendBoardsForFreelancer(Long freelancerId) {
        // 1. 프리랜서 정보 가져오기
        Freelancer freelancer = freelancerRepository.findById(freelancerId)
                .orElseThrow(() -> new IllegalArgumentException("프리랜서를 찾을 수 없습니다."));

        List<Recommend> recommendListByClassification = boardElasticsearchRepo.findByClassification(freelancer.getClassification()).stream().toList();

//         2. 프리랜서가 사용하는 언어에 맞는 보드 추천
        Set<String> languages = freelancer.getLanguages().stream()
                .map(language -> language.getLanguage().getName())
                .collect(Collectors.toSet());
        // 각 언어별로 추천 검색
        Set<Recommend> recommendedBoardsByLanguage = new HashSet<>();
        for (String language : languages) {
            List<Recommend> recommendsByLanguage = boardElasticsearchRepo.findByLanguages(language);
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

        // 프리랜서 경력에 맞는 보드 추천
        List<Recommend> recommendedBoardsByLevel = boardElasticsearchRepo.findByLevel(freelancerLevel);


        // 추천된 모든 보드들을 하나의 리스트로 합침
        Set<Recommend> recommendedBoards = new HashSet<>();
        recommendedBoards.addAll(recommendListByClassification);
        recommendedBoards.addAll(recommendedBoardsByFramework);
        recommendedBoards.addAll(recommendedBoardsByLevel);
        recommendedBoards.addAll(recommendedBoardsByLanguage);

        // 5. 각 Recommend가 몇 개의 조건을 만족하는지 확인하고, 3개 이상 맞는 보드만 필터링
        Set<Recommend> result = recommendedBoards.stream()
                .filter(recommend -> {
                    int matchCount = 0;

                    // classification 일치 여부 확인
                    if (recommend.getClassification().equals(freelancer.getClassification())) {
                        matchCount++;
                    }

                    if (!recommend.getLanguages().isEmpty() && recommend.getLanguages().stream()
                            .map(language -> language.getLanguage().getName())
                            .anyMatch(languages::contains)) {
                        matchCount++;
                    }

                    // framework 일치 여부 확인
                    if (!recommend.getFrameworks().isEmpty() && recommend.getFrameworks().stream()
                            .map(framework -> framework.getFramework().getName())
                            .anyMatch(frameworks::contains)) {
                        matchCount++;
                    }

                    // level 일치 여부 확인
                    if (recommend.getLevel() == freelancerLevel) {
                        matchCount++;
                    }
                    // 3개 이상의 조건이 일치하는 경우만 포함
                    return matchCount >= 3;
                })
                .collect(Collectors.toSet());

        return result;
    }

    private Level getLevelByCareerYear(int careerYear) {
        for (Level level : Level.values()) {
            if (level.matches(careerYear)) {
                return level;
            }
        }
        throw new IllegalArgumentException("적절한 레벨을 찾을 수 없습니다.");
    }

    public Set<Recommend> recommends(Long freelancerId) {
        Freelancer freelancer = freelancerRepository.findById(freelancerId)
                .orElseThrow(() -> new IllegalArgumentException("프리랜서를 찾을 수 없습니다."));

        Set<String> languages = freelancer.getLanguages().stream()
                .map(language -> language.getLanguage().getName())
                .collect(Collectors.toSet());

//        // 3. 프리랜서가 사용하는 프레임워크에 맞는 보드 추천
        Set<String> frameworks = freelancer.getFrameworks().stream()
                .map(framework -> framework.getFramework().getName())
                .collect(Collectors.toSet());

        Integer careerYear = freelancer.getCareerYear();
        Level freelancerLevel = getLevelByCareerYear(careerYear);

        List<Recommend> recommendList = boardElasticsearchRepo.findByMultipleCriteria(freelancer.getClassification(),languages,frameworks,freelancerLevel);
        Set<Recommend> results = new HashSet<>(recommendList);

        return results;
    }


}
