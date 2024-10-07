package com.ssafy.stackup.common.util;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.concurrent.TimeUnit;

@Repository
@RequiredArgsConstructor
public class RedisUtil {
    private final RedisTemplate<String,Object> redisTemplate;

    /**
     * 키, 값, TTL 시간 설정하여 삽입
     * @param key
     * @param value
     * @param expiredTime
     */
    public void setData(String key, String value, Long expiredTime) {
        redisTemplate.opsForValue()
                .set(key, value, expiredTime, TimeUnit.MILLISECONDS);
    }

    /**
     * 키에대한 값 가져오기
     * @param key
     * @return
     */
    public String getData(String key) {
        return (String) redisTemplate.opsForValue()
                .get(key);
    }

    /**
     * 키 삭제
     * @param key
     */
    public void deleteData(String key) {
        redisTemplate.delete(key);
    }

    /**
     * 현재 생성되어있는 키에 값 추가하기
     * @param key
     * @param value
     */
    public void appendData(String key, String value) {
        redisTemplate.opsForValue()
                .append(key, value);
    }


}