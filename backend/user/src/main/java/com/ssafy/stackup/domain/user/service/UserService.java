package com.ssafy.stackup.domain.user.service;


import com.ssafy.stackup.domain.user.dto.request.ClientLoginRequestDto;
import com.ssafy.stackup.domain.user.dto.request.ClientSignUpRequestDto;
import com.ssafy.stackup.domain.user.dto.request.FreelancerInfoRequestDto;
import com.ssafy.stackup.domain.user.dto.response.*;
import com.ssafy.stackup.domain.user.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

public interface UserService {

    FreelancerRegisterResponseDto registerInfo(FreelancerInfoRequestDto freelancerInfoRequestDto, User user);

    ClientResponseDto signUp(@Valid final ClientSignUpRequestDto requestDto);

    LoginResponseDto login(@Valid final ClientLoginRequestDto loginRequestDto, HttpServletResponse response);

    String logout(final HttpServletRequest request);

    void reissue(final HttpServletRequest request, final HttpServletResponse response);

    Boolean emailCheck(String email);

    void report(Long userId);

    Double grade(User user);

    UserInfoResponseDto getInfo(User user);

    FreelancerLoginResponseDto token(Long user);

    void setSecondPassword(UserInfoResponseDto userRequestInfo);

    UserInfoResponseDto getInfo(Long userId);

    void setAddress(Long userId, String address);

    void setAccountKey(Long userId, String accountKey);

    void setMainAccount(UserInfoResponseDto userRequestInfo);
}
