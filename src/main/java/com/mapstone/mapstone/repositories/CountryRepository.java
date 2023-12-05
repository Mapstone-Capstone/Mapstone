package com.mapshare.mapcollector.repositories;

import com.mapshare.mapcollector.models.Country;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CountryRepository extends JpaRepository<Country, Long> {

    Country getCountryById(long id);

    Country getCountryByName(String name);



    List<Country> getAllByUsers_Id(long id);
}
