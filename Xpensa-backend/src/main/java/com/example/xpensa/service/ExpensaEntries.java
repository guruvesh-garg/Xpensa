package com.example.xpensa.service;

import java.util.List;

import com.example.xpensa.model.ExpensaDTO;
import com.example.xpensa.model.ExpenseEntity;

public interface ExpensaEntries {
	
	String createEntries(List<ExpensaDTO> expensaDTO);
	
	List<ExpenseEntity> fetchEntries(int month, int year);
	
	String removeExpense(long id);
	
	String updateExpense(long id, ExpensaDTO expensaDTO);

}
