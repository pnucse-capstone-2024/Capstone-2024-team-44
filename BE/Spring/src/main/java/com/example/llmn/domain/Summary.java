package com.example.llmn.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "summary_tb")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Summary extends TimeStamp{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(length = 50)
    @Enumerated(EnumType.STRING)
    private SummaryType summaryType;

    @Column(columnDefinition="TEXT")
    private String content;

    @Column
    private boolean isChecked;

    @Builder
    public Summary(User user, Project project, SummaryType summaryType, String content) {
        this.user = user;
        this.project = project;
        this.summaryType = summaryType;
        this.content = content;
        this.isChecked = false;
    }

    public void updateIsChecked(boolean isChecked){
        this.isChecked = isChecked;
    }
}
