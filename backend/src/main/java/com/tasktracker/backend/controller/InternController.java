package com.tasktracker.backend.controller;

import com.tasktracker.backend.dto.CreateInternRequest;
import com.tasktracker.backend.model.User;
import com.tasktracker.backend.service.InternService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/interns")
public class InternController {

    private final InternService internService;

    public InternController(InternService internService) {
        this.internService = internService;
    }

    // POST: Create a new intern
    @PostMapping
    public ResponseEntity<User> createIntern(@Valid @RequestBody CreateInternRequest request) {
        User newIntern = internService.createIntern(request);
        return new ResponseEntity<>(newIntern, HttpStatus.CREATED);
    }

    // GET: Get all interns
    @GetMapping
    public ResponseEntity<List<User>> getAllInterns() {
        List<User> interns = internService.getAllInterns();
        return ResponseEntity.ok(interns);
    }

    // GET: Get intern by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getInternById(@PathVariable String id) {
        User intern = internService.getInternById(id);
        return ResponseEntity.ok(intern);
    }

    // PATCH: Activate/Deactivate intern
    @PatchMapping("/{id}/status")
    public ResponseEntity<User> updateInternStatus(
            @PathVariable String id,
            @RequestParam boolean active) {
        User updatedIntern = internService.updateInternStatus(id, active);
        return ResponseEntity.ok(updatedIntern);
    }
}