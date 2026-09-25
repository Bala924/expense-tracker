package com.example.expensetracker.controller;

import com.example.expensetracker.dto.LoginRequest;
import com.example.expensetracker.dto.RegisterRequest;
import com.example.expensetracker.dto.UserResponse;
import com.example.expensetracker.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(
    origins = {
        "https://expense-tracker-git-main-balas-projects-c2cdf002.vercel.app",
        "https://expense-tracker-r5oaqulb8-balas-projects-c2cdf002.vercel.app",
        "http://localhost:5173",
        "http://localhost:5174"
    }
)
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        UserResponse response = userService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(
            @Valid @RequestBody LoginRequest request) {

        UserResponse response = userService.login(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable Long id) {

        UserResponse response = userService.getUserById(id);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/salary")
    public ResponseEntity<UserResponse> updateSalary(
            @PathVariable Long id,
            @RequestBody Map<String, BigDecimal> body) {

        BigDecimal salary = body.get("salary");

        UserResponse response =
                userService.updateSalary(id, salary);

        return ResponseEntity.ok(response);
    }
}