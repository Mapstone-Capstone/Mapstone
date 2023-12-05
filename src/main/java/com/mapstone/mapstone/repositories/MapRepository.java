package com.mapstone.mapstone.repositories;


import com.mapstone.mapstone.models.Map;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MapRepository extends JpaRepository<Map, Long> {

    Map getMapById(long id);

    Map getMapByUserId(long id);


}
