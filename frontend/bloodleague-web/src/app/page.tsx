"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Players {
  email: string;
  password: string;
}

export default function Home() {

  const [player, setPlayer] = useState<Players>({
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const router = useRouter(); // Hook para navegar

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/players/login`, player);
      if (response.status === 200 && response.data.id) {
        localStorage.setItem("player", JSON.stringify(response.data));
        // Redirigir al panel del jugador
        router.push("/playerPanel");
        setMessage("¡Sesión iniciada!");
      } else {
        setMessage("Error en el inicio de sesión. Por favor, verifica tus credenciales.");
      }
    } catch (error) {
      setMessage("Error en el inicio de sesión. Por favor, verifica tus credenciales.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <form className="mt-8 flex w-80 flex-col space-y-4">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          Iniciar Sesion
        </h1>
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={player.email}
          onChange={(e) => setPlayer({ ...player, email: e.target.value })}
          className="w-full rounded border border-zinc-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={player.password}
          onChange={(e) => setPlayer({ ...player, password: e.target.value })}
          className="w-full rounded border border-zinc-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 cursor-pointer"
        >
          Iniciar Sesion
        </button>
        <button
          type="button"
          onClick={() => router.push("/registerPlayer")}
          className="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 cursor-pointer"
        >
          Registrarse
        </button>
        {message && (
          <p className="mt-4 text-center text-zinc-900 dark:text-zinc-100">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
