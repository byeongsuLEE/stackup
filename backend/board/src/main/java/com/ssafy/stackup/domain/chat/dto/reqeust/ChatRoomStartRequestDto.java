package com.ssafy.stackup.domain.chat.dto.reqeust;


import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ChatRoomStartRequestDto {
    private Long clientId;
    private Long freelancerId;
}
