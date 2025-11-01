package com.bloodleague.core.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bloodleague.core.model.Players;

@Repository
public interface PlayerRepository extends JpaRepository<Players, Long> {

    Players findByEmailAndPassword(String email, String password);

    List<Players> findByLeagues_Id(Long idLeague);
    
}
