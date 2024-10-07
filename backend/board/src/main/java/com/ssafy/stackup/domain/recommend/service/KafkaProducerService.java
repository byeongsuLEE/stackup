package com.ssafy.stackup.domain.recommend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void sendDescription(String description) {
        kafkaTemplate.send("description-topic", description);
    }
}
