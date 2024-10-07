package com.ssafy.stackup.common.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.stackup.common.response.ApiResponse;
import com.ssafy.stackup.common.response.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Slf4j
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    /**
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-08
     * @ 설명     : 접근할 수 있는 권한을 가지고 있는지 검증
     * @param request 헤더에서 토큰을 가져오기위한 servlet
     * @param response 토큰을 헤더에 추가하기 위한 servlet
     * @param accessDeniedException exception
     * @return
     * @status 실패 : 403
     */
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        log.error("[AccessDeniedHandler] - 해당 엔드포인트에 접근할 권한 없음: {}, {}", request.getUserPrincipal().getName(), request.getServletPath());
        ObjectMapper objectMapper = new ObjectMapper();

        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("utf-8");
        response.getWriter().write(objectMapper.writeValueAsString(ApiResponse.error(ErrorCode.PERMISSION_DENIED)));
    }
}
