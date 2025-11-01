package com.bloodleague.core.service;

import java.util.List;

import com.bloodleague.core.dto.PlayerAllianceDTO;

public interface AllianceService {

    List<PlayerAllianceDTO> getAlliancesByLeague(Long id_league);

    PlayerAllianceDTO createAlliance(PlayerAllianceDTO allianceDTO);

    void deleteAlliance(Long id);
}
