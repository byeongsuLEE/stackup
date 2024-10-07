package com.ssafy.stackup.common.oauth2.service;

import com.ssafy.stackup.common.exception.CustomOAuth2Exception;
import com.ssafy.stackup.common.oauth2.dto.GitHubResponse;
import com.ssafy.stackup.common.response.ErrorCode;
import com.ssafy.stackup.domain.user.entity.Freelancer;
import com.ssafy.stackup.domain.user.entity.UserAdapter;
import com.ssafy.stackup.domain.user.repository.FreelancerRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * 작성자   : 이병수
 * 작성날짜 : 2024-09-09
 * 설명    : 소셜로그인
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final FreelancerRepository freelancerRepository;




    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        System.out.println("OauthUserService");

        if (registrationId.equals("github")) {

            GitHubResponse gitHubResponse = new GitHubResponse(attributes);

            System.out.println(gitHubResponse.getId());
            // GitHub ID로 프리랜서 사용자 검색
            Optional<Freelancer> optionalFreelancer = freelancerRepository.findByGithubId(gitHubResponse.getId());


            Freelancer freelancer = null;
            if (optionalFreelancer.isEmpty()) {
                freelancer = Freelancer.builder()
                        .githubId(gitHubResponse.getId())
                        .roles(List.of("ROLE_FREELANCER"))
                        .portfolioUrl(gitHubResponse.getProfileUrl())
                        .reportedCount(0)
                        .totalScore(0.0)
                        .careerYear(0)
                        .evaluatedCount(0)
                        .build();


            } else {

                freelancer = optionalFreelancer.get();
                 Optional<Freelancer> optionalExitFreelancer = freelancerRepository.findById(freelancer.getId());
                optionalExitFreelancer.ifPresent(existFreelancer -> { existFreelancer.updatePortfolioUrl(gitHubResponse.getProfileUrl()); });


            }

            freelancerRepository.save(freelancer);
            return new UserAdapter(freelancer);
        }


        throw new CustomOAuth2Exception(ErrorCode.OAUTH2_USER_NOT_FOUND);


    }

}
