package com.ssafy.stackup.common.oauth2.dto;

/**
 * 작성자   : user
 * 작성날짜 : 2024-09-09
 * 설명    :
 */
public interface Oauth2Response {
    //제공자 (Ex. naver, google, ...)
    String getProvider();
    //제공자에서 발급해주는 아이디(번호)
    String getProviderId();
    //이메일
    String getEmail();
    //사용자 실명 (설정한 이름)
    String getName();
}
