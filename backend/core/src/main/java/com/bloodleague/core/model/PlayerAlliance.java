
package com.bloodleague.core.model;

import java.sql.Timestamp;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "player_alliance")
@Data
public class PlayerAlliance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;
    @ManyToOne
    @JoinColumn(name = "id_league")
    private Leagues idLeague;
    @ManyToOne
    @JoinColumn(name = "id_player_a")
    private Players idPlayerA;
    @ManyToOne
    @JoinColumn(name = "id_player_b")
    private Players idPlayerB;
}