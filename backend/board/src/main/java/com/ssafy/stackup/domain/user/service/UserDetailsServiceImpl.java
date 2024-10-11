package com.ssafy.stackup.domain.user.service;

import com.ssafy.stackup.common.exception.CustomException;
import com.ssafy.stackup.common.response.ErrorCode;
import com.ssafy.stackup.domain.user.entity.User;
import com.ssafy.stackup.domain.user.entity.UserAdapter;
import com.ssafy.stackup.domain.user.repository.ClientRepository;
import com.ssafy.stackup.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @ 작성자   : 이병수
 * @ 작성일   : 2024-09-12
 * @ 설명 : UserDetailsService 구현체
 */
@RequiredArgsConstructor
@Service
@Slf4j
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;




    /**
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-12
     * @ 설명     : SecurityContextHolder에 저장할 유저 디테일 생성
     * @param
     * @return 유저 객체를 담고있는 Adapter
     */
    @Transactional
    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {

        User user = userRepository.findById(Long.parseLong(identifier)).orElseThrow(() ->
           new CustomException(ErrorCode.USER_NOT_FOUND));;



//        if(identifier.contains("@")){
//            user = clientRepository.findByEmail(identifier).orElseThrow(() ->
//            new CustomException(ErrorCode.USER_NOT_FOUND));
//        }
//        else{
//             user = userRepository.findById(Long.parseLong(identifier)).orElseThrow(() ->
//                    new CustomException(ErrorCode.USER_NOT_FOUND));
//        }


        return new UserAdapter(user);
    }
}
