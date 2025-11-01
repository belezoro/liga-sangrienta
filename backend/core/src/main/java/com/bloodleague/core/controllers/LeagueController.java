package com.bloodleague.core.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bloodleague.core.dto.LeagueDTO;
import com.bloodleague.core.model.Leagues;
import com.bloodleague.core.service.LeagueService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/leagues")
public class LeagueController {

    @Autowired
    private LeagueService leagueService;

    /**
     * Endpoint to create a new league.
     */
    @PostMapping("/create")
    public ResponseEntity<LeagueDTO> createLeague(@RequestBody Leagues league) {
        LeagueDTO created = leagueService.createLeague(league);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/getById")
    public LeagueDTO getMethodName(@RequestParam String idLeague) {
        return leagueService.getLeagueById(Long.parseLong(idLeague));
    }

    @PostMapping("/startLeague")
    public LeagueDTO startLeague(@RequestBody Leagues league, @RequestParam int ai_player_count) {
        return leagueService.startLeague(league, ai_player_count);
    }
    
    

}
