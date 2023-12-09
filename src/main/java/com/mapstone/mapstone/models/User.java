package com.mapstone.mapstone.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;


@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    long id;

    @Column(name = "username", length = 250, unique = true)
    private String username;

    @Column(name = "first_name", length = 250)
    @NotEmpty(message = "First name cannot be blank")
    private String firstName;

    @Column(name = "last_name", length = 250)
    @NotEmpty(message = "Last name cannot be blank")
    private String lastName;

    @Column(name = "email", length = 250, unique = true)
    @NotEmpty(message = "Email cannot be blank")
    @Email(message = "Please provide a valid email")
    private String email;

    @Column(name = "country", length = 250)
    @NotEmpty(message = "Country cannot be blank")
    private String country;

    @Column(name = "password", length = 500)
    @JsonIgnore
    @NotEmpty(message = "Password cannot be blank")
    private String password;

    @Column(name = "avatar", length = 500)
    private String avatar;

    @JsonBackReference(value = "user-map")
    @OneToOne(mappedBy = "user")
    private Map map;

    @JsonManagedReference(value = "user-comment")
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    private List<Comment> comments;

    @JsonIgnore
    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_countries",
            joinColumns = {@JoinColumn(name = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "country_id")}
    )
    private List<Country> countries;

    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    private List<Image> images;



    public User() {
    }

    public User(User copy) {
        id = copy.id;
        username = copy.username;
        firstName = copy.firstName;
        lastName = copy.lastName;
        email = copy.email;
        country = copy.country;
        password = copy.password;
        avatar = copy.avatar;
        map = copy.map;
        comments = copy.comments;
        countries = copy.countries;
        images = copy.images;
    }

    public User(long id, String username, String firstName, String lastName, String email, String country, String password, String avatar) {
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.country = country;
        this.password = password;
        this.avatar = avatar;
    }

    public User(String username, String firstName, String lastName, String email, String country, String password, String avatar) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.country = country;
        this.password = password;
        this.avatar = avatar;
    }

    public User(String username, String firstName, String lastName, String email, String country, String password) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.country = country;
        this.password = password;
    }

    public User(String username, String firstName, String lastName, String email, String country) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.country = country;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public Map getMap() {
        return map;
    }

    public void setMap(Map map) {
        this.map = map;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public List<Country> getCountries() {
        return countries;
    }

//    public void setCountries(Country country) {
//        this.countries.add(country);
//    }

    public void setCountries(List<Country> countries) {
        this.countries = countries;
    }

    public List<Image> getImages() {
        return images;
    }

    public void setImages(List<Image> images) {
        this.images = images;
    }



}
