package com.mapstone.mapstone.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "images")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private long id;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    //a user can upload many images to one country
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    //a country can have many images
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;

    public Image() {
    }

    public Image(long id, String imageUrl, User user, Country country) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.user = user;
        this.country = country;
    }

    public Image(String imageUrl, User user, Country country) {
        this.imageUrl = imageUrl;
        this.user = user;
        this.country = country;
    }

    public Image(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Image(long id, String imageUrl) {
        this.id = id;
        this.imageUrl = imageUrl;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Country getCountry() {
        return country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }
}
