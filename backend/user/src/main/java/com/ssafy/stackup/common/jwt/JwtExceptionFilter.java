package com.ssafy.stackup.common.jwt;


import com.ssafy.stackup.common.response.ApiResponse;
import com.ssafy.stackup.common.response.ErrorCode;
import com.ssafy.stackup.common.util.RedisUtil;
import com.ssafy.stackup.domain.user.dto.response.TokenDto;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class  JwtExceptionFilter extends OncePerRequestFilter {
    private final TokenProvider tokenProvider;
    private final RedisUtil redisUtil;

    /**
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-08
     * @ 설명     : JWT 에러 핸들링
     * @param request 헤더에서 토큰을 가져오기위한 servlet
     * @param response 토큰을 헤더에 추가하기 위한 servlet
     * @param filterChain filter
     * @return
     * @status 실패 : 400, 401, 403
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        try{
            doFilter(request, response, filterChain);
        } catch (JwtException e) {
            ErrorCode errorCode = null;

            if(e.getMessage().equals(ErrorCode.EXPIRED_TOKEN.getMessage())) {
                if(request.getHeader("refreshToken") == null) { // 만약 헤더에 refreshToken 이 없다면 토큰 만료 에러발생
                    errorCode = ErrorCode.EXPIRED_TOKEN;
                } else { // RefreshToken이 있다면 reissue 요청이므로 refreshToken으로 Authentication을 만들고 토큰 재발급
                    Authentication authentication = tokenProvider.getAuthentication(request.getHeader("refreshToken"));
                    if (redisUtil.getData(authentication.getName()) == null) {
                        errorCode = ErrorCode.EXPIRED_REFRESH_TOKEN;
                    } else {
                        String accessToken = request.getHeader("Authorization").substring(7); // "Bearer " 이후의 토큰 부분만 추출
                        String userType = tokenProvider.getUserType(accessToken);
                        TokenDto tokenDto = tokenProvider.generateToken(authentication,userType);
                        response.setHeader("Authorization", tokenDto.accessToken());
                        response.setHeader("refreshToken", tokenDto.refreshToken());
                        response.setStatus(HttpStatus.CREATED.value());

                        redisUtil.setData(authentication.getName(), tokenDto.refreshToken(), tokenDto.refreshTokenExpiresIn());

                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            } else if(e.getMessage().equals(ErrorCode.UNKNOWN_TOKEN.getMessage())){
                errorCode = ErrorCode.UNKNOWN_TOKEN;
            } else if(e.getMessage().equals(ErrorCode.WRONG_TYPE_TOKEN.getMessage())){
                errorCode = ErrorCode.WRONG_TYPE_TOKEN;
            } else if(e.getMessage().equals(ErrorCode.UNSUPPORTED_TOKEN.getMessage())){
                errorCode = ErrorCode.UNSUPPORTED_TOKEN;
            }

            ApiResponse<String> apiResponse;
            if(errorCode == null) {
                apiResponse = ApiResponse.success("토큰 재발급 성공");
            } else {
                response.setStatus(errorCode.getStatus().value());
                apiResponse = ApiResponse.error(errorCode);
            }
            response.getWriter().write(apiResponse.toJson()); // ApiResponse의 toJson() 메서드를 사용하여 JSON으로 변환
        }

    }
}
