package com.example.llmn.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisService {

    private final StringRedisTemplate redisTemplate;

    public void storeValue(String type, String id, String value, Long expirationTime) {
        redisTemplate.opsForValue().set(buildKey(type, id), value, expirationTime, TimeUnit.MILLISECONDS);
    }

    public void storeValue(String type, String value, Long expirationTime) {
        redisTemplate.opsForValue().set(type, value, expirationTime, TimeUnit.MILLISECONDS);
    }

    public void storeValue(String key, String value) {
        redisTemplate.opsForValue().set(key, value);
    }

    public void addSetElement(String key, Long value) {
        SetOperations<String, String> setOps = redisTemplate.opsForSet();
        setOps.add(key, String.valueOf(value));
    }

    public void addSetElement(String key, String value) {
        SetOperations<String, String> setOps = redisTemplate.opsForSet();
        setOps.add(key, value);
    }

    public void addSetElement(String key, Long value, Long expirationTime) {
        SetOperations<String, String> setOps = redisTemplate.opsForSet();
        setOps.add(key, String.valueOf(value));
        redisTemplate.expire(key, expirationTime, TimeUnit.SECONDS);
    }

    public Set<String> getAllElement(String key) {
        SetOperations<String, String> setOps = redisTemplate.opsForSet();
        return setOps.members(key);
    }

    public void addListElementWithLimit(String key, String value, Long limit) {
        ListOperations<String, String> listOps = redisTemplate.opsForList();
        listOps.leftPush(key, value);

        while (listOps.size(key) > limit) {
            listOps.rightPop(key);
        }
    }

    public void deleteListElement(String key, String value){
        ListOperations<String, String> listOps = redisTemplate.opsForList();
        listOps.remove(key, 0, value);
    }

    public void setExpireDate(String type, String id, Long expirationTime){
        redisTemplate.expire(buildKey(type, id), expirationTime, TimeUnit.MILLISECONDS);
    }

    public boolean isDateExist(String type, String id) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(buildKey(type, id)));
    }

    public boolean isSetElementExists(String key, String value) {
        SetOperations<String, String> setOps = redisTemplate.opsForSet();
        return Boolean.TRUE.equals(setOps.isMember(key, value));
    }

    public boolean validateData(String type, String id, String value){
        String storedData = redisTemplate.opsForValue().get(buildKey(type, id));

        if(storedData == null){
            return false;
        }
        return storedData.equals(value);
    }

    public boolean validateValue(String type, String id, String value) {
        String storedValue = redisTemplate.opsForValue().get(buildKey(type, id));
        return storedValue != null && storedValue.equals(value);
    }

    public void removeData(String type, String id) { redisTemplate.delete(buildKey(type, id)); }

    public void removeData(String key) { redisTemplate.delete(key); }

    public Long getDataInLong(String type, String id){
        String value = redisTemplate.opsForValue().get(buildKey(type, id));

        if(value == null) return 0L;
        return Long.valueOf(value);
    }

    public Long getDataInLong(String type){
        String value = redisTemplate.opsForValue().get(type);

        if(value == null) return 0L;
        return Long.valueOf(value);
    }

    public String getDataInStr(String type, String id){ return redisTemplate.opsForValue().get(buildKey(type, id)); }

    public Double getDataInDouble(String key){
        String value = redisTemplate.opsForValue().get(key);

        if(value == null){
            return 0.0;
        }

        return Double.valueOf(value);
    }

    public Long getTTL(String type, String id) {
        Long ttl = redisTemplate.getExpire(buildKey(type, id), TimeUnit.SECONDS);
        return ttl != null ? ttl : -2L;  
    }

    private String buildKey(String type, String id){
        return type + ":" + id;
    }
}