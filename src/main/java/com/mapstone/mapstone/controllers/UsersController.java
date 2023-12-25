package com.mapstone.mapstone.controllers;

import com.mapstone.mapstone.models.*;
import com.mapstone.mapstone.repositories.*;
import com.mapstone.mapstone.services.EmailService;
import com.mapstone.mapstone.services.RandomPasswordGenerator;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;

import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.validation.annotation.Validated;

import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Controller
@Validated
public class UsersController {

    private final UserRepository userDao;
    private final MapRepository mapDao;

    private final CountryRepository countryDao;

    private final LayerRepository layerDao;

    private final ImageRepository imageDao;
    private final CommentRepository commentDao;

    private final EntriesRepository entryDao;

    private final BadgesRepository badgeDao;
    private PasswordEncoder passwordEncoder;

    private final EmailService emailService;

    private final RandomPasswordGenerator randomPasswordGenerator;


    public UsersController(UserRepository userDao, MapRepository mapDao, PasswordEncoder passwordEncoder, CountryRepository countryDao, ImageRepository imageDao, LayerRepository layerDao, CommentRepository commentDao, EntriesRepository entryDao, BadgesRepository badgeDao, EmailService emailService, RandomPasswordGenerator randomPasswordGenerator) {
        this.userDao = userDao;
        this.mapDao = mapDao;
        this.passwordEncoder = passwordEncoder;
        this.countryDao = countryDao;
        this.imageDao = imageDao;
        this.layerDao = layerDao;
        this.commentDao = commentDao;
        this.entryDao = entryDao;
        this.badgeDao = badgeDao;
        this.emailService = emailService;
        this.randomPasswordGenerator = randomPasswordGenerator;
    }

    @GetMapping("/sign-up")
    public String displayRegistrationForm(Model model) {
        //send a new empty user object to the sign-up form
        model.addAttribute("user", new User());
        //send all the existing countries to the sign-up form so the user can select their country
        model.addAttribute("countries", countryDao.findAll());
        return "users/sign-up";
    }

    @PostMapping("/sign-up")
    public String createUser(@ModelAttribute User user, Model model) {

        //check if the username is taken
        User existingUser = userDao.findByUsername(user.getUsername());
        if (existingUser != null) {
            model.addAttribute("user", user);
            model.addAttribute("usernameError", "Username already exists");
            //if the username is taken, send the user back to the sign-up form
            return "users/sign-up";
        }

        //check if the email is taken
        User existingEmail = userDao.findByEmail(user.getEmail());
        if (existingEmail != null) {
            model.addAttribute("user", user);
            model.addAttribute("emailError", "Email already exists");
            //if the email is taken, send the user back to the sign-up form
            return "users/sign-up";
        }

        //hash the password
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        //set the hashed password on the user object
        user.setPassword(hashedPassword);
        //set a default avatar for the user using the default avatars api
        //default avatars will be in image with the users first initial of their first and last name
        user.setAvatar("https://ui-avatars.com/api/?name="+user.getFirstName()+"+"+user.getLastName()+"&background=0059ff&color=fff");
        //save the user object to the database
        userDao.save(user);
        //create a new map object for the user with default values
        Map userMap = new Map("#0059ff", "light-v11", "mercator", "2");
        userMap.setUser(user);
        userDao.save(user);
        mapDao.save(userMap);
        return "users/login";

    }

    @GetMapping("/profile")
    public String getProfilePage(Model model) {
        System.out.println("logged-in");
        //get the logged-in user
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        //send the logged-in user to the profile page

        //if first time logging in, set model attribute to first time and make boolean true
        //this is how we will know to display the tutorial for the first time the user logs in
        if (!loggedInUser.isHasLoggedIn()) {
            model.addAttribute("firstTime", true);
            User userFromDb = userDao.getOne(loggedInUser.getId());
            userFromDb.setHasLoggedIn(true);
            loggedInUser.setHasLoggedIn(true);
            userDao.save(userFromDb);
        }

        model.addAttribute("loggedIn", true);
        model.addAttribute("user", userDao.getOne(loggedInUser.getId()));
        //gets all comments made by logged-in user
        List<Comment> commentList = commentDao.findAllByMap_Id(loggedInUser.getMap().getId());
        model.addAttribute("commentList", commentList);
        //get the user's map
        Map userMap = mapDao.getMapByUserId(loggedInUser.getId());

        model.addAttribute("image", new Image());

        model.addAttribute("entry", new Entry());

        //send the user's map to the profile page
        model.addAttribute("map", userMap);
        return "users/profile";
    }

