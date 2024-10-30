package com.example.llmn.controller.DTO;

import java.util.List;

public class UserResponse {

    public record LoginDTO(String accessToken) {}

    public record CheckEmailExistDTO(boolean isValid) {}

    public record CheckNickNameDTO(boolean isDuplicate) {}

    public record FindDashboardDTO(
            String ip,
            String cpuUsage,
            String memoryUsage,
            String networkReceived,
            String networkSent,
            String summary,
            List<MetricResponse.CpuMetricDTO> cpuHistory,
            List<MetricResponse.MemoryMetricDTO> memoryHistory,
            List<MetricResponse.NetworkInMetricDTO> networkInHistory,
            List<MetricResponse.NetworkOutMetricDTO> networkOutHistory){}

    public record FindConfigurationInfoDTO(
            String nickName,
            List<SshInfoDTO> sshInfos,
            Long monitoringSshId,
            boolean receivingAlarm){}

    public record SshInfoDTO(
            Long id,
            String remoteName,
            String remoteHost,
            String remoteKeyPath,
            boolean isWorking
    ){}

    public record FindCloudInfoDTO(List<CloudInfoDTO> clouds, CloudInfoDTO selectedCloud){}

    public record CloudInfoDTO(String remoteName, String remoteHost){}

    public record VerifyEmailCodeDTO(boolean isMatching) {}

    public record VerifySshConnectDTO(boolean isValid) {}

    public record RequestApiKeyLoadDTO(boolean success){}

    public record ValidateOpenAIKeyDTO(boolean isValid){}

    public record CheckAccountExistDTO(boolean isValid) {}

    public record EnvUpdateDTO(boolean success){}

    public record ValidateAccessTokenDTO(String nickName){}
}
