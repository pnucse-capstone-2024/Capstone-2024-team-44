package com.example.llmn.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_tb")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class User extends TimeStamp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String nickName;

    @Column
    private String email;

    @Column
    private String password;

    @Column
    private boolean receivingAlarm;

    @Column
    private Long monitoringSshId;

    @Builder
    public User(Long id, String nickName, String email, String password, boolean receivingAlarm, Long monitoringSshId) {
        this.id = id;
        this.nickName = nickName;
        this.email = email;
        this.password = password;
        this.receivingAlarm = receivingAlarm;
        this.monitoringSshId = monitoringSshId;
    }

    public void updatePassword (String password) {
        this.password  = password;
    }

    public void updateMonitoringSshInfoId(Long monitoringSshInfoId) {
        this.monitoringSshId = monitoringSshInfoId;
    }

    public void updateConfiguration(String nickName, boolean receivingAlarm, Long monitoringSshId){
        this.nickName = nickName;
        this.receivingAlarm = receivingAlarm;
        this.monitoringSshId = monitoringSshId;
    }
}
