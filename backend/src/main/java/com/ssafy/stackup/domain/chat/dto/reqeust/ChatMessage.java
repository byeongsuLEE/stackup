package com.ssafy.stackup.domain.chat.dto.reqeust;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatMessage {
    private Long userId;
    private String message;
    private String chatRoomId;
    private LocalDateTime registTime;
}
