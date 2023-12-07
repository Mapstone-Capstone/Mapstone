package com.mapstone.mapstone.controllers;

import com.mapstone.mapstone.models.User;
import com.mapstone.mapstone.repositories.UserRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class SearchbarController {
    private UserRepository userDao;

    SearchbarController(UserRepository userDao){
        this.userDao= userDao;
    }

    @PostMapping("/search")
    public String search(@RequestParam(name = "search") String searchinput, Model model){
        List<User>listOfUsers = userDao.findAllByUsernameContainsIgnoreCase(searchinput);
        model.addAttribute("userList",listOfUsers);
        return "users/search";
    }
}
