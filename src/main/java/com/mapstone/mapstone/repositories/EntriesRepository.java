package com.mapstone.mapstone.repositories;

import com.mapstone.mapstone.models.Entry;
import com.mapstone.mapstone.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EntriesRepository extends JpaRepository<Entry, Long> {

    List<Entry> getImagesByCountry_IdAndUser_Id(long country_id, long user_id);

    List<Entry> getEntriesByUser_Id(long id);

    Entry getEntryById(long id);

    List<Entry> getEntriesByCountry_Id(long id);

}
