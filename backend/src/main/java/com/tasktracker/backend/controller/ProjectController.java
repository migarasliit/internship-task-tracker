package com.tasktracker.backend.controller;

import com.tasktracker.backend.dto.CreateProjectRequest;
import com.tasktracker.backend.model.EProjectStatus;
import com.tasktracker.backend.model.Project;
import com.tasktracker.backend.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@Valid @RequestBody CreateProjectRequest request) {
        return new ResponseEntity<>(projectService.createProject(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable String id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Project> updateProjectStatus(
            @PathVariable String id,
            @RequestParam EProjectStatus status) {
        return ResponseEntity.ok(projectService.updateProjectStatus(id, status));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(
            @PathVariable String id,
            @Valid @RequestBody CreateProjectRequest request) {
        return ResponseEntity.ok(projectService.updateProject(id, request));
    }
}