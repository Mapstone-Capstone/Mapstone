package com.mapstone.mapstone.controllers;

import com.mapstone.mapstone.models.Country;
import com.mapstone.mapstone.models.Layer;
import com.mapstone.mapstone.models.Map;
import com.mapstone.mapstone.models.User;
import com.mapstone.mapstone.repositories.CountryRepository;
import com.mapstone.mapstone.repositories.LayerRepository;
import com.mapstone.mapstone.repositories.MapRepository;
import com.mapstone.mapstone.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.ArrayList;
import java.util.List;

@Controller
public class MapsController {

    public final MapRepository mapDao;

    public final UserRepository userDao;

    public final CountryRepository countryDao;

    public final LayerRepository layerDao;

    public MapsController(MapRepository mapDao, CountryRepository countryDao, UserRepository userDao, LayerRepository layerDao) {
        this.mapDao = mapDao;
        this.userDao = userDao;
        this.countryDao = countryDao;
        this.layerDao = layerDao;
    }

    //updates the map style
    @PostMapping("/update")
    public String updateMap(@ModelAttribute("map") Map map, Model model) {
        Map mapToSave = mapDao.getMapById(map.getId());
        mapToSave.setStyle(map.getStyle());
        mapToSave.setColor(map.getColor());
        mapToSave.setZoom(map.getZoom());
        mapToSave.setProjection(map.getProjection());
        mapDao.save(mapToSave);
        model.addAttribute("map", mapToSave);
        return "redirect:/profile";
    }


    @PostMapping("/reset")
    public String resetMap(@ModelAttribute("map") Map map, Model model) {
        //get the logged-in user
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userDao.getById(loggedInUser.getId());
        Map mapToReset = mapDao.getMapById(map.getId());
        //delete the layers that belong to the map (must be done before deleting the map because of foreign key constraints)

        List<Layer> layersToDelete = layerDao.getLayersByMap(mapToReset);
        layerDao.deleteAll(layersToDelete);

        //save the map with no layers
        mapDao.save(mapToReset);
        //get all the countries that belong to the user and delete them
        user.setCountries(new ArrayList<>());

        //get the users list of badges and delete them
        user.setBadges(new ArrayList<>());
        loggedInUser.setBadges(new ArrayList<>());
        userDao.save(user);
        //update the logged-in user principal to reflect the changes when the user is redirected to the profile page

        loggedInUser.setCountries(new ArrayList<>());
        //now set default map values and save the map
        mapToReset.setColor("#0059ff");
        mapToReset.setStyle("light-v11");
        mapToReset.setProjection("mercator");
        mapToReset.setZoom("2");
        mapDao.save(mapToReset);
        //send the new map to the profile page
        model.addAttribute("map", mapToReset);
        return "redirect:/profile";
    }

}
