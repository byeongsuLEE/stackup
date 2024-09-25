package com.ssafy.stackup.domain.user.controller;

import com.ssafy.stackup.common.jwt.TokenProvider;
import com.ssafy.stackup.common.response.ApiResponse;
import com.ssafy.stackup.common.util.RedisUtil;
import com.ssafy.stackup.domain.user.dto.response.*;
import com.ssafy.stackup.domain.user.dto.request.ClientLoginRequestDto;
import com.ssafy.stackup.domain.user.dto.request.ClientSignUpRequestDto;
import com.ssafy.stackup.domain.user.dto.request.FreelancerInfoRequestDto;
import com.ssafy.stackup.domain.user.entity.AuthUser;
import com.ssafy.stackup.domain.user.entity.User;
import com.ssafy.stackup.domain.user.repository.UserRepository;
import com.ssafy.stackup.domain.user.service.UserServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserServiceImpl userService;
    private final UserRepository userRepository;
    private final RedisUtil redisUtil;
    private final TokenProvider tokenProvider;


    @PostMapping("/client/signup")
    ResponseEntity<ApiResponse<ClientResponseDto>> signup(@RequestBody ClientSignUpRequestDto clientSignUpRequestDto){
        ClientResponseDto clientResponseDto = userService.signUp(clientSignUpRequestDto);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(clientResponseDto));
    }

    @PostMapping("/info")
    ResponseEntity<ApiResponse<FreelancerRegisterResponseDto>> registerInfo(@RequestBody FreelancerInfoRequestDto freelancerInfoRequestDto, @AuthUser User user) {
        FreelancerRegisterResponseDto freelancerRegisterResponseDto = userService.registerInfo(freelancerInfoRequestDto, user);
        //추천 프로젝트 업데이트 함수 실행 추가해야합니다

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success(freelancerRegisterResponseDto));
    }

    @GetMapping("/info")
    ResponseEntity<ApiResponse<?>> getInfo(@AuthUser User user) {
        UserInfoResponseDto userInfoResponseDto=   userService.getInfo(user);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success(userInfoResponseDto));
    }


    @GetMapping("/check/{email}")
    public ResponseEntity<ApiResponse<String>> checkEmail(@PathVariable String email){
        userService.emailCheck(email);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success("사용가능한 이메일 입니다"));
    }


    @PostMapping("/reissue")
    public ResponseEntity<ApiResponse<String>> reissue(HttpServletRequest request, HttpServletResponse response) {
         userService.reissue(request,response);
         return ResponseEntity.status(HttpStatus.OK)
                 .body(ApiResponse.success("토큰 재발급 성공"));
    }

    @PostMapping("client/login")
    public ResponseEntity<ApiResponse<LoginResponseDto>> login(@Valid @RequestBody ClientLoginRequestDto clientLoginRequstDto, HttpServletResponse response) {

        LoginResponseDto clientLoginResponseDto = userService.login(clientLoginRequstDto, response);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(clientLoginResponseDto));

    }

    @PatchMapping("/report/{userId}")
    public ResponseEntity<ApiResponse<String>> report(@PathVariable Long userId){

        userService.report(userId);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success("신고 완료 되었습니다"));
    }

    @GetMapping("/grade")
    public ResponseEntity<ApiResponse<Double>> grade (@AuthUser User user){
        Double gradeScore = userService.grade(user);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(gradeScore));
    }


    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(HttpServletRequest request) {
        userService.logout(request);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success("로그아웃"));

    }

    @GetMapping("/token")
    public ResponseEntity<ApiResponse<FreelancerLoginResponseDto>> successLogin(@RequestParam("userId") Long userId){
        FreelancerLoginResponseDto freelancerLoginDto= userService.token(userId);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(freelancerLoginDto, "로그인에 성공하셨습니다"));
    }

    @GetMapping("/check/{businessNum}")
    public ResponseEntity<ApiResponse<Boolean>> checkBusinessNum(@PathVariable String businessNum){
         boolean isValidBusinessNum =  userService.checkBusinessNum(businessNum);
         if(isValidBusinessNum){
             return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(isValidBusinessNum));
         }
         else {
             return ResponseEntity.badRequest().body(ApiResponse.error(HttpStatus.BAD_REQUEST,isValidBusinessNum,"등록되지않은 사업자번호입니다."));
         }

    }








}