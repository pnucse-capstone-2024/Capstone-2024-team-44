package com.example.llmn.controller.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

public class UserRequest {

    public record LoginDTO(
            @NotBlank(message = "이메일을 입력해주세요.")
            @Pattern(regexp = "^[\\w._%+-]+@[\\w.-]+\\.[a-zA-Z]{2,6}$", message = "올바른 이메일 형식을 입력해주세요.")
            String email,

            @NotBlank(message = "비밀번호를 입력해주세요.")
            @Size(min=8, max=20, message = "비밀번호는 8자에서 20자 이내여야 합니다.")
            @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[@#$%^&+=!~`<>,./?;:'\"\\[\\]{}\\\\()|_-])\\S*$", message = "올바른 비밀번호 형식을 입력해주세요.")
            String password
    ){}

    public record JoinDTO(
            @NotBlank(message = "이메일을 입력해주세요.")
            @Pattern(regexp = "^[\\w._%+-]+@[\\w.-]+\\.[a-zA-Z]{2,6}$", message = "올바른 이메일 형식을 입력해주세요.")
            String email,
            @NotBlank(message="닉네임을 입력해주세요.")
            @Size(min=2, max=20, message = "닉네임은 2자에서 20자 이내여야 합니다.")
            String nickName,
            @NotBlank(message = "비밀번호를 입력해주세요.")
            @Size(min=8, max=20, message = "비밀번호는 8자에서 20자 이내여야 합니다.")
            @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[@#$%^&+=!~`<>,./?;:'\"\\[\\]{}\\\\()|_-])\\S*$", message = "올바른 비밀번호 형식을 입력해주세요.")
            String password,
            @NotBlank(message = "비밀번호를 입력해주세요.")
            String passwordConfirm,
            List<SshInfoDTO> sshInfos,
            boolean receivingAlarm,
            @NotBlank(message = "모니터링할 클라우드 인스턴스를 선택해야 합니다.")
            String monitoringSshHost,
            @NotBlank(message = "OpenAI API키를 입력해야 합니다.")
            String openAiKey) {}

    public record SshInfoDTO(
            String remoteName,
            String remoteHost,
            String remoteKeyPath
    ){}

    public record EmailDTO(
            @NotBlank(message = "이메일을 입력해주세요.")
            @Pattern(regexp = "^[\\w._%+-]+@[\\w.-]+\\.[a-zA-Z]{2,6}$", message = "올바른 이메일 형식을 입력해주세요.")
            String email){}

    public record UpdateConfigurationDTO(
            @NotBlank(message="닉네임을 입력해주세요.")
            @Size(min=2, max=20, message = "닉네임은 2자에서 20자 이내여야 합니다.")
            String nickName,
            List<SshInfoDTO> sshInfos,
            boolean receivingAlarm,
            @NotBlank(message = "모니터링할 클라우드 인스턴스를 선택해야 합니다.")
            String monitoringSshHost
    ){}

    public record UpdateAPiKeyDTO(@NotBlank(message="API키를 입력해주세요.") String apiKey){}

    public record VerifyCodeDTO(
            @NotBlank
            @Pattern(regexp = "^[\\w._%+-]+@[\\w.-]+\\.[a-zA-Z]{2,6}$", message = "올바른 이메일 형식을 입력해주세요.")
            String email,
            @NotBlank(message = "코드를 입력해주세요.")
            String code){}

    public record CheckNickDTO(
            @NotBlank(message = "닉네임을 입력해주세요.")
            String nickName){}

    public record VerifySshConnectDTO(
            @NotBlank(message = "클라우드 인스턴스의 유저명을 입력해주세요.")
            String remoteName,
            @NotBlank(message = "클라우드 인스턴의 IP(호스트)를 입력해주세요.")
            String remoteHost,
            @NotBlank(message = "Pem키 파일의 경로를 입력해주세요.")
            String remoteKeyPath){}

    public record RequestValidateKeyDTO(String apiKey){}

    public record ValidateOpenAIKeyDTO(@NotBlank(message = "OpenAI API키를 입력해주세요.") String apiKey){}

    public record ResetPasswordDTO(
            @NotBlank(message = "코드를 입력해주세요.")
            String code,
            @NotBlank(message = "비밀번호를 입력해주세요.")
            @Size(min=8, max=20, message = "비밀번호는 8자에서 20자 이내여야 합니다.")
            @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[@#$%^&+=!~`<>,./?;:'\"\\[\\]{}\\\\()|_-])\\S*$", message = "올바른 비밀번호 형식을 입력해주세요.")
            String newPassword
    ){}

    public record UpdateMonitoringSshDTO(@NotBlank(message = "모니터링할 호스트(ip)를 입력해주세요.") String remoteHost){}

    public record EnvUpdateDTO(String key, String value){}
}
