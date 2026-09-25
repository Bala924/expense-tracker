package com.example.expensetracker.dto;

import java.math.BigDecimal;

public class SummaryResponse {

    private BigDecimal totalSalary;
    private BigDecimal totalExpense;
    private BigDecimal balance;

    public SummaryResponse() {}

    public SummaryResponse(BigDecimal totalSalary, BigDecimal totalExpense, BigDecimal balance) {
        this.totalSalary = totalSalary;
        this.totalExpense = totalExpense;
        this.balance = balance;
    }

    public BigDecimal getTotalSalary() { return totalSalary; }
    public void setTotalSalary(BigDecimal totalSalary) { this.totalSalary = totalSalary; }

    public BigDecimal getTotalExpense() { return totalExpense; }
    public void setTotalExpense(BigDecimal totalExpense) { this.totalExpense = totalExpense; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
}
