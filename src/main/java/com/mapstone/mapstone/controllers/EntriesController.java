package com.mapstone.mapstone.controllers;

import com.mapstone.mapstone.models.Country;
import com.mapstone.mapstone.models.Entry;

import com.mapstone.mapstone.models.Map;
import com.mapstone.mapstone.models.User;
import com.mapstone.mapstone.repositories.CountryRepository;
import com.mapstone.mapstone.repositories.EntriesRepository;
import com.mapstone.mapstone.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class EntriesController {

    public final EntriesRepository entryDao;

    public final CountryRepository countryDao;

    public final UserRepository userDao;

    public EntriesController(EntriesRepository entryDao, CountryRepository countryDao, UserRepository userDao) {
        this.entryDao = entryDao;
        this.countryDao = countryDao;
        this.userDao = userDao;
    }

    @GetMapping("/create-entries")
    public String displayCreateEntryForm(Model model) {

        //get the logged-in user
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userDao.getReferenceById(loggedInUser.getId());

        List<Country> countries = countryDao.getAllByUsers_Id(loggedInUser.getId());

        //send a new empty user object to the create entry form
        model.addAttribute("entry", new Entry());

        model.addAttribute("countries", countries);

        model.addAttribute("user", user);

        return "/users/create-entry";
    }

    @PostMapping("/create-entries")
    public String createEntry(@ModelAttribute Entry entry, @RequestParam(name = "entry-date") String date, @RequestParam(name = "country-id") long id, Model model) {
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        System.out.println("TEST");

        User user = userDao.getOne(loggedInUser.getId());

        Country country = countryDao.getCountryById(id);

        entry.setCountry(country);
        entry.setDate(date);
        entry.setUser(user);

        entryDao.save(entry);

        return "redirect:/profile";

    }

    @GetMapping("/edit-entries/{id}")
    public String displayEditEntryForm(@PathVariable long id, Model model) {
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Entry userEntry = entryDao.getEntryByIdAndUser_Id(id, loggedInUser.getId());

        //send a new empty user object to the create entry form
        model.addAttribute("entry", userEntry);

        return "/users/edit-entry";
    }

    @PostMapping("/edit-entries")
    public String editEntry(@ModelAttribute Entry entry, @RequestParam (name = "entry-id") long id) {

        Entry userEntry = entryDao.getOne(id);

        userEntry.setTitle(entry.getTitle());
        userEntry.setDate(entry.getDate());
        userEntry.setDescription(entry.getDescription());

        entryDao.save(userEntry);


        return "redirect:/profile";
    }

}
