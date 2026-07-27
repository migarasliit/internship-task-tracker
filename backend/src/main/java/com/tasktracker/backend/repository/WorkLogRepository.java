package com.tasktracker.backend.repository;

import com.tasktracker.backend.model.WorkLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface WorkLogRepository extends MongoRepository<WorkLog, String> {
    List<WorkLog> findByInternIdOrderByLogDateDesc(String internId);
}