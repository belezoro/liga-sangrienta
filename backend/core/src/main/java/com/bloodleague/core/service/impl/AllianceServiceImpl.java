package com.bloodleague.core.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bloodleague.core.dto.LeagueDTO;
import com.bloodleague.core.dto.PlayerAllianceDTO;
import com.bloodleague.core.dto.PlayerDTO;
import com.bloodleague.core.model.Leagues;
import com.bloodleague.core.model.PlayerAlliance;
import com.bloodleague.core.model.Players;
import com.bloodleague.core.repository.AllianceRepository;
import com.bloodleague.core.repository.LeagueRepository;
import com.bloodleague.core.repository.PlayerRepository;
import com.bloodleague.core.service.AllianceService;

@Service
public class AllianceServiceImpl implements AllianceService {

    @Autowired
    private AllianceRepository allianceRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private LeagueRepository leagueRepository;

    @Override
    public List<PlayerAllianceDTO> getAlliancesByLeague(Long idLeague) {
        List<PlayerAlliance> alliances = allianceRepository.findByIdLeague_Id(idLeague);
        List<PlayerAllianceDTO> allianceDTOs = alliances.stream()
                .map(alliance -> new PlayerAllianceDTO(
                        alliance.getId(),
                        alliance.getCreatedAt(),
                        new LeagueDTO(
                            alliance.getIdLeague().getId(), 
                            alliance.getIdLeague().getCreated_at(),
                            alliance.getIdLeague().getName(),
                            alliance.getIdLeague().getTeams(),
                            alliance.getIdLeague().getState(),
                            alliance.getIdLeague().getId_admin(),
                            alliance.getIdLeague().getMatch_frequency(),
                            alliance.getIdLeague().getStart_date(),
                            null,
                            null),
                        new PlayerDTO(
                            alliance.getIdPlayerA().getId(),
                            alliance.getIdPlayerA().getNick(),
                            alliance.getIdPlayerA().getEmail(),
                            alliance.getIdPlayerA().is_ai(),
                            null
                        ),
                        new PlayerDTO(
                            alliance.getIdPlayerB().getId(),
                            alliance.getIdPlayerB().getNick(),
                            alliance.getIdPlayerB().getEmail(),
                            alliance.getIdPlayerB().is_ai(),
                            null)
                ))
                .toList();
        
        return allianceDTOs;
    }

    @Override
    public PlayerAllianceDTO createAlliance(PlayerAllianceDTO allianceDTO) {
        PlayerAlliance alliance = new PlayerAlliance();

        Players playerA = playerRepository.findById(allianceDTO.playerA().id()).orElseThrow();
        Players playerB = playerRepository.findById(allianceDTO.playerB().id()).orElseThrow();
        Leagues league = leagueRepository.findById(allianceDTO.league().id()).orElseThrow();
        alliance.setIdLeague(league);
        alliance.setIdPlayerA(playerA);
        alliance.setIdPlayerB(playerB);
        alliance = allianceRepository.save(alliance);

        LeagueDTO leagueDTO = new LeagueDTO(league.getId(), league.getCreated_at(), league.getName(), league.getTeams(), league.getState(), league.getId_admin(), league.getMatch_frequency(), league.getStart_date(), null, null);
        PlayerDTO playerADTO = new PlayerDTO(playerA.getId(), playerA.getNick(), playerA.getEmail(), playerA.is_ai(), null);
        PlayerDTO playerBDTO = new PlayerDTO(playerB.getId(), playerB.getNick(), playerB.getEmail(), playerB.is_ai(), null);
        
        return new PlayerAllianceDTO(
                alliance.getId(),
                alliance.getCreatedAt(),
                leagueDTO,
                playerADTO,
                playerBDTO
        );
    }

    @Override
    public void deleteAlliance(Long id) {
        allianceRepository.deleteById(id);
    }

}
