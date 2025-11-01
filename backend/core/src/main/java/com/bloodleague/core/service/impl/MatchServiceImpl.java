package com.bloodleague.core.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bloodleague.core.dto.MatchDTO;
import com.bloodleague.core.dto.PlayerDTO;
import com.bloodleague.core.model.Matches;
import com.bloodleague.core.repository.LeagueRepository;
import com.bloodleague.core.repository.MatchesRepository;
import com.bloodleague.core.service.MatchService;

@Service
public class MatchServiceImpl implements MatchService {

    @Autowired
    private MatchesRepository matchesRepository;

    @Autowired
    private LeagueRepository leagueRepository;

    @Override
    public MatchDTO updateMatch(Matches match, Long leagueId) {
        // Implement the logic to update the match details
        if (match.getState().equals("COMPLETED")) {
            // Additional logic for completed matches can be added here
            if (match.getPointsa() > match.getPointsb()) {
                match.setWinner(match.getTeamA().getId());
            } else if (match.getPointsb() > match.getPointsa()) {
                match.setWinner(match.getTeamB().getId());
            } else {
                match.setWinner(null); // It's a draw
            }
        }
        match.setLeague(leagueRepository.findById(leagueId).orElse(null));
        Matches updatedMatch = matchesRepository.save(match);
        return new MatchDTO(
            updatedMatch.getId(),
            leagueId,
            new PlayerDTO(updatedMatch.getTeamA().getId(), updatedMatch.getTeamA().getNick(), updatedMatch.getTeamA().getEmail(), updatedMatch.getTeamA().is_ai(), null),
            new PlayerDTO(updatedMatch.getTeamB().getId(), updatedMatch.getTeamB().getNick(), updatedMatch.getTeamB().getEmail(), updatedMatch.getTeamB().is_ai(), null),
            updatedMatch.getMatch_date(),
            updatedMatch.getMatch_time(),
            updatedMatch.getState(),
            updatedMatch.getRound(),
            updatedMatch.getPointsa(),
            updatedMatch.getPointsb(),
            updatedMatch.getWinner() != null ? (updatedMatch.getWinner().equals(updatedMatch.getTeamA().getId()) ? new PlayerDTO(updatedMatch.getTeamA().getId(), updatedMatch.getTeamA().getNick(), updatedMatch.getTeamA().getEmail(), updatedMatch.getTeamA().is_ai(), null) : new PlayerDTO(updatedMatch.getTeamB().getId(), updatedMatch.getTeamB().getNick(), updatedMatch.getTeamB().getEmail(), updatedMatch.getTeamB().is_ai(), null)) : null
        );
    }
}
