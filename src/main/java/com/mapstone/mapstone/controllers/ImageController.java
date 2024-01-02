package com.mapstone.mapstone.controllers;

import com.mapstone.mapstone.models.Country;
import com.mapstone.mapstone.models.Image;
import com.mapstone.mapstone.models.User;
import com.mapstone.mapstone.repositories.CountryRepository;
import com.mapstone.mapstone.repositories.ImageRepository;
import com.mapstone.mapstone.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@Controller
public class ImageController {

    public final ImageRepository imageDao;

    public final UserRepository userDao;

    public final CountryRepository countryDao;

    public ImageController(ImageRepository imageDao, UserRepository userDao, CountryRepository countryDao) {
        this.imageDao = imageDao;
        this.userDao = userDao;
        this.countryDao = countryDao;
    }

    @PostMapping("/url-images")
    public String updateImages(@RequestParam(name = "countryName") String countryName, @RequestParam(name = "imageUrls") String[] urls, Model model) {
        //get the logged in user which is a copy of a user
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        //use the copy to get the real user from the DB
        User user = userDao.getOne(loggedInUser.getId());


        //get the country from the DB that has the same name as the country clicked on
        Country country = countryDao.getCountryByName(countryName);
        System.out.println(Arrays.toString(urls));


        for (String url:urls) {

            Image image = new Image();

            image.setImageUrl(url);
            //set that user as the owner of the image uploaded
            image.setUser(user);
            //make this image belong to that country
            image.setCountry(country);
            System.out.println(image.getCountry()+ "THIS IS THE COUNTRY ");

            //now the image has a user and country, so save it to the db

            System.out.println(image.getImageUrl());

//            images.add(image);
//            country.setImages(images);

            imageDao.save(image);


        }

//        //get the logged in user which is a copy of a user
//        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        //use the copy to get the real user from the DB
//        User user = userDao.getOne(loggedInUser.getId());
//        //set that user as the owner of the image uploaded
//        image.setUser(user);
//        //get the country from the DB that has the same name as the country clicked on
//        Country country = countryDao.getCountryByName(countryName);
//        //make this image belong to that country
//        image.setCountry(country);
//        //now the image has a user and country, so save it to the db
////        imageDao.save(image);

        return "redirect:/profile";
    }

    @GetMapping("/image/country"+"/{id}")
    public List<Image> getImagesByCountryId(@PathVariable long id) {
        return imageDao.getImagesByCountry_Id(id);
    }

//    @RequestMapping(method = RequestMethod.GET)
//    public List<Image> getAllImages(@RequestParam(name = "view-all-images") User user) {
//
//        return imageDao.getImagesByUser(user);
//    }

    @PostMapping("/delete-image")
    public String deleteImageById(@RequestParam (name = "image-id") long id) {

        imageDao.deleteById(id);

        return "redirect:/profile";
    }

}

