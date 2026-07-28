package com.tasktracker.backend.controller;

import com.tasktracker.backend.dto.CreateTaskRequest;
import com.tasktracker.backend.model.ETaskStatus;
import com.tasktracker.backend.model.Task;
import com.tasktracker.backend.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // Admin creates task
    @PostMapping("/admin")
    public ResponseEntity<Task> createTask(@Valid @RequestBody CreateTaskRequest request) {
        return new ResponseEntity<>(taskService.createTask(request), HttpStatus.CREATED);
    }

    // Get all tasks (Admin view)
    @GetMapping("/admin")
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    // Intern views their own tasks
    @GetMapping("/intern/{internId}")
    public ResponseEntity<List<Task>> getTasksByIntern(@PathVariable String internId) {
        return ResponseEntity.ok(taskService.getTasksByIntern(internId));
    }

    // Update task status (e.g., TODO -> IN_PROGRESS)
    @PatchMapping("/{id}/status")
    public ResponseEntity<Task> updateTaskStatus(
            @PathVariable String id,
            @RequestParam ETaskStatus status) {
        return ResponseEntity.ok(taskService.updateTaskStatus(id, status));
    }

    // Intern submits work
    @PostMapping("/{id}/submit")
    public ResponseEntity<Task> submitTask(
            @PathVariable String id,
            @RequestParam String submissionLink) {
        return ResponseEntity.ok(taskService.submitTask(id, submissionLink));
    }

    // Admin provides feedback and updates task status (COMPLETED or REVISION_REQUIRED)
    @PatchMapping("/admin/{id}/feedback")
    public ResponseEntity<Task> provideTaskFeedback(
            @PathVariable String id,
            @RequestParam String feedback,
            @RequestParam ETaskStatus newStatus) {

        // We delegate the business logic to the TaskService!
        Task updatedTask = taskService.provideFeedback(id, feedback, newStatus);
        return ResponseEntity.ok(updatedTask);
    }
}