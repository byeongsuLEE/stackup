package com.ssafy.stackup.common.oauth2;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.stackup.common.jwt.TokenProvider;
import com.ssafy.stackup.common.util.RedisUtil;
import com.ssafy.stackup.domain.user.dto.response.TokenDto;
import com.ssafy.stackup.domain.user.repository.FreelancerRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * 작성자   : user
 * 작성날짜 : 2024-09-09
 * 설명    :
 */
@Component
@RequiredArgsConstructor
public class CustomOauth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {



    private final TokenProvider tokenProvider;
    private final RedisUtil redisUtil;

    private final FreelancerRepository freelancerRepository;
    //    private final FrameworkRepository frameworkRepository;
//    private final LanguageRepository languageRepository;
    private final ObjectMapper objectMapper;

    @Value("${redirect.url.callback}")
    private String redirectCallback;

    @Value("${redirect.url.main}")
    private String redirectMainUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        System.out.println("로그인성공");
        String userType = "freelancer";
        TokenDto tokenDto = tokenProvider.generateToken(authentication,userType);

        // 생성된 토큰을 응답 헤더에 설정
        tokenToHeader(tokenDto, response);

        // Refresh Token을 Redis에 저장
        String githubId = authentication.getName(); // 사용자 이메일 (또는 식별자)
        redisUtil.setData(githubId, tokenDto.refreshToken(), tokenDto.refreshTokenExpiresIn());

        //회원정보가 있다면 메인으로 이동시켜봅시다..
        getRedirectStrategy().sendRedirect(request, response, redirectCallback+"?userId="+authentication.getName());

    }

    private void tokenToHeader(TokenDto tokenDto, HttpServletResponse response) {
        response.addHeader("Authorization",tokenDto.accessToken());
        response.addHeader("refreshToken", tokenDto.refreshToken());
    }

}
