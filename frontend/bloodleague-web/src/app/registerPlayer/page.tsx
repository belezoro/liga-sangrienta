'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


interface Players{
    nick: string;
    email: string;
    password: string;
}

export default function RegisterPlayer() {
    const [player, setPlayer] = useState<Players>({
        nick: "",
        email: "",
        password: ""
    });
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí puedes manejar el registro del jugador usando los valores de nick, email y password
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        console.log('API URL usada en build:', apiUrl);
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/players/createPlayer`, player)
            .then(response => {
                setMessage("Jugador registrado exitosamente");
            })
            .catch(error => {
                setMessage("Error al registrar jugador");
            });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <form className="mt-8 flex w-80 flex-col space-y-4">
                <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">Registro de Jugador</h1>
                <input
                    type="text"
                    placeholder="Nick"
                    value={player.nick}
                    onChange={(e) => setPlayer({ ...player, nick: e.target.value })}
                    className="rounded border border-zinc-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                    type="email"
                    placeholder="Correo Electrónico"
                    value={player.email}
                    onChange={(e) => setPlayer({ ...player, email: e.target.value })}
                    className="rounded border border-zinc-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={player.password}
                    onChange={(e) => setPlayer({ ...player, password: e.target.value })}
                    className="rounded border border-zinc-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 cursor-pointer"
                >
                    Registrarse
                </button>
                <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="w-full rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
                >
                    Volver
                </button>
                {message && (
                    <p className="mt-4 text-center text-zinc-900 dark:text-zinc-100">{message}</p>
                )}
            </form>
        </div>
    );
}