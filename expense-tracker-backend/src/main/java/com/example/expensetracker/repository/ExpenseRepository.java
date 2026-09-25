package com.example.expensetracker.repository;

import com.example.expensetracker.entity.Category;
import com.example.expensetracker.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserIdOrderByDateDesc(Long userId);

    List<Expense> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDate fromDate, LocalDate toDate);

    List<Expense> findByUserIdAndCategoryOrderByDateDesc(Long userId, Category category);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId")
    BigDecimal getTotalExpenseByUserId(@Param("userId") Long userId);

    @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.user.id = :userId GROUP BY e.category")
    List<Object[]> getCategorySummaryByUserId(@Param("userId") Long userId);

    @Query("SELECT MONTH(e.date), YEAR(e.date), SUM(e.amount) FROM Expense e WHERE e.user.id = :userId GROUP BY YEAR(e.date), MONTH(e.date) ORDER BY YEAR(e.date), MONTH(e.date)")
    List<Object[]> getMonthlySummaryByUserId(@Param("userId") Long userId);

    @Query("SELECT e FROM Expense e WHERE e.user.id = :userId " +
           "AND (:search IS NULL OR LOWER(e.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:category IS NULL OR e.category = :category) " +
           "AND (:fromDate IS NULL OR e.date >= :fromDate) " +
           "AND (:toDate IS NULL OR e.date <= :toDate) " +
           "ORDER BY e.date DESC")
    List<Expense> findByFilters(
        @Param("userId") Long userId,
        @Param("search") String search,
        @Param("category") Category category,
        @Param("fromDate") LocalDate fromDate,
        @Param("toDate") LocalDate toDate
    );

    List<Expense> findTop5ByUserIdOrderByDateDesc(Long userId);
}
