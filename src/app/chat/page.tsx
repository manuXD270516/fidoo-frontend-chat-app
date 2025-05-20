"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { useAuthStore } from "../store/authStore";
import { useRouter } from "next/navigation";
import { sendMessageToChatGPT } from "@/services/api";

type Message = {
  id?: string;
  text: string;
  createdAt: any;
  sender: string;
};

export default function ChatPage() {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    user.getIdToken().then((token: any) => {
      console.log("Firebase ID Token:", token);
    });

    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Message, "id">),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;

    await addDoc(collection(db, "messages"), {
      text: newMessage,
      createdAt: serverTimestamp(),
      sender: user.email,
    });

    setNewMessage("");

    try {
      await sendMessageToChatGPT(newMessage);
    } catch (err) {
      console.error("Error enviando a ChatGPT:", err);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null; // evita errores al cerrar sesión

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Chat en Tiempo Real</h2>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-3 py-1 rounded text-sm"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-md max-w-xs ${
              user && msg.sender === user.email
                ? "bg-blue-200 self-end ml-auto"
                : "bg-white self-start mr-auto text-gray-800"
            }`}
          >
            <p className="text-sm">{msg.text}</p>
            <p className="text-[10px] text-gray-500 mt-1 text-right">
              {msg.sender}
            </p>
          </div>
        ))}
      </div>

      <div className="p-4 flex gap-2 border-t">
        <input
          type="text"
          className="flex-1 border p-2 rounded text-gray-800 placeholder-gray-600"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Escribe un mensaje..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
