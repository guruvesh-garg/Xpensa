package com.example.xpensa.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.xpensa.model.ExpensaDTO;
import com.example.xpensa.model.ExpenseEntity;
import com.example.xpensa.service.ExpensaEntries;

@RestController
@RequestMapping("/expensa")
public class ExpensaRestController {
	
	 @Autowired
	    private ExpensaEntries expensaEntries;
	 
	 @GetMapping("/getAllExpense/{month}/{year}")
	 public ResponseEntity<List<ExpenseEntity>> getAllExpense(@PathVariable int month, @PathVariable int year) {
	     try {
	         List<ExpenseEntity> expenses = expensaEntries.fetchEntries(month, year);
	         if (expenses.isEmpty()) {
	             return ResponseEntity.noContent().build();  // 204 No Content if no expenses found
	         }
	         return ResponseEntity.ok(expenses);  // 200 OK with the list
	     } catch (Exception e) {
	         // Log error if needed
	         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	     }
	 }

	 	
	 	@DeleteMapping ("/removeExpense/{id}")
	 	public String removeExpense(@PathVariable long id) {
	 		return expensaEntries.removeExpense(id);
	 	}

	    @PostMapping ("/addExpense")
	    public String addExpense(@RequestBody List<ExpensaDTO> expensaDTO) {
	        return expensaEntries.createEntries(expensaDTO);
	    }
	    
	    @PutMapping("/updateExpense/{id}")
	    public String updateExpense(@PathVariable long id, @RequestBody ExpensaDTO expensaDTO) {
	    	return expensaEntries.updateExpense(id,expensaDTO);
	    }
	
	

}
