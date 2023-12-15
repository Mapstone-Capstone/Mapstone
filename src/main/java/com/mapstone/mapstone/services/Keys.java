package com.mapstone.mapstone.services;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class Keys {

    @Value("${mapbox.key}")
    private String mapbox_key;

    @Value("${filestack.key}")
    private String filestack_key;

    public String getMapbox_key() {
        return mapbox_key;
    }

    public String getFilestack_key() {
        return filestack_key;
    }
}
