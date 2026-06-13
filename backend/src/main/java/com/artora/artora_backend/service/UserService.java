package com.artora.artora_backend.service;

import com.artora.artora_backend.entity.User;
import com.artora.artora_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repo;

    public List<User> getAll() { return repo.findAll(); }

    public User getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
    }

    public User create(User user) { return repo.save(user); }

    public void delete(Long id) { repo.deleteById(id); }
}
