package com.ssafy.stackup.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfiguration {
    @Value("${spring.data.redis.host}")
    private String redisHost;
    @Value("${spring.data.redis.port}")
    private int redisPort;
    @Value("${spring.data.redis.password}")
    private String redisPassword;



    /*
      RedisConnectionFactory 인터페이스를 통해
      LettuceConnectionFactory를 생성하여 반환
   */
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        RedisConnectionFactory factory = new LettuceConnectionFactory();
        // RedisStandaloneConfiguration을 사용하여 호스트, 포트, 패스워드를 설정
        RedisStandaloneConfiguration redisConfig = new RedisStandaloneConfiguration();
        redisConfig.setHostName(redisHost);
        redisConfig.setPort(redisPort);
        redisConfig.setPassword(redisPassword); // 패스워드 설정

        return new LettuceConnectionFactory(redisConfig);

    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate() {
        // redisTemplate를 받아와서 set, get, delete를 사용
        RedisTemplate<String,Object> redisTemplate = new RedisTemplate<>();

        /**
         * setKeySerializer, setValueSerializer 설정
         * redis-cli을 통해 직접 데이터를 조회 시 알아볼 수 없는 형태로 출력되는 것을 방지
         */
        redisTemplate.setConnectionFactory(redisConnectionFactory());
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new StringRedisSerializer());
        return redisTemplate;
    }
}
