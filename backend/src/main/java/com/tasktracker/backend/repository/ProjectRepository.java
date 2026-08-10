package com.tasktracker.backend.repository;

import com.tasktracker.backend.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ProjectRepository extends MongoRepository<Project, String> {
    List<Project> findByAssignedInternIdsContaining(String internId);
}