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

        //get the logged in users map
        Map map = user.getMap();

        List<Country> countries = countryDao.getAllByUsers_Id(loggedInUser.getId());

        //send a new empty user object to the create entry form
        model.addAttribute("entry", new Entry());

        model.addAttribute("countries", countries);

        model.addAttribute("user", user);

        model.addAttribute("map", map);

        return "/users/create-entry";
    }

    @PostMapping("/create-entries")
    public String createEntry(@ModelAttribute Entry entry, @RequestParam(name = "entry-date") String date, @RequestParam(name = "country-id") long id) {
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

    @GetMapping("/edit-entries")
    public String displayEditEntryForm(Model model) {
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<Entry> userEntries = entryDao.getEntriesByUser_Id(loggedInUser.getId());



        //send a new empty user object to the create entry form
        model.addAttribute("entries", userEntries);

        model.addAttribute("map", loggedInUser.getMap());

        return "/users/edit-entry";
    }

    @PostMapping("/edit-entries")
    public String editEntry(@RequestParam (name = "entry-id") long id, @RequestParam (name = "entry-title") String title, @RequestParam (name = "entry-date") String date, @RequestParam (name = "entry-description") String description) {

        Entry userEntry = entryDao.getOne(id);

        userEntry.setTitle(title);
        userEntry.setDate(date);
        userEntry.setDescription(description);

        entryDao.save(userEntry);


        return "redirect:/profile";
    }

    @PostMapping("/delete-entries")
    public String deleteEntries(@RequestParam (name = "entry-id") long id){

        entryDao.deleteById(id);

        return "redirect:/profile";
    }

}
