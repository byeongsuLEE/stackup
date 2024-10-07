package com.ssafy.stackup.domain.chat.dto.reqeust;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class ChatDto {
    private Long chatroomId;
    private Long sendId;
    private Long receiverId;
    private LocalDateTime registTime;
    private String message;
}
