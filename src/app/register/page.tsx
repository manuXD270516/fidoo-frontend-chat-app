"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/firebase";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(result.user);
      router.push("/chat");
    } catch (err: any) {
      alert("Error al registrarse: " + err.message);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleRegister();
      }}
      className="h-screen flex items-center justify-center bg-gray-100"
    >
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-xl mb-4 text-center">Crear Cuenta</h1>
        <input
          type="email"
          placeholder="Correo electrónico"
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
        <input
          type="password"
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border w-full p-2 mb-4 rounded placeholder-gray-600 text-gray-800"
        />
        <button
          type="submit"
          className="bg-green-500 text-white font-semibold p-2 w-full rounded hover:bg-green-600"
        >
          Registrarse
        </button>
        <p className="text-sm mt-4 text-center">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </form>
  );
}
