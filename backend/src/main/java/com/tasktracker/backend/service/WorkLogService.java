package com.tasktracker.backend.service;

import com.tasktracker.backend.dto.CreateWorkLogRequest;
import com.tasktracker.backend.exception.ResourceNotFoundException;
import com.tasktracker.backend.model.WorkLog;
import com.tasktracker.backend.repository.WorkLogRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class WorkLogService {

    private final WorkLogRepository workLogRepository;

    public WorkLogService(WorkLogRepository workLogRepository) {
        this.workLogRepository = workLogRepository;
    }

    public WorkLog createWorkLog(String internId, CreateWorkLogRequest request) {
        WorkLog log = new WorkLog();
        log.setInternId(internId);
        log.setLogDate(LocalDate.now());
        log.setCompletedWork(request.getCompletedWork());
        log.setCurrentWork(request.getCurrentWork());
        log.setChallenges(request.getChallenges());
        log.setHoursWorked(request.getHoursWorked());
        log.setNextDayPlan(request.getNextDayPlan());
        return workLogRepository.save(log);
    }

    public List<WorkLog> getWorkLogsByIntern(String internId) {
        return workLogRepository.findByInternIdOrderByLogDateDesc(internId);
    }

    public WorkLog addSupervisorComment(String logId, String comment) {
        WorkLog log = workLogRepository.findById(logId)
                .orElseThrow(() -> new ResourceNotFoundException("Work log not found with id: " + logId));
        log.setSupervisorComment(comment);
        return workLogRepository.save(log);
    }
}