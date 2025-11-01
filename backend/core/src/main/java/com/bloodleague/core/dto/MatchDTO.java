package com.bloodleague.core.dto;

import java.sql.Date;

public record MatchDTO(
    Long id, 
    Long id_league, 
    PlayerDTO teamA, 
    PlayerDTO teamB, 
    Date match_date, 
    String match_time,
    String state,
    int round,
    int pointsa,
    int pointsb,
    PlayerDTO winner
) {
}
