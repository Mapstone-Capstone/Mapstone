package com.mapstone.mapstone.models;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    long id;

    @JsonBackReference(value = "user-comment")
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column
    private Date date;

    @JsonBackReference(value = "map-comment")
    @ManyToOne
    @JoinColumn(name = "map_id")
    private Map map;

    @Column(length = 5000)
    String content;


    public Comment() {
    }

    public Comment(long id, User user, Map map, String content) {
        this.id = id;
        this.user = user;
        this.map = map;
        this.content = content;
    }

    public Comment(User user, Map map, String content) {
        this.user = user;
        this.map = map;
        this.content = content;
    }

    public Comment(User user, Date date, Map map, String content) {
        this.user = user;
        this.date = date;
        this.map = map;
        this.content = content;
    }

    public Comment(User user, String content) {
        this.user = user;
        this.content = content;
    }

    public Comment(Map map, String content) {
        this.map = map;
        this.content = content;
    }

    public Comment(String content) {
        this.content = content;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getDate() {
        DateFormat dateFormat = new SimpleDateFormat("hh:mm dd-MM-yyyy");
        String strDate = dateFormat.format(date);
        System.out.println("Converted String: " + strDate);
        return strDate;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Map getMap() {
        return map;
    }

    public void setMap(Map map) {
        this.map = map;
    }

    public String getComment() {
        return content;
    }

    public void setComment(String content) {
        this.content = content;
    }
}
