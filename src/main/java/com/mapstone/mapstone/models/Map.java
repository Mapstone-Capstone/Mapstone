package com.mapstone.mapstone.models;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.lang.reflect.Array;
import java.util.List;

@Entity
@Table(name="map")
public class Map {


    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private long id;

    @Column (name="data", length = 1000000)
    private String data;

    @Column (name="color")
    private String color;

    @Column (name="style")
    private String style;

    @Column (name="projection")
    private String projection;

    @Column(name="zoom")
    private String zoom;

    @Column(name="center")
    private String center;

    @JsonBackReference(value="user-map")
    @OneToOne
    private User user;


    @JsonManagedReference(value="map-layer")
    @OneToMany(mappedBy = "map",cascade = CascadeType.ALL,fetch=FetchType.EAGER)
    private List<Layer> layers;


    public Map() {
    }

    public Map(String data, String color, String style, String projection, String zoom, String center) {
        this.data = data;
        this.color = color;
        this.style = style;
        this.projection = projection;
        this.zoom = zoom;
        this.center = center;
    }


    public Map(long id, String data, String color, String style, String projection, String zoom) {
        this.id = id;
        this.data = data;
        this.color = color;
        this.style = style;
        this.projection = projection;
        this.zoom = zoom;
    }

    public Map(String color, String style, String projection, String zoom) {
        this.color = color;
        this.style = style;
        this.projection = projection;
        this.zoom = zoom;
    }

    public Map(long id, String data) {
        this.id = id;
        this.data = data;
    }

    public Map(String data) {
        this.data = data;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getStyle() {
        return style;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public String getProjection() {
        return projection;
    }

    public void setProjection(String projection) {
        this.projection = projection;
    }

    public String getZoom() {
        return zoom;
    }

    public void setZoom(String zoom) {
        this.zoom = zoom;
    }

    public String getCenter() {
        return center;
    }

    public void setCenter(String center) {
        this.center = center;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Layer> getLayers() {
        return layers;
    }

    public void setLayers(List<Layer> layers) {
        this.layers = layers;
    }
}
