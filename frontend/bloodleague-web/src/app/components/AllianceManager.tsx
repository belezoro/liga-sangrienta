import { useState, useEffect } from "react";
import axios from "axios";
import { notEqual } from "assert";

interface LeaguesDTO {
    id: number;
    created_at: Date;
    name: string;
    teams: number;
    state: string;
    id_admin: number;
    match_frequency: number;
    start_date: Date;
}

interface PlayerDTO {
  id: number;
  nick: string;
  email: string;
  is_ai: boolean;
}

interface PlayerAllianceDTO {
  id: number;
  league: LeaguesDTO;
  playerA: PlayerDTO;
  playerB: PlayerDTO;
  createdAt: string;
}

export default function AllianceManager({ leagueId, sessionPlayer }: { leagueId: number, sessionPlayer: PlayerDTO }) {
  const [players, setPlayers] = useState<PlayerDTO[]>([]);
  const [alliances, setAlliances] = useState<PlayerAllianceDTO[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<number | null>(null);

  // Cargar jugadores y alianzas al montar
  useEffect(() => {
    (async () => {
      const [playersRes, alliancesRes] = await Promise.all([
        axios.get(`http://localhost:8080/players/byLeague?idLeague=${leagueId}`),
        axios.get(`http://localhost:8080/alliances/byLeague?idLeague=${leagueId}`),
      ]);
      setPlayers(playersRes.data);
      setAlliances(alliancesRes.data);
    })();
  }, [leagueId]);

  // Crear nueva alianza
  const createAlliance = async () => {
    if (!selectedPartner) return;
    try {
      const res = await axios.post(`http://localhost:8080/alliances/create`, {
        league: {id: leagueId},
        playerA: {id: sessionPlayer.id},
        playerB: {id: selectedPartner},
      });
      setAlliances([...alliances, res.data]);
      setSelectedPartner(null);
    } catch (err) {
      console.error("Error creando alianza:", err);
    }
  };

  // Eliminar alianza
  const deleteAlliance = async (id: number) => {
    await axios.delete(`http://localhost:8080/alliances/delete?id=${id}`);
    setAlliances(alliances.filter(a => a.id !== id));
  };

  return (
    <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 max-w-lg">
      <h2 className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">🤝 Alianzas</h2>

      {/* Mostrar alianzas existentes */}
      <ul className="space-y-2 mb-4">
        {alliances.map(a => {
          return (
            <li key={a.id} className="flex justify-between items-center bg-zinc-200 dark:bg-zinc-800 p-2 rounded-md">
              <span className="mr-5">{a.playerA.nick} & {a.playerB.nick}</span>
              {(sessionPlayer.id === a.playerA.id || sessionPlayer.id === a.playerB.id) && 
                <button
                  onClick={() => deleteAlliance(a.id)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  Romper
                </button>
              }
            </li>
          );
        })}
      </ul>

      {/* Crear nueva alianza */}
      {!alliances.some(a => a.playerA.id === sessionPlayer.id || a.playerB.id === sessionPlayer.id) &&
        <div className="flex gap-2 items-center">
          <select
            className="bg-zinc-200 dark:bg-zinc-700 p-2 rounded-md text-black dark:text-white"
            value={selectedPartner ?? ""}
            onChange={(e) => setSelectedPartner(Number(e.target.value))}
          >
            <option value="">Seleccionar aliado</option>
            {players
              .filter(p => p.id !== sessionPlayer.id &&
                    !alliances.some(a => a.playerA.id === p.id || a.playerB.id === p.id)
              )
              .map(p => (
                <option key={p.id} value={p.id}>{p.nick}</option>
              ))}
          </select>
          <button
            onClick={createAlliance}
            disabled={!selectedPartner}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer"
          >
            Crear
          </button>
        </div>
      }
    </div>
  );
}