package com.example.expensetracker.dto;

import java.math.BigDecimal;

public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private BigDecimal salary;

    public UserResponse() {}

    public UserResponse(Long id, String name, String email, BigDecimal salary) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.salary = salary;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public BigDecimal getSalary() { return salary; }
    public void setSalary(BigDecimal salary) { this.salary = salary; }
}
