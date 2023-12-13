package com.mapstone.mapstone.restcontrollers;


import com.fasterxml.jackson.databind.util.JSONPObject;
import com.mapstone.mapstone.models.*;
import com.mapstone.mapstone.repositories.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MapsRestController {

    public final MapRepository mapDao;

    public final UserRepository userDao;

    public final CountryRepository countryDao;

    public final LayerRepository layerDao;

    public final BadgesRepository badgesDao;

    public MapsRestController(MapRepository mapDao, CountryRepository countryDao, UserRepository userDao, LayerRepository layerDao, BadgesRepository badgesDao) {
        this.mapDao = mapDao;
        this.countryDao = countryDao;
        this.userDao = userDao;
        this.layerDao = layerDao;
        this.badgesDao = badgesDao;
    }

    //returns the map details (color, style, projection, and zoom) as a Map object
    @GetMapping("/api/map/details" + "/{id}")
    public Map getMapDetails(@PathVariable long id) {
        return mapDao.getMapById(id);
    }

    //post endpoint to update map details
    @PostMapping("/api/map/update")
    public Map updateMap(@RequestBody Map map) {
        //get the logged-in user
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        //get the map from the database
        Map mapToUpdate = mapDao.getMapByUserId(loggedInUser.getId());
        //update the map details
        mapToUpdate.setColor(map.getColor());
        mapToUpdate.setStyle(map.getStyle());
        mapToUpdate.setProjection(map.getProjection());
        mapToUpdate.setZoom(map.getZoom());
        //save the map
        mapDao.save(mapToUpdate);

        loggedInUser.setMap(mapToUpdate);

        return mapToUpdate;

    }


    //post endpoint to add country to user_countries table
    @PostMapping("/api/country/add")
    public List<Country> addCountry(@RequestBody Country country) {
        //get the logged-in user
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        //get the country from the database
        Country countryToAdd = countryDao.getCountryByName(country.getName());
        //add the country to the user's list of countries
        User user = userDao.getOne(loggedInUser.getId());
        //if the country is already in the user's list of countries, remove it, otherwise add it
        if (user.getCountries().contains(countryToAdd)) {
            user.getCountries().remove(countryToAdd);
        } else {
            user.getCountries().add(countryToAdd);
            loggedInUser.getCountries().add(countryToAdd);
        }
        //save the user so the country is added to the user_countries table
        userDao.save(user);
        //get the updated list of countries so we can determine if a new badge should be given to the user
        List<Country> updatedCountries = user.getCountries();
        //Also get the list of badges that user already has
        List<Badge> userBadges = user.getBadges();
        //user has visited at least one country
        if (updatedCountries.size() >= 1 && !userBadges.contains(badgesDao.getReferenceById(1))) {
            userBadges.add(badgesDao.getOne(1));
            loggedInUser.getBadges().add(badgesDao.getOne(1));
        }
        //user has visited at least 5 countries
        if (updatedCountries.size() >= 5 && !userBadges.contains(badgesDao.getReferenceById(4))) {
            userBadges.add(badgesDao.getOne(4));
            loggedInUser.getBadges().add(badgesDao.getOne(4));
        }
        //user has visited at least 10 countries
        if (updatedCountries.size() >= 10 && !userBadges.contains(badgesDao.getReferenceById(5))) {
            userBadges.add(badgesDao.getOne(5));
            loggedInUser.getBadges().add(badgesDao.getOne(5));
        }
        userDao.save(user);
        //return the list of countries
        return countryDao.getAllByUsers_Id(loggedInUser.getId());
    }


    @PostMapping("/api/map/layer/add")
    public List<Layer> updateMapLayers(@RequestBody Layer newLayer) {
        //get the logged-in user
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        //set the map for the layer
        newLayer.setMap(mapDao.getMapByUserId(loggedInUser.getId()));
        //get the user
        User user = userDao.getOne(loggedInUser.getId());
        Map userMap = mapDao.getMapByUserId(loggedInUser.getId());

        //get all the layers for the map and loop through them, if the name of the layer being added matches the name of a layer already in the map, remove it
        for (Layer layer : userMap.getLayers()) {
            if (layer.getName().equals(newLayer.getName())) {
                userMap.getLayers().remove(layer);
                break;
            }
        }
        //add the new layer to the map
        userMap.getLayers().add(newLayer);

        try {
            userDao.save(user);
            mapDao.save(userMap);
        } catch (Exception e) {
            //remove the layer from the map where the duplicate error occurred
            userMap.getLayers().remove(newLayer);
            mapDao.save(userMap);
        }
        //return the list of layers
        return userMap.getLayers();
    }


    @GetMapping("/api/map/layers")
    public List<Layer> getMapLayers() {
        //get the logged-in user
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        //get the map from the database
        Map userMap = mapDao.getMapById(loggedInUser.getMap().getId());
        //get the list of layers
        return layerDao.getAllByMap_Id(userMap.getId());
    }


    @GetMapping("/api/map/layers" + "/{id}")
    public List<Layer> getViewOnlyMapLayers(@PathVariable long id) {
        //get the user by id
        User user = userDao.getReferenceById(id);
        //get the map from the database
        Map userMap = mapDao.getMapById(user.getMap().getId());
        //get the list of layers
        return layerDao.getAllByMap_Id(userMap.getId());
    }

    //get all the names of the countries that belong to the logged-in user as a string to it can be parsed as valid JSON
    @GetMapping("/api/countries")
    public String getCountries() {
        //get the logged-in user
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        //get the list of countries
        JSONPObject countries = new JSONPObject("countries", countryDao.getAllByUsers_Id(loggedInUser.getId()));
        //return JUST THE STRINGIFIED COUNTRY DATA SO IT CAN BE PARSED AS VALID JSON
        return countries.toString();
    }


    @GetMapping("/api/badges" + "/{id}")
    public List<Badge> getBadgesByUserId(@PathVariable long id) {
        //get the map from the id
        Map userMap = mapDao.getMapById(id);
        //get the user from the map
        User user = userDao.getOne(userMap.getUser().getId());
        //return the list of badges that belong to the user with the given id
        return userDao.getOne(user.getId()).getBadges();
    }

    @GetMapping("/api/country" + "/{id}")
    public Country getCountryNameById(@PathVariable long id) {
        System.out.println(id);

        return countryDao.getCountryById(id);
    }




}




