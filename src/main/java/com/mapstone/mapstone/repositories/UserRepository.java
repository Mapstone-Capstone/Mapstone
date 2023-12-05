package com.mapstone.mapstone.repositories;


import com.mapstone.mapstone.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findById(int id);
    User findByUsername(String username);
}
