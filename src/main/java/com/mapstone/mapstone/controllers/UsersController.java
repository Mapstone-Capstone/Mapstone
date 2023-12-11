package com.mapstone.mapstone.controllers;

import com.mapstone.mapstone.models.*;
import com.mapstone.mapstone.repositories.*;
import jakarta.validation.Valid;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.validation.annotation.Validated;

import org.springframework.web.bind.annotation.*;

import javax.swing.*;
import java.util.List;

@Controller
@Validated
public class UsersController {

    private final UserRepository userDao;
    private final MapRepository mapDao;

    private final CountryRepository countryDao;

    private final LayerRepository layerDao;

    private final ImageRepository imageDao;
    private final CommentRepository commentDao;
    private PasswordEncoder passwordEncoder;

    public UsersController(UserRepository userDao, MapRepository mapDao, PasswordEncoder passwordEncoder, CountryRepository countryDao, ImageRepository imageDao, LayerRepository layerDao, CommentRepository commentDao) {
        this.userDao = userDao;
        this.mapDao = mapDao;
        this.passwordEncoder = passwordEncoder;
        this.countryDao = countryDao;
        this.imageDao = imageDao;
        this.layerDao = layerDao;
        this.commentDao = commentDao;
    }

    @GetMapping("/sign-up")
    public String displayRegistrationForm(Model model) {
        //send a new empty user object to the sign-up form
        model.addAttribute("user", new User());
        //send all the existing countries to the sign-up form so the user can select their country
        model.addAttribute("countries", countryDao.findAll());
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
        userDao.save(user);
        mapDao.save(userMap);
        return "redirect:/login";
    }

    @GetMapping("/profile")
    public String getProfilePage(Model model) {
        //get the logged-in user
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        //send the logged-in user to the profile page
        model.addAttribute("user", userDao.getOne(loggedInUser.getId()));
        //gets all comments made by logged in user
        List<Comment>commentList = commentDao.findAllByMap_Id(loggedInUser.getMap().getId());
        model.addAttribute("commentList",commentList);
        //get the user's map
        Map userMap = mapDao.getMapByUserId(loggedInUser.getId());


        //TODO:get the users list of countries visited
        //model.addAttribute("countries", countryDao.getAllByUsers_Id(loggedInUser.getId()));

        model.addAttribute("image", new Image());

        //send the user's map to the profile page
        model.addAttribute("map", userMap);

        return "users/profile";
    }
    @GetMapping("/viewprofile/{id}")
    public String viewGuestProfile(@PathVariable Long id, Model model){
        model.addAttribute("comment", new Comment());
        //Checks if user is logged in
        //When not logged in a user, it will be called an anonymousUser
        if(SecurityContextHolder.getContext().getAuthentication().getPrincipal()!="anonymousUser"){
            model.addAttribute("loggedIn",true);
        }else {
            model.addAttribute("loggedIn",false);
        }
        User chosen = userDao.getReferenceById(id);
        model.addAttribute("user",chosen);
        Map userMap = mapDao.getMapByUserId(chosen.getId());
        List<Comment>commentList = commentDao.findAllByMap_Id(userMap.getId());
        model.addAttribute("commentList",commentList);
        List<Country> list = countryDao.getAllByUsers_Id(chosen.getId());
        model.addAttribute("countries", list);
        model.addAttribute("map", userMap);
        return "users/viewprofile";
    }

@PostMapping("/profile-picture")
    public String updateProfilePicture(@RequestParam(name = "avatarUrl") String avatarUrl) {

    //get the logged-in user
    User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    //set the logged-in user's profile picture to the new profile picture
    User userFromDb = userDao.getOne(loggedInUser.getId());
    userFromDb.setAvatar(avatarUrl);


    //save the user object to the database
    userDao.save(userFromDb);

        return "redirect:/profile";
    }

    @GetMapping("/view")
    public String viewImages(@RequestParam(name = "viewImage") Model model){
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String image = imageDao.getImageByUser(loggedInUser).getImageUrl();

//        List<Country> listOfCountries =
//        model.addAttribute("image", image);
        return "/profile";
    }
}

