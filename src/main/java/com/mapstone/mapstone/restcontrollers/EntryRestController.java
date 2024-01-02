package com.mapstone.mapstone.restcontrollers;

import com.mapstone.mapstone.models.Entry;
import com.mapstone.mapstone.models.Map;
import com.mapstone.mapstone.models.User;
import com.mapstone.mapstone.repositories.EntriesRepository;
import com.mapstone.mapstone.repositories.MapRepository;
import com.mapstone.mapstone.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class EntryRestController {

    private final EntriesRepository entryDao;

    private final MapRepository mapDao;

    private final UserRepository userDao;

    public EntryRestController(EntriesRepository entryDao, MapRepository mapDao, UserRepository userDao) {
        this.entryDao = entryDao;
        this.mapDao = mapDao;
        this.userDao = userDao;
    }


//    TODO: Refactor, need another path variable of userID, this method does not work correctly for viewing other peoples profiles
    @GetMapping("/api/entry/country"+"/{entryId}"+"/{mapId}")
    public List<Entry> getEntriesByCountryId(@PathVariable long entryId, @PathVariable long mapId) {
        Map map = mapDao.getOne(mapId);
        User user = userDao.getOne(map.getUser().getId());
        return entryDao.getImagesByCountry_IdAndUser_Id(entryId, user.getId());
    }

    @GetMapping("/api/entry/country"+"/{countryId}")
    public List<Entry> getEntriesByCountryId(@PathVariable long countryId) {
        return entryDao.getEntriesByCountry_Id(countryId);
    }

    @GetMapping("/api/entry/user"+"/{id}")
    public List<Entry> getAllEntries(@PathVariable long id) {
        return entryDao.getEntriesByUser_Id(id);
    }

    @GetMapping("/api/entry"+"/{id}")
    public Entry getEntryById(@PathVariable long id) {
        return entryDao.getEntryById(id);
    }

}
