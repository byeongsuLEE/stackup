package com.ssafy.stackup.domain.chat.controller;


import com.ssafy.stackup.domain.chat.dto.reqeust.ChatMessage;
import com.ssafy.stackup.domain.chat.dto.response.ChatMessageResponse;
import com.ssafy.stackup.domain.chat.entity.Chat;
import com.ssafy.stackup.domain.chat.service.ChatServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    @MessageMapping("/user/chatroom/send")
    @SendTo("/topic/chatroom") // 채팅방 ID에 따라 구독한 클라이언트에게 메시지 전송
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        return chatMessage; // 클라이언트에게 메시지를 그대로 반환
    }

    private final ChatServiceImpl chatService;
    // 메시지 저장 API
    @PostMapping("/user/chat/send")
    public Chat sendToMessage(@RequestBody ChatMessage chatMessage) {
        return chatService.saveMessage(chatMessage.getUserId(), chatMessage.getChatRoomId(), chatMessage.getMessage(), chatMessage.getRegistTime());
    }

    // 채팅 메시지 조회 API
    @GetMapping("/user/chat/room/{chatRoomId}")
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