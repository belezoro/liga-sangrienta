package com.bloodleague.core.model;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "leagues")
@Data
public class Leagues {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    private Timestamp created_at;

    private String name;
    private int teams;
    private Long id_admin;
    private String state;
    private int match_frequency;
    private Date start_date;

    @ManyToMany(mappedBy = "leagues")
    private Set<Players> players = new HashSet<>();

    @OneToMany(mappedBy = "league")
    private Set<Matches> matches = new HashSet<>();

}
