package com.mapstone.mapstone.repositories;

import com.mapstone.mapstone.models.Entry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EntriesRepository extends JpaRepository<Entry, Long> {



}
