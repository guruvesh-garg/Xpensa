package com.example.xpensa.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;

import com.example.xpensa.model.ExpensaDTO;
import com.example.xpensa.model.ExpenseEntity;
import com.example.xpensa.model.UserEntity;
import com.example.xpensa.repository.ExpensaRepo;
import com.example.xpensa.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class ExpensaEntriesImpl implements ExpensaEntries {

    @Autowired
    private ExpensaRepo expensaRepo;

    @Autowired
    private UserRepository userRepository;

    private UserEntity getCurrentUser(OAuth2AuthenticationToken authentication) {
        String email = authentication.getPrincipal().getAttribute("email");
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    @Override
    public List<ExpenseEntity> fetchEntries(int month, int year, OAuth2AuthenticationToken authentication) {
        UserEntity user = getCurrentUser(authentication);
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        return expensaRepo.findByUserAndDateBetween(user, start, end);
    }

    @Override
    public String removeExpense(long id, OAuth2AuthenticationToken authentication) {
        ExpenseEntity entity = expensaRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        UserEntity user = getCurrentUser(authentication);
        if (!entity.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        expensaRepo.deleteById(id);
        return "Deleted successfully.";
    }

    @Override
    public String createEntries(List<ExpensaDTO> dtoList, OAuth2AuthenticationToken authentication) {
        UserEntity user = getCurrentUser(authentication);
        List<ExpenseEntity> newExpenses = new ArrayList<>();

        for (ExpensaDTO dto : dtoList) {
            ExpenseEntity entity = new ExpenseEntity();
            entity.setAmount(dto.getAmount());
            entity.setDate(dto.getDate());
            entity.setType(dto.getType());
            entity.setSubType(dto.getSubType());
            entity.setUser(user); 
            newExpenses.add(entity);
        }

        expensaRepo.saveAll(newExpenses);
        return newExpenses.size() + " entries added.";
    }

    @Transactional
    @Override
    public String updateExpense(long id, ExpensaDTO dto, OAuth2AuthenticationToken authentication) {
        ExpenseEntity entity = expensaRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        UserEntity user = getCurrentUser(authentication);
        if (!entity.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        entity.setAmount(dto.getAmount());
        entity.setSubType(dto.getSubType());
        // repo.save(entity); // unnecessary due to @Transactional
        return "Updated";
    }
}
