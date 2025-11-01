package com.bloodleague.core.model;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "matches")
@Data
public class Matches {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_teama")
    private Players teamA;

    @ManyToOne
    @JoinColumn(name = "id_teamb")
    private Players teamB;

    private Date match_date;
    private String match_time;
    private String state;
    private int round;
    private int pointsa;
    private int pointsb;
    private Long winner;

    @ManyToOne
    @JoinColumn(name = "id_league")
    private Leagues league;

    // Para evitar problemas con Set antes de persistir
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Matches)) return false;
        return id != null && id.equals(((Matches) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

}
