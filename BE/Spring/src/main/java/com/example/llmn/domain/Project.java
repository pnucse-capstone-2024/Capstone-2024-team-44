package com.example.llmn.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "project_tb")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Project extends TimeStamp{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ssh_info_id")
    private SshInfo sshInfo;

    @Column
    private String projectName;

    @Column
    private String containerName;

    @Column
    @Enumerated(EnumType.STRING)
    private ContainerStatus containerStatus;

    @Column
    private String description;

    @Column
    private boolean isUrgent;

    @Builder
    public Project(User user, SshInfo sshInfo, String projectName, String containerName, String description, ContainerStatus containerStatus, boolean isUrgent) {
        this.user = user;
        this.sshInfo = sshInfo;
        this.projectName = projectName;
        this.containerName = containerName;
        this.containerStatus = containerStatus;
        this.description = description;
        this.isUrgent = isUrgent;
    }

    public void updateProject(String projectName, String containerName, String description, ContainerStatus containerStatus){
        this.projectName = projectName;
        this.containerName = containerName;
        this.description = description;
        this.containerStatus = containerStatus;
    }

    public void updateIsUrgent(boolean isUrgent){
        this.isUrgent = isUrgent;
    }
}
