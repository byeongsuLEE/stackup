package com.ssafy.stackup.domain.chat.repository;


import com.ssafy.stackup.domain.chat.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findByChatRoomId(Long chatRoomId);

}
