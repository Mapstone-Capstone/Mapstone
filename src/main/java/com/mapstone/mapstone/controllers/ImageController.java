package com.mapstone.mapstone.controllers;

import com.mapstone.mapstone.models.Image;
import com.mapstone.mapstone.repositories.CountryRepository;
import com.mapstone.mapstone.repositories.ImageRepository;
import com.mapstone.mapstone.repositories.UserRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

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
    public String updateImages(@RequestParam(name = "image-url") String image, Model model) {

        System.out.println("This is the image url: " + image);

//        imageDao.save(image);
//        model.addAttribute("image", image);
        return "redirect:profile";
    }

}

