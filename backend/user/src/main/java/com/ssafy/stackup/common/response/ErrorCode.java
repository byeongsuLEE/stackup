package com.ssafy.stackup.common.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum ErrorCode {
    USER_NOT_FOUND(HttpStatus.NOT_FOUND,"해당 유저를 찾을 수 없습니다."),
    DUPLICATE_NICKNAME(HttpStatus.CONFLICT,"이미 가입되어있는 닉네임입니다."),
    DUPLICATE_EMAIL(HttpStatus.CONFLICT,"이미 가입되어있는 이메일입니다."),
    DUPLICATE_PHONE_NUMBER(HttpStatus.CONFLICT,"이미 가입되어있는 전화번호입니다."),
    CHANNEL_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 채널입니다."),
    CHANNEL_FULL(HttpStatus.FORBIDDEN, "채널 인원이 가득찼습니다."),
    SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "일시적인 오류가 발생했습니다"),
    BLACK_LIST_TOKEN(HttpStatus.FORBIDDEN,"로그아웃 된 유저입니다."),
    UNKNOWN_TOKEN(HttpStatus.BAD_REQUEST, "토큰이 존재하지 않습니다."),
    WRONG_TYPE_TOKEN(HttpStatus.UNAUTHORIZED, "잘못된 타입의 토큰입니다."),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "만료된 토큰입니다."),
    UNSUPPORTED_TOKEN(HttpStatus.FORBIDDEN, "지원되지 않는 토큰입니다."),
    PLAN_NOT_FOUND(HttpStatus.NOT_FOUND,"일정을 찾을 수 없습니다."),
    DUPLICATE_PIN_ORDER(HttpStatus.CONFLICT,"핀 번호가 중복되었습니다."),
    NOT_FOUND_MAP_PIN(HttpStatus.NOT_FOUND,"핀 번호를 찾을 수 없습니다."),
    PERMISSION_DENIED(HttpStatus.FORBIDDEN,"해당 작업을 수행할 권한이 없습니다."),
    AUTHENTICATION_ERROR(HttpStatus.UNAUTHORIZED, "인증에 실패했습니다."),
    FEED_NOT_FOUND(HttpStatus.NOT_FOUND,"피드를 찾을 수 없습니다."),
    EXPIRED_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED,"재 로그인이 필요합니다."),
    ALREADY_EXIST_WORCATION(HttpStatus.CONFLICT, "진행중인 워케이션이 있습니다."),
    FILE_TOO_LARGE(HttpStatus.PAYLOAD_TOO_LARGE,"파일의 최대용량이 초과되었습니다."),
    CHANNEL_LIMIT_EXCEED(HttpStatus.FORBIDDEN, "채널 인원이 가득 찼습니다."),
    EMAIL_OR_PASSWORD_UNMATCH(HttpStatus.BAD_REQUEST,"이메일 또는 비밀번호가 일치하지 않습니다."),
    ALREADY_FOLLOWING(HttpStatus.BAD_REQUEST,"이미 팔로우중인 채널입니다."),
    NOT_FOLLOWING(HttpStatus.BAD_REQUEST,"팔로우 하지 않는 채널입니다."),
    SELF_FOLLOWING(HttpStatus.BAD_REQUEST,"자기를 팔로우할수는 없습니다."),
    IOEXCEPTION(HttpStatus.BAD_REQUEST,"IOEXCEPTION 발생"),
    BAD_WORD(HttpStatus.BAD_REQUEST,"비속어를 사용할 수 없습니다."),
    NO_CONTENT(HttpStatus.NO_CONTENT, "빈 값을 넣었습니다. 다시 입력해주세요"),
    OAUTH2_USER_NOT_FOUND(HttpStatus.UNAUTHORIZED,"OAuth2 인증 과정에서 사용자 정보를 불러오지 못했습니다."),
    BOARD_NOT_FOUND(HttpStatus.NOT_FOUND,"해당 모집 게시글을 찾을 수 없습니다."),
    CLIENT_NOT_FOUND(HttpStatus.NOT_FOUND,"해당 클라이언트를 찾을 수 없습니다."),
    PROJECT_NOT_FOUND(HttpStatus.NOT_FOUND,"진행중인 해당 프로젝트를 찾을 수 없습니다."),
    ADDRESS_NOT_REGISTER(HttpStatus.NOT_FOUND," 회원의 전자지갑이 등록되지 않았습니다."),
    PROJECT_ALREADY_EXISTS(HttpStatus.CONFLICT,"해당 모집 게시글에 해당 프로젝트가 이미 존재합니다" );
    private HttpStatus status;
    private String message;
}
