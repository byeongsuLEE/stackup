package com.ssafy.stackup.domain.chat.controller;


import com.ssafy.stackup.common.response.ApiResponse;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ChatController {
    private final SimpMessagingTemplate template;
    private final ChatService chatService;

    @MessageMapping("/message")
    public ResponseEntity<ApiResponse<ChatDto>> sendChat(@Payload ChatDto chatDto, @Header(name = "Authorization") String token) {
        template.convertAndSend("/sub/chatroom/" + chatDto.getChannelId(), chatDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(chatService.saveChat(chatDto,token.substring(7))));
    }

    @GetMapping("/chat/logs/{channelId}")
    public ResponseEntity<ApiResponse<List<ChatResponseDto>>> getChatLogs(@PathVariable(name = "channelId") Long channelId) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success(chatService.chatLogs(channelId)));
    }
}