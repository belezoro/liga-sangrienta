package com.bloodleague.core.service;

import com.bloodleague.core.dto.LeagueDTO;
import com.bloodleague.core.model.Leagues;

public interface LeagueService {
    
    /**
     * Creates a new league.
     * @param league
     */
    LeagueDTO createLeague(Leagues league);

    /**
     * Get a league by ID
     * @param id
     * @return
     */
    LeagueDTO getLeagueById(Long id);

    /**
     * Starts a league with a given number of AI players.
     * @param league
     * @param ai_player_count
     * @return
     */
    LeagueDTO startLeague(Leagues league, int ai_player_count);
}
