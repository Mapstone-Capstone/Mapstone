package com.mapstone.mapstone.controllers;

import com.mapstone.mapstone.models.Country;
import com.mapstone.mapstone.models.Map;
import com.mapstone.mapstone.models.User;
import com.mapstone.mapstone.repositories.CountryRepository;
import com.mapstone.mapstone.repositories.MapRepository;
import com.mapstone.mapstone.repositories.UserRepository;
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

    @GetMapping("/viewprofile/{id}")
    public String viewGuestProfile(@PathVariable Long id, Model model){
        int count = 0;
        User chosen = userDao.getReferenceById(id);
        model.addAttribute("user",chosen);
        Map userMap = mapDao.getMapByUserId(chosen.getId());
        List<Country> list = countryDao.getAllByUsers_Id(chosen.getId());
        model.addAttribute("countries", list);
        model.addAttribute("map", userMap);
        System.out.println("HEYYYYYYY");
        System.out.println(chosen.getUsername());
        for (Country hi: list) {
            System.out.println(count);
        }
        return "users/viewprofile";
    }
}
