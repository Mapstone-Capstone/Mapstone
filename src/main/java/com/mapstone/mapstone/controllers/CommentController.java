package com.mapstone.mapstone.controllers;

import com.mapstone.mapstone.models.Comment;
import com.mapstone.mapstone.models.User;
import com.mapstone.mapstone.repositories.CommentRepository;
import com.mapstone.mapstone.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class CommentController {
    private UserRepository userDao;
    private CommentRepository commentDao;

    public CommentController(UserRepository userDao, CommentRepository commentDao){
        this.userDao = userDao;
        this.commentDao = commentDao;
    }

    @PostMapping("/viewprofile/{id}")
    public String createComment(@ModelAttribute Comment comment, @PathVariable Long id){
        System.out.println("\n\n\n\n\nn\nHEY\n!!!!!!");
        System.out.println(comment.getComment());
       User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Comment newComment = new Comment(loggedInUser,loggedInUser.getMap(),comment.getComment());
        commentDao.save(newComment);
        return "redirect:/viewprofile/"+id;
    }
}
