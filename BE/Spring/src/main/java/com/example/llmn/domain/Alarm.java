package com.example.llmn.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "alarm_tb")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Alarm extends TimeStamp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User receiver;

    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    private AlarmType alarmType;

    @Column(columnDefinition="TEXT")
    private String content;

    @Column
    private boolean isRead;

    @Column
    private LocalDateTime readDate;

    @Builder
    public Alarm(User receiver, String content, AlarmType alarmType) {
        this.receiver = receiver;
        this.content = content;
        this.alarmType = alarmType;
        this.isRead = false;
    }

    public void updateIsRead(Boolean isRead, LocalDateTime readDate){
        this.isRead = isRead;
        this.readDate = readDate;
    }
}
