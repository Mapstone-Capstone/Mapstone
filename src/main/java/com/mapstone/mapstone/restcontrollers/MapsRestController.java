package com.mapstone.mapstone.restcontrollers;


import com.mapstone.mapstone.models.Map;
import com.mapstone.mapstone.repositories.MapRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MapsRestController {

    public final MapRepository mapDao;

    public MapsRestController(MapRepository mapDao) {
        this.mapDao = mapDao;
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



}
