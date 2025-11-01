package com.bloodleague.core.dto;

import java.util.List;

public record PlayerDTO(
    Long id,
    String nick,
    String email,
    boolean is_ai,
    List<LeagueDTO> leagues
) {} 
