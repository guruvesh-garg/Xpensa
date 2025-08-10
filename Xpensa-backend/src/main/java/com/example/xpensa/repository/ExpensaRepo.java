package com.example.xpensa.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.xpensa.model.ExpenseEntity;

public interface ExpensaRepo extends JpaRepository<ExpenseEntity, Long> {

	// Fetch all expenses between two dates
    List<ExpenseEntity> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Modifying
    @Query("UPDATE ExpenseEntity e SET e.amount = :amount, e.subType = :subType WHERE e.id = :id")
    void updateByID(@Param("id") long id, @Param("amount") int amount, @Param("subType") String subType);

	
}
