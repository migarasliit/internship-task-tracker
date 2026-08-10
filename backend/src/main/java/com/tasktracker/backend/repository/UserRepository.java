package com.tasktracker.backend.repository;

import com.tasktracker.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    long countByRoleAndActiveTrue(com.tasktracker.backend.model.ERole role);
}