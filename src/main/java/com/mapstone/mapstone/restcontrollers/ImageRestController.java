package com.mapstone.mapstone.restcontrollers;


import com.mapstone.mapstone.models.Country;
import com.mapstone.mapstone.models.Image;
import com.mapstone.mapstone.models.Map;
import com.mapstone.mapstone.models.User;
import com.mapstone.mapstone.repositories.CountryRepository;
import com.mapstone.mapstone.repositories.ImageRepository;
import com.mapstone.mapstone.repositories.MapRepository;
import com.mapstone.mapstone.repositories.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ImageRestController {

    private final ImageRepository imageDao;
    private  final CountryRepository countryDao;

    private final MapRepository mapDao;

    private final UserRepository userDao;

    public ImageRestController(ImageRepository imageDao, CountryRepository countryDao, MapRepository mapDao, UserRepository userDao) {
        this.imageDao = imageDao;
        this.countryDao = countryDao;
        this.mapDao = mapDao;
        this.userDao = userDao;
    }

    @GetMapping("/api/image/country"+"/{id}")
    public List<Image> getImagesByCountryId(@PathVariable long id) {
        System.out.println(id);
        return imageDao.getImagesByCountry_Id(id);
    }

    @GetMapping("/api/image/country"+"/{id}" + "/{mapId}")
    public List<Image> getImagesByCountryIdAndMapId(@PathVariable long id, @PathVariable long mapId) {
        System.out.println(id);
        //get the user from the map id
        Map map = mapDao.getOne(mapId);
        User user = map.getUser();
        return imageDao.getImagesByCountry_IdAndUser_Id(id, user.getId());
    }

    @GetMapping("/api/images/country"+"/{id}")
    public List<Image> getAllImages(@PathVariable long id) {

        return imageDao.getImagesByUser_Id(id);
    }
}