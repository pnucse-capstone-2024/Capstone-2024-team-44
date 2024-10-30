package com.example.llmn.repository;

import com.example.llmn.domain.Project;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT p FROM Project p")
    List<Project> findAllWithUser();

    @Query("SELECT p FROM Project p WHERE p.user.id = :userId")
    List<Project> findByUserId(@Param("userId") Long userId);

    @EntityGraph(attributePaths = {"sshInfo"})
    @Query("SELECT p FROM Project p WHERE p.user.id = :userId")
    List<Project> findByUserIdWithSshInfo(@Param("userId") Long userId);

    @Query("SELECT p.containerName FROM Project p WHERE p.id = :projectId")
    Optional<String> findContainerNameById(@Param("projectId") Long projectId);

    @Query("SELECT s.id FROM Project p " +
            "JOIN p.sshInfo s " +
            "WHERE p.id = :projectId")
    Optional<Long> findSshInfoId(@Param("projectId") Long projectId);

    @Modifying
    @Query("DELETE FROM Project p WHERE p.user.id = :userId")
    void deleteByUserId(Long userId);
}
