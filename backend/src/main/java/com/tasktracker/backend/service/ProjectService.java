package com.tasktracker.backend.service;

import com.tasktracker.backend.dto.CreateProjectRequest;
import com.tasktracker.backend.exception.ResourceNotFoundException;
import com.tasktracker.backend.model.EProjectStatus;
import com.tasktracker.backend.model.Project;
import com.tasktracker.backend.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public Project createProject(CreateProjectRequest request) {
        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setTechnologyStack(request.getTechnologyStack());
        project.setDeadline(request.getDeadline());
        project.setAssignedInternIds(request.getAssignedInternIds());
        project.setStatus(EProjectStatus.PLANNED); // Default status

        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(String id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    public Project updateProjectStatus(String id, EProjectStatus status) {
        Project project = getProjectById(id);
        project.setStatus(status);
        return projectRepository.save(project);
    }
}