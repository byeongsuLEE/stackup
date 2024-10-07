package com.ssafy.stackup.domain.chat.controller;


import com.ssafy.stackup.common.response.ApiResponse;
import com.ssafy.stackup.domain.chat.dto.reqeust.ChatRoomStartRequestDto;
import com.ssafy.stackup.domain.chat.dto.response.ChatRoomInfoResponseDto;
import com.ssafy.stackup.domain.chat.dto.reqeust.ChatDto;
import com.ssafy.stackup.domain.chat.dto.response.ChatResponseDto;
import com.ssafy.stackup.domain.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ChatController {
    private final SimpMessagingTemplate template;
    private final ChatService chatService;

    @MessageMapping("/message")
    public ResponseEntity<ApiResponse<ChatDto>> sendChat(@Payload ChatDto chatDto, @Header(name = "Authorization") String token) {
        log.info("in");
        template.convertAndSend("/sub/chatroom/" + chatDto.getChatroomId(), chatDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(chatService.saveChat(chatDto,token.substring(7))));
    }

    @GetMapping("/chat/logs/{chatroomId}")
    public ResponseEntity<ApiResponse<List<ChatResponseDto>>> getChatLogs(@PathVariable(name = "chatroomId") Long chatroomId) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success(chatService.chatLogs(chatroomId)));
    }

    // 채팅시작하기 채팅방이 없으면 만들기
    @PostMapping("/chatroom/start")
    public ResponseEntity<ApiResponse<ChatRoomInfoResponseDto>> startChatRoom(@RequestBody ChatRoomStartRequestDto chatRoomStartRequestDto ) {
        ChatRoomInfoResponseDto chatRoomInfoResponseDto =  chatService.startChatRoom(chatRoomStartRequestDto);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success(chatRoomInfoResponseDto));
    }

    /**
     * 내가 참여하는 모든채팅방 가져오기
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-25
     * @ 설명     :

     * @param userId
     * @return
     */
    @GetMapping("/chatroom/{userId}")
    public ResponseEntity<ApiResponse<List<ChatRoomInfoResponseDto>>> getChatRooms(@PathVariable Long userId) {
            List<ChatRoomInfoResponseDto> chatRoomInfoResponseDtos=  chatService.getChatRooms(userId);
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(chatRoomInfoResponseDtos));
    }
}