package com.bloodleague.core.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bloodleague.core.dto.LeagueDTO;
import com.bloodleague.core.dto.PlayerDTO;
import com.bloodleague.core.model.Leagues;
import com.bloodleague.core.model.Players;
import com.bloodleague.core.repository.LeagueRepository;
import com.bloodleague.core.repository.PlayerRepository;
import com.bloodleague.core.service.PlayerService;

@Service
public class PlayerServiceImpl implements PlayerService {
    
    /*
     * REPOSITORIES
     */

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private LeagueRepository leagueRepository;
    
    /**
     * IMPLEMENTED METHODS
     */

    @Override
    public Players createPlayer(Players player) {
        return playerRepository.save(player);
    }

    @Override
    public PlayerDTO login(Players player) {
        Players playerBD = playerRepository.findByEmailAndPassword(player.getEmail(), player.getPassword());
        if (playerBD != null) {
            List<LeagueDTO> leagues = playerBD.getLeagues().stream().map(league ->
                new LeagueDTO(league.getId(), league.getCreated_at(), league.getName(), league.getTeams(),
                league.getState(), league.getId_admin(), league.getMatch_frequency(), league.getStart_date(), null, null))
            .collect(Collectors.toList());
            return new PlayerDTO(
                playerBD.getId(), 
                playerBD.getNick(), 
                playerBD.getEmail(), 
                playerBD.is_ai(),
                leagues); 
        }

        return null;
    }

    @Override
    public PlayerDTO joinLeague(Long playerId, Long leagueId) {
        Players player = playerRepository.findById(playerId).orElse(null);
        List<LeagueDTO> leagues = new ArrayList<>();
        if (player != null) {
            // Aquí puedes agregar la lógica para unir al jugador a la liga
            Leagues league = leagueRepository.findById(leagueId).orElse(null);
            if (league != null) {
                player.getLeagues().add(league);
                player = playerRepository.save(player);
            }
            leagues = player.getLeagues().stream().map(l ->
                    new LeagueDTO(l.getId(), l.getCreated_at(), l.getName(), l.getTeams(),
                    l.getState(), l.getId_admin(), l.getMatch_frequency(), l.getStart_date(), null, null))
                .collect(Collectors.toList());
                return new PlayerDTO(
                        player.getId(), 
                        player.getNick(), 
                        player.getEmail(), 
                        player.is_ai(),
                        leagues);
        }

        return null;
    }

    @Override
    public PlayerDTO getPlayerById(Long id) {
        Players player = playerRepository.findById(id).orElse(null);
        if (null != player) {
            List<LeagueDTO> leagues = player.getLeagues().stream().map(league ->
                new LeagueDTO(league.getId(), league.getCreated_at(), league.getName(), league.getTeams(),
                league.getState(), league.getId_admin(), league.getMatch_frequency(), league.getStart_date(), null, null))
            .collect(Collectors.toList());
            return new PlayerDTO(
                player.getId(), 
                player.getNick(), 
                player.getEmail(), 
                player.is_ai(),
                leagues);
        } else {
            return null;
        }
    }

    @Override
    public List<PlayerDTO> getPlayersByLeague(Long leagueId) {
        List<Players> players = playerRepository.findByLeagues_Id(leagueId);
        return players.stream().map(p -> new PlayerDTO(p.getId(), p.getNick(), p.getEmail(), p.is_ai(), null)).collect(Collectors.toList());
    }

    @Override
    public List<Players> getAllPlayers() {
        return playerRepository.findAll();
    }

    @Override
    public Players updatePlayer(Long id, Players player) {
        if (playerRepository.existsById(id)) {
            player.setId(id);
            return playerRepository.save(player);
        }
        return null;
    }

    @Override
    public void deletePlayer(Long id) {
        if (playerRepository.existsById(id)) {
            playerRepository.deleteById(id);
        }

    }
}