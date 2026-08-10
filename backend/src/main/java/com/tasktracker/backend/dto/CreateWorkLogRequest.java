package com.tasktracker.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateWorkLogRequest {
    @NotBlank(message = "Completed work is required")
    private String completedWork;

    @NotBlank(message = "Current work is required")
    private String currentWork;

    private String challenges;

    @NotNull(message = "Hours worked is required")
    @Min(value = 1, message = "Hours worked must be at least 1")
    private double hoursWorked;

    @NotBlank(message = "Next day plan is required")
    private String nextDayPlan;
}