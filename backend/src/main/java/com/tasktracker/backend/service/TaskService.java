package com.tasktracker.backend.service;

import com.tasktracker.backend.dto.CreateTaskRequest;
import com.tasktracker.backend.exception.ResourceNotFoundException;
import com.tasktracker.backend.model.EPriority;
import com.tasktracker.backend.model.ETaskStatus;
import com.tasktracker.backend.model.Task;
import com.tasktracker.backend.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Task createTask(CreateTaskRequest request) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setProjectId(request.getProjectId());
        task.setAssignedInternId(request.getAssignedInternId());
        task.setDeadline(request.getDeadline());
        task.setStatus(ETaskStatus.TODO); // Default status
        task.setPriority(request.getPriority() != null ? request.getPriority() : EPriority.MEDIUM); // Default to MEDIUM

        return taskRepository.save(task);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksByIntern(String internId) {
        return taskRepository.findByAssignedInternId(internId);
    }

    public Task updateTaskStatus(String id, ETaskStatus status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        task.setStatus(status);
        return taskRepository.save(task);
    }

    public Task submitTask(String id, String submissionLink) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        task.setSubmissionLink(submissionLink);
        task.setStatus(ETaskStatus.SUBMITTED);
        return taskRepository.save(task);
    }

    // Admin provides feedback and updates task status
    public Task provideFeedback(String id, String feedback, ETaskStatus newStatus) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        task.setSupervisorFeedback(feedback);
        task.setStatus(newStatus);

        return taskRepository.save(task);
    }
}