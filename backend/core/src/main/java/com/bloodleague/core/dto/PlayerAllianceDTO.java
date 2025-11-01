package com.bloodleague.core.dto;

import java.sql.Timestamp;

public record PlayerAllianceDTO(
    Long id, 
    Timestamp createdAt,
    LeagueDTO league, 
    PlayerDTO playerA, 
    PlayerDTO playerB
) {
}
