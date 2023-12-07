package com.mapstone.mapstone.repositories;

import com.mapstone.mapstone.models.Image;
import com.mapstone.mapstone.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long> {
    Image getImageByUser(User user);

}
