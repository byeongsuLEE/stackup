package com.ssafy.stackup.domain.chat.service;


import com.ssafy.stackup.domain.chat.dto.reqeust.ChatDto;
import com.ssafy.stackup.domain.chat.dto.reqeust.ChatRoomStartRequestDto;
import com.ssafy.stackup.domain.chat.dto.response.ChatResponseDto;
import com.ssafy.stackup.domain.chat.dto.response.ChatRoomInfoResponseDto;

import java.util.List;

public interface ChatService {
    ChatDto saveChat(final ChatDto chatDto, final String token);
    List<ChatResponseDto> chatLogs(final Long ChannelId);

    ChatRoomInfoResponseDto startChatRoom(ChatRoomStartRequestDto chatRoomStartRequestDto);

    List<ChatRoomInfoResponseDto> getChatRooms(Long userId);
}
