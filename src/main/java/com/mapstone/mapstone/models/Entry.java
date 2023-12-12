package com.mapstone.mapstone.models;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.sql.Date;
import java.util.List;
@Entity
@Table(name = "entries")
public class Entry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private long id;

    @Column(name = "title", length = 250)
    private String title;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "date")
    private String date;

    @JsonIgnore
    @OneToMany(mappedBy = "entry", cascade = CascadeType.ALL)
    private List<Image> images;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @JsonBackReference(value = "country-entries")
    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;

    public Entry() {
    }
    public Entry(long id) {
        this.id = id;
    }
    public Entry(String title, String description, String date) {
        this.title = title;
        this.description = description;
        this.date = date;
    }
    public Entry(String title, String description, String date, List<Image> images, User user, Country country) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.images = images;
        this.user = user;
        this.country = country;
    }
    public Entry(long id, String title, String description, String date, List<Image> images, User user, Country country) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.date = date;
        this.images = images;
        this.user = user;
        this.country = country;
    }
    public long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getDate() {
        return date;
    }
    public void setDate(String date) {
        this.date = date;
    }
    public List<Image> getImages() {
        return images;
    }
    public void setImages(List<Image> images) {
        this.images = images;
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









