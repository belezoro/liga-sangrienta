package com.bloodleague.core.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bloodleague.core.dto.PlayerDTO;
import com.bloodleague.core.model.Players;
import com.bloodleague.core.service.PlayerService;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/players")
public class PlayerController {

    @Autowired
    private PlayerService playerService;

    @PostMapping("/createPlayer")
    public Players createPlayer(@RequestBody Players player) {
        return playerService.createPlayer(player);
    }

    @PostMapping("/login")
    public PlayerDTO login(@RequestBody Players player) {
        return playerService.login(player);
    }

    @PutMapping("/joinLeague/{id_player}/{id_league}")
    public PlayerDTO joinLeague(@PathVariable Long id_player, @PathVariable Long id_league) {
        return playerService.joinLeague(id_player, id_league);
    }

    @GetMapping("/{id}")
    public PlayerDTO getPlayerById(@PathVariable Long id) {
        return playerService.getPlayerById(id);
    }

    @GetMapping("/byLeague")
    public List<PlayerDTO> getMethodName(@RequestParam Long idLeague) {
        return playerService.getPlayersByLeague(idLeague);
    }

    @GetMapping("/getAllPlayers")
    public List<Players> getAllPlayers() {
        return playerService.getAllPlayers();
    }

    @PutMapping("/{id}")
    public Players updatePlayer(@PathVariable Long id, @RequestBody Players player) {
        return playerService.updatePlayer(id, player);
    }

    @DeleteMapping("/{id}")
    public void deletePlayer(@PathVariable Long id) {
        playerService.deletePlayer(id);
    }
}
