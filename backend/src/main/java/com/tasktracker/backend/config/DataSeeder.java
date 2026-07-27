package com.tasktracker.backend.config;

import com.tasktracker.backend.model.ERole;
import com.tasktracker.backend.model.User;
import com.tasktracker.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Create a default Admin if one doesn't exist
        if (!userRepository.existsByEmail("admin@tasktracker.com")) {
            User admin = new User();
            admin.setEmail("admin@tasktracker.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("System Administrator");
            admin.setRole(ERole.ROLE_ADMIN);
            admin.setActive(true);
            userRepository.save(admin);
            System.out.println(">>> Default Admin user created! Email: admin@tasktracker.com | Password: admin123");
        }
    }
}