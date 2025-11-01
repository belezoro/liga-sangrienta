package com.bloodleague.core.service.impl;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bloodleague.core.dto.LeagueDTO;
import com.bloodleague.core.dto.MatchDTO;
import com.bloodleague.core.dto.PlayerDTO;
import com.bloodleague.core.model.Leagues;
import com.bloodleague.core.model.Matches;
import com.bloodleague.core.model.Players;
import com.bloodleague.core.repository.LeagueRepository;
import com.bloodleague.core.repository.MatchesRepository;
import com.bloodleague.core.repository.PlayerRepository;
import com.bloodleague.core.service.LeagueService;

@Service
public class LeagueServiceImpl implements LeagueService {

    /**
     * REPOSITORIES
     */
    @Autowired
    private LeagueRepository leagueRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private MatchesRepository matchesRepository;


    /**
     * METHOD IMPLEMENTATIONS
     */

    @Override
    public LeagueDTO createLeague(Leagues league) {
        Players player = playerRepository.findById(league.getId_admin()).orElseThrow();
        league.setState("WAITING");
        Set<Players> players = Set.of(player);
        league.setPlayers(players);

        player.getLeagues().add(league);
        
        Leagues savedLeague = leagueRepository.save(league);


        return new LeagueDTO(
            savedLeague.getId(),
            savedLeague.getCreated_at(),
            savedLeague.getName(), 
            savedLeague.getTeams(), 
            savedLeague.getState(), 
            savedLeague.getId_admin(), 
            savedLeague.getMatch_frequency(), 
            savedLeague.getStart_date(), 
            null, 
            null);
    }

    @Override
    public LeagueDTO getLeagueById(Long id) {
        Optional<Leagues> league = leagueRepository.findById(id);
        if (league.isEmpty()) {
            return null;
        }
        List<PlayerDTO> players = league.get().getPlayers().stream()
                .map(p -> new PlayerDTO(p.getId(), p.getNick(), p.getEmail(), p.is_ai(), null))
                .collect(Collectors.toList());
        List<MatchDTO> matches = league.get().getMatches().stream()
                .map(m -> new MatchDTO(
                    m.getId(), 
                    league.get().getId(), 
                    new PlayerDTO(m.getTeamA().getId(), m.getTeamA().getNick(), m.getTeamA().getEmail(), m.getTeamA().is_ai(), null), 
                    new PlayerDTO(m.getTeamB().getId(), m.getTeamB().getNick(), m.getTeamB().getEmail(), m.getTeamB().is_ai(), null), 
                    m.getMatch_date(), 
                    m.getMatch_time(),
                    m.getState(),
                    m.getRound(),
                    m.getPointsa(),
                    m.getPointsb(),
                    m.getWinner() != null ? (m.getWinner().equals(m.getTeamA().getId()) ? new PlayerDTO(m.getTeamA().getId(), m.getTeamA().getNick(), m.getTeamA().getEmail(), m.getTeamA().is_ai(), null) : new PlayerDTO(m.getTeamB().getId(), m.getTeamB().getNick(), m.getTeamB().getEmail(), m.getTeamB().is_ai(), null)) : null
                    ))
                .collect(Collectors.toList());

                //Ordenar matches por fecha
                matches.sort(Comparator.comparing(MatchDTO::match_date));

        return new LeagueDTO(
                league.get().getId(),
                league.get().getCreated_at(),
                league.get().getName(),
                league.get().getTeams(),
                league.get().getState(),
                league.get().getId_admin(),
                league.get().getMatch_frequency(),
                league.get().getStart_date(),
                players,
                matches
        );
    }

