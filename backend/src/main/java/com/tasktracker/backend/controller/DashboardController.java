package com.tasktracker.backend.controller;

import com.tasktracker.backend.model.ERole;
import com.tasktracker.backend.model.ETaskStatus;
import com.tasktracker.backend.repository.ProjectRepository;
import com.tasktracker.backend.repository.TaskRepository;
import com.tasktracker.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public DashboardController(UserRepository userRepository, ProjectRepository projectRepository, TaskRepository taskRepository) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        long activeInterns = userRepository.countByRoleAndActiveTrue(ERole.ROLE_INTERN);
        long activeProjects = projectRepository.findAll().stream().filter(p -> p.getStatus() == com.tasktracker.backend.model.EProjectStatus.ACTIVE).count();

        long pendingTasks = taskRepository.countByStatus(ETaskStatus.TODO);
        long inProgressTasks = taskRepository.countByStatus(ETaskStatus.IN_PROGRESS);
        long submittedTasks = taskRepository.countByStatus(ETaskStatus.SUBMITTED);
        long completedTasks = taskRepository.countByStatus(ETaskStatus.COMPLETED);

        return ResponseEntity.ok(Map.of(
                "activeInterns", activeInterns,
                "activeProjects", activeProjects,
                "pendingTasks", pendingTasks,
                "inProgressTasks", inProgressTasks,
                "submittedTasks", submittedTasks,
                "completedTasks", completedTasks
        ));
    }
}