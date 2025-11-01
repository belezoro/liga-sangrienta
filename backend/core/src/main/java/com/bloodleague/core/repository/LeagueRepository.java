package com.bloodleague.core.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bloodleague.core.model.Leagues;

@Repository
public interface LeagueRepository extends JpaRepository<Leagues, Long>  {

    @SuppressWarnings("null")
    @EntityGraph(attributePaths = {"players", "matches"})
    Optional<Leagues> findById(Long id);

}
