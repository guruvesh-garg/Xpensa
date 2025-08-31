package com.example.xpensa.service;

import java.util.List;

import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;

import com.example.xpensa.model.ExpensaDTO;
import com.example.xpensa.model.ExpenseEntity;

public interface ExpensaEntries {

    String createEntries(List<ExpensaDTO> expensaDTO, OAuth2AuthenticationToken authentication);

    List<ExpenseEntity> fetchEntries(int month, int year, OAuth2AuthenticationToken authentication);

    String removeExpense(long id, OAuth2AuthenticationToken authentication);

    String updateExpense(long id, ExpensaDTO expensaDTO, OAuth2AuthenticationToken authentication);
}