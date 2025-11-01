package com.bloodleague.core.service;

import java.util.List;

import com.bloodleague.core.dto.PlayerDTO;
import com.bloodleague.core.model.Players;

public interface PlayerService {

    /**
     * Create a new player
     * @param player
     * @return
     */
    Players createPlayer(Players player);

    /**
     * Player login
     * @param player
     * @return
     */
    PlayerDTO login(Players player);

    /**
     * Join a league
     * @param playerId
     * @param leagueId
     * @return
     */
    PlayerDTO joinLeague(Long playerId, Long leagueId);

    /**
     * Get a player by ID
     * @param id
     * @return
     */
    PlayerDTO getPlayerById(Long id);

    /**
     * Get players by league ID
     * @param leagueId
     * @return
     */
    List<PlayerDTO> getPlayersByLeague(Long leagueId);

    /**
     * Get all players
     * @return
     */
    List<Players> getAllPlayers();

    /**
     * Update a player
     * @param id
     * @param player
     * @return
     */
    Players updatePlayer(Long id, Players player);

    /**
     * Delete a player
     * @param id
     */
    void deletePlayer(Long id);

}
