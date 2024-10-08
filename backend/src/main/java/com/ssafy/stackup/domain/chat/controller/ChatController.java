package com.ssafy.stackup.domain.chat.controller;


import com.ssafy.stackup.common.response.ApiResponse;
import com.ssafy.stackup.domain.board.dto.BoardClientResponse;
import com.ssafy.stackup.domain.chat.dto.reqeust.ChatMessage;
import com.ssafy.stackup.domain.chat.dto.reqeust.ChatRoomStartRequestDto;
import com.ssafy.stackup.domain.chat.dto.response.ChatMessageResponse;
import com.ssafy.stackup.domain.chat.dto.response.ChatRoomInfoResponseDto;
import com.ssafy.stackup.domain.chat.dto.reqeust.ChatDto;
import com.ssafy.stackup.domain.chat.dto.response.ChatResponseDto;
import com.ssafy.stackup.domain.chat.entity.Chat;
import com.ssafy.stackup.domain.chat.service.ChatService;
import com.ssafy.stackup.domain.chat.service.ChatServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ChatController {
//    private final SimpMessagingTemplate template;
//    private final ChatService chatService;
//
//    @MessageMapping("/message")
//    public ResponseEntity<ApiResponse<ChatDto>> sendChat(@Payload ChatDto chatDto, @Header(name = "Authorization") String token) {
//        log.info("in");
//        template.convertAndSend("/sub/chatroom/" + chatDto.getChatroomId(), chatDto);
//        return ResponseEntity.status(HttpStatus.CREATED)
//                .body(ApiResponse.success(chatService.saveChat(chatDto,token.substring(7))));
//    }
//
//    @GetMapping("/chat/logs/{chatroomId}")
//    public ResponseEntity<ApiResponse<List<ChatResponseDto>>> getChatLogs(@PathVariable(name = "chatroomId") Long chatroomId) {
//        return ResponseEntity.status(HttpStatus.OK)
//                .body(ApiResponse.success(chatService.chatLogs(chatroomId)));
//    }
//
//    // 채팅시작하기 채팅방이 없으면 만들기
//    @PostMapping("/chatroom/start")
//    public ResponseEntity<ApiResponse<ChatRoomInfoResponseDto>> startChatRoom(@RequestBody ChatRoomStartRequestDto chatRoomStartRequestDto ) {
//        ChatRoomInfoResponseDto chatRoomInfoResponseDto =  chatService.startChatRoom(chatRoomStartRequestDto);
//        return ResponseEntity.status(HttpStatus.OK)
//                .body(ApiResponse.success(chatRoomInfoResponseDto));
//    }
//
//    /**
//     * 내가 참여하는 모든채팅방 가져오기
//     * @ 작성자   : 이병수
//     * @ 작성일   : 2024-09-25
//     * @ 설명     :
//
//     * @param userId
//     * @return
//     */
//    @GetMapping("/chatroom/{userId}")
//    public ResponseEntity<ApiResponse<List<ChatRoomInfoResponseDto>>> getChatRooms(@PathVariable Long userId) {
//            List<ChatRoomInfoResponseDto> chatRoomInfoResponseDtos=  chatService.getChatRooms(userId);
//            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(chatRoomInfoResponseDtos));
//    }

    @MessageMapping("/chatroom/send")
    @SendTo("/topic/chatroom") // 채팅방 ID에 따라 구독한 클라이언트에게 메시지 전송
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        return chatMessage; // 클라이언트에게 메시지를 그대로 반환
    }

    private final ChatServiceImpl chatService;
    // 메시지 저장 API
    @PostMapping("/chat/send")
    public Chat sendToMessage(@RequestBody ChatMessage chatMessage) {
        return chatService.saveMessage(chatMessage.getUserId(), chatMessage.getChatRoomId(), chatMessage.getMessage());
    }

//    return boards.stream()
//            .map(BoardClientResponse::new)
//                .collect(Collectors.toList());
    // 채팅 메시지 조회 API
    @GetMapping("/chat/room/{chatRoomId}")
    public List<ChatMessageResponse> getMessages(@PathVariable String chatRoomId) {
        List<Chat> chats = chatService.getMessages(chatRoomId);

        // 각 채팅 메시지를 출력
        for (Chat chat : chats) {
            System.out.println("Message: " + chat.getMessage());
        }

        return chats.stream()
                .map(ChatMessageResponse::new)
                .collect(Collectors.toList());
//        return response;
    }
}