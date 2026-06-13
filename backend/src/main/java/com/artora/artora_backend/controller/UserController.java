package com.artora.artora_backend.controller;

import com.artora.artora_backend.entity.User;
import com.artora.artora_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService service;

    @GetMapping
    public List<User> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public User getOne(@PathVariable Long id) { return service.getById(id); }

    @PostMapping
    public User create(@RequestBody User user) {
        return service.create(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
