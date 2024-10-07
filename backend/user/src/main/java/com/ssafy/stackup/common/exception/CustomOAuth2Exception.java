package com.ssafy.stackup.common.exception;
import com.ssafy.stackup.common.response.ErrorCode;
import lombok.Getter;
import org.springframework.security.core.AuthenticationException;
/**
 * 작성자   : user
 * 작성날짜 : 2024-09-09
 * 설명    :
 */
@Getter
public class CustomOAuth2Exception extends AuthenticationException {

    private final ErrorCode errorCode;

    public CustomOAuth2Exception(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public CustomOAuth2Exception(ErrorCode errorCode, Throwable cause) {
        super(errorCode.getMessage(), cause);
        this.errorCode = errorCode;
    }
}
