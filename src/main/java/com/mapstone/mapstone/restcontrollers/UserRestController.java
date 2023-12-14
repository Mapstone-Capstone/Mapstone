package com.mapstone.mapstone.restcontrollers;

import com.mapstone.mapstone.models.Country;
import com.mapstone.mapstone.models.Layer;
import com.mapstone.mapstone.models.Map;
import com.mapstone.mapstone.models.User;
import com.mapstone.mapstone.repositories.LayerRepository;
import com.mapstone.mapstone.repositories.MapRepository;
import com.mapstone.mapstone.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserRestController {

    private UserRepository userDao;

    public UserRestController(UserRepository userDao) {
        this.userDao = userDao;

    }

    @PostMapping("/api/user/edit")
    public User editUser(@RequestBody User user) {
        System.out.println(user.getFirstName());
        //get the logged-in user
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        //get the user from the database
        User userToUpdate = userDao.getOne(loggedInUser.getId());
        //update the user details
        userToUpdate.setUsername(user.getUsername());
        userToUpdate.setFirstName(user.getFirstName());
        userToUpdate.setLastName(user.getLastName());
        userToUpdate.setEmail(user.getEmail());

        //update thr logged-in user
        loggedInUser.setUsername(user.getUsername());
        loggedInUser.setFirstName(user.getFirstName());
        loggedInUser.setLastName(user.getLastName());
        loggedInUser.setEmail(user.getEmail());

        userDao.save(userToUpdate);

        return userToUpdate;
    }

    //delete user
    @PostMapping("/api/user/delete")
    public void deleteUser(@RequestBody User user) {
        //get the logged-in user
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        //get the user from the database
        User userToDelete = userDao.getOne(loggedInUser.getId());

        userDao.delete(userToDelete);
    }


}


