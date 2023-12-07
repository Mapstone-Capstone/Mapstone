package com.mapstone.mapstone.controllers;

import com.mapstone.mapstone.models.Country;
import com.mapstone.mapstone.models.Map;
import com.mapstone.mapstone.models.User;
import com.mapstone.mapstone.repositories.CountryRepository;
import com.mapstone.mapstone.repositories.MapRepository;
import com.mapstone.mapstone.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class UsersController {

    private final UserRepository userDao;
    private final MapRepository mapDao;

    private final CountryRepository countryDao;
    private PasswordEncoder passwordEncoder;

    public UsersController(UserRepository userDao, MapRepository mapDao, PasswordEncoder passwordEncoder, CountryRepository countryDao) {
        this.userDao = userDao;
        this.mapDao = mapDao;
        this.passwordEncoder = passwordEncoder;
        this.countryDao = countryDao;
    }

    @GetMapping("/sign-up")
    public String displayRegistrationForm(Model model) {
        //send a new empty user object to the sign-up form
        model.addAttribute("user", new User());
        return "/users/sign-up";
    }

    @PostMapping("/sign-up")
    public String createUser(@ModelAttribute @Valid User user, BindingResult result, Model model) {

        //check for validation errors
        if (result.hasErrors()) {
            //if there are errors, send the errors back to the form
            model.addAttribute("errors", result.getAllErrors());
            //send the user object back to the form so the user doesn't have to re-enter the information
            model.addAttribute("user", user);
            return "users/sign-up";
        }
        //hash the password
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        //set the hashed password on the user object
        user.setPassword(hashedPassword);
        //save the user object to the database
        userDao.save(user);
        //create a new map object for the user with default values
        Map userMap = new Map("#0059ff", "light-v11", "naturalEarth", "1" );
        userMap.setUser(user);
        mapDao.save(userMap);
        return "redirect:/login";
    }

    @GetMapping("/profile")
    public String getProfilePage(Model model) {
        //get the logged-in user
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        //send the logged-in user to the profile page
        model.addAttribute("user", userDao.getOne(loggedInUser.getId()));

        //get the user's map
        Map userMap = mapDao.getMapByUserId(loggedInUser.getId());

        model.addAttribute("country", new Country());

        //TODO:get the users list of countries visited
//        model.addAttribute("countries", countryDao.getAllByUsers_Id(loggedInUser.getId()));

        //send the user's map to the profile page
        model.addAttribute("map", userMap);
        return "users/profile";
    }



}
