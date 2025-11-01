package com.bloodleague.core.service;

import com.bloodleague.core.dto.MatchDTO;
import com.bloodleague.core.model.Matches;

public interface MatchService {

    /**
     * Update match details.
     * @param match
     * @param idLeague
     * @return
     */
    MatchDTO updateMatch(Matches match, Long idLeague);
}
