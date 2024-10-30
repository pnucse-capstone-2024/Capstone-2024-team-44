package com.example.llmn.controller;

import com.example.llmn.controller.DTO.UserRequest;
import com.example.llmn.controller.DTO.UserResponse;
import com.example.llmn.core.security.CustomUserDetails;
import com.example.llmn.core.utils.ApiUtils;
import com.example.llmn.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Path;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private static final String CODE_TYPE_JOIN = "join";
    private static final String CODE_TYPE_RECOVERY = "recovery";

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody @Valid UserRequest.LoginDTO requestDTO, HttpServletRequest request) {
        Map<String, String> tokens = userService.login(requestDTO, request);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, userService.createRefreshTokenCookie(tokens.get("refreshToken")))
                .body(ApiUtils.success(HttpStatus.OK, new UserResponse.LoginDTO(tokens.get("accessToken"))));
    }

    @PostMapping("/accounts")
    public ResponseEntity<?> join(@RequestBody @Valid UserRequest.JoinDTO requestDTO){
        userService.join(requestDTO);
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.CREATED, null));
    }

    @PostMapping("/accounts/ssh")
    public ResponseEntity<?> uploadSSHKey(@RequestParam("file") MultipartFile file) {
        Path path = userService.uploadSSHKey(file);
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.CREATED, path));
    }

    @PostMapping("/accounts/check/email")
    public ResponseEntity<?> checkEmailAndSendCode(@RequestBody @Valid UserRequest.EmailDTO requestDTO) {
        UserResponse.CheckEmailExistDTO responseDTO = userService.checkEmailExist(requestDTO.email());
        userService.sendCodeWithValidation(requestDTO.email(), CODE_TYPE_JOIN, responseDTO.isValid());
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, responseDTO));
    }

    @PostMapping("/accounts/check/nick")
    public ResponseEntity<?> checkNickname(@RequestBody @Valid UserRequest.CheckNickDTO requestDTO){
        UserResponse.CheckNickNameDTO responseDTO = userService.checkNickName(requestDTO);
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, responseDTO));
    }

    @PostMapping("/accounts/verify/code")
    public ResponseEntity<?> verifyCode(@RequestBody @Valid UserRequest.VerifyCodeDTO requestDTO, @RequestParam String codeType){
        UserResponse.VerifyEmailCodeDTO responseDTO = userService.verifyCode(requestDTO, codeType);
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, responseDTO));
    }

    @PostMapping("/accounts/resend/code")
    public ResponseEntity<?> resendCode(@RequestBody @Valid UserRequest.EmailDTO requestDTO, @RequestParam String codeType) {
        userService.sendCodeWithValidation(requestDTO.email(), codeType, true);
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, null));
    }

    @PostMapping("/accounts/validate/ssh")
    public ResponseEntity<?> verifySshConnect(@RequestBody @Valid UserRequest.VerifySshConnectDTO requestDTO){
        UserResponse.VerifySshConnectDTO responseDTO = userService.verifySshConnect(requestDTO);
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, responseDTO));
    }

    @PostMapping("/accounts/validate/key")
    public ResponseEntity<?> validateOpenAIKey(@RequestBody @Valid UserRequest.ValidateOpenAIKeyDTO requestDTO){
        UserResponse.ValidateOpenAIKeyDTO responseDTO = userService.validateOpenAIKey(requestDTO.apiKey());
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, responseDTO));
    }

    @GetMapping("/home")
    public ResponseEntity<?> findDashboard(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UserResponse.FindDashboardDTO responseDTO = userService.findDashboard(userDetails.getUser().getId());
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, responseDTO));
    }

    @GetMapping("/cloud")
    public ResponseEntity<?> findCloudInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UserResponse.FindCloudInfoDTO responseDTO = userService.findCloudInfo(userDetails.getUser().getId());
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, responseDTO));
    }

    @PatchMapping("/cloud")
    public ResponseEntity<?> updateMonitoringSsh(@RequestBody @Valid UserRequest.UpdateMonitoringSshDTO requestDTO, @AuthenticationPrincipal CustomUserDetails userDetails) {
        userService.updateMonitoringSsh(userDetails.getUser().getId(), requestDTO.remoteHost());
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, null));
    }

    @GetMapping("/accounts/info")
    public ResponseEntity<?> findConfigurationInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UserResponse.FindConfigurationInfoDTO responseDTO = userService.findConfigurationInfo(userDetails.getUser().getId());
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, responseDTO));
    }

    @PatchMapping("/accounts")
    public ResponseEntity<?> updateConfiguration(@RequestBody @Valid UserRequest.UpdateConfigurationDTO requestDTO, @AuthenticationPrincipal CustomUserDetails userDetails) {
        userService.updateConfiguration(requestDTO, userDetails.getUser().getId());
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, null));
    }

    @PatchMapping("/accounts/apiKey")
    public ResponseEntity<?> updateApiKey(@RequestBody @Valid UserRequest.UpdateAPiKeyDTO requestDTO){
        userService.updateApiKey(requestDTO.apiKey());
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, null));
    }

    @PostMapping("/accounts/recovery/code")
    public ResponseEntity<?> sendCodeForRecovery(@RequestBody @Valid UserRequest.EmailDTO requestDTO) {
        UserResponse.CheckAccountExistDTO responseDTO = userService.checkLocalAccountExist(requestDTO);
        userService.sendCodeWithValidation(requestDTO.email(), CODE_TYPE_RECOVERY, responseDTO.isValid());
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, responseDTO));
    }

    @PostMapping("/accounts/recovery/reset")
    public ResponseEntity<?> resetPassword(@RequestBody @Valid UserRequest.ResetPasswordDTO requestDTO){
        userService.resetPassword(requestDTO);
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, null));
    }

    @DeleteMapping("/accounts/withdraw")
    public ResponseEntity<?> withdrawMember(@AuthenticationPrincipal CustomUserDetails userDetails){
        userService.withdrawMember(userDetails.getUser().getId());
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, null));
    }

    @PostMapping("/validate/accessToken")
    public ResponseEntity<?> validateAccessToken(@CookieValue String accessToken){
        UserResponse.ValidateAccessTokenDTO responseDTO = userService.validateAccessToken(accessToken);
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, responseDTO));
    }
}
