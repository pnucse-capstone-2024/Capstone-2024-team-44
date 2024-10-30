package com.example.llmn.controller.DTO;

import com.example.llmn.domain.ContainerStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public class ProjectResponse {

    public record CreateProjectDTO(Long id){}

    public record FindProjectInfoByIdDTO(
            String projectName,
            String usingContainerName,
            String description,
            List<ContainerDTO> containers){}

    public record FindProjectListDTO(List<ProjectDTO> projects){}

    public record ProjectDTO(
            Long id,
            boolean isUrgent,
            String name,
            String description,
            ContainerStatus containerStatus,
            String cpuUsage,
            String memoryUsage) {}

    public record FindContainerListDTO(List<String> names){}

    public record FindProjectByIdDTO(
            String name,
            String description,
            String summaryContent,
            String summaryUpdateDate,
            String logContent){}

    public record FindProjectLogListDTO(List<String> files){}

    public record FindProjectLogByNameDTO(
            String name,
            String description,
            String fileName,
            String logMessage){}

    public record FindProjectSummaryDTO(
            String name,
            String description,
            List<SummaryDTO> summaries,
            boolean isLastPage,
            int pageNum){}

    public record SummaryDTO(
            Long id,
            String time,
            String content,
            boolean isChecked){}

    public record FindCloudAndContainerInfoDTO(List<CloudInstanceDTO> cloudInstances){}

    public record CloudInstanceDTO(String cloudName, Long sshInfoId, List<ContainerDTO> containers){}

    public record ContainerDTO(String containerName){}
}
