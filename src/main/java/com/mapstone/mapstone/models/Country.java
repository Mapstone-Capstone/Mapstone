package com.mapstone.mapstone.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "countries")
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "country_name", length = 250)
    private String name;

    @Column(name = "continent", length = 250)
    private String continent;

    //a user can upload many images to one country
    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "country")
    private List<Image> images;



    @JsonIgnore
    @ManyToMany(mappedBy = "countries", fetch = FetchType.EAGER)
    private List<User> users;

    public Country() {
    }


    public Country(long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Country(long id, String name, String continent, List<Image> images, List<User> users) {
        this.id = id;
        this.name = name;
        this.continent = continent;
        this.images = images;
        this.users = users;
    }

    public Country(long id, String name, String continent) {
        this.id = id;
        this.name = name;
        this.continent = continent;
    }

    public Country(String name) {
        this.name = name;
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

    public List<Image> getImages() {
        return images;
    }

    public void setImages(List<Image> images) {
        this.images = images;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public String getContinent() {
        return continent;
    }

    public void setContinent(String continent) {
        this.continent = continent;
    }
}
