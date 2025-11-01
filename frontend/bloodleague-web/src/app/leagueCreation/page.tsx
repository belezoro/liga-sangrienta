"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import LoginButton from "../components/LoginButton";

export default function LeagueCreation() {
    const [leagueName, setLeagueName] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter(); // Hook para navegar
    const [player, setPlayer] = useState<{id:number,name:string} | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("player");
        if (stored) setPlayer(JSON.parse(stored));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!player) {
                setMessage("Jugador no encontrado. Por favor, inicia sesión nuevamente.");
                return;
            }
            const adminId = player.id;
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/leagues/create`, { name: leagueName, id_admin: adminId });
            if (response.status === 201) {
                setMessage("¡Liga creada exitosamente!");
                // Redirigir al panel del jugador
                router.push("/playerPanel");
            } else {
                setMessage("Error al crear la liga. Por favor, intenta nuevamente.");
            }
        } catch (error) {
            setMessage("Error al crear la liga. Por favor, intenta nuevamente.");
        }
    };

  return (
    <>
      <LoginButton />
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <form className="mt-8 flex w-80 flex-col space-y-4">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            Crear Nueva Liga
          </h1>
          <input
            type="text"
            placeholder="Nombre de la Liga"
            value={leagueName}
            onChange={(e) => setLeagueName(e.target.value)}
            className="w-full rounded border border-zinc-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 cursor-pointer"
          >
            Crear Liga
          </button>
          <button
              type="button"
              onClick={() => router.push("/playerPanel")}
              className="w-full rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
          >
              Volver
          </button>
          {message && (
            <p className="mt-4 text-center text-zinc-900 dark:text-zinc-100">
              {message}
            </p>
          )}
        </form>
      </div>
    </>
  );
}
