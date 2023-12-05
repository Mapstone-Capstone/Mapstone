package com.mapshare.mapcollector.repositories;

import com.mapshare.mapcollector.models.Map;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MapRepository extends JpaRepository<Map, Long> {

    Map getMapById(long id);

    Map getMapByUserId(long id);


}
