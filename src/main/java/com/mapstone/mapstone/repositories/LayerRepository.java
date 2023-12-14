package com.mapstone.mapstone.repositories;


import com.mapstone.mapstone.models.Layer;
import com.mapstone.mapstone.models.Map;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LayerRepository extends JpaRepository<Layer, Long> {

    List<Layer> findAllByMap_Id(long map_id);

    List<Layer> getAllByMap_Id(long map_id);

    List<Layer> getAllByMap(Map userMap);

    List<Layer> getLayersByMapId(long id);

    List<Layer> getLayersByMap(Map mapToReset);
}
