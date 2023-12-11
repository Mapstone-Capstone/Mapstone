package com.mapstone.mapstone.repositories;


import com.mapstone.mapstone.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    List<User> findAllByUsernameContainsIgnoreCase(String search);
}
