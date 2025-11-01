package com.bloodleague.core.dto;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

public record LeagueDTO(
    Long id,
    Timestamp created_at,
    String name,
    int teams,
    String state,
    Long id_admin,
    int match_frequency,
    Date start_date,
    List<PlayerDTO> players,
    List<MatchDTO> matches
) {}