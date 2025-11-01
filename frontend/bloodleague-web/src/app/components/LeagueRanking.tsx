import {useState, useEffect} from "react";
import axios from "axios";

interface PlayerDTO {
    id: number;
    nick: string;
    email: string;
}

interface MatchDTO {
    id: number;
    id_league: number;
    teamA: PlayerDTO;
    teamB: PlayerDTO;
    match_date: Date;
    state: string;
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
}

interface PlayerAllianceDTO {
  id: number;
  league: LeaguesDTO;
  playerA: PlayerDTO;
  playerB: PlayerDTO;
  createdAt: string;
}



export default function LeagueRanking({ matches, players, league }: { matches: MatchDTO[], players: PlayerDTO[], league: LeaguesDTO }) {
    // Lista de alianzas y sus respectivos puntos
    const [alliances, setAlliances] = useState<PlayerAllianceDTO[] | []>([])
     // Cargar jugadores y alianzas al montar
    useEffect(() => {
        (async () => {
        const [alliancesRes] = await Promise.all([
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/alliances/byLeague?idLeague=${league.id}`),
        ]);
        setAlliances(alliancesRes.data);
        })();
    }, []);
    
    // Mapa para acumular los puntos
    const rankingMap: Record<number, { player: PlayerDTO; points: number; wins: number; losses: number, draws: number, touchdownsAttack: number, touchdownsDefense: number }> = {};

    // Inicializamos todos los jugadores
    players.forEach(p => {
        rankingMap[p.id] = { player: p, points: 0, wins: 0, losses: 0, draws: 0,  touchdownsAttack: 0, touchdownsDefense: 0 };
    });

    // Ranking por alianzas
    type AllianceKey = string; // "playerAId-playerBId" ordenado
    const allianceRankingMap: Record<AllianceKey, { alliance: PlayerAllianceDTO, points: number, wins: number, losses: number, draws: number, touchdownsAttack: number, touchdownsDefense: number }> = {};

    // Inicializamos las alianzas
    alliances.forEach(a => {
        const key = [a.playerA.id, a.playerB.id].sort((x, y) => x - y).join("-");
        allianceRankingMap[key] = { alliance: a, points: 0, wins: 0, losses: 0, draws: 0, touchdownsAttack: 0, touchdownsDefense: 0 };
    });

    // Recorremos todos los partidos
    matches.forEach(match => {
        if (match.state === "COMPLETED") {
            const winner = match.winner ?? "";
            // Asegurar valores numéricos
            const pointsa = match.pointsa || 0;
            const pointsb = match.pointsb || 0;
            if(winner){
                const loser = (match.teamA.id === winner.id) ? match.teamB.id : match.teamA.id;
    
    
                // Sumamos puntos
                rankingMap[winner.id].points += 3;
                rankingMap[winner.id].wins += 1;
                rankingMap[loser].losses += 1;
                rankingMap[winner.id].touchdownsAttack += pointsa;
                rankingMap[loser].touchdownsDefense += pointsa;
                rankingMap[loser].touchdownsAttack += pointsb;
                rankingMap[winner.id].touchdownsDefense += pointsb;
            } else {
                rankingMap[match.teamA.id].points += 1
                rankingMap[match.teamA.id].draws += 1;
                rankingMap[match.teamB.id].points += 1
                rankingMap[match.teamB.id].draws += 1;
                rankingMap[match.teamA.id].touchdownsAttack += pointsa;
                rankingMap[match.teamB.id].touchdownsDefense += pointsa;
                rankingMap[match.teamB.id].touchdownsAttack += pointsb;
                rankingMap[match.teamA.id].touchdownsDefense += pointsb;
            }

            
        }
    });
    
    // Ranking alianzas
    alliances.forEach(a => {
        const key = [a.playerA.id, a.playerB.id].sort((x, y) => x - y).join("-");
        const allianceStats = allianceRankingMap[key];
        allianceStats.points += rankingMap[a.playerA.id].points + rankingMap[a.playerB.id].points;
        allianceStats.wins += rankingMap[a.playerA.id].wins + rankingMap[a.playerB.id].wins;
        allianceStats.losses += rankingMap[a.playerA.id].losses + rankingMap[a.playerB.id].losses;
        allianceStats.draws += rankingMap[a.playerA.id].draws + rankingMap[a.playerB.id].draws;
        allianceStats.touchdownsAttack += rankingMap[a.playerA.id].touchdownsAttack + rankingMap[a.playerB.id].touchdownsAttack;
        allianceStats.touchdownsDefense += rankingMap[a.playerA.id].touchdownsDefense + rankingMap[a.playerB.id].touchdownsDefense;
    });


    // Convertimos el mapa a lista y ordenamos por puntos
    const rankingList = Object.values(rankingMap).sort((a, b) => b.points - a.points);
    const allianceRankingList = Object.values(allianceRankingMap).sort((a, b) => b.points - a.points);

    return (
        <div className="border border-zinc-300 dark:border-zinc-700 rounded-xl p-4 my-4 w-full max-w--lg mx-auto">
        {/* Clasificación General */}
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Clasificación General</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse border border-zinc-400 dark:border-zinc-600">
            <thead>
                <tr className="bg-zinc-300 dark:bg-zinc-800">
                <th className="p-2 border border-zinc-400 dark:border-zinc-600">Jugador</th>
                <th className="p-2 border border-zinc-400 dark:border-zinc-600">Puntos</th>
                <th className="p-2 border border-zinc-400 dark:border-zinc-600">Victorias</th>
                <th className="p-2 border border-zinc-400 dark:border-zinc-600">Derrotas</th>
                <th className="p-2 border border-zinc-400 dark:border-zinc-600">Empates</th>
                <th className="p-2 border border-zinc-400 dark:border-zinc-600">TouchDowns Ataque</th>
                <th className="p-2 border border-zinc-400 dark:border-zinc-600">TouchDowns Defensa</th>
                </tr>
            </thead>
            <tbody>
                {rankingList.map(({ player, points, wins, losses, draws, touchdownsAttack, touchdownsDefense }) => (
                <tr key={player.id} className="hover:bg-zinc-100 dark:hover:bg-zinc-700 transition">
                    <td className="p-2 border border-zinc-400 dark:border-zinc-600">{player.nick}</td>
                    <td className="p-2 border border-zinc-400 dark:border-zinc-600">{points}</td>
                    <td className="p-2 border border-zinc-400 dark:border-zinc-600">{wins}</td>
                    <td className="p-2 border border-zinc-400 dark:border-zinc-600">{losses}</td>
                    <td className="p-2 border border-zinc-400 dark:border-zinc-600">{draws}</td>
                    <td className="p-2 border border-zinc-400 dark:border-zinc-600">{touchdownsAttack}</td>
                    <td className="p-2 border border-zinc-400 dark:border-zinc-600">{touchdownsDefense}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        {/* Clasificación Alianzas */}
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mt-6 mb-2">Clasificación Alianzas</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse border border-zinc-400 dark:border-zinc-600">
            <thead>
                <tr className="bg-zinc-300 dark:bg-zinc-800">
                <th className="p-2 border border-zinc-400 dark:border-zinc-600">Alianza</th>
                <th className="p-2 border border-zinc-400 dark:border-zinc-600">Puntos</th>
                <th className="p-2 border border-zinc-400 dark:border-zinc-600">Victorias</th>
                <th className="p-2 border border-zinc-400 dark:border-zinc-600">Derrotas</th>
                <th className="p-2 border border-zinc-400 dark:border-zinc-600">Empates</th>
                <th className="p-2 border border-zinc-400 dark:border-zinc-600">TouchDowns Ataque</th>
                <th className="p-2 border border-zinc-400 dark:border-zinc-600">TouchDowns Defensa</th>
                </tr>
            </thead>
            <tbody>
                {allianceRankingList.map(({ alliance, points, wins, losses, draws, touchdownsAttack, touchdownsDefense }) => (
                <tr key={alliance.id} className="hover:bg-zinc-100 dark:hover:bg-zinc-700 transition">
                    <td className="p-2 border border-zinc-400 dark:border-zinc-600">
                    {alliance.playerA.nick} & {alliance.playerB.nick}
                    </td>
                    <td className="p-2 border border-zinc-400 dark:border-zinc-600">{points}</td>
                    <td className="p-2 border border-zinc-400 dark:border-zinc-600">{wins}</td>
                    <td className="p-2 border border-zinc-400 dark:border-zinc-600">{losses}</td>
                    <td className="p-2 border border-zinc-400 dark:border-zinc-600">{draws}</td>
                    <td className="p-2 border border-zinc-400 dark:border-zinc-600">{touchdownsAttack}</td>
                    <td className="p-2 border border-zinc-400 dark:border-zinc-600">{touchdownsDefense}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
}