package com.artora.artora_backend.dto;

import com.artora.artora_backend.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
}
