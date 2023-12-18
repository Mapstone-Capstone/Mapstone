package com.mapstone.mapstone.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String index() {
        return "index";
    }
    @GetMapping("/index")
    public String home(){
        return "index";
    }
    @GetMapping("/aboutUs")
    public String meetTheTeam(){
        return "about-us";
    }

    @GetMapping("/badges")
    public String badges(){
        return "explore-badges";
    }

}
