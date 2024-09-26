package com.ssafy.stackup.domain.user.entity;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
public class UserAdapter extends org.springframework.security.core.userdetails.User implements OAuth2User {
    private final User user;

    public UserAdapter(User user) {
        // 공통 ID를 username으로 사용, password는 Client만 설정하고, Freelancer는 의미 없는 값 사용
        super(String.valueOf(user.getId()),                      // 공통 ID를 username으로 사용
                user instanceof Client ? ((Client) user).getPassword() : "", // Client는 실제 password 사용, Freelancer는 의미 없는 값 사용
                authorities(user.getRoles()));                     // 권한 설정
        this.user = user;
    }

    // 권한 목록 생성
    private static Collection<? extends GrantedAuthority> authorities(List<String> roles) {
        return roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getAttributes() {
        return Map.of(
                "id", user.getId(),             // 공통 UserRepository ID
                "email", user.getEmail(),       // 공통 Email
                "name", user.getName()          // 공통 Name
                // 필요한 다른 공통 필드들...
        );
    }

    @Override
    public String getName() {
        return String.valueOf(user.getId()); // 공통 ID를 name으로 사용
    }
}
