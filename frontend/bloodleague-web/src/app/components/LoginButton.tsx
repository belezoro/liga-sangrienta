import {useRouter} from "next/navigation";

export default function LoginButton(){

    const router = useRouter();

    return (
        <button
            className="fixed top-5 right-5 p-3  bg-red-500 hover:bg-red-600 rounded-xl cursor-pointer"
            onClick={() => router.push("/")}
        >
            Cerrar Sesión
        </button>
    );
}