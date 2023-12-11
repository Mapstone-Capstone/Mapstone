package com.mapstone.mapstone.restcontrollers;


import com.mapstone.mapstone.models.Image;
import com.mapstone.mapstone.repositories.ImageRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ImageRestController {

    private final ImageRepository imageDao;

    public ImageRestController(ImageRepository imageDao) {
        this.imageDao = imageDao;
    }

    @GetMapping("/api/image/country"+"/{id}")
    public List<Image> getImagesByCountryId(@PathVariable long id) {
        System.out.println(id);
        return imageDao.getImagesByCountry_Id(id);
    }
}