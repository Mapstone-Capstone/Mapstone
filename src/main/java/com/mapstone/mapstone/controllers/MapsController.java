package com.mapstone.mapstone.controllers;

import com.mapstone.mapstone.models.Map;
import com.mapstone.mapstone.models.User;
import com.mapstone.mapstone.repositories.CountryRepository;
import com.mapstone.mapstone.repositories.MapRepository;
import com.mapstone.mapstone.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class MapsController {

    public final MapRepository mapDao;

    public final UserRepository userDao;

    public final CountryRepository countryDao;

    public MapsController(MapRepository mapDao, CountryRepository countryDao, UserRepository userDao) {
        this.mapDao = mapDao;
        this.userDao = userDao;
        this.countryDao = countryDao;
    }

    @PostMapping("/update")
    public String updateMap(@ModelAttribute("map") Map map, Model model) {

        mapDao.save(map);
        model.addAttribute("map", map);
        return "redirect:/profile";
    }

    @PostMapping("/reset")
    public String resetMap(@ModelAttribute("map") Map map, Model model) {
        //get the user from the map, delete the map, create a new map with the same user
        mapDao.delete(map);
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Map newMap = new Map("#0059ff", "light-v11", "naturalEarth", "1" );
        newMap.setUser(loggedInUser);
        mapDao.save(newMap);
        //deletes all entries for this user in the user_country table
        countryDao.deleteAll(loggedInUser.getCountries());
        model.addAttribute("map", newMap);
        return "redirect:/profile";
    }


}
