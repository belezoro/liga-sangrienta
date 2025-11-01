package com.bloodleague.core.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bloodleague.core.model.Matches;

@Repository
public interface MatchesRepository extends JpaRepository<Matches, Long> {

    @Query("SELECT m FROM Matches m WHERE m.league.id = :id")
    Set<Matches> findByIdLeague(Long id);
    
}
