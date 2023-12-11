package com.mapstone.mapstone.restcontrollers;


import com.fasterxml.jackson.databind.util.JSONPObject;
import com.mapstone.mapstone.models.Country;
import com.mapstone.mapstone.models.Layer;
import com.mapstone.mapstone.models.Map;
import com.mapstone.mapstone.models.User;
import com.mapstone.mapstone.repositories.CountryRepository;
import com.mapstone.mapstone.repositories.LayerRepository;
import com.mapstone.mapstone.repositories.MapRepository;
import com.mapstone.mapstone.repositories.UserRepository;
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

    public MapsRestController(MapRepository mapDao, CountryRepository countryDao, UserRepository userDao, LayerRepository layerDao) {
        this.mapDao = mapDao;
        this.countryDao = countryDao;
        this.userDao = userDao;
        this.layerDao = layerDao;
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
        Map userMap = mapDao.getMapByUserId(loggedInUser.getId());
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

    }




