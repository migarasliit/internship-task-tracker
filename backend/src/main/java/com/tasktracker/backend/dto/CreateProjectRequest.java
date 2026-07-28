package com.tasktracker.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class CreateProjectRequest {
    @NotBlank(message = "Project title is required")
    private String title;

    private String description;
    private String technologyStack;

    @NotNull(message = "Deadline is required")
    private LocalDate deadline;

    // List of Intern IDs to assign to this project
    private List<String> assignedInternIds;
}