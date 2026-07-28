package com.tasktracker.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Document(collection = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    @Id
    private String id;
    private String title;
    private String description;
    private String projectId; // Links to Project
    private String assignedInternId; // Links to User (Intern)
    private ETaskStatus status;
    private LocalDate deadline;
    private String submissionLink; // For intern to submit work
    private String supervisorFeedback; // For admin to give feedback
    private EPriority priority;
}