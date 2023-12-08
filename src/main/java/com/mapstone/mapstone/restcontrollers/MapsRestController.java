package com.mapstone.mapstone.restcontrollers;


import com.mapstone.mapstone.models.Country;
import com.mapstone.mapstone.models.Map;
import com.mapstone.mapstone.models.User;
import com.mapstone.mapstone.repositories.CountryRepository;
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

    public MapsRestController(MapRepository mapDao, CountryRepository countryDao, UserRepository userDao ) {
        this.mapDao = mapDao;
        this.countryDao = countryDao;
        this.userDao = userDao;
    }

    //returns the map data (layers, markers, etc) as a string, must be handled separately from the map details because it needs to be parsed by the map
    @GetMapping("/api/map" + "/{id}")
    public String getMap(@PathVariable long id) {
        return mapDao.getMapById(id).getData();
    }

    //returns the map details (color, style, projection, and zoom) as a Map object
    @GetMapping("/api/map/details" + "/{id}")
    public Map getMapDetails(@PathVariable long id) {
        return mapDao.getMapById(id);
    }


    //post endpoint to add country to user_countries table
    @PostMapping("/api/country/add")
    public List<Country> addCountry(@RequestBody Country country)  {
        System.out.println("test");
        //get the logged-in user
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        //get the country from the database
       Country countryToAdd = countryDao.getCountryByName(country.getName());
        //add the country to the user's list of countries
        User user = userDao.getOne(loggedInUser.getId());
        user.getCountries().add(countryToAdd);

        //save the user so the country is added to the user_countries table
        userDao.save(user);
        //return the list of countries
        return countryDao.getAllByUsers_Id(loggedInUser.getId());
    }



}
