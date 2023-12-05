package com.mapshare.mapcollector.repositories;

import com.mapshare.mapcollector.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);
}
