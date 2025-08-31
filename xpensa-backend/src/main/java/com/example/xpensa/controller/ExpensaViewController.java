package com.example.xpensa.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ExpensaViewController {
	
	 @GetMapping({
	        "/", 
	        "/login", 
	        "/signup", 
	        "/mode-selection", 
	        "/feed-data", 
	        "/view-data"
	    })
	    public String forwardToIndex() {
	        return "forward:/index.html";
	    }

}
