package com.bloodleague.core.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bloodleague.core.dto.MatchDTO;
import com.bloodleague.core.model.Matches;
import com.bloodleague.core.service.MatchService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/matches")
public class MatchesController {

    @Autowired
    private MatchService matchService;

    @PutMapping("/update")
    public MatchDTO putMethodName(@RequestBody Matches match, @RequestParam Long id_league) {
        return matchService.updateMatch(match, id_league);
    }
    
}
