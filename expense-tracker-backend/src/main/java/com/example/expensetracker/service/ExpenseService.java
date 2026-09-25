package com.example.expensetracker.service;

import com.example.expensetracker.dto.*;
import com.example.expensetracker.entity.Category;
import com.example.expensetracker.entity.Expense;
import com.example.expensetracker.entity.User;
import com.example.expensetracker.exception.ExpenseNotFoundException;
import com.example.expensetracker.exception.UserNotFoundException;
import com.example.expensetracker.repository.ExpenseRepository;
import com.example.expensetracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseService(ExpenseRepository expenseRepository, UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    public ExpenseResponse addExpense(ExpenseRequest request) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new UserNotFoundException("User not found with id: " + request.getUserId()));

        Category category = parseCategory(request.getCategory());

        Expense expense = new Expense(
            user,
            request.getDescription().trim(),
            request.getAmount(),
            category,
            request.getDate()
        );

        Expense saved = expenseRepository.save(expense);
        return mapToExpenseResponse(saved);
    }

    public List<ExpenseResponse> getExpensesByUser(Long userId) {
        userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
        return expenseRepository.findByUserIdOrderByDateDesc(userId)
            .stream()
            .map(this::mapToExpenseResponse)
            .collect(Collectors.toList());
    }

    public ExpenseResponse getExpenseById(Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
            .orElseThrow(() -> new ExpenseNotFoundException("Expense not found with id: " + expenseId));
        return mapToExpenseResponse(expense);
    }

    public ExpenseResponse updateExpense(Long expenseId, ExpenseRequest request) {
        Expense expense = expenseRepository.findById(expenseId)
            .orElseThrow(() -> new ExpenseNotFoundException("Expense not found with id: " + expenseId));

        if (!expense.getUser().getId().equals(request.getUserId())) {
            throw new IllegalArgumentException("You are not authorized to update this expense");
        }

        Category category = parseCategory(request.getCategory());

        expense.setDescription(request.getDescription().trim());
        expense.setAmount(request.getAmount());
        expense.setCategory(category);
        expense.setDate(request.getDate());

        Expense updated = expenseRepository.save(expense);
        return mapToExpenseResponse(updated);
    }

    public void deleteExpense(Long expenseId, Long userId) {
        Expense expense = expenseRepository.findById(expenseId)
            .orElseThrow(() -> new ExpenseNotFoundException("Expense not found with id: " + expenseId));

        if (!expense.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You are not authorized to delete this expense");
        }

        expenseRepository.delete(expense);
    }

    public BigDecimal getTotalExpense(Long userId) {
        userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
        return expenseRepository.getTotalExpenseByUserId(userId);
    }

    public SummaryResponse getDashboardSummary(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        BigDecimal totalSalary = user.getSalary();
        BigDecimal totalExpense = expenseRepository.getTotalExpenseByUserId(userId);
        BigDecimal balance = totalSalary.subtract(totalExpense);

        return new SummaryResponse(totalSalary, totalExpense, balance);
    }

    public List<CategorySummaryResponse> getCategorySummary(Long userId) {
        userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        List<Object[]> results = expenseRepository.getCategorySummaryByUserId(userId);
        return results.stream()
            .map(row -> new CategorySummaryResponse(
                row[0].toString(),
                (BigDecimal) row[1]
            ))
            .collect(Collectors.toList());
    }

    public List<MonthlySummaryResponse> getMonthlySummary(Long userId) {
        userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        List<Object[]> results = expenseRepository.getMonthlySummaryByUserId(userId);
        return results.stream()
            .map(row -> {
                int monthNum = ((Number) row[0]).intValue();
                BigDecimal amount = (BigDecimal) row[2];
                String monthName = Month.of(monthNum).name().charAt(0) +
                    Month.of(monthNum).name().substring(1).toLowerCase();
                return new MonthlySummaryResponse(monthName, amount);
            })
            .collect(Collectors.toList());
    }

    public List<ExpenseResponse> getFilteredExpenses(Long userId, String search, String category,
                                                      LocalDate fromDate, LocalDate toDate) {
        userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        Category categoryEnum = null;
        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("all")) {
            categoryEnum = parseCategory(category);
        }

        String searchParam = (search != null && !search.isBlank()) ? search : null;

        return expenseRepository.findByFilters(userId, searchParam, categoryEnum, fromDate, toDate)
            .stream()
            .map(this::mapToExpenseResponse)
            .collect(Collectors.toList());
    }

    public List<ExpenseResponse> getRecentExpenses(Long userId) {
        userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
        return expenseRepository.findTop5ByUserIdOrderByDateDesc(userId)
            .stream()
            .map(this::mapToExpenseResponse)
            .collect(Collectors.toList());
    }

    private Category parseCategory(String categoryStr) {
        try {
            return Category.valueOf(categoryStr);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid category: " + categoryStr +
                ". Valid categories are: Food, Travel, Shopping, Bills, Education, Others");
        }
    }

    private ExpenseResponse mapToExpenseResponse(Expense expense) {
        return new ExpenseResponse(
            expense.getId(),
            expense.getUser().getId(),
            expense.getDescription(),
            expense.getAmount(),
            expense.getCategory().name(),
            expense.getDate()
        );
    }
}
