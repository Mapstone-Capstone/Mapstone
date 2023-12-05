package com.mapstone.mapstone.controllers;

import com.mapstone.mapstone.models.Map;
import com.mapstone.mapstone.models.User;
import com.mapstone.mapstone.repositories.CountryRepository;
import com.mapstone.mapstone.repositories.MapRepository;
import com.mapstone.mapstone.repositories.UserRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class ViewProfile {
    private UserRepository userDao;
    private MapRepository mapDao;
    private CountryRepository countryDao;

    @GetMapping("/viewprofile/{id}")
    public String viewGuestProfile(@PathVariable int id, Model model){
        User chosen = userDao.findById(id);
        model.addAttribute("user",chosen);
        Map userMap = mapDao.getMapByUserId(chosen.getId());
        model.addAttribute("countries", countryDao.getAllByUsers_Id(chosen.getId()));
        model.addAttribute("map", userMap);

        return "users/viewprofile";
    }
}
