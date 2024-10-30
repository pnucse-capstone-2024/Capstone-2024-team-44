package com.example.llmn.repository;

import com.example.llmn.domain.SshInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SshInfoRepository extends JpaRepository<SshInfo, Long> {

    @Query("SELECT s FROM SshInfo s WHERE s.user.id = :userId")
    List<SshInfo> findByUserId(@Param("userId") Long userId);

    @Query("SELECT s.remoteHost FROM SshInfo s")
    List<String> findAllRemoteHost();

    @Query("SELECT s.remoteHost FROM SshInfo s WHERE s.id = :id")
    Optional<String> findHostById(@Param("id") Long id);

    @Modifying
    @Query("UPDATE SshInfo s SET s.isWorking = :isWorking WHERE s.id = :sshId")
    void updateIsWorking(@Param("sshId") Long sshId, @Param("isWorking") boolean isWorking);

    @Modifying
    @Query("DELETE FROM SshInfo s WHERE s.user.id = :userId")
    void deleteByUserId(Long userId);
}
