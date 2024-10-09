package com.ssafy.stackup.domain.chat.dto.reqeust;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatDto {
    private Long chatroomId;
    private Long sendId;
    private Long receiverId;
    private LocalDateTime registTime;
    private String message;
}
