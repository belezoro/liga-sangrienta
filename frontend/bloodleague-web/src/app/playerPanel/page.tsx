"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import LoginButton from "../components/LoginButton";

interface League {
    id: number;
    name: string;
}

interface Player {
    id: number;
    nick: string;
    email: string;
    leagues: League[];
}

export default function PlayerPanel() {
    const [player, setPlayer] = useState<Player | null>(null);
    const [leagueId, setLeagueId] = useState("");
    const router = useRouter();

    useEffect(() => {
        const storedPlayer = localStorage.getItem("player");
        if (storedPlayer) {
            const parsed = JSON.parse(storedPlayer);
            axios.get(`http://localhost:8080/players/${parsed.id}`)
            .then(response => {
                localStorage.setItem("player", JSON.stringify(response.data));
                setPlayer(response.data);
            })
            .catch(error => {
                console.error("Error al cargar usuario:", error);
            });
        }
    }, []);

    const handleLeagueClick = (leagueId: number) => {
        // Aquí puedes manejar el clic en una liga
        localStorage.setItem("leagues", JSON.stringify([leagueId]));
        router.push("/leagueManager");
    };

    const handleSubmit = () => {
        // Aquí puedes manejar la unión a una liga usando el leagueId
        if (!player) return;
        axios.put(`http://localhost:8080/players/joinLeague/${player.id}/${leagueId}`)
        .then(response => {
            localStorage.setItem("player", JSON.stringify(response.data));
            setPlayer(response.data);
            setLeagueId("");
        })
        .catch(error => {
            console.error("Error al unirse a la liga:", error);
        });
    };

    if (!player) return <p>Cargando jugador...</p>;

    return (
        <>
            <LoginButton/>
            <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">Panel de Jugador</h1>
                    <p className="mt-2 text-zinc-900 dark:text-zinc-100">Bienvenido, {player?.nick}</p>
                    <p className="mt-2 text-zinc-900 dark:text-zinc-100">Aquí puedes gestionar tu perfil y tus ligas.</p>
                    <div className="mt-5">
                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Ligas activas</h2>
                        <ul className="mt-2 space-y-2">
                            {/* Aquí se listarían las ligas activas del jugador */}
                            {player.leagues?.length === 0 && (<p className="text-zinc-700 dark:text-zinc-300">No estás en ninguna liga actualmente.</p>
                            )}
                            {player.leagues?.map((league) => (
                                <button key={league.id} type="button" className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 cursor-pointer" onClick={() => handleLeagueClick(league.id)}>
                                    {league.name}
                                </button>
                            ))}
                        </ul>
                    </div>
                </div>
                
                
                <form className="mt-8 flex w-80 flex-col space-y-4">
                    <input
                        type="text"
                        placeholder="ID de Liga"
                        value={leagueId}
                        onChange={(e) => setLeagueId(e.target.value)}
                        className="w-full rounded border border-zinc-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                    />
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 cursor-pointer"
                    >
                        Unirse a Liga
                    </button>
                    <button
                        type="button"
                        className="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 cursor-pointer"
                        onClick={() => router.push("/leagueCreation")}
                    >
                        Crear Nueva Liga
                    </button>
                </form>
            </div>
        </>
    );
}
