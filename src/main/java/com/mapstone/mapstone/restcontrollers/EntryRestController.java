package com.mapstone.mapstone.restcontrollers;

import com.mapstone.mapstone.models.Entry;
import com.mapstone.mapstone.models.User;
import com.mapstone.mapstone.repositories.EntriesRepository;
import com.mapstone.mapstone.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class EntryRestController {

    private final EntriesRepository entryDao;

    public EntryRestController(EntriesRepository entryDao) {
        this.entryDao = entryDao;
    }

    @GetMapping("/api/entry/country"+"/{id}")
    public List<Entry> getEntriesByCountryId(@PathVariable long id) {
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        System.out.println(id);
        return entryDao.getImagesByCountry_IdAndUser_Id(id, loggedInUser.getId());
    }

    @GetMapping("/api/entry/user"+"/{id}")
    public List<Entry> getAllEntries(@PathVariable long id) {
        return entryDao.getEntriesByUser_Id(id);
    }
}
