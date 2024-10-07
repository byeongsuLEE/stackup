package com.ssafy.stackup.common.jwt;




import com.ssafy.stackup.common.response.ApiResponse;
import com.ssafy.stackup.common.response.ErrorCode;
import com.ssafy.stackup.common.util.RedisUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * 설명 : JWT인증을 하기 위해 설치하는 커스텀 필터. UsernamePasswordAuthenticationFilter 이전에 실행
 */
@RequiredArgsConstructor
@Slf4j
public class AuthenticationFilter extends OncePerRequestFilter {
    private final TokenProvider tokenProvider;
    private final RedisUtil redisUtil;

    /**
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-08
     * @ 설명     : 토큰이 사용가능한지, 블랙리스트에 있는 토큰인지 검증 후 ContextHolder에 저장
     * @param request 헤더에서 토큰을 가져오기위한 servlet
     * @param response 토큰을 헤더에 추가하기 위한 servlet
     * @param filterChain filter
     * @return
     * @status 실패 : 401, 403
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = tokenProvider.resolveToken(request);
        if (token != null && tokenProvider.validateToken(token)) {
            Authentication authentication = tokenProvider.getAuthentication(token);
            if (redisUtil.getData(token) != null) {
                jwtExceptionHandler(response, ErrorCode.BLACK_LIST_TOKEN);
                return;
            }
            SecurityContextHolder.getContext().setAuthentication(authentication);
            log.info("context : {}",SecurityContextHolder.getContext().getAuthentication());

        }

        filterChain.doFilter(request, response);
    }


    /**
     *
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-08
     * @ 설명     :
     * @param response 토큰을 헤더에 추가하기 위한 servlet
     * @param errorCode 커스텀 에러 코드
     * @return
     * @status 실패 : 401, 403
     */
    public void jwtExceptionHandler(HttpServletResponse response, ErrorCode errorCode) {
        response.setStatus(errorCode.getStatus().value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        try {
            ApiResponse<String> apiResponse = ApiResponse.error(errorCode);
            response.getWriter().write(apiResponse.toJson());
        } catch (Exception e) {
            throw new JwtException(errorCode.getMessage());
        }
    }
}