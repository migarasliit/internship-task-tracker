package com.tasktracker.backend.controller;

import com.tasktracker.backend.model.ERole;
import com.tasktracker.backend.model.ETaskStatus;
import com.tasktracker.backend.model.Task;
import com.tasktracker.backend.model.WorkLog;
import com.tasktracker.backend.repository.ProjectRepository;
import com.tasktracker.backend.repository.TaskRepository;
import com.tasktracker.backend.repository.UserRepository;
import com.tasktracker.backend.repository.WorkLogRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final WorkLogRepository workLogRepository; // <-- ADDED

    public DashboardController(UserRepository userRepository,
                               ProjectRepository projectRepository,
                               TaskRepository taskRepository,
                               WorkLogRepository workLogRepository) { // <-- ADDED
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.workLogRepository = workLogRepository; // <-- ADDED
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        long activeInterns = userRepository.countByRoleAndActiveTrue(ERole.ROLE_INTERN);
        long activeProjects = projectRepository.findAll().stream()
                .filter(p -> p.getStatus() == com.tasktracker.backend.model.EProjectStatus.ACTIVE).count();

        long pendingTasks = taskRepository.countByStatus(ETaskStatus.TODO);
        long inProgressTasks = taskRepository.countByStatus(ETaskStatus.IN_PROGRESS);
        long submittedTasks = taskRepository.countByStatus(ETaskStatus.SUBMITTED);
        long completedTasks = taskRepository.countByStatus(ETaskStatus.COMPLETED);

        long overdueTasks = taskRepository.findAll().stream()
                .filter(t -> t.getDeadline().isBefore(java.time.LocalDate.now()) &&
                        t.getStatus() != ETaskStatus.COMPLETED)
                .count();

        return ResponseEntity.ok(Map.of(
                "activeInterns", activeInterns,
                "activeProjects", activeProjects,
                "pendingTasks", pendingTasks,
                "inProgressTasks", inProgressTasks,
                "submittedTasks", submittedTasks,
                "completedTasks", completedTasks,
                "overdueTasks", overdueTasks
        ));
    }

    @GetMapping("/recent-activity")
    public ResponseEntity<List<Map<String, String>>> getRecentActivity() {
        List<Map<String, String>> activities = new ArrayList<>();

        // Get last 5 tasks
        List<Task> tasks = taskRepository.findAll();
        for (int i = Math.max(0, tasks.size() - 5); i < tasks.size(); i++) {
            activities.add(Map.of(
                    "type", "Task",
                    "message", "Task '" + tasks.get(i).getTitle() + "' status: " + tasks.get(i).getStatus()
            ));
        }

        // Get last 5 work logs
        List<WorkLog> logs = workLogRepository.findAll();
        for (int i = Math.max(0, logs.size() - 5); i < logs.size(); i++) {
            activities.add(Map.of(
                    "type", "Log",
                    "message", "Work log submitted for date: " + logs.get(i).getLogDate()
            ));
        }

        return ResponseEntity.ok(activities);
    }
}