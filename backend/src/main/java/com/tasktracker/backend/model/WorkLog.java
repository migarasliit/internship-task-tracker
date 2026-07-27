package com.tasktracker.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Document(collection = "work_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkLog {
    @Id
    private String id;
    private String internId;
    private LocalDate logDate;
    private String completedWork;
    private String currentWork;
    private String challenges;
    private double hoursWorked;
    private String nextDayPlan;
    private String supervisorComment;
}