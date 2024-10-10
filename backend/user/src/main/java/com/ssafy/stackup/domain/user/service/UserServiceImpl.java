package com.ssafy.stackup.domain.user.service;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.stackup.common.exception.CustomException;
import com.ssafy.stackup.common.exception.ResourceNotFoundException;
import com.ssafy.stackup.common.jwt.TokenProvider;
import com.ssafy.stackup.common.response.ErrorCode;
import com.ssafy.stackup.common.util.RedisUtil;
import com.ssafy.stackup.common.util.UserUtil;
import com.ssafy.stackup.domain.framework.entity.Framework;
import com.ssafy.stackup.domain.framework.repository.FrameworkRepository;
import com.ssafy.stackup.domain.language.entity.Language;
import com.ssafy.stackup.domain.language.repository.LanguageRepository;
import com.ssafy.stackup.domain.user.dto.request.ClientLoginRequestDto;
import com.ssafy.stackup.domain.user.dto.request.ClientSignUpRequestDto;
import com.ssafy.stackup.domain.user.dto.request.FreelancerInfoRequestDto;
import com.ssafy.stackup.domain.user.dto.response.*;
import com.ssafy.stackup.domain.user.entity.*;
import com.ssafy.stackup.domain.user.repository.ClientRepository;
import com.ssafy.stackup.domain.user.repository.FreelancerRepository;
import com.ssafy.stackup.domain.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserServiceImpl implements UserService {
    private final SimpUserRegistry userRegistry;
    @Value("${default.image}")
    private String defaultImage;



    @Value("${publicDataPortal.api.url}")
    private String publicDataPortalApiUrl;

    @Value("${publicDataPortal.api.key}")
    private String publicDataPortalApiKey;


    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final FrameworkRepository frameworkRepository;
    private final LanguageRepository languageRepository;
    private final FreelancerRepository freelancerRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final AuthenticationManagerBuilder managerBuilder;
    private final TokenProvider tokenProvider;
    private final RedisUtil redisUtil;


    @Override
    @Transactional
    public FreelancerRegisterResponseDto registerInfo(FreelancerInfoRequestDto freelancerInfoRequestDto, User user) {

        Freelancer freelancer = freelancerRepository.findById(user.getId()).orElseThrow(
                () -> new CustomException(ErrorCode.USER_NOT_FOUND)
        );

        //언어와 프레임워크 만들기
        Set<FreelancerFramework> freelancerFrameworks = new HashSet<>();
        Set<FreelancerLanguage> freelancerLanguages = new HashSet<>();

        for (String frameworkName : freelancerInfoRequestDto.getFramework()) {
            Framework framework = frameworkRepository.findByName(frameworkName)
                    .orElseThrow(()->{ return new ResourceNotFoundException("해당 프레임워크 이름이 지정되지 않았습니다.");});

            FreelancerFramework freelancerFramework = FreelancerFramework.builder()
                    .freelancer(freelancer)
                    .framework(framework)
                    .build();
            freelancerFrameworks.add(freelancerFramework);

        }

        for (String languageName : freelancerInfoRequestDto.getLanguage()) {
            Language language = languageRepository.findByName(languageName)
                    .orElseThrow(()->{ throw new ResourceNotFoundException("해당 언어 이름이 지정되지 않았습니다.");});
            FreelancerLanguage freelancerLanguage = FreelancerLanguage.builder()
                    .freelancer(freelancer)
                    .language(language)
                    .build();
            freelancerLanguages.add(freelancerLanguage);
        }

        freelancer.updateName(freelancerInfoRequestDto.getName());
        freelancer.updateAddress(freelancerInfoRequestDto.getAddress());
        freelancer.updateEmail(freelancerInfoRequestDto.getEmail());
        freelancer.updateClassification(freelancerInfoRequestDto.getClassification());
        freelancer.updateCareerYear(freelancerInfoRequestDto.getCareerYear());
        freelancer.updatePhone(freelancerInfoRequestDto.getPhone());
        freelancer.updatePortfolioUrl(freelancerInfoRequestDto.getPortfolioUrl());
        freelancer.updateSelfIntroduction(freelancerInfoRequestDto.getSelfIntroduction());
        freelancer.updateFreelancerFrameworks(freelancerFrameworks);
        freelancer.updateFreelancerLanguages(freelancerLanguages);

        freelancerRepository.save(freelancer);

        FreelancerRegisterResponseDto freelancerRegisterResponseDto = FreelancerRegisterResponseDto.builder()
                .name(freelancer.getName())
                .email(freelancer.getEmail())
                .phone(freelancer.getPhone())
                .classification(freelancer.getClassification())
                .framework(freelancerInfoRequestDto.getFramework())
                .language(freelancerInfoRequestDto.getLanguage())
                .careerYear(freelancer.getCareerYear())
                .portfolioURL(freelancer.getPortfolioUrl())
                .selfIntroduction(freelancer.getSelfIntroduction())
                .build();

        return freelancerRegisterResponseDto;
    }

    @Override
    @Transactional
    public ClientResponseDto signUp(ClientSignUpRequestDto requestDto) {
        emailCheck(requestDto.getEmail());
        String encodedPassword = bCryptPasswordEncoder.encode(requestDto.getPassword());
        Client client = Client.builder()
                .name(requestDto.getName())
                .email(requestDto.getEmail())
                .password(encodedPassword)
                .roles(List.of("ROLE_CLIENT"))
                .phone(requestDto.getPhone())
                .businessName(requestDto.getBusinessName())
                .businessRegistrationNumber(requestDto.getBusinessRegistrationNumber())
                .totalScore(0.0)
                .reportedCount(0)
                .evaluatedCount(0)
                .build();


        Client savedClient = clientRepository.save(client);

        ClientResponseDto responseDto = ClientResponseDto.builder()
                .id(savedClient.getId())
                .email(savedClient.getEmail())
                .name(savedClient.getName())
                .businessRegistrationNumber(savedClient.getBusinessRegistrationNumber())
                .businessName(savedClient.getBusinessName())
                .phone(savedClient.getPhone())
                .build();

        return responseDto;
    }


    /**
     * 클라이언트 로그인 인증 후 토큰 발행
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-23
     * @ 설명     :
     * @param requestDto
     * @param response
     * @return
     */
    @Override
    @Transactional
    public LoginResponseDto login(ClientLoginRequestDto requestDto, HttpServletResponse response) {
        String userType = "client";
        Client user = clientRepository.findByEmail(requestDto.getEmail()).orElseThrow(
                () -> new CustomException(ErrorCode.USER_NOT_FOUND)
        );

        UsernamePasswordAuthenticationToken authenticationToken = new
                UsernamePasswordAuthenticationToken(String.valueOf(user.getId()), requestDto.getPassword());

        Authentication authentication = managerBuilder.getObject().authenticate(authenticationToken);

        TokenDto tokenDto = tokenProvider.generateToken(authentication,userType);
        tokenToHeader(tokenDto, response);

        redisUtil.setData(String.valueOf(user.getId()), tokenDto.refreshToken(), tokenDto.refreshTokenExpiresIn());
        LoginResponseDto responseDto = LoginResponseDto.builder()
                .id(user.getId())
                .userType(userType)
                .build();

        return responseDto;
    }


    @Override
    @Transactional(readOnly = true)
    public String logout(final HttpServletRequest request) {
        String token = tokenProvider.resolveToken(request); // 헤더에서 AccessToken 가져오기
        Authentication authentication = tokenProvider.getAuthentication(token); // 토큰 인증 후 페이로드에서 유저 정보 추출
        redisUtil.deleteData(authentication.getName()); // 해당 유저의 key 삭제
        Long accessExpiration = tokenProvider.getAccessExpiration(token);// AccessToken의 남은 시간 가져오기
        redisUtil.setData(token,"logout",accessExpiration); // 로그아웃을 하더라도 AccessToken의 시간이 남아있으면 인증이 가능하여 블랙리스트로 추가
        return "로그아웃 성공";
    }

    @Override
    @Transactional(readOnly = true)
    public void reissue(final HttpServletRequest request, final HttpServletResponse response) {
        String accessToken = tokenProvider.resolveToken(request);
        tokenProvider.validateToken(accessToken);
        Authentication authentication = tokenProvider.getAuthentication(accessToken);
        String refreshToken = redisUtil.getData(authentication.getName());

        if (refreshToken == null)
            throw new CustomException(ErrorCode.UNKNOWN_TOKEN);
        if (!Objects.equals(refreshToken, request.getHeader("refreshToken")))
            throw new CustomException(ErrorCode.WRONG_TYPE_TOKEN);
        String userType = tokenProvider.getUserType(accessToken);
        TokenDto tokenDto = tokenProvider.generateToken(authentication, userType);
        tokenToHeader(tokenDto, response);

        redisUtil.setData(authentication.getName(), tokenDto.refreshToken(), tokenDto.refreshTokenExpiresIn());


    }



    @Override
    @Transactional(readOnly = true)
    public Boolean emailCheck(String email) {
        Optional<Client> client = clientRepository.findByEmail(email);
        if(client.isPresent()) {
            throw new CustomException(ErrorCode.DUPLICATE_EMAIL);
        }
        return true;
    }


    /**
     * 해당 유저 신고 수 증가
     * @param userId 신고받은 유저 고유번호
     */
    @Transactional
    public void report(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        user.updateReportedCount(user.getReportedCount()+1);
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Double grade(User user) {
        User users = userRepository.findById(user.getId())
                .orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));

        return users.getTotalScore();
    }


    /**
     * 내 상세 정보 조회
     * @param user
     * @return
     */
    @Override
    @Transactional(readOnly = true)
    public UserInfoResponseDto getInfo(User user) {

        if(user.getRoles().contains("ROLE_FREELANCER")) {
            Freelancer freelancer = freelancerRepository.findById(user.getId()).orElseThrow(
                    () -> new CustomException(ErrorCode.USER_NOT_FOUND)
            );


            List<String> frameworks = UserUtil.getFrameworks(freelancer.getFrameworks());
            List<String> languages = UserUtil.getLanguages(freelancer.getLanguages());

            FreelancerResponseDto freelancerResponseDto =   FreelancerResponseDto.builder()
                    .id(freelancer.getId())
                    .roles(freelancer.getRoles())
                    .name(freelancer.getName())
                    .phone(freelancer.getPhone())
                    .email(freelancer.getEmail())
                    .secondPassword(freelancer.getSecondPassword())
                    .accountKey(freelancer.getAccountKey())
                    .mainAccount(freelancer.getMainAccount())
                    .totalScore(freelancer.getTotalScore())
                    .framework(frameworks)
                    .language(languages)
                    .careerYear(freelancer.getCareerYear())
                    .portfolioURL(freelancer.getPortfolioUrl())
                    .selfIntroduction(freelancer.getSelfIntroduction())
                    .classification(freelancer.getClassification())
                    .githubId(freelancer.getGithubId())
                    .address(freelancer.getAddress())
                    .userType("freelancer")
                    .userAddress(user.getUserAddress())
                    .evaluatedCount(user.getEvaluatedCount())
                    .publicKey(user.getPublicKey())
                    .secondPassword(user.getSecondPassword())
                    .reportedCount(user.getReportedCount())
                    .build();
            return freelancerResponseDto;


        }else{

            Client client = clientRepository.findById(user.getId())
                    .orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));

            ClientResponseDto clientResponseDto  = ClientResponseDto.builder()
                    .id(client.getId())
                    .roles(client.getRoles())
                    .name(client.getName())
                    .phone(client.getPhone())
                    .email(client.getEmail())
                    .secondPassword(client.getSecondPassword())
                    .accountKey(client.getAccountKey())
                    .businessRegistrationNumber(client.getBusinessRegistrationNumber())
                    .businessName(client.getBusinessName())
                    .reportedCount(client.getReportedCount())
                    .mainAccount(client.getMainAccount())
                    .totalScore(client.getTotalScore())
                    .userType("client")
                    .userAddress(user.getUserAddress())
                    .evaluatedCount(user.getEvaluatedCount())
                    .publicKey(user.getPublicKey())
                    .secondPassword(user.getSecondPassword())
                    .reportedCount(user.getReportedCount())
                    .build();

            return clientResponseDto;

        }

    }

    /**
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-19
     * @ 설명     : 소셜 로그인 성공 후 데이터 전송
     * @param userId 유저 아이디
     * @return
     */
    @Override
    public FreelancerLoginResponseDto token(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));


        Authentication authentication = tokenProvider.getAuthentication(redisUtil.getData(String.valueOf(userId)));
        TokenDto tokenDto = tokenProvider.generateToken(authentication, "freelancer");

        FreelancerLoginResponseDto freelancerLoginResponseDto =  FreelancerLoginResponseDto.builder()
                .accessToken(tokenDto.accessToken())
                .refreshToken(tokenDto.refreshToken())
                .userId(userId)
                .userType("freelancer")
                .build();

        return freelancerLoginResponseDto;
    }

    @Override
    public void setSecondPassword(UserInfoResponseDto userRequestInfo) {
        User user = userRepository.findById(userRequestInfo.getId())
                .orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));

        user.updateSecondPassword(userRequestInfo.getSecondPassword());
        userRepository.save(user);
    }

    @Override
    public UserInfoResponseDto getInfo(Long userId) {

        User user = userRepository.findById(userId).orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));


        if(user.getRoles().contains("ROLE_FREELANCER")) {
            Freelancer freelancer = freelancerRepository.findById(user.getId()).orElseThrow(
                    () -> new CustomException(ErrorCode.USER_NOT_FOUND)
            );


            List<String> frameworks = UserUtil.getFrameworks(freelancer.getFrameworks());
            List<String> languages = UserUtil.getLanguages(freelancer.getLanguages());

            FreelancerResponseDto freelancerResponseDto =   FreelancerResponseDto.builder()
                    .id(freelancer.getId())
                    .roles(freelancer.getRoles())
                    .name(freelancer.getName())
                    .phone(freelancer.getPhone())
                    .email(freelancer.getEmail())
                    .secondPassword(freelancer.getSecondPassword())
                    .accountKey(freelancer.getAccountKey())
                    .mainAccount(freelancer.getMainAccount())
                    .totalScore(freelancer.getTotalScore())
                    .framework(frameworks)
                    .language(languages)
                    .careerYear(freelancer.getCareerYear())
                    .portfolioURL(freelancer.getPortfolioUrl())
                    .selfIntroduction(freelancer.getSelfIntroduction())
                    .classification(freelancer.getClassification())
                    .githubId(freelancer.getGithubId())
                    .address(freelancer.getAddress())
                    .build();
            return freelancerResponseDto;


        }else{

            Client client = clientRepository.findById(user.getId())
                    .orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));

            System.out.println("메인계좌"+client.getMainAccount());
            System.out.println("유저 주소"+client.getUserAddress());

            ClientResponseDto clientResponseDto  = ClientResponseDto.builder()
                    .id(user.getId())
                    .roles(user.getRoles())
                    .name(user.getName())
                    .phone(user.getPhone())
                    .mainAccount(user.getMainAccount())
                    .userAddress(user.getUserAddress())
                    .email(user.getEmail())
                    .userAddress(user.getUserAddress())
                    .secondPassword(user.getSecondPassword())
                    .accountKey(user.getAccountKey())
                    .businessRegistrationNumber(client.getBusinessRegistrationNumber())
                    .businessName(client.getBusinessName())
                    .reportedCount(user.getReportedCount())
                    .totalScore(user.getTotalScore())
                    .build();

            return clientResponseDto;

        }

    }


    @Override
    public void setAddress(Long userId, String address) {
        User user = userRepository.findById(userId).orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));
        user.updateAddress(address);
        userRepository.save(user);

    }

    @Override
    public void setAccountKey(Long userId, String accountKey) {
        User user = userRepository.findById(userId).orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));
        user.updateAcountKey(accountKey);
        userRepository.save(user);
    }

    @Override
    public void setMainAccount(UserInfoResponseDto userRequestInfo) {
        User user = userRepository.findById(userRequestInfo.getId())
                .orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));

        user.updateMainAccount(userRequestInfo.getMainAccount());
        userRepository.save(user);
    }

    /**
     * @param tokenDto 로그인 시 발급한 토큰 데이터
     * @param response 토큰을 헤더에 추가하기 위한 servlet
     * @return
     * @ 설명     : 헤더에  Access,Refresh토큰 추가
     */
    private void tokenToHeader(TokenDto tokenDto, HttpServletResponse response) {
        response.addHeader("Authorization", tokenDto.accessToken());
        response.addHeader("refreshToken", tokenDto.refreshToken());
    }

    public String getUserAddress(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));
        String address = user.getUserAddress();
        return address;
    }



    public boolean checkBusinessNum(String businessNum) {

        String requestBody = "{ \"b_no\": [\"" + businessNum + "\"] }";

        // 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        try {
            // API 요청 보내기
            String requestUrl = publicDataPortalApiUrl + "?serviceKey=" + publicDataPortalApiKey;
            ResponseEntity<String> response = restTemplate.exchange(requestUrl, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                // JSON 파싱
                JsonNode root = objectMapper.readTree(response.getBody());

                // "data" 필드에서 사업자 상태 확인
                JsonNode dataNode = root.path("data").get(0);
                String statusMessage = dataNode.path("tax_type").asText();

                // "국세청에 등록되지 않은 사업자등록번호입니다." 라는 메시지가 있다면 false 반환
                if (statusMessage.contains("국세청에 등록되지 않은 사업자등록번호")) {
                    return false;
                }

                // 유효한 사업자등록번호인 경우 true 반환
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 기본적으로 false 반환
        return false;
    }

}
