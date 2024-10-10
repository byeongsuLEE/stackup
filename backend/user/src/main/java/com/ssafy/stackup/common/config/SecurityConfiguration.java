package com.ssafy.stackup.common.config;


import com.ssafy.stackup.common.jwt.*;
import com.ssafy.stackup.common.oauth2.CustomOauth2SuccessHandler;
import com.ssafy.stackup.common.oauth2.service.CustomOAuth2UserService;
import com.ssafy.stackup.common.util.RedisUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@EnableWebSecurity
@RequiredArgsConstructor
@Configuration
public class SecurityConfiguration {

    private final   TokenProvider tokenProvider;
    private final RedisUtil redisUtil;
    private final CustomOAuth2UserService customOAuth2UserService; // CustomOAuth2UserService 주입

    private final String[] PERMIT_ALL_ARRAY = { // 허용할 API
            "/","/user/client/signup", "/user/login","/**","/login/**", "/oauth2/**", "/user/token","/user/ws/**", "/user/oauth2/**"
    };

    private final String[] CORS_API_METHOD = { // 허용할 Method
            "GET", "POST", "PATCH", "DELETE"
    };

    private final String[] CORS_ALLOW_URL = { // 허용할 URL
            "http://localhost:5173","https://github.com" ,"https://stackup.live","https://stackup.live:443" , "https://stackup.live"
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, CustomOauth2SuccessHandler customOauth2SuccessHandler) throws Exception {
        return http
                // CSRF 보호 비활성화
                .csrf(AbstractHttpConfigurer::disable)
                // HTTP Basic 인증 비활성화
                .httpBasic(AbstractHttpConfigurer::disable)
                // 폼 로그인 비활성화
                .formLogin(AbstractHttpConfigurer::disable)
                // CORS 설정 적용 (corsConfigurationSource 메서드에서 정의된 설정 사용)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // 세션 관리 정책을 STATELESS로 설정 (서버에서 세션을 유지하지 않음)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 요청 권한 설정
                .authorizeHttpRequests(request -> request
                        // PERMIT_ALL_ARRAY에 정의된 모든 경로는 인증 없이 접근 허용
                        .requestMatchers(Arrays.stream(PERMIT_ALL_ARRAY)
                                .map(AntPathRequestMatcher::antMatcher)
                                .toArray(AntPathRequestMatcher[] :: new))
                        .permitAll()
                        // "/admin/**" 경로는 ADMIN 역할을 가진 사용자만 접근 허용
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        // 그 외 모든 요청은 인증 필요
                        .anyRequest().authenticated()

                )

                // OAuth2 로그인 설정
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(authorizationEndpointConfig ->
                                authorizationEndpointConfig
                                        .baseUri("/user/oauth2/authorization") // github 로그인 페이지로 이동
                        )
                        .redirectionEndpoint(redirectionEndpointConfig ->
                                redirectionEndpointConfig
                                        .baseUri("/user/login/oauth2/code/github") // github 로그인 성공 후 코드넣고 사용자 정보 요청
                        )
                        .userInfoEndpoint(userInfoEndpointConfig -> userInfoEndpointConfig
                                .userService(customOAuth2UserService))
                        .successHandler(customOauth2SuccessHandler)
                ) // CustomOAuth2UserService 설정



                // UsernamePasswordAuthenticationFilter 전에 AuthenticationFilter 추가
                .addFilterBefore(new AuthenticationFilter(tokenProvider,redisUtil), UsernamePasswordAuthenticationFilter.class)
                // AuthenticationFilter 전에 JwtExceptionFilter 추가
                .addFilterBefore(new JwtExceptionFilter(tokenProvider, redisUtil), AuthenticationFilter.class)
                // 예외 처리 설정
                .exceptionHandling(e -> {
                    // 인증 실패 시 CustomAuthenticationEntryPoint 사용
                    e.authenticationEntryPoint(new CustomAuthenticationEntryPoint());
                    // 접근 거부 시 CustomAccessDeniedHandler 사용
                    e.accessDeniedHandler(new CustomAccessDeniedHandler());
                })
                // SecurityFilterChain 객체 빌드 및 반환
                .build();
    }


    /**
     * Swagger 사용
     * @return WebSecurityCustomizer
     */
    @Bean
    public WebSecurityCustomizer configure() {
        return (web) -> web.ignoring()
                .requestMatchers("/swagger-ui/**");
    }

    /**
     * 비밀번호 인코딩
     * @return BcryptPasswordEncoder
     */
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * cors 설정
     * @return
     */
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.stream(CORS_ALLOW_URL).toList());
        configuration.setAllowedMethods(Arrays.stream(CORS_API_METHOD).toList());
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        configuration.setExposedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}