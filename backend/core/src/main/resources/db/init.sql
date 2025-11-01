-- Crear tablas base si no existen
CREATE TABLE IF NOT EXISTS players (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nick VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    password VARCHAR(255),
    is_ai BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS leagues (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255) NOT NULL,
    teams INTEGER,
    id_admin BIGINT,
    state VARCHAR(50),
    match_frequency INTEGER,
    start_date DATE
);

CREATE TABLE IF NOT EXISTS matches (
    id BIGSERIAL PRIMARY KEY,
    id_teama BIGINT REFERENCES players(id),
    id_teamb BIGINT REFERENCES players(id),
    id_league BIGINT REFERENCES leagues(id),
    match_date DATE,
    match_time VARCHAR(8),
    state VARCHAR(50),
    round INTEGER DEFAULT 0,
    pointsa INTEGER DEFAULT 0,
    pointsb INTEGER DEFAULT 0,
    winner BIGINT
);

-- Tabla de alianzas entre jugadores
CREATE TABLE IF NOT EXISTS player_alliance (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_league BIGINT REFERENCES leagues(id),
    id_player_a BIGINT REFERENCES players(id),
    id_player_b BIGINT REFERENCES players(id)
);

-- Tabla de relación entre jugadores y ligas
CREATE TABLE IF NOT EXISTS player_league (
    id_player BIGINT REFERENCES players(id),
    id_league BIGINT REFERENCES leagues(id),
    PRIMARY KEY (id_player, id_league)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_matches_league ON matches(id_league);
CREATE INDEX IF NOT EXISTS idx_matches_teams ON matches(id_teama, id_teamb);
CREATE INDEX IF NOT EXISTS idx_player_alliance_league ON player_alliance(id_league);
CREATE INDEX IF NOT EXISTS idx_player_alliance_players ON player_alliance(id_player_a, id_player_b);
CREATE INDEX IF NOT EXISTS idx_player_league_league ON player_league(id_league);
CREATE INDEX IF NOT EXISTS idx_player_league_player ON player_league(id_player);