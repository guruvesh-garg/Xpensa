package com.example.xpensa.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class ExpenseEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long entryID;
	
	private LocalDate date;
	
	private int amount;
	
	private String type;
	
	private String subType;
	
	@ManyToOne
	@JoinColumn(name = "user_id")
	private UserEntity user;


	public UserEntity getUser() {
		return user;
	}

	public void setUser(UserEntity user) {
		this.user = user;
	}

	public Long getEntryID() {
		return entryID;
	}

	public void setEntryID(Long entryID) {
		this.entryID = entryID;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public int getAmount() {
		return amount;
	}

	public void setAmount(int amount) {
		this.amount = amount;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getSubType() {
		return subType;
	}

	public void setSubType(String subType) {
		this.subType = subType;
	}

	@Override
	public String toString() {
		return "ExpenseEntity [entryID=" + entryID + ", date=" + date + ", amount=" + amount + ", type=" + type
				+ ", subType=" + subType + "]";
	}

}
