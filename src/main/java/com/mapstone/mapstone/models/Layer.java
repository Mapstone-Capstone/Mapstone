package com.mapstone.mapstone.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class Layer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    long id;


    @Column(name = "name")
    String name;


    @JsonBackReference(value = "map-layer")
    @ManyToOne
    @JoinColumn(name = "map_id")
    private Map map;

    public Layer() {
    }

    public Layer(Map map) {
        this.map = map;
    }

    public Layer(long id, Map map) {
        this.id = id;
        this.map = map;
    }

    public Layer(String name) {
        this.name = name;
    }

    public Layer(String name, Map map) {
        this.name = name;
        this.map = map;
    }

    public Layer(long id, String name, Map map) {
        this.id = id;
        this.name = name;
        this.map = map;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public Map getMap() {
        return map;
    }

    public void setMap(Map map) {
        this.map = map;
    }


}
