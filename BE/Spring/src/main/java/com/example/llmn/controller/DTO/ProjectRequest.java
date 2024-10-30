package com.example.llmn.controller.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ProjectRequest {

    public record CreateProjectDTO(
            @NotBlank(message="서비스 이름을 입력해주세요.")
            @Size(min=2, max=20, message = "서비스 이름은 2자에서 20자 이내여야 합니다.")
            String projectName,
            Long sshInfoId,
            String containerName,
            @NotBlank(message="설명을 입력해주세요.")
            String description){}

    public record UpdateProjectDTO(
            @NotBlank(message="서비스 이름을 입력해주세요.")
            @Size(min=2, max=20, message = "서비스 이름은 2자에서 20자 이내여야 합니다.")
            String projectName,
            String containerName,
            @NotBlank(message="설명을 입력해주세요.")
            String description){}


    public record ContainerDTO(String name){}

    public record ExecuteCommandDTO(
            @NotBlank(message="명령을 입력해주세요.")
            String command,
            @NotBlank(message="SSH 호스트명을 입력해주세요.")
            String sshHost,
            boolean isFirstExecution){}
}
