package com.mapstone.mapstone.controllers;


import com.mapstone.mapstone.models.Country;
import com.mapstone.mapstone.models.User;
import com.mapstone.mapstone.repositories.CountryRepository;
import com.mapstone.mapstone.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class CountriesController {


    public final CountryRepository countryDao;
    public final UserRepository userDao;

    public CountriesController(UserRepository userDao, CountryRepository countryDao) {
        this.userDao = userDao;
        this.countryDao = countryDao;
    }

    //gets the stringified list of countries from the front end and adds them to the user's list of countries
//    @PostMapping("/country")
//    public String addCountry(@RequestParam String countryName) {
//        //get the logged in user
//        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//
//        //split the string into an array
//        String[] countryArray = countryName.split(",");
//        for (int i = 0; i < countryArray.length; i++) {
//            System.out.println(countryArray[i]);
//        }
//        User user = userDao.findByUsername(loggedInUser.getUsername());
//
//        //get the current list of countries the user has visited
//        List<Country> countries = user.getCountries();
//        //loop through the array of countries clicked
//        for (int i = 0; i < countryArray.length; i++) {
//            //get the country object from the database so we have the id to add to the user
//            Country country = countryDao.getCountryByName(countryArray[i]);
//            //only add the country to the user if it doesn't already exist in the user's list of countries
//            if (!countries.contains(country)) {
//                countries.add(country);
//            }
//        }
//
//        user.setCountries(countries);
//
//        userDao.save(user);
//        return "redirect:/profile";
//
//    }


    @PostMapping("/country")
    public String addCountry(@RequestParam(name="country-name") String countryName) {
        //get the logged in user
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userDao.findByUsername(loggedInUser.getUsername());

        //get the current list of countries the user has visited
        List<Country> countries = user.getCountries();
        //get the country object from the database so we have the id to add to the user
        Country country = countryDao.getCountryByName(countryName);
        //add the country to the users list of countries
        countries.add(country);
        user.setCountries(countries);

        userDao.save(user);
        return "redirect:/profile";

    }


}
