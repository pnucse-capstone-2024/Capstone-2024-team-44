package com.example.llmn.repository;

import com.example.llmn.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmail(@Param("email") String email);

    @Query("SELECT u.monitoringSshId FROM User u WHERE u.id = :userId")
    Optional<Long> findMonitoringSshId(@Param("userId") Long userId);

    @Query("SELECT u.nickName FROM User u WHERE u.id = :userId")
    Optional<String> findNickName(@Param("userId") Long userId);

    @Query("SELECT u.id FROM User u")
    List<Long> findIds();

    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.email = :email")
    boolean existsByEmail(@Param("email") String email);

    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.nickName = :nickName")
    boolean existsByNickname(@Param("nickName") String nickName);

    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.email = :email")
    boolean existsByEmailWithRemoved(@Param("email") String email);
}
