package com.example.llmn.service;

import com.example.llmn.controller.DTO.LogDTO;
import com.example.llmn.controller.DTO.MetricResponse;
import com.example.llmn.controller.DTO.UserRequest;
import com.example.llmn.controller.DTO.UserResponse;
import com.example.llmn.core.errors.CustomException;
import com.example.llmn.core.errors.ExceptionCode;
import com.example.llmn.core.security.JWTProvider;
import com.example.llmn.domain.SshInfo;
import com.example.llmn.domain.SummaryType;
import com.example.llmn.domain.User;
import com.example.llmn.repository.*;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseCookie;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.security.SecureRandom;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static com.example.llmn.core.utils.MailTemplate.VERIFICATION_CODE;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final SshInfoRepository sshInfoRepository;
    private final MetricRepository metricRepository;
    private final AlarmRepository alarmRepository;
    private final SSHService sshService;
    private final RedisService redisService;
    private final SummaryRepository summaryRepository;
    private final MetricService metricService;
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    private final WebClient webClient;

    @Value("${spring.mail.username}")
    private String SERVICE_MAIL_ACCOUNT;

    @Value("${reload.uri}")
    private String REQUEST_RELOAD_KEY_URI;

    @Value("${validate_key.uri}")
    private String REQUEST_VALIDATE_KEY_URI;

    @Value("${update_env.uri}")
    private String UPDATE_ENV_URI;

    private static final String REDIS_KEY_EMAIL_CODE = "code:";
    private static final String MAIL_TEMPLATE_FOR_CODE = "verification_code_email.html";
    private static final String UTF_EIGHT_ENCODING = "UTF-8";
    private static final String UPLOAD_DIR = "ssh";
    private static final String REDIS_KEY_SESSION_ID = "sessionId";
    private static final String REDIS_KEY_REFRESH_TOKEN = "refreshToken";
    private static final String REDIS_KEY_ACCESS_TOKEN = "accessToken";
    private static final String REDIS_SSH_KEY = "SSH";
    private static final String COOKIE_KEY_REFRESH_TOKEN = "refreshToken";
    private static final String SORT_BY_DATE = "createdDate";
    private static final String MODEL_KEY_CODE = "code";
    private static final String DELIMITER = "-";
    private static final Long REDIS_SSH_KEY_EXP = 60L * 60 * 24 * 180; // 180일
    private static final String NOT_AVAILABLE = "N/A";
    private static final String ENV_FILE_RELATIVE_PATH = "FastAPI/app/.env";
    private static final String OPEN_API_KEY = "OPENAI_API_KEY";
    private static final String CODE_TO_EMAIL_KEY_PREFIX = "codeToEmail";
    private static final String CODE_TYPE_RECOVERY = "recovery";

    @Transactional
    public Map<String, String> login(UserRequest.@Valid LoginDTO requestDTO, HttpServletRequest request) {
        User user = userRepository.findByEmail(requestDTO.email()).orElseThrow(
                () -> new CustomException(ExceptionCode.USER_ACCOUNT_WRONG)
        );

        if(!passwordEncoder.matches(requestDTO.password(), user.getPassword())){
            throw new CustomException(ExceptionCode.USER_ACCOUNT_WRONG);
        }

        return createToken(user);
    }

    @Transactional
    public void join(UserRequest.JoinDTO requestDTO){
        if (!requestDTO.password().equals(requestDTO.passwordConfirm()))
            throw new CustomException(ExceptionCode.USER_PASSWORD_WRONG);

        checkAlreadyJoin(requestDTO.email());

        checkDuplicateNickname(requestDTO.nickName());

        if(requestDTO.sshInfos().isEmpty()){
            throw new CustomException(ExceptionCode.SSH_INFO_EMPTY);
        }

        if(hasDuplicateRemoteHost(requestDTO.sshInfos())){
            throw new CustomException(ExceptionCode.DUPLICATE_SSH_HOST);
        }

        User user = User.builder()
                .nickName(requestDTO.nickName())
                .email(requestDTO.email())
                .password(passwordEncoder.encode(requestDTO.password()))
                .receivingAlarm(requestDTO.receivingAlarm())
                .build();

        userRepository.save(user);

        List<SshInfo> sshInfos = new ArrayList<>();

        requestDTO.sshInfos().forEach(sshInfoDTO -> {
            SshInfo sshInfo = SshInfo.builder()
                    .user(user)
                    .remoteName(sshInfoDTO.remoteName())
                    .remoteHost(sshInfoDTO.remoteHost())
                    .remoteKeyPath(sshInfoDTO.remoteKeyPath())
                    .build();

            sshInfoRepository.save(sshInfo);
            sshInfos.add(sshInfo);
        });

        Optional<SshInfo> monitoringSshInfo = sshInfos.stream()
                .filter(sshInfo -> sshInfo.getRemoteHost().equals(requestDTO.monitoringSshHost()))
                .findFirst();

        if(monitoringSshInfo.isEmpty()){
            throw new CustomException(ExceptionCode.MONITORING_SSH_NOT_SELECT);
        }

        user.updateMonitoringSshInfoId(monitoringSshInfo.get().getId());

        updateFastAPIEnvFile(OPEN_API_KEY, requestDTO.openAiKey());
    }

    @Transactional(readOnly = true)
    public UserResponse.CheckEmailExistDTO checkEmailExist(String email){
        boolean isValid = !userRepository.existsByEmailWithRemoved(email);
        return new UserResponse.CheckEmailExistDTO(isValid);
    }

    @Transactional
    public UserResponse.CheckNickNameDTO checkNickName(UserRequest.CheckNickDTO requestDTO){
        boolean isDuplicate = userRepository.existsByNickname(requestDTO.nickName());
        return new UserResponse.CheckNickNameDTO(isDuplicate);
    }

    @Async
    public void sendCodeWithValidation(String email, String codeType, boolean isValid) {
        if(redisService.isDateExist(REDIS_KEY_EMAIL_CODE + codeType, email)){
            throw new CustomException(ExceptionCode.ALREADY_SEND_EMAIL);
        }

        if(isValid){
            sendCodeByEmail(email, codeType);
        }
    }

    public UserResponse.VerifyEmailCodeDTO verifyCode(UserRequest.VerifyCodeDTO requestDTO, String codeType){
        if(!redisService.validateData(REDIS_KEY_EMAIL_CODE + codeType, requestDTO.email(), requestDTO.code()))
            return new UserResponse.VerifyEmailCodeDTO(false);

        if(codeType.equals(CODE_TYPE_RECOVERY))
            redisService.storeValue(CODE_TO_EMAIL_KEY_PREFIX, requestDTO.code(), requestDTO.email(), 5 * 60 * 1000L);

        return new UserResponse.VerifyEmailCodeDTO(true);
    }

    public UserResponse.VerifySshConnectDTO verifySshConnect(UserRequest.VerifySshConnectDTO requestDTO){
        boolean isValid = sshService.checkConnectionValid(requestDTO.remoteHost(), requestDTO.remoteName(), requestDTO.remoteKeyPath());
        return new UserResponse.VerifySshConnectDTO(isValid);
    }

    public Path uploadSSHKey(MultipartFile file) {
        if (file.isEmpty()) {
            throw new CustomException(ExceptionCode.NO_FILE_TO_UPLOAD);
        }

        createDirIfNotExist();

        String fileName = file.getOriginalFilename();
        Path path = Paths.get(UPLOAD_DIR + File.separator + fileName);

        try {
            Files.write(path, file.getBytes());
        } catch (IOException e) {
            log.info("업로드 파일 저장 실패");
            throw new CustomException(ExceptionCode.SAVE_FILE_FAIL);
        }

        return path;
    }

    public UserResponse.ValidateOpenAIKeyDTO validateOpenAIKey(String apiKey){
        return webClient.post()
                .uri(buildURI(REQUEST_VALIDATE_KEY_URI))
                .bodyValue(new UserRequest.RequestValidateKeyDTO(apiKey))
                .retrieve()
                .bodyToMono(UserResponse.ValidateOpenAIKeyDTO.class)
                .block();
    }

    @Transactional
    public void resetPassword(UserRequest.ResetPasswordDTO requestDTO){
        String email = redisService.getDataInStr(CODE_TO_EMAIL_KEY_PREFIX, requestDTO.code());
        if(email == null){
            throw new CustomException(ExceptionCode.BAD_APPROACH);
        }

        redisService.removeData(CODE_TO_EMAIL_KEY_PREFIX, requestDTO.code());

        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new CustomException(ExceptionCode.USER_EMAIL_NOT_FOUND)
        );

        user.updatePassword(passwordEncoder.encode(requestDTO.newPassword()));
    }

    @Transactional
    public UserResponse.FindDashboardDTO findDashboard(Long userId) {
        Long sshInfoId = userRepository.findMonitoringSshId(userId).orElseThrow(
                () -> new CustomException(ExceptionCode.USER_NOT_FOUND)
        );

        String remoteHost = sshInfoRepository.findHostById(sshInfoId).orElseThrow(
                () -> new CustomException(ExceptionCode.SSH_NOT_FOUND)
        );

        MetricResponse.FindCurrentMetricDTO currentMetric = metricService.findCurrentMetric(sshInfoId);

        String cpuUsage = Optional.ofNullable(currentMetric)
                .map(metric -> String.format("%.2f%%", metric.cpuUsage()))
                .orElse(NOT_AVAILABLE);

        String memoryUsage = Optional.ofNullable(currentMetric)
                .filter(metric -> metric.totalMemory() > 0)
                .map(metric -> String.format("%.2f%%", (metric.usedMemory() / metric.totalMemory()) * 100))
                .orElse(NOT_AVAILABLE);

        String networkReceived = Optional.ofNullable(currentMetric)
                .map(metric -> String.format("%.2f MB", metric.networkReceived()))
                .orElse(NOT_AVAILABLE);

        String networkSent = Optional.ofNullable(currentMetric)
                .map(metric -> String.format("%.2f MB", metric.networkSent()))
                .orElse(NOT_AVAILABLE);

        MetricResponse.FindMetricHistoryDTO metricHistory = metricService.findMetricHistory(24, sshInfoId);

        String summary = getLatestHourlySummary()
                .orElse("요약된 내용이 존재하지 않습니다.");

        return new UserResponse.FindDashboardDTO(
                remoteHost,
                cpuUsage,
                memoryUsage,
                networkReceived,
                networkSent,
                summary,
                metricHistory.cpuMetrics(),
                metricHistory.memoryMetrics(),
                metricHistory.networkInMetrics(),
                metricHistory.networkOutMetrics());
    }

    @Transactional(readOnly = true)
    public UserResponse.FindCloudInfoDTO findCloudInfo(Long userId){
        User user = userRepository.findById(userId).orElseThrow(
                () -> new CustomException(ExceptionCode.USER_NOT_FOUND)
        );

        List<SshInfo> sshInfos = sshInfoRepository.findByUserId(userId);

        List<UserResponse.CloudInfoDTO> cloudInfoDTOS = sshInfos.stream()
                .map(sshInfo -> new UserResponse.CloudInfoDTO(sshInfo.getRemoteName(), sshInfo.getRemoteHost()))
                .toList();

        UserResponse.CloudInfoDTO selectedCloudDTO = sshInfos.stream()
                .filter(sshInfo -> sshInfo.getId().equals(user.getMonitoringSshId()))
                .map(sshInfo -> new UserResponse.CloudInfoDTO(sshInfo.getRemoteName(), sshInfo.getRemoteHost()))
                .findFirst()
                .get();

        return new UserResponse.FindCloudInfoDTO(cloudInfoDTOS, selectedCloudDTO);
    }

    @Transactional
    public void updateMonitoringSsh(Long userId ,String monitoringSshHost){
        User user = userRepository.findById(userId).orElseThrow(
                () -> new CustomException(ExceptionCode.USER_NOT_FOUND)
        );

        List<SshInfo> sshInfos = sshInfoRepository.findByUserId(userId);

        SshInfo foundSshInfo = sshInfos.stream()
                .filter(sshInfo -> sshInfo.getRemoteHost().equals(monitoringSshHost))
                .findFirst()
                .orElseThrow(
                        () -> new CustomException(ExceptionCode.MONITORING_SSH_NOT_SELECT)
                );

        user.updateMonitoringSshInfoId(foundSshInfo.getId());
    }

    @Transactional(readOnly = true)
    public UserResponse.FindConfigurationInfoDTO findConfigurationInfo(Long userId){
        User user = userRepository.findById(userId).orElseThrow(
                () -> new CustomException(ExceptionCode.USER_NOT_FOUND)
        );

        List<SshInfo> sshInfos = sshInfoRepository.findByUserId(userId);
        List<UserResponse.SshInfoDTO> sshInfoDTOS = sshInfos.stream()
                .map(sshInfo -> new UserResponse.SshInfoDTO(
                        sshInfo.getId(),
                        sshInfo.getRemoteName(),
                        sshInfo.getRemoteHost(),
                        sshInfo.getRemoteKeyPath(),
                        sshInfo.isWorking()))
                .toList();

        return new UserResponse.FindConfigurationInfoDTO(
                user.getNickName(),
                sshInfoDTOS,
                user.getMonitoringSshId(),
                user.isReceivingAlarm());
    }

    @Transactional
    public void updateConfiguration(UserRequest.UpdateConfigurationDTO requestDTO, Long userId){
        User user = userRepository.findById(userId).orElseThrow(
                () -> new CustomException(ExceptionCode.USER_NOT_FOUND)
        );

        if(hasDuplicateRemoteHost(requestDTO.sshInfos())){
            throw new CustomException(ExceptionCode.DUPLICATE_SSH_HOST);
        }

        List<UserRequest.SshInfoDTO> requestSshInfoDTOS = requestDTO.sshInfos();
        if(requestSshInfoDTOS.isEmpty()){
            throw new CustomException(ExceptionCode.SSH_INFO_EMPTY);
        }

        List<SshInfo> sshInfos = sshInfoRepository.findByUserId(userId);

        updateOrDeleteSshInfo(sshInfos, requestSshInfoDTOS);
        List<SshInfo> addedSshHosts = addNewSshInfos(sshInfos, requestSshInfoDTOS, user);

        String monitoringSshHost = requestSshInfoDTOS.stream()
                .filter(sshInfoDTO -> sshInfoDTO.remoteHost().equals(requestDTO.monitoringSshHost()))
                .findFirst()
                .orElseThrow(() -> new CustomException(ExceptionCode.MONITORING_SSH_NOT_SELECT))
                .remoteHost();

        SshInfo monitoringSshInfo = findMonitoringSshInfo(sshInfos, addedSshHosts, monitoringSshHost);

        user.updateConfiguration(requestDTO.nickName(), requestDTO.receivingAlarm(), monitoringSshInfo.getId());

        String combinedInfo = String.join(DELIMITER, monitoringSshInfo.getRemoteHost(), monitoringSshInfo.getRemoteName(), monitoringSshInfo.getRemoteKeyPath());
        redisService.storeValue(REDIS_SSH_KEY, userId.toString(), combinedInfo, REDIS_SSH_KEY_EXP);
    }

    public void updateApiKey(String apiKey){
        updateFastAPIEnvFile(OPEN_API_KEY, apiKey);
    }

    @Transactional(readOnly = true)
    public UserResponse.ValidateAccessTokenDTO validateAccessToken(@CookieValue String accessToken){
        if(!JWTProvider.validateToken(accessToken)) {
            throw new CustomException(ExceptionCode.TOKEN_WRONG);
        }

        Long userIdFromToken = JWTProvider.getUserIdFromToken(accessToken);
        if(!redisService.validateValue(REDIS_KEY_ACCESS_TOKEN, String.valueOf(userIdFromToken), accessToken)){
            throw new CustomException(ExceptionCode.ACCESS_TOKEN_WRONG);
        }

        String nickName = userRepository.findNickName(userIdFromToken).orElse(null);

        return new UserResponse.ValidateAccessTokenDTO(nickName);
    }

    private Map<String, String> createToken(User user){
        String accessToken = JWTProvider.createAccessToken(user);
        String refreshToken = JWTProvider.createRefreshToken(user);

        redisService.storeValue(REDIS_KEY_ACCESS_TOKEN, String.valueOf(user.getId()), accessToken, JWTProvider.ACCESS_EXP_MILLI);

        redisService.storeValue(REDIS_KEY_REFRESH_TOKEN, String.valueOf(user.getId()), refreshToken, JWTProvider.REFRESH_EXP_MILLI);

        redisService.storeValue(REDIS_KEY_SESSION_ID, user.getId().toString());

        Map<String, String> tokens = new HashMap<>();
        tokens.put(REDIS_KEY_ACCESS_TOKEN, accessToken);
        tokens.put(REDIS_KEY_REFRESH_TOKEN, refreshToken);

        return tokens;
    }

    public String createRefreshTokenCookie(String refreshToken) {
        return ResponseCookie.from(COOKIE_KEY_REFRESH_TOKEN, refreshToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(JWTProvider.REFRESH_EXP_SEC)
                .build().toString();
    }

    @Transactional(readOnly = true)
    public UserResponse.CheckAccountExistDTO checkLocalAccountExist(UserRequest.EmailDTO requestDTO){
        Optional<User> userOP = userRepository.findByEmail(requestDTO.email());
        boolean isValid = userOP.isPresent();

        return new UserResponse.CheckAccountExistDTO(isValid);
    }

    @Transactional
    public void withdrawMember(Long userId){
        User user = userRepository.findById(userId).orElseThrow(
                () -> new CustomException(ExceptionCode.USER_NOT_FOUND)
        );

        alarmRepository.deleteByUserId(userId);

        projectRepository.deleteByUserId(userId);

        summaryRepository.deleteByUserId(userId);

        metricRepository.deleteByUserId(userId);

        sshInfoRepository.deleteByUserId(userId);

        redisService.removeData(REDIS_KEY_ACCESS_TOKEN, userId.toString());
        redisService.removeData(REDIS_KEY_REFRESH_TOKEN, userId.toString());

        userRepository.delete(user);
    }

    private void checkDuplicateNickname(String nickName) {
        if(userRepository.existsByNickname(nickName))
            throw new CustomException(ExceptionCode.USER_NICKNAME_EXIST);
    }

    private void checkAlreadyJoin(String email) {
        if(userRepository.existsByEmail(email))
            throw new CustomException(ExceptionCode.USER_EMAIL_EXIST);
    }

    private String generateVerificationCode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        SecureRandom random = new SecureRandom();

        return IntStream.range(0, 8) // 8자리
                .map(i -> random.nextInt(chars.length()))
                .mapToObj(chars::charAt)
                .map(Object::toString)
                .collect(Collectors.joining());
    }

    @Async
    public void sendCodeByEmail(String email, String codeType) {
        String verificationCode = generateVerificationCode();

        Map<String, Object> model = new HashMap<>();
        model.put(MODEL_KEY_CODE, verificationCode);

        sendMail(email, VERIFICATION_CODE.getSubject(), MAIL_TEMPLATE_FOR_CODE, model);

        redisService.storeValue(REDIS_KEY_EMAIL_CODE + codeType, email, verificationCode, 175 * 1000L); // 3분 동안 유효
    }

    @Async
    public void sendMail(String toEmail, String subject, String templateName, Map<String, Object> templateModel) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, UTF_EIGHT_ENCODING);

            Context context = new Context();
            templateModel.forEach(context::setVariable);
            String htmlContent = templateEngine.process(templateName, context);
            helper.setText(htmlContent, true);

            helper.setFrom(SERVICE_MAIL_ACCOUNT);
            helper.setTo(toEmail);
            helper.setSubject(subject);

            mailSender.send(message);
        } catch (MessagingException e){
            log.info(toEmail + "로의 메일 전송에 실패했습니다");
        }
    }

    private Optional<String> getLatestHourlySummary(){
        Pageable pageable = PageRequest.of(0, 1, Sort.by(Sort.Direction.DESC, SORT_BY_DATE));
        Page<String> page = summaryRepository.findContentByType(SummaryType.HOURLY, pageable);
        return page.hasContent() ? Optional.of(page.getContent().get(0)) : Optional.empty();
    }

    private List<SshInfo> addNewSshInfos(List<SshInfo> sshInfos, List<UserRequest.SshInfoDTO> requestSshInfoDTOS, User user) {
        List<SshInfo> addedSshHosts = new ArrayList<>();

        for (UserRequest.SshInfoDTO sshInfoDTO : requestSshInfoDTOS) {
            boolean exists = sshInfos.stream()
                    .anyMatch(sshInfo -> sshInfo.getRemoteHost().equals(sshInfoDTO.remoteHost()));

            if (!exists) {
                SshInfo newSshInfo = SshInfo.builder()
                        .user(user)
                        .remoteHost(sshInfoDTO.remoteHost())
                        .remoteName(sshInfoDTO.remoteName())
                        .remoteKeyPath(sshInfoDTO.remoteKeyPath())
                        .build();

                sshInfoRepository.save(newSshInfo);
                addedSshHosts.add(newSshInfo);
            }
        }

        return addedSshHosts;
    }

    private void updateOrDeleteSshInfo(List<SshInfo> sshInfos, List<UserRequest.SshInfoDTO> requestSshInfoDTOS) {
        for (SshInfo sshInfo : sshInfos) {
            Optional<UserRequest.SshInfoDTO> matchingDTO = requestSshInfoDTOS.stream()
                    .filter(sshInfoDTO -> sshInfoDTO.remoteHost().equals(sshInfo.getRemoteHost()))
                    .findFirst();

            if (matchingDTO.isPresent()) {
                updateSshInfoIfChanged(sshInfo, matchingDTO.get());
            } else {
                sshInfoRepository.delete(sshInfo);
            }
        }
    }

    private void updateSshInfoIfChanged(SshInfo sshInfo, UserRequest.SshInfoDTO sshInfoDTO) {
        if (!sshInfo.getRemoteHost().equals(sshInfoDTO.remoteHost()) ||
                !sshInfo.getRemoteName().equals(sshInfoDTO.remoteName()) ||
                !sshInfo.getRemoteKeyPath().equals(sshInfoDTO.remoteKeyPath())) {
            sshInfo.updateSshInfo(sshInfoDTO.remoteHost(), sshInfoDTO.remoteName(), sshInfoDTO.remoteKeyPath(), true);
        }
    }

    private SshInfo findMonitoringSshInfo(List<SshInfo> sshInfos, List<SshInfo> addedSshHosts, String monitoringSshHost) {
        return sshInfos.stream()
                .filter(sshInfo -> sshInfo.getRemoteHost().equals(monitoringSshHost))
                .findFirst()
                .orElseGet(() -> addedSshHosts.stream()
                        .filter(sshInfo -> sshInfo.getRemoteHost().equals(monitoringSshHost))
                        .findFirst()
                        .orElseThrow(() -> new CustomException(ExceptionCode.MONITORING_SSH_NOT_SELECT))
                );
    }

    private boolean hasDuplicateRemoteHost(List<UserRequest.SshInfoDTO> sshInfos) {
        Set<String> remoteHostSet = new HashSet<>();

        for (UserRequest.SshInfoDTO sshInfoDTO : sshInfos) {
            if (!remoteHostSet.add(sshInfoDTO.remoteHost())) {
                return true;
            }
        }
        return false;
    }

    private void createDirIfNotExist() {
        Path uploadPath = Paths.get(UPLOAD_DIR);

        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e){
            throw new CustomException(ExceptionCode.CREATE_DIR_FAIL);
        }
    }

    private void updateFastAPIEnvFile(String key, String value) {
        try {
            UserResponse.EnvUpdateDTO responseDTO = webClient.post()
                    .uri(buildURI(UPDATE_ENV_URI))
                    .bodyValue(new UserRequest.EnvUpdateDTO(key, value))
                    .retrieve()
                    .bodyToMono(UserResponse.EnvUpdateDTO.class)
                    .block();

            if (responseDTO == null || !responseDTO.success()) {
                throw new CustomException(ExceptionCode.LOG_CONVERT_TO_FILE_FAIL);
            }

        } catch (Exception e){
            log.info("API 키 업데이트 실패");
            throw new CustomException(ExceptionCode.LOG_CONVERT_TO_FILE_FAIL);
        }
    }

    private URI buildURI(String uri) {
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(uri);
        return uriBuilder.build().encode().toUri();
    }
}