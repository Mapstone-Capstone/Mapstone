package com.mapstone.mapstone.restcontrollers;


import com.mapstone.mapstone.models.Country;
import com.mapstone.mapstone.models.Image;
import com.mapstone.mapstone.repositories.CountryRepository;
import com.mapstone.mapstone.repositories.ImageRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ImageRestController {

    private final ImageRepository imageDao;
    private  final CountryRepository countryDao;

    public ImageRestController(ImageRepository imageDao, CountryRepository countryDao) {
        this.imageDao = imageDao;
        this.countryDao = countryDao;
    }

    @GetMapping("/api/image/country"+"/{id}")
    public List<Image> getImagesByCountryId(@PathVariable long id) {
        System.out.println(id);
        return imageDao.getImagesByCountry_Id(id);
    }

    @GetMapping("/api/images/country"+"/{id}")
    public List<Image> getAllImages(@PathVariable long id) {

        return imageDao.getImagesByUser_Id(id);
    }
}