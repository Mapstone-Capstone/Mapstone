package com.mapstone.mapstone.repositories;

import com.mapstone.mapstone.models.Image;
import com.mapstone.mapstone.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {


    Image getImageByUser(User user);

    List<Image> getImagesByCountry_Id(long id);

    List<Image> getImagesByUser_Id(long id);


    List<Image> getImagesByCountry_IdAndUser_Id(long countryId, long userId);
}
