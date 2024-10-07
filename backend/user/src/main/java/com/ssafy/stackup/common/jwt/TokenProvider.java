package com.ssafy.stackup.common.jwt;


import com.ssafy.stackup.common.response.ErrorCode;
import com.ssafy.stackup.domain.user.dto.response.TokenDto;
import com.ssafy.stackup.domain.user.service.UserDetailsServiceImpl;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.security.Key;
import java.util.Date;

/**
 * @ 작성자   : 이병수
 * @ 작성일   : 2024-09-08
 * 설명 : JWT 토큰을 생성및 검증
 */
@Component
@Slf4j
public class TokenProvider {
    private final String GRANT_TYPE = "Bearer ";
    private final Key key;

    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;

    private final long accessTokenExpTime;

    private final long refreshTokenExpTime;

    public TokenProvider(@Value("${jwt.secret}") String secretKey,
                         @Value("${jwt.access_expiration_time}") long accessTokenExpTime,
                         @Value("${jwt.refresh_expiration_time}") long refreshTokenExpTime) {
        byte[] key = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(key);
        this.accessTokenExpTime = accessTokenExpTime;
        this.refreshTokenExpTime = refreshTokenExpTime;
    }

    /**
     * JWT 토큰 생성
     * @param authentication
     * @return TokenDto
     */
    public TokenDto generateToken(Authentication authentication,String userType) {
        /**
         * 현재 서비스에서 유저는 권한을 하나만 가지게 하기 때문에 하나만 가져온다.
         * 권한이 여러개 일때는 stream을 이용하여 여러개의 권한을 ','로 구분하여 가져오면 된다.
         */
        String authority = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority();


        Date now = new Date();

        String accessToken = Jwts.builder()
                .setSubject(authentication.getName()) // 인증된 사용자의 이름을 Subject로 설정하여 JWT가 어떤 사용자에 관한 것인지 식별
                .claim("userType",userType)
                .claim("auth",authority) // 'auth'라는 키로 authorities(권한 목록)을 클레임으로 추가, 클레임은 페이로드부분에 포함
                .setExpiration(new Date(now.getTime() + accessTokenExpTime)) // 만료시간
                .signWith(key, SignatureAlgorithm.HS256) // SHA-256알고리즘을 사용하여 JWT 서명 (JWT 무결성 보장)
                .compact(); // 위에서 설정한 정보를 사용하영 JWT를 생성하고 문자열로 반환


        System.out.println(accessToken);
        String refreshToken = Jwts.builder()
                .setSubject(authentication.getName())
                .setExpiration(new Date(now.getTime() + refreshTokenExpTime))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        return TokenDto.builder()
                .grantType(GRANT_TYPE)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .refreshTokenExpiresIn(refreshTokenExpTime)
                .build();
    }

    /**
     * 토큰을 복호화 하여 토큰에 들어있는 정보를 꺼내기
     * @param accessToken
     * @return Authentication
     */
    public Authentication getAuthentication(String accessToken) throws RuntimeException {
        Claims claims = parseClaims(accessToken);
        UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(claims.getSubject());

        return new UsernamePasswordAuthenticationToken(userDetails, accessToken, userDetails.getAuthorities());
    }

    /**
     * AccessToken 복호화
     * ParseClaimsJws 메서드가 JWT 토큰의 검증과 파싱을 모두 수행
     * @param accessToken
     * @return Claims
     */
    public Claims parseClaims(String accessToken) {
        try{
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(accessToken)
                    .getBody();
        }catch (JwtException e) {
            throw new JwtException(ErrorCode.EXPIRED_TOKEN.getMessage());
        }
    }

    /**
     *
     *
     *
     *
     *
     * 주어진 토큰을 검증하여 유효성 검사
     * @param token
     * @return boolean
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            throw new JwtException(ErrorCode.WRONG_TYPE_TOKEN.getMessage());
        } catch (ExpiredJwtException e) {
            throw new JwtException(ErrorCode.EXPIRED_TOKEN.getMessage());
        } catch (UnsupportedJwtException e) {
            throw new JwtException(ErrorCode.UNSUPPORTED_TOKEN.getMessage());
        } catch (IllegalArgumentException e) {
            throw new JwtException(ErrorCode.UNKNOWN_TOKEN.getMessage());
        }
    }

    /**
     * AccessToken 유효시간 가져오기 (로그아웃된 유저 블랙리스트 위함)
     * @param accessToken
     * @return
     */
    public Long getAccessExpiration(String accessToken) {
        Date expiration = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(accessToken)
                .getBody()
                .getExpiration();

        Date now = new Date();
        return expiration.getTime() - now.getTime();
    }

    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    // 사용자 유형 추출
    public String getUserType(String token) {
        Claims claims = parseClaims(token);
        return claims.get("userType", String.class); // JWT 토큰에서 사용자 유형을 추출
    }
}
