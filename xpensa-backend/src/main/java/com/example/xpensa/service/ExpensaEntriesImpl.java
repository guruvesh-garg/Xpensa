package com.example.xpensa.service;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.xpensa.model.ExpensaDTO;
import com.example.xpensa.model.ExpenseEntity;
import com.example.xpensa.repository.ExpensaRepo;

import jakarta.transaction.Transactional;

@Service
public class ExpensaEntriesImpl implements ExpensaEntries {

	@Autowired
	private ExpensaRepo expensaRepo;

	@Override
	public List<ExpenseEntity> fetchEntries(int month, int year) {
	    LocalDate start = LocalDate.of(year, month, 1);
	    LocalDate end = start.withDayOfMonth(start.lengthOfMonth()); // Gets last day of month

	    return expensaRepo.findByDateBetween(start, end);
	}

	@Override
	public String removeExpense(long id) {
	    LocalDate tempDate = expensaRepo.getById(id).getDate();
	    int amount = expensaRepo.getById(id).getAmount();
	    expensaRepo.deleteById(id);
	    return "Your Expense for " + tempDate + " with amount " + amount + " is Deleted Successfully.";
	}

	@Override
	public String createEntries(List<ExpensaDTO> expensaDTOList) {
	    List<ExpenseEntity> newExpenses = new ArrayList<>();

	    for (ExpensaDTO dto : expensaDTOList) {
	        ExpenseEntity entity = new ExpenseEntity();
	        entity.setAmount(dto.getAmount());
	        entity.setDate(dto.getDate());
	        entity.setType(dto.getType());
	        entity.setSubType(dto.getSubType());
	        newExpenses.add(entity);
	    }

	    expensaRepo.saveAll(newExpenses); // Efficient batch save
	    return newExpenses.size() + " expense entries added successfully.";
	}

	@Transactional
	@Override
	public String updateExpense(long id, ExpensaDTO expensaDTO) {
	    expensaRepo.updateByID(id, expensaDTO.getAmount(), expensaDTO.getSubType());
	    return "updated";
	}


}
