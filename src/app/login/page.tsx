"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/firebase";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/chat");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      router.push("/chat");
    } catch (err: any) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
      className="h-screen flex items-center justify-center bg-gray-100"
    >
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-xl mb-4 text-center">Iniciar Sesión</h1>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border w-full p-2 mb-3 rounded placeholder-gray-600 text-gray-800"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full p-2 mb-3 rounded placeholder-gray-600 text-gray-800"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600"
        >
          Entrar
        </button>
        <p className="text-sm mt-4 text-center">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-blue-600 underline">
            Regístrate aquí
          </a>
        </p>
      </div>
    </form>
  );
}
