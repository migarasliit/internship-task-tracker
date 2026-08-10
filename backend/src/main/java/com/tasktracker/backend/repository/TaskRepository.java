package com.tasktracker.backend.repository;

import com.tasktracker.backend.model.ETaskStatus;
import com.tasktracker.backend.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByAssignedInternId(String internId);
    List<Task> findByStatus(ETaskStatus status);
    long countByStatus(ETaskStatus status);
}