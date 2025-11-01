package com.bloodleague.core.model;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "players")
@Data
public class Players {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    private Timestamp created_at;
    private String nick;
    private String email;
    private String password;
    private boolean is_ai;

    @ManyToMany
    @JoinTable(
        name = "player_league",
        joinColumns = @JoinColumn(name = "id_player"),
        inverseJoinColumns = @JoinColumn(name = "id_league")
    )
    private List<Leagues> leagues = new ArrayList<>();
    
}
