package com.ssafy.stackup.common.oauth2.dto;

import lombok.Getter;

import java.util.Map;

/**
 * 작성자   : user
 * 작성날짜 : 2024-09-09
 * 설명    :
 */
@Getter
public class GitHubResponse implements Oauth2Response{

    private final Map<String, Object> attribute;

    public GitHubResponse(Map<String, Object> attribute) {
        this.attribute = attribute;
    }

    public String getId() {
        return attribute.get("login").toString();
    }

    public String getProfileUrl() {
        return attribute.get("html_url").toString();  // GitHub 프로필 URL
    }

    @Override
    public String getProvider() {
        return "github";
    }

    @Override
    public String getProviderId() {
        return attribute.get("id").toString();
    }

    @Override
    public String getEmail() {
        // GitHub에서는 email 필드가 private 설정일 수 있으므로, 해당 필드가 없을 경우 예외 처리 필요
        return attribute.get("email") != null ? attribute.get("email").toString() : "email_not_provided";
    }

    @Override
    public String getName() {
        return attribute.get("name") != null ? attribute.get("name").toString() : attribute.get("login").toString();
    }
}
