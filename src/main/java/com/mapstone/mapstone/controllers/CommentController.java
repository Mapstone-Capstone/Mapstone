package com.mapstone.mapstone.controllers;

import com.mapstone.mapstone.models.Comment;
import com.mapstone.mapstone.models.Map;
import com.mapstone.mapstone.models.User;
import com.mapstone.mapstone.repositories.CommentRepository;
import com.mapstone.mapstone.repositories.MapRepository;
import com.mapstone.mapstone.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Date;

@Controller
public class CommentController {
    private UserRepository userDao;
    private CommentRepository commentDao;
    private MapRepository mapDao;

    public CommentController(UserRepository userDao, CommentRepository commentDao,MapRepository mapDao){
        this.userDao = userDao;
        this.commentDao = commentDao;
        this.mapDao = mapDao;
    }

    @PostMapping("/comment")
    public String createComment(@RequestParam(name = "comment2")String comment,@RequestParam(name = "user")String user_id,@RequestParam(name = "mapid")String map_id){
        User user = userDao.getReferenceById(Long.valueOf(user_id));
        Map map = mapDao.getMapById(Long.parseLong(map_id));
        System.out.println("\n\n\n\n\nn\nHEY\n!!!!!!");
       Date date = new Date();
        System.out.println(date);
       User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Comment newComment = new Comment(loggedInUser,date,map,comment);
        commentDao.save(newComment);
        return "redirect:/viewprofile/"+user.getId();
    }

    @PostMapping("/test")
    public String test() {
        System.out.println("Inside test");
        return "index";
    }
}
