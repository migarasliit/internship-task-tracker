package com.tasktracker.backend.service;

import com.tasktracker.backend.dto.CreateInternRequest;
import com.tasktracker.backend.exception.ResourceNotFoundException;
import com.tasktracker.backend.model.ERole;
import com.tasktracker.backend.model.User;
import com.tasktracker.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InternService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public InternService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Create a new intern
    public User createIntern(CreateInternRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }

        User intern = new User();
        intern.setFullName(request.getFullName());
        intern.setEmail(request.getEmail());
        intern.setPassword(passwordEncoder.encode(request.getPassword()));
        intern.setRole(ERole.ROLE_INTERN);
        intern.setActive(true);

        return userRepository.save(intern);
    }

    // Get all interns
    public List<User> getAllInterns() {
        // We can filter by role if needed, but for now, let's just get all users and filter in memory
        // or add a findByRole method to the repository later.
        // For simplicity, let's return all users for now.
        return userRepository.findAll();
    }

    // Get intern by ID
    public User getInternById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Intern not found with id: " + id));
    }

    // Activate or Deactivate an intern
    public User updateInternStatus(String id, boolean isActive) {
        User intern = getInternById(id);
        intern.setActive(isActive);
        return userRepository.save(intern);
    }

    // Update intern profile
    public User updateIntern(String id, CreateInternRequest request) {
        User intern = getInternById(id);
        intern.setFullName(request.getFullName());
        // We intentionally do not update email/password here to keep it simple and secure
        return userRepository.save(intern);
    }
}