package com.example.llmn.controller;

import com.example.llmn.controller.DTO.ProjectRequest;
import com.example.llmn.controller.DTO.ProjectResponse;
import com.example.llmn.core.security.CustomUserDetails;
import com.example.llmn.core.utils.ApiUtils;
import com.example.llmn.core.utils.SSHCommandExecutor;
import com.example.llmn.service.DockerService;
import com.example.llmn.service.ProjectService;
import com.example.llmn.service.SSHService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api")
public class ProjectController {

    private final ProjectService projectService;
    private final SSHService sshService;
    private final DockerService dockerService;
    private static final String SORT_BY_DATE = "createdDate";
    private static final boolean USING_CACHE = true;
    private static final boolean NOT_USING_CACHE = false;

    @PostMapping("/project")
    public ResponseEntity<?> createProject(@RequestBody ProjectRequest.CreateProjectDTO requestDTO, @AuthenticationPrincipal CustomUserDetails userDetails) {
        ProjectResponse.CreateProjectDTO responseDTO = projectService.createProject(requestDTO, userDetails.getUser().getId());
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, responseDTO));
    }

    @GetMapping("/project/cloud")
    public ResponseEntity<?> findCloudAndContainerInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {
        ProjectResponse.FindCloudAndContainerInfoDTO responseDTO = projectService.findCloudAndContainerInfo(userDetails.getUser().getId());
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, responseDTO));
    }

    @GetMapping("/project/{projectId}/info")
    public ResponseEntity<?> findProjectInfoById(@PathVariable Long projectId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        ProjectResponse.FindProjectInfoByIdDTO responseDTO = projectService.findProjectInfoById(projectId, userDetails.getUser().getId());
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, responseDTO));
    }

    @PatchMapping("/project/{projectId}")
    public ResponseEntity<?> updateProject(@RequestBody ProjectRequest.UpdateProjectDTO requestDTO,
                                           @PathVariable Long projectId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        projectService.updateProject(requestDTO, projectId, userDetails.getUser().getId());
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, null));
    }

    @GetMapping("/project")
    public ResponseEntity<?> findProjectList(@AuthenticationPrincipal CustomUserDetails userDetails) {
        ProjectResponse.FindProjectListDTO responseDTO = projectService.findProjectList(userDetails.getUser().getId(), USING_CACHE);
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, responseDTO));
    }

    @GetMapping("/project/refresh")
    public ResponseEntity<?> findRefreshedProjectList(@AuthenticationPrincipal CustomUserDetails userDetails) {
        ProjectResponse.FindProjectListDTO responseDTO = projectService.findProjectList(userDetails.getUser().getId(), NOT_USING_CACHE);
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, responseDTO));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<?> findProjectById(@PathVariable Long projectId) {
        ProjectResponse.FindProjectByIdDTO responseDTO = projectService.findProjectById(projectId);
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, responseDTO));
    }

    @GetMapping("/project/{projectId}/summaries")
    public ResponseEntity<?> findProjectSummary(@PathVariable Long projectId,
                                                @PageableDefault(size = 5, sort = SORT_BY_DATE, direction = Sort.Direction.DESC) Pageable pageable){
        ProjectResponse.FindProjectSummaryDTO responseDTO = projectService.findProjectSummary(projectId, pageable);
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, responseDTO));
    }

    @GetMapping("/project/{projectId}/logs")
    public ResponseEntity<?> findProjectLogList(@PathVariable Long projectId) {
        ProjectResponse.FindProjectLogListDTO responseDTO = projectService.findProjectLogList(projectId);
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, responseDTO));
    }

    @GetMapping("/project/{projectId}/logs/{fileName}")
    public ResponseEntity<?> findProjectLogByName(@PathVariable Long projectId, @PathVariable String fileName){
        ProjectResponse.FindProjectLogByNameDTO responseDTO = projectService.findProjectLogByName(projectId, fileName);
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, responseDTO));
    }

    @GetMapping("/containers")
    public ResponseEntity<?> findContainerList(@RequestParam Long sshId) {
        List<String> runningContainerNameList = dockerService.findRunningContainerList(sshId);
        ProjectResponse.FindContainerListDTO responseDTO = new ProjectResponse.FindContainerListDTO(runningContainerNameList);
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, responseDTO));
    }

    @PostMapping("/project/{projectId}/container/stop")
    public ResponseEntity<?> stopContainer(@RequestBody ProjectRequest.ContainerDTO requestDTO, @PathVariable Long projectId) {
        boolean response = dockerService.stopContainerByName(requestDTO.name(), projectId);
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, response));
    }

    @PostMapping("/project/{projectId}/container/restart")
    public ResponseEntity<?> restartContainer(@RequestBody ProjectRequest.ContainerDTO requestDTO, @PathVariable Long projectId) {
        boolean response = dockerService.restartContainerByName(requestDTO.name(), projectId);
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, response));
    }

    @DeleteMapping("/project/{projectId}")
    public ResponseEntity<?> deleteProjectById(@PathVariable Long projectId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        projectService.deleteProjectById(userDetails.getUser().getId(), projectId);
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, null));
    }

    @PostMapping("/summaries/{summaryId}/check")
    public ResponseEntity<?> checkSummary(@PathVariable Long summaryId){
        projectService.checkSummary(summaryId);
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, null));
    }

    @PostMapping("/command/init")
    public ResponseEntity<?> initCommend(@AuthenticationPrincipal CustomUserDetails userDetails){
        sshService.initCommend(userDetails.getUser().getId());
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, null));
    }

    @PostMapping("/command/home")
    public ResponseEntity<?> executeCommandInHome(@RequestBody ProjectRequest.ExecuteCommandDTO requestDTO, @AuthenticationPrincipal CustomUserDetails userDetails) {
        String response = projectService.executeCommandInHome(requestDTO.command(), requestDTO.isFirstExecution(), userDetails.getUser().getId());
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, response));
    }

    @PostMapping("/command/terminate")
    public ResponseEntity<?> terminateCommand(@AuthenticationPrincipal CustomUserDetails userDetails) {
        sshService.stopCommend(userDetails.getUser().getId());
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, null));
    }

    @PostMapping("/command/interrupt")
    public ResponseEntity<?> interruptCommand(@AuthenticationPrincipal CustomUserDetails userDetails) {
        sshService.executeSigInt(userDetails.getUser().getId());
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, null));
    }
}
