package com.mapstone.mapstone.controllers;

import com.mapstone.mapstone.models.Country;
import com.mapstone.mapstone.models.Map;
import com.mapstone.mapstone.models.User;
import com.mapstone.mapstone.repositories.CountryRepository;
import com.mapstone.mapstone.repositories.MapRepository;
import com.mapstone.mapstone.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Controller
public class ViewProfile {
    private UserRepository userDao;
    private MapRepository mapDao;
    private CountryRepository countryDao;

    public ViewProfile(UserRepository userDao, MapRepository mapDao, CountryRepository countryDao) {
        this.userDao = userDao;
        this.mapDao = mapDao;
        this.countryDao = countryDao;
    }


}
