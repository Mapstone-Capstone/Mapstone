package com.mapstone.mapstone.controllers;


import com.mapstone.mapstone.services.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class KeyContoller {

    @Autowired
    private Keys keys;

    @GetMapping(value="/keys.js", produces ="application/javascript")
    public String getKeys() {
        return String.format("""
                const MAP_BOX_TOKEN = "%s";
                const FILE_STACK_TOKEN = "%s";
                """, keys.getMapbox_key(), keys.getFilestack_key()
        );
    }

}
