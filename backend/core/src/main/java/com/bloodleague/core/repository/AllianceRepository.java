package com.bloodleague.core.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bloodleague.core.model.PlayerAlliance;

@Repository
public interface AllianceRepository extends JpaRepository<PlayerAlliance, Long> {

    @EntityGraph(attributePaths = {"idLeague", "idPlayerA", "idPlayerB"})
    List<PlayerAlliance> findByIdLeague_Id(Long idLeague);
}
