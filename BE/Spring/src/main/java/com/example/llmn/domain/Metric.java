package com.example.llmn.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "metric_tb")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Metric extends TimeStamp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ssh_info_id")
    private SshInfo sshInfo;

    @Column
    private double cpuUsage;

    @Column
    private double totalMemory;

    @Column
    private double usedMemory;

    @Column
    private double totalBytesReceived;

    @Column
    private double totalBytesSent;

    @Builder
    public Metric(SshInfo sshInfo, double cpuUsage, double totalMemory, double usedMemory, double totalBytesReceived, double totalBytesSent) {
        this.sshInfo = sshInfo;
        this.cpuUsage = cpuUsage;
        this.totalMemory = totalMemory;
        this.usedMemory = usedMemory;
        this.totalBytesReceived = totalBytesReceived;
        this.totalBytesSent = totalBytesSent;
    }
}
