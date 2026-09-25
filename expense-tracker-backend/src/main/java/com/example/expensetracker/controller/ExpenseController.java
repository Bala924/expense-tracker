package com.example.expensetracker.controller;

import com.example.expensetracker.dto.*;
import com.example.expensetracker.service.ExpenseService;

import jakarta.validation.Valid;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(
    origins = {
        "https://expense-tracker-git-main-balas-projects-c2cdf002.vercel.app",
        "https://expense-tracker-r5oaqulb8-balas-projects-c2cdf002.vercel.app",
        "http://localhost:5173",
        "http://localhost:5174"
    }
)
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> addExpense(
            @Valid @RequestBody ExpenseRequest request) {

        ExpenseResponse response =
                expenseService.addExpense(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ExpenseResponse>> getExpensesByUser(
            @PathVariable Long userId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate toDate) {

        List<ExpenseResponse> expenses;

        if (search != null ||
            category != null ||
            fromDate != null ||
            toDate != null) {

            expenses = expenseService.getFilteredExpenses(
                    userId,
                    search,
                    category,
                    fromDate,
                    toDate
            );

        } else {
            expenses = expenseService.getExpensesByUser(userId);
        }

        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/{expenseId}")
    public ResponseEntity<ExpenseResponse> getExpenseById(
            @PathVariable Long expenseId) {

        ExpenseResponse response =
                expenseService.getExpenseById(expenseId);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable Long expenseId,
            @Valid @RequestBody ExpenseRequest request) {

        ExpenseResponse response =
                expenseService.updateExpense(expenseId, request);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Map<String, String>> deleteExpense(
            @PathVariable Long expenseId,
            @RequestParam Long userId) {

        expenseService.deleteExpense(expenseId, userId);

        return ResponseEntity.ok(
                Map.of("message", "Expense deleted successfully")
        );
    }

    @GetMapping("/user/{userId}/total")
    public ResponseEntity<Map<String, Object>> getTotalExpense(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                Map.of(
                        "totalExpense",
                        expenseService.getTotalExpense(userId)
                )
        );
    }

    @GetMapping("/user/{userId}/summary")
    public ResponseEntity<SummaryResponse> getDashboardSummary(
            @PathVariable Long userId) {

        SummaryResponse response =
                expenseService.getDashboardSummary(userId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}/category-summary")
    public ResponseEntity<List<CategorySummaryResponse>> getCategorySummary(
            @PathVariable Long userId) {

        List<CategorySummaryResponse> response =
                expenseService.getCategorySummary(userId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}/monthly")
    public ResponseEntity<List<MonthlySummaryResponse>> getMonthlySummary(
            @PathVariable Long userId) {

        List<MonthlySummaryResponse> response =
                expenseService.getMonthlySummary(userId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}/recent")
    public ResponseEntity<List<ExpenseResponse>> getRecentExpenses(
            @PathVariable Long userId) {

        List<ExpenseResponse> response =
                expenseService.getRecentExpenses(userId);

        return ResponseEntity.ok(response);
    }
}