package com.example.llmn.repository;

import com.example.llmn.domain.Project;
import com.example.llmn.domain.Summary;
import com.example.llmn.domain.SummaryType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SummaryRepository extends JpaRepository<Summary, Long> {

    @Query("SELECT s FROM Summary s " +
            "JOIN s.project p " +
            "WHERE p = :project")
    Page<Summary> findLatestSummaryByProject(@Param("project") Project project, Pageable pageable);

    @Query("SELECT s FROM Summary s " +
            "JOIN s.project p " +
            "WHERE p.id = :projectId")
    Page<Summary> findByProjectId(@Param("projectId") Long projectId, Pageable pageable);

    @Query("SELECT s FROM Summary s " +
            "WHERE s.summaryType IN :types " +
            "AND s.id = (SELECT MAX(subS.id) FROM Summary subS WHERE subS.summaryType = s.summaryType)")
    List<Summary> findLatestByTypes(@Param("types") List<SummaryType> types);

    @Query("SELECT s FROM Summary s " +
            "WHERE s.summaryType = :type AND s.user.id = :userId")
    Page<Summary> findByType(@Param("type") SummaryType type, @Param("userId") Long userId, Pageable pageable);

    @Query("SELECT s.content FROM Summary s " +
            "WHERE s.summaryType = :type")
    Page<String> findContentByType(@Param("type") SummaryType type, Pageable pageable);

    @Query("SELECT s FROM Summary s " +
            "JOIN s.user u " +
            "WHERE s.summaryType IN :types AND u.id = :userId AND s.createdDate >= :startOfDay")
    List<Summary> findByTypeWithinDate(@Param("types") List<SummaryType> types,
                                       @Param("userId") Long userId,
                                       @Param("startOfDay") LocalDateTime startOfDay);

    @EntityGraph(attributePaths = {"project"})
    @Query("SELECT s FROM Summary s " +
            "JOIN s.user u " +
            "WHERE s.summaryType IN :types AND u.id = :userId AND s.createdDate >= :startOfDay")
    List<Summary> findByTypeWithinDateWithProject(@Param("types") List<SummaryType> types,
                                                  @Param("userId") Long userId,
                                                  @Param("startOfDay") LocalDateTime startOfDay);

    @EntityGraph(attributePaths = {"project"})
    @Query("SELECT s FROM Summary s " +
            "WHERE s.project IN :projects AND s.createdDate BETWEEN :startDate AND :endDate " +
            "ORDER BY s.createdDate DESC")    
    List<Summary> findByProjectsAndDateRange(@Param("projects") List<Project> projects,
                                             @Param("startDate") LocalDateTime startDate,
                                             @Param("endDate") LocalDateTime endDate);

    @Query("DELETE FROM Summary s WHERE s.project.id = :projectId")
    void deleteByProjectId(@Param("projectId") Long projectId);

    @Modifying
    @Query("DELETE FROM Summary s WHERE s.user.id = :userId")
    void deleteByUserId(Long userId);
}
