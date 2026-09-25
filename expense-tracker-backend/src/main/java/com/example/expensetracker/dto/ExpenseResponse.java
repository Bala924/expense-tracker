package com.example.expensetracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ExpenseResponse {

    private Long id;
    private Long userId;
    private String description;
    private BigDecimal amount;
    private String category;
    private LocalDate date;

    public ExpenseResponse() {}

    public ExpenseResponse(Long id, Long userId, String description, BigDecimal amount, String category, LocalDate date) {
        this.id = id;
        this.userId = userId;
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.date = date;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}