    @Override
    public LeagueDTO startLeague(Leagues league, int ai_player_count) {
        // Generamos e incorporamos los jugadores AI
        Set<Players> players = new HashSet<>(league.getPlayers());
        for (int i = 0; i < ai_player_count; i++) {
            Players aiPlayer = new Players();
            aiPlayer.setNick("AI_Player_" + (i + 1));
            aiPlayer.set_ai(true);
            // Set other necessary fields for AI player
            aiPlayer.setLeagues(List.of(league));
            aiPlayer = playerRepository.saveAndFlush(aiPlayer);
            players.add(aiPlayer);
        }

        league.setPlayers(players);
        leagueRepository.saveAndFlush(league);

        // Generamos el calendario de partidos Round Robin
        List<Long> playerIds = players.stream().map(Players::getId).collect(Collectors.toList());
        List<Matches> matches = generateRoundRobinMatches(league, playerIds, league.getMatch_frequency(), league.getStart_date());

        matchesRepository.saveAllAndFlush(matches);

        // This is a placeholder implementation
        league.setState("ACTIVE");
        leagueRepository.saveAndFlush(league);
        return new LeagueDTO(
                league.getId(),
                league.getCreated_at(),
                league.getName(),
                league.getTeams(),
                league.getState(),
                league.getId_admin(),
                league.getMatch_frequency(),
                league.getStart_date(),
                players.stream().map(p -> new PlayerDTO(p.getId(), p.getNick(), p.getEmail(), p.is_ai(), null)).collect(Collectors.toList()),
                matches.stream().map(m -> new MatchDTO(
                    m.getId(), 
                    league.getId(), 
                    new PlayerDTO(m.getTeamA().getId(), m.getTeamA().getNick(), m.getTeamA().getEmail(), m.getTeamA().is_ai(), null), 
                    new PlayerDTO(m.getTeamB().getId(), m.getTeamB().getNick(), m.getTeamB().getEmail(), m.getTeamB().is_ai(), null), 
                    m.getMatch_date(), 
                    m.getMatch_time(),
                    m.getState(),
                    m.getRound(),
                    m.getPointsa(),
                    m.getPointsb(),
                    m.getWinner() != null ? (m.getWinner().equals(m.getTeamA().getId()) ? new PlayerDTO(m.getTeamA().getId(), m.getTeamA().getNick(), m.getTeamA().getEmail(), m.getTeamA().is_ai(), null) : new PlayerDTO(m.getTeamB().getId(), m.getTeamB().getNick(), m.getTeamB().getEmail(), m.getTeamB().is_ai(), null)) : null
                    ))
                    .collect(Collectors.toList())
        );
    }

    private List<Matches> generateRoundRobinMatches(Leagues league, List<Long> playerIds, int matchFrequency, java.util.Date startDate) {
        List<Matches> matches = new ArrayList<>();

        int numPlayers = playerIds.size();
        boolean isOdd = numPlayers % 2 != 0;

        // Si es impar, agregar un "bye" (-1)
        if (isOdd) {
            playerIds.add(-1L);
            numPlayers++;
        }

        int numRounds = (numPlayers - 1) * 2; // Ida y vuelta
        int half = numPlayers / 2;

        List<Long> rotation = new ArrayList<>(playerIds);

        for (int round = 0; round < numRounds; round++) {
            boolean isReturn = round >= (numRounds / 2);
            for (int i = 0; i < half; i++) {
                Players playerA = playerRepository.findById(rotation.get(i)).orElse(null);
                Players playerB = playerRepository.findById(rotation.get(numPlayers - 1 - i)).orElse(null);

                 // Intercambiar equipos en la vuelta
                if (isReturn) {
                    Players temp = playerA;
                    playerA = playerB;
                    playerB = temp;
                }

                if (playerA != null && playerB != null) {
                    Matches match = new Matches();
                    match.setTeamA(playerA);
                    match.setTeamB(playerB);
                    Date nextDate = Date.valueOf(((Date) startDate).toLocalDate().plusDays((long) round * matchFrequency));
                    match.setMatch_date(nextDate);
                    match.setState("PENDIENTE");
                    match.setLeague(league);
                    match.setRound(round);
                    matches.add(match);
                    league.getMatches().add(match);
                }
            }

            // Rotar (excepto el primer jugador)
            Collections.rotate(rotation.subList(1, numPlayers), 1);
        }

        return matches;
    }
}
