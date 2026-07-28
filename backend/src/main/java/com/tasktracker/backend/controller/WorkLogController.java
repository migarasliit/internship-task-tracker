package com.tasktracker.backend.controller;

import com.tasktracker.backend.dto.CreateWorkLogRequest;
import com.tasktracker.backend.model.WorkLog;
import com.tasktracker.backend.service.WorkLogService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/worklogs")
public class WorkLogController {

    private final WorkLogService workLogService;

    public WorkLogController(WorkLogService workLogService) {
        this.workLogService = workLogService;
    }

    // Intern creates a daily log
    @PostMapping("/intern/{internId}")
    public ResponseEntity<WorkLog> createWorkLog(
            @PathVariable String internId,
            @Valid @RequestBody CreateWorkLogRequest request) {
        return new ResponseEntity<>(workLogService.createWorkLog(internId, request), HttpStatus.CREATED);
    }

    // View logs for a specific intern (Admin or Intern)
    @GetMapping("/intern/{internId}")
    public ResponseEntity<List<WorkLog>> getWorkLogsByIntern(@PathVariable String internId) {
        return ResponseEntity.ok(workLogService.getWorkLogsByIntern(internId));
    }

    // Admin adds a comment/feedback to a log
    @PatchMapping("/{logId}/comment")
    public ResponseEntity<WorkLog> addSupervisorComment(
            @PathVariable String logId,
            @RequestParam String comment) {
        return ResponseEntity.ok(workLogService.addSupervisorComment(logId, comment));
    }
}