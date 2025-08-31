package com.example.xpensa.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import com.example.xpensa.model.ExpensaDTO;
import com.example.xpensa.model.ExpenseEntity;
import com.example.xpensa.service.ExpensaEntries;

@RestController
@RequestMapping("/expensa")
public class ExpensaRestController {

    @Autowired
    private ExpensaEntries expensaEntries;

    @GetMapping("/getAllExpense/{month}/{year}")
    public ResponseEntity<List<ExpenseEntity>> getAllExpense(@PathVariable int month, @PathVariable int year, OAuth2AuthenticationToken auth) {
        List<ExpenseEntity> expenses = expensaEntries.fetchEntries(month, year, auth);
        return expenses.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(expenses);
    }

    @PostMapping("/addExpense")
    public String addExpense(@RequestBody List<ExpensaDTO> dto, OAuth2AuthenticationToken auth) {
        return expensaEntries.createEntries(dto, auth);
    }

    @DeleteMapping("/removeExpense/{id}")
    public String removeExpense(@PathVariable long id, OAuth2AuthenticationToken auth) {
        return expensaEntries.removeExpense(id, auth);
    }

    @PutMapping("/updateExpense/{id}")
    public String updateExpense(@PathVariable long id, @RequestBody ExpensaDTO dto, OAuth2AuthenticationToken auth) {
        return expensaEntries.updateExpense(id, dto, auth);
    }

}