    @GetMapping("/viewprofile/{id}")
    public String viewGuestProfile(@PathVariable Long id, Model model) {
        model.addAttribute("comment", new Comment());
        //Checks if user is logged in
        //When not logged in a user, it will be called an anonymousUser
        if (SecurityContextHolder.getContext().getAuthentication().getPrincipal() != "anonymousUser") {
            model.addAttribute("loggedIn", true);
        } else {
            model.addAttribute("loggedIn", false);
        }
        User chosen = userDao.getReferenceById(id);
        model.addAttribute("user", chosen);

        Map userMap = mapDao.getMapByUserId(chosen.getId());
        List<Comment> commentList = commentDao.findAllByMap_Id(userMap.getId());
        model.addAttribute("commentList", commentList);
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
        loggedInUser.setAvatar(avatarUrl);
        User userFromDb = userDao.getOne(loggedInUser.getId());
        userFromDb.setAvatar(avatarUrl);
        //save the user object to the database
        userDao.save(userFromDb);
        return "redirect:/profile";
    }


    @PostMapping("/delete-profile")
    public String performLogout(Authentication authentication, HttpServletRequest request, HttpServletResponse response) {
        SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();
        System.out.println("did this work?");
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        //delete the user from the database
        userDao.deleteById(loggedInUser.getId());
        // force logout
       logoutHandler.logout(request, response, authentication);
        return "redirect:/login";
    }


    @GetMapping("/forgot-password")
    public String displayForgotPasswordForm() {
        return "users/password-reset";
    }

    @PostMapping("/password-reset")
    public String resetPassword(@RequestParam(name = "email") String email, Model model) {
        //check if the email exists in the database
        User existingEmail = userDao.findByEmail(email);
        if (existingEmail == null) {
            model.addAttribute("emailError", "Email does not exist");
            //if the email does not exist, send the user back to the login page
            return "users/password-reset";
        }
        //generate a random password
        String randomPassword = RandomPasswordGenerator.generateRandomPassword();

        //hash the random password
        String hashedPassword = passwordEncoder.encode(randomPassword);

        //set the hashed password on the user object
        existingEmail.setPassword(hashedPassword);
        //save the user object to the database
        userDao.save(existingEmail);
        //send the user an email with the new password
        emailService.prepareAndSend(existingEmail, "Password Reset", "Your temporary password is: " + randomPassword + "Please return to the 'Finish retting your password' page or use this link to complete your password reset localhost/8080/change-password");

        //if the above was successful, send this user to the user to the change password page alon with this message
        model.addAttribute("success", "Check your email to retrieve your temporary password, then comeback here to set a new password.");

        return "users/change-password";
    }

    @PostMapping("/change-password")
    public String setPassword(@RequestParam(name="email") String email, @RequestParam(name="password") String password, @RequestParam(name="tempPassword") String tempPassword, Model model) {

        User existingUser = userDao.findByEmail(email);

        if (existingUser == null) {
            model.addAttribute("emailError", "Email does not exist.");
            return "users/change-password";
        }

        //check if the temp password matches the hash of the password in the database
        boolean matches = passwordEncoder.matches(tempPassword, existingUser.getPassword());


        if (!matches) {
            model.addAttribute("tempPasswordError", "Invalid temporary password.");
             return "users/change-password";

        }

        String hashedPassword = passwordEncoder.encode(password);

        existingUser.setPassword(hashedPassword);

        userDao.save(existingUser);

        model.addAttribute("passwordSetSuccess", "Your password has been updated successfully! Please log in!");

        return "users/login";
    }


}

