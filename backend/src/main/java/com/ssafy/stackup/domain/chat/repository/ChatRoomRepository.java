package com.ssafy.stackup.domain.chat.repository;


import com.ssafy.stackup.domain.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom,Long> {
    
        Optional<ChatRoom> findByClientIdAndFreelancerId(Long clientId, Long freelancerId);

        Optional<List<ChatRoom>> findAllByFreelancerIdOrClientId(Long freelancerId, Long clientId);
}
