package com.ssafy.stackup.domain.chat.service;


import com.ssafy.stackup.common.exception.CustomException;
import com.ssafy.stackup.common.jwt.TokenProvider;
import com.ssafy.stackup.common.response.ErrorCode;
import com.ssafy.stackup.domain.chat.dto.reqeust.ChatDto;
import com.ssafy.stackup.domain.chat.dto.response.ChatResponseDto;
import com.ssafy.stackup.domain.chat.entity.Chat;
import com.ssafy.stackup.domain.chat.entity.ChatRoom;
import com.ssafy.stackup.domain.chat.repository.ChatRepository;
import com.ssafy.stackup.domain.chat.repository.ChatRoomRepository;
import com.ssafy.stackup.domain.user.entity.User;
import com.ssafy.stackup.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatServiceImpl implements ChatService{
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final TokenProvider tokenProvider;
    private final ChatRoomRepository chatRoomRepository;

    /**
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-15
     * @ 설명     : 전송한 채팅 저장
     * @param chatDto 채팅 데이터
     * @param token 헤더에 들어있는 액세스 토큰 (유저 정보)
     * @return
     * @status 성공 : 201 , 실패 : 401, 404
     */
    @Override
    @Transactional
    public ChatDto saveChat(final ChatDto chatDto, final String token) {
        Authentication authentication = tokenProvider.getAuthentication(token);
        User userOpt = userRepository.findById(Long.parseLong(authentication.getName())).orElseThrow(
                () -> new CustomException(ErrorCode.USER_NOT_FOUND)
        );
        ChatRoom chatRoom = channelValidate(chatDto.getChannelId());

        Chat chat = Chat.builder()
                .user(userOpt)
                .chatRoom(chatRoom)
                .content(chatDto.getMessage())
                .build();

        chatRepository.save(chat);

        return chatDto;
    }

    /**
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-15
     * @ 설명     : 채팅방에 해당되는 이전 채팅 로그 가져오기
     * @param channelId 채널 식별 아이디
     * @return 채팅 로그 리스트
     * @status 성공 : 200, 실패 : 404
     */
    @Override
    @Transactional(readOnly = true)
    public List<ChatResponseDto> chatLogs(final Long channelId) {
        ChatRoom chatRoom = channelValidate(channelId);
        List<Chat> chatLogs = chatRepository.findByChatRoomId(chatRoom.getId());

        List<ChatResponseDto> chatResponseDtoList = chatLogs.stream()
                .map(chatLog -> ChatResponseDto.builder()
                        .userId(chatLog.getUser().getId())
                        .name(chatLog.getUser().getName())
                        .message(chatLog.getContent())
                        .registTime(chatLog.getRegistTime())
                        .build())
                .collect(Collectors.toList());

        return chatResponseDtoList;
    }

    /**
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-15
     * @ 설명     : 데이터베이스에 존재하는 채널인지 검증
     * @param channelId 채널 식별 아이디
     * @return 채팅 로그 리스트
     * @status 실패 : 404
     */
    private ChatRoom channelValidate(Long channelId) {
        ChatRoom chatRoom = chatRoomRepository.findById(channelId).orElseGet(null);
        if(chatRoom == null) {
            throw new CustomException(ErrorCode.CHANNEL_NOT_FOUND);
        }
        return chatRoom;
    }
}
