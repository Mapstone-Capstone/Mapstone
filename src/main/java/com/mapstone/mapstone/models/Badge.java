package com.mapstone.mapstone.models;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.springframework.context.annotation.Conditional;
import org.springframework.stereotype.Controller;

import java.util.List;

@Entity
@Table(name="badges")
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    long id;

    @Column(name = "bagde_url")
    String url;

    @Column(name = "name")
    String name;

    @Column(name = "description")
    String description;

    @JsonIgnore
    @ManyToMany(mappedBy = "badges")
    private List<User> users;

    public Badge() {
    }

    public Badge(long id, String url, List<User> users) {
        this.id = id;
        this.url = url;
        this.users = users;
    }

    public Badge(long id, String url) {
        this.id = id;
        this.url = url;
    }

    public Badge(String url) {
        this.url = url;
    }

    public Badge(String url, List<User> users) {
        this.url = url;
        this.users = users;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
