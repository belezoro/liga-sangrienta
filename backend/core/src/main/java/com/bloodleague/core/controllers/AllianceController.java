package com.bloodleague.core.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bloodleague.core.dto.PlayerAllianceDTO;
import com.bloodleague.core.service.AllianceService;

@RestController
@RequestMapping("/alliances")
public class AllianceController {

    @Autowired
    private AllianceService allianceService;

    @GetMapping("/byLeague")
    public List<PlayerAllianceDTO> getAlliancesByLeague(@RequestParam Long idLeague) {
        return allianceService.getAlliancesByLeague(idLeague);
    }

    @PostMapping("/create")
    public PlayerAllianceDTO createAlliance(@RequestBody PlayerAllianceDTO allianceDTO) {
        return allianceService.createAlliance(allianceDTO);
    }

    @DeleteMapping("/delete")
    public void deleteAlliance(@RequestParam Long id) {
        allianceService.deleteAlliance(id);
    }

}
