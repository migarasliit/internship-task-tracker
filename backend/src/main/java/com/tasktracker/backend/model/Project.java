package com.tasktracker.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.util.List;

@Document(collection = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    @Id
    private String id;
    private String title;
    private String description;
    private String technologyStack;
    private LocalDate deadline;
    private EProjectStatus status;
    //   store the IDs of the interns assigned to this project
    private List<String> assignedInternIds;
}