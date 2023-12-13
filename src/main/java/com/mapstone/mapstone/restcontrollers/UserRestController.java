package com.mapstone.mapstone.restcontrollers;

import com.mapstone.mapstone.models.Map;
import com.mapstone.mapstone.models.User;
import com.mapstone.mapstone.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserRestController {

    private UserRepository userDao;

    public UserRestController(UserRepository userDao) {
        this.userDao = userDao;
    }

    @PostMapping("/api/user/edit")
    public User editUser(@RequestBody User user) {
        //get the logged-in user
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        //get the user from the database
        User userToUpdate = userDao.getOne(loggedInUser.getId());
        //update the user details
        userToUpdate.setUsername(user.getUsername());
        userToUpdate.setFirstName(user.getFirstName());
        userToUpdate.setLastName(user.getLastName());
        userToUpdate.setEmail(user.getEmail());

        userDao.save(userToUpdate);

        return userToUpdate;
    }
}
