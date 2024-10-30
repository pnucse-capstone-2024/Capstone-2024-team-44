package com.example.llmn.repository;

import com.example.llmn.domain.Alarm;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AlarmRepository extends JpaRepository<Alarm, Long> {

    List<Alarm> findByReceiverId(Long receiverId);

    @Query("SELECT a FROM Alarm a WHERE a.readDate <= :date AND a.isRead = TRUE")
    List<Alarm> findReadBeforeDate(@Param("date") LocalDateTime date);

    @EntityGraph(attributePaths = {"receiver"})
    @Query("SELECT a FROM Alarm a WHERE a.id IN :ids")
    List<Alarm> findByIdsWithUser(@Param("ids") List<Long> ids);

    @Modifying
    @Query("DELETE FROM Alarm a WHERE a.receiver.id = :userId")
    void deleteByUserId(Long userId);
}
