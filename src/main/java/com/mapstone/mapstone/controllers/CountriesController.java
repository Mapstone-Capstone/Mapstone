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






}
