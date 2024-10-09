package com.ssafy.stackup.domain.chat.service;


import com.ssafy.stackup.common.exception.CustomException;
import com.ssafy.stackup.common.jwt.TokenProvider;
import com.ssafy.stackup.common.response.ErrorCode;
import com.ssafy.stackup.domain.chat.dto.reqeust.ChatDto;
import com.ssafy.stackup.domain.chat.dto.reqeust.ChatRoomStartRequestDto;
import com.ssafy.stackup.domain.chat.dto.response.ChatResponseDto;
import com.ssafy.stackup.domain.chat.dto.response.ChatRoomInfoResponseDto;
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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatServiceImpl implements ChatService {
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final TokenProvider tokenProvider;
    private final ChatRoomRepository chatRoomRepository;

    // 메시지 저장
    public Chat saveMessage(Long userId, String chatRoomId, String message, LocalDateTime registTime) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found")); // 사용자 존재 여부 체크

        Chat chat = Chat.builder()
                .user(user)
                .message(message)
                .registTime(registTime)
                .chatRoomId(chatRoomId) // chatRoomId를 직접 저장하기 위해 필요
                .build();

        System.out.println(userId + chatRoomId + message);

        return chatRepository.save(chat);
    }

    // 채팅 메시지 조회
    public List<Chat> getMessages(String chatRoomId) {
        return chatRepository.findByChatRoomId(chatRoomId);
    }

    /**
     * @param chatDto 채팅 데이터
     * @param token   헤더에 들어있는 액세스 토큰 (유저 정보)
     * @return
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-15
     * @ 설명     : 전송한 채팅 저장
     * @status 성공 : 201 , 실패 : 401, 404
     */
    @Override
    @Transactional
    public ChatDto saveChat(final ChatDto chatDto, final String token) {
        Authentication authentication = tokenProvider.getAuthentication(token);
        User userOpt = userRepository.findById(Long.parseLong(authentication.getName())).orElseThrow(
                () -> new CustomException(ErrorCode.USER_NOT_FOUND)
        );
        ChatRoom chatRoom = channelValidate(chatDto.getChatroomId());

        Chat chat = Chat.builder()
                .user(userOpt)
                .chatRoom(chatRoom)
                .message(chatDto.getMessage())
                .registTime(chatDto.getRegistTime())
                .build();

        chatRepository.save(chat);

        return chatDto;
    }

    /**
     * @param chatroomId 채널 식별 아이디
     * @return 채팅 로그 리스트
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-15
     * @ 설명     : 채팅방에 해당되는 이전 채팅 로그 가져오기
     * @status 성공 : 200, 실패 : 404
     */
    @Override
    @Transactional(readOnly = true)
    public List<ChatResponseDto> chatLogs(final Long chatroomId) {
        ChatRoom chatRoom = channelValidate(chatroomId);
        List<Chat> chatLogs = chatRepository.findByChatRoomId(chatRoom.getId().toString());

        List<ChatResponseDto> chatResponseDtoList = chatLogs.stream()
                .map(chatLog -> ChatResponseDto.builder()
                        .userId(chatLog.getUser().getId())
                        .name(chatLog.getUser().getName())
                        .message(chatLog.getMessage())
                        .registTime(chatLog.getRegistTime())
                        .build())
                .collect(Collectors.toList());

        return chatResponseDtoList;
    }

    @Override
    public ChatRoomInfoResponseDto startChatRoom(ChatRoomStartRequestDto chatRoomStartRequestDto) {

            Long clientId = chatRoomStartRequestDto.getClientId();
            Long freelancerId = chatRoomStartRequestDto.getFreelancerId();

            ChatRoom chatRoom = null;
            Optional<ChatRoom> optionalChatRoom = chatRoomRepository.findByClientIdAndFreelancerId(clientId, freelancerId);
            if (optionalChatRoom.isPresent()) {
                chatRoom = optionalChatRoom.get();

                // Chat 엔티티를 ChatDto로 변환
                List<ChatDto> chatDtoList = chatRoom.getChats().stream()
                        .map(chat -> ChatDto.builder()
                                .chatroomId(chat.getId())
                                .receiverId(chat.getUser().getId())
                                .message(chat.getMessage())
                                .registTime(chat.getRegistTime())
                                .build())
                        .collect(Collectors.toList());

                ChatRoomInfoResponseDto response = ChatRoomInfoResponseDto.builder()
                        .chatRoomId(chatRoom.getId())
                        .clientId(clientId)
                        .freelancerId(freelancerId)
                        .chats(chatDtoList)
                        .previewChat("")
                        .build();
                return response;
            }

            User client = userRepository.findById(clientId).orElseThrow(()->new CustomException(ErrorCode.USER_NOT_FOUND));
            User freelancer = userRepository.findById(freelancerId).orElseThrow(()->new CustomException(ErrorCode.USER_NOT_FOUND));

            chatRoom= chatRoom.builder()
                    .chats(new ArrayList<>())
                    .client(client)
                    .freelancer(freelancer)
                    .build();

            chatRoom = chatRoomRepository.save(chatRoom);


            return ChatRoomInfoResponseDto.builder()
                    .chatRoomId(chatRoom.getId())
                    .clientId(clientId)
                    .freelancerId(freelancerId)
                    .chats(null)
                    .previewChat("")
                    .build();
        }


    /**
     * 해당 유저의 모든 채팅방 가져오기
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-25
     * @ 설명     :모든 채팅방 가져오기
     * @param userId
     * @return\
     */
    @Override
    public List<ChatRoomInfoResponseDto> getChatRooms(Long userId) {

        List<ChatRoomInfoResponseDto> chatRoomListResponse = new ArrayList<>();
        List<ChatRoom> chatRoomList = chatRoomRepository.findAllByFreelancerIdOrClientId(userId, userId).orElse(null);





        for(ChatRoom chatRoom : chatRoomList) {

            // Chat 엔티티를 ChatDto로 변환
            List<ChatDto> chatDtoList = chatRoom.getChats().stream()
                    .map(chat -> ChatDto.builder()
                            .chatroomId(chat.getId())
                            .receiverId(chat.getUser().getId())
                            .message(chat.getMessage())
                            .registTime(chat.getRegistTime())
                            .build())
                    .collect(Collectors.toList());

            ChatRoomInfoResponseDto chatRoomInfoResponseDto = ChatRoomInfoResponseDto.builder()
                    .chatRoomId(chatRoom.getId())
                    .chats(chatDtoList)
                    .clientId(chatRoom.getClient().getId())
                    .freelancerId(chatRoom.getFreelancer().getId())
                    .build();
            chatRoomInfoResponseDto.setPreviewChat();
            chatRoomListResponse.add(chatRoomInfoResponseDto);
        }




        return chatRoomListResponse;
    }


    /**
     * @param channelId 채널 식별 아이디
     * @return 채팅 로그 리스트
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-15
     * @ 설명     : 데이터베이스에 존재하는 채널인지 검증
     * @status 실패 : 404
     */
    private ChatRoom channelValidate(Long channelId) {
        ChatRoom chatRoom = chatRoomRepository.findById(channelId).orElseGet(null);
        if (chatRoom == null) {
            throw new CustomException(ErrorCode.CHANNEL_NOT_FOUND);
        }
        return chatRoom;
    }
}
