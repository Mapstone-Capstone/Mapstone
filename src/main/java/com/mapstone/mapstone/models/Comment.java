package com.mapshare.mapcollector.models;


import jakarta.persistence.*;

@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne
    @JoinColumn(name = "map_id")
    private Map map;

    String comment;


    public Comment() {
    }

    public Comment(long id, User user, Map map, String comment) {
        this.id = id;
        this.user = user;
        this.map = map;
        this.comment = comment;
    }

    public Comment(User user, Map map, String comment) {
        this.user = user;
        this.map = map;
        this.comment = comment;
    }

    public Comment(User user, String comment) {
        this.user = user;
        this.comment = comment;
    }

    public Comment(Map map, String comment) {
        this.map = map;
        this.comment = comment;
    }

    public Comment(String comment) {
        this.comment = comment;
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

    public Map getMap() {
        return map;
    }

    public void setMap(Map map) {
        this.map = map;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
