package com.example.llmn.repository;

import com.example.llmn.domain.Metric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MetricRepository extends JpaRepository<Metric, Long> {
    @Query("SELECT m FROM Metric m WHERE m.createdDate >= :date AND m.sshInfo.id = :sshInfoId")
    List<Metric> findALlWithinDate(@Param("date") LocalDateTime date, @Param("sshInfoId") Long sshInfoId);

    @Modifying
    @Query("DELETE FROM Metric m WHERE m.sshInfo.user = :userId")
    void deleteByUserId(Long userId);
}
