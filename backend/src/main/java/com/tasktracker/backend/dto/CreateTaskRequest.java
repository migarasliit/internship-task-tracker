package com.tasktracker.backend.dto;

import com.tasktracker.backend.model.ETaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateTaskRequest {
    @NotBlank(message = "Task title is required")
    private String title;

    private String description;

    @NotBlank(message = "Project ID is required")
    private String projectId;

    @NotBlank(message = "Assigned Intern ID is required")
    private String assignedInternId;

    @NotNull(message = "Deadline is required")
    private LocalDate deadline;
}