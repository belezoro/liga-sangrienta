'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import LeagueRanking from "../components/LeagueRanking";
import AllianceManager from "../components/AllianceManager";
import { motion } from "framer-motion";
import LoginButton from "../components/LoginButton";

interface PlayerDTO {
    id: number;
    nick: string;
    email: string;
    is_ai: boolean;
}

interface MatchDTO {
    id: number;
    id_league: number;
    teamA: PlayerDTO;
    teamB: PlayerDTO;
    match_date: Date;
    match_time: string;
    state: string;
    round: number;
    pointsa: number;
    pointsb: number;
    winner: PlayerDTO | null;
}

interface LeaguesDTO {
    id: number;
    created_at: Date;
    name: string;
    teams: number;
    state: string;
    id_admin: number;
    match_frequency: number;
    start_date: Date;
    players: PlayerDTO[];
    matches: MatchDTO[];
}

export default function LeagueManager() {
    const [leagues, setLeagues] = useState<LeaguesDTO>();
    const [sessionPlayer, setSessionPlayer] = useState<PlayerDTO | null>(null);
    const [ai_player_count, setAiPlayerCount] = useState(0);

     // 👉 Modal states
    const [selectedMatch, setSelectedMatch] = useState<MatchDTO | null>(null);
    const [matchDate, setMatchDate] = useState("");
    const [matchTime, setMatchTime] = useState("");
    const [pointsA, setPointsA] = useState(0);
    const [pointsB, setPointsB] = useState(0);

    useEffect(() => {
        // Aquí podrías cargar las ligas desde una API o localStorage
        const storedLeagues = localStorage.getItem("leagues");
        if (!storedLeagues) return;

        (async () => {
            try {
                console.log("Fetching league with ID:", JSON.parse(storedLeagues));
                const response = await axios.get<LeaguesDTO>("http://localhost:8080/leagues/getById", { params: { idLeague: JSON.parse(storedLeagues) } });
                setLeagues(response.data);
            } catch (error) {
                console.error("Error fetching leagues:", error);
            }
        })();

        const storedPlayer = localStorage.getItem("player");
        if (storedPlayer) {
            setSessionPlayer(JSON.parse(storedPlayer));
        }

    }, []);

    const handleStartLeague = () => {
        if (!leagues) return;
        axios.post(`http://localhost:8080/leagues/startLeague`, leagues, { params: { ai_player_count } })
        .then(response => {
            setLeagues(response.data);
        })
        .catch(error => {
            console.error("Error al iniciar la liga:", error);
        });
    };

    const openModal = (match: MatchDTO) => {
        setSelectedMatch(match);
        setMatchDate(new Date(match.match_date).toISOString().split("T")[0]);
        setPointsA(match.pointsa || 0);
        setPointsB(match.pointsb || 0);
        setMatchTime("18:00"); // valor por defecto
    };

    // 👉 Cerrar modal
    const closeModal = () => {
        setSelectedMatch(null);
    };

    // 👉 Guardar cambios
    const handleSaveMatch = async () => {
        if (!selectedMatch) return;

        try {
        const updatedMatch = {
            ...selectedMatch,
            id_league: leagues?.id,
            teamA: selectedMatch.teamA,
            teamB: selectedMatch.teamB,
            state: selectedMatch.state,
            match_date: matchDate,
            match_time: matchTime,
            pointsa: pointsA,
            pointsb: pointsB,
        };

        const response = await axios.put(
            `http://localhost:8080/matches/update`,
            updatedMatch, { params: { id_league: leagues?.id } }
        );

        // Actualizamos en la liga local
        const updatedMatches = leagues?.matches.map((m) =>
            m.id === selectedMatch.id ? response.data : m
        );
        setLeagues({ ...leagues!, matches: updatedMatches! });
        closeModal();
        } catch (error) {
        console.error("Error guardando partido:", error);
        }
    };



    {!leagues && (
        <p className="text-zinc-700 dark:text-zinc-300">No hay ligas disponibles.</p>
    )}
    return (
        <>
            <LoginButton />
            <div className="flex flex-col min-h-screen p-4 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
                <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">{leagues?.name}</h1>
                {leagues?.state === "WAITING" && 
                    <>
                        <span className="mt-2 bg-yellow-500 rounded-lg p-2 text-zinc-900 dark:text-white">Estado: {leagues?.state}</span>
                        <div className="mt-4">
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Jugadores inscritos:</h2>
                            <ul className="mt-2 space-y-2">
                                {leagues?.players.map((player) => (
                                    <li key={player.id} className="border-b border-zinc-300 dark:border-zinc-700 py-2">
                                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">{player.nick}</p>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{player.email}</p>
                                    </li>
                                )) || <p>No hay jugadores</p>}
                            </ul>
                            <div className="mt-4 flex flex-col items-center">
                                <AllianceManager leagueId={leagues.id} sessionPlayer={sessionPlayer!} />
                            </div>
                        </div>
                        {sessionPlayer?.id === leagues?.id_admin && (
                            <>
                                <p className="mt-2 text-green-500">Eres el administrador de esta liga.</p>
                                <div className="mt-4">
                                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Configuración liga</h3>
                                    <div className="mt-2">
                                        <label className="block text-zinc-900 dark:text-zinc-100">Inicio de liga:</label>
                                        <input 
                                            type="date"
                                            className="bg-zinc-200 hover:bg-zinc-300 rounded-md p-2 text-black"
                                            value={leagues?.start_date? new Date(leagues.start_date).toISOString().split("T")[0] : ""}
                                            onChange={(e) => setLeagues({ ...leagues, start_date: new Date(e.target.value) })}
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <label className="block text-zinc-900 dark:text-zinc-100">Frecuencia partidos:</label>
                                        <input 
                                            type="number"
                                            className="bg-zinc-200 hover:bg-zinc-300 rounded-md p-2 text-black"
                                            value={leagues?.match_frequency??""}
                                            onChange={(e) => setLeagues({ ...leagues, match_frequency: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <label className="block text-zinc-900 dark:text-zinc-100">Cantidad jugadores IA:</label>
                                        <input 
                                            type="number"
                                            className="bg-zinc-200 hover:bg-zinc-300 rounded-md p-2 text-black"
                                            value={ai_player_count??""}
                                            onChange={(e) => setAiPlayerCount(Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                                <button type="button" onClick={handleStartLeague} disabled={leagues?.match_frequency < 1 || !leagues?.start_date} className="mt-4 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 cursor-pointer">Iniciar Liga</button>
                            </>
                        )}
                    </>
                }
                {leagues?.state === "ACTIVE" &&
                    <>
                        <span className="my-2 bg-green-500 rounded-lg p-2 text-zinc-900 dark:text-white">Estado: {leagues?.state}</span>
                        <div className="mt-2 border-t-2 border-zinc-300 dark:border-zinc-700 pt-4 flex flex-col items-center">
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Partidos Jugados</h2>
                            <motion.div className="overflow-hidden w-full">
                                <motion.ul
                                    className="flex space-x-4 my-4"
                                    animate={{ x: ["0%", "-50%"] }}
                                    transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
                                >
                                    {[...leagues.matches.filter(m => m.winner !== null), ...leagues.matches.filter(m => m.winner !== null)].map((match, i) => (
                                    <li key={i} className="min-w-[350px] bg-zinc-200 dark:bg-zinc-800 rounded-md p-3 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition text-center">
                                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                                        {new Date(match.match_date).toLocaleDateString()}
                                        </p>
                                        <p className="text-white text-md dark:text-white">
                                        {match.teamA.nick} <span className="text-yellow-300">vs</span> {match.teamB.nick} -
                                        Ganador:<span className="font-bold ml-2 text-yellow-300 ">{match.winner?.nick}</span> 
                                        </p>
                                    </li>
                                    ))}
                                </motion.ul>
                            </motion.div>
                        </div>
                        <div className="mt-8 w-full max-w-screen-2xl mx-auto border-t-2 border-zinc-300 dark:border-zinc-700 pt-8 px-4">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 w-full">
                                {/* 🏁 Rondas */}
                                <div className="flex-1 w-full">
                                {(() => {
                                    const matches = leagues.matches.filter(m => m.state !== 'COMPLETED');
                                    const rounds = new Map<number, MatchDTO[]>();
                                    matches.forEach((match) => {
                                    const round = match.round || 1;
                                    if (!rounds.has(round)) rounds.set(round, []);
                                    rounds.get(round)!.push(match);
                                    });
                                    const roundsArray = Array.from(rounds.entries()).sort(([a], [b]) => a - b);

                                    return roundsArray.map(([roundNumber, roundMatches]) => (
                                    <div
                                        key={roundNumber}
                                        className="border border-zinc-300 dark:border-zinc-700 rounded-2xl p-6 my-4 w-full shadow-md bg-zinc-50/80 dark:bg-zinc-900/40 backdrop-blur-sm"
                                    >
                                        <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-3 text-center">
                                        🏁 Ronda {roundNumber}
                                        </h3>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                                        {roundMatches.map(match => (
                                            <li
                                            key={match.id}
                                            onClick={() => openModal(match)}
                                            className="bg-zinc-200 dark:bg-zinc-800 rounded-xl p-4 cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700 transition text-center shadow-sm"
                                            >
                                            <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                                                {new Date(match.match_date).toLocaleDateString()}
                                            </p>
                                            <p>
                                                ({match.match_time?match.match_time:'Sin establecer hora'})
                                            </p>
                                            <span className="bg-amber-500 text-black font-bold rounded-full px-3 py-1 text-xs">
                                                {match.state}
                                            </span>
                                            <p className="text-zinc-900 dark:text-zinc-100 text-md mt-2">
                                                {match.teamA.nick} <span className="text-yellow-300">vs</span> {match.teamB.nick}
                                            </p>
                                            </li>
                                        ))}
                                        </ul>
                                    </div>
                                    ));
                                })()}
                                </div>

                                {/* 🏆 Ranking */}
                                <div className="flex-1 w-full">
                                <LeagueRanking matches={leagues.matches} players={leagues.players} league={leagues} />
                                </div>
                            </div>
                            </div>

                    </>
                }
                {/* 🔽 Modal */}
                {selectedMatch && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl w-96">
                        <h2 className="text-2xl font-bold mb-4 text-center text-zinc-900 dark:text-zinc-100">
                            Editar Partido
                        </h2>

                        <label className="block text-zinc-700 dark:text-zinc-300 mb-1">
                            Fecha:
                        </label>
                        <input
                            type="date"
                            value={matchDate}
                            onChange={(e) => setMatchDate(e.target.value)}
                            className="w-full mb-2 p-2 rounded bg-zinc-200 dark:bg-zinc-700 text-white"
                        />

                        <label className="block text-zinc-700 dark:text-zinc-300 mb-1">
                            Hora:
                        </label>
                        <input
                            type="time"
                            value={matchTime}
                            onChange={(e) => setMatchTime(e.target.value)}
                            className="w-full mb-2 p-2 rounded bg-zinc-200 dark:bg-zinc-700 text-white"
                        />

                        <div className="flex justify-between mt-4">
                            <div>
                                <label className="text-zinc-700 dark:text-zinc-300 mr-2">
                                    {selectedMatch.teamA.nick}
                                </label>
                                <input
                                    type="number"
                                    value={pointsA}
                                    onChange={(e) => setPointsA(Number(e.target.value))}
                                    className="w-20 p-1 rounded bg-zinc-200 dark:bg-zinc-700 text-white"
                                />
                            </div>
                            <div>
                                <label className="text-zinc-700 dark:text-zinc-300 mr-2">
                                    {selectedMatch.teamB.nick}
                                </label>
                                <input
                                    type="number"
                                    value={pointsB}
                                    onChange={(e) => setPointsB(Number(e.target.value))}
                                    className="w-20 p-1 rounded bg-zinc-200 dark:bg-zinc-700 text-white"
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <label className="text-white mr-2">Estado:</label>
                            <select
                                value={selectedMatch.state}
                                onChange={(e) => setSelectedMatch({ ...selectedMatch, state: e.target.value })}
                                className="p-1 rounded bg-zinc-200 dark:bg-zinc-700 text-white"
                            >
                                <option value="SCHEDULED">PENDIENTE</option>
                                <option value="IN_PROGRESS">EN PROGRESO</option>
                                <option value="COMPLETED">COMPLETADO</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 rounded bg-zinc-400 dark:bg-zinc-700 text-white hover:bg-zinc-500 dark:hover:bg-zinc-600 cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveMatch}
                                className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white  cursor-pointer"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                    </div>
                )}
                {leagues?.state === "COMPLETED" && <span className="mt-2 bg-blue-500 rounded-lg p-2 text-zinc-900 dark:text-white">Estado: {leagues?.state}</span>}
            </div>
        </>
    );
}
