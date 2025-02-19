"use client";
import React, { useEffect, useRef, useState } from "react";
import { LogOutBtn } from "@/components/LogOutBtn";
import { io, Socket } from "socket.io-client";

export default function DashboardPage() {
  const socketRef = useRef<Socket | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { id?: string; text: string; sender: string }[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const newSocket = io("http://localhost:3000", {
      transports: ["websocket", "polling"],
      withCredentials: true,
      auth: { token },
    });

    socketRef.current = newSocket;

    newSocket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
      scrollToBottom();
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") return;

    if (!socketRef.current) return;

    const newMessage = { text: message };
    socketRef.current.emit("sendMessage", newMessage);

    setMessage("");
    scrollToBottom();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      <header className="flex justify-between items-center bg-gray-800 p-4 text-white shadow-lg">
        <h1 className="text-xl font-bold">Chatty Network</h1>
        <LogOutBtn />
      </header>

      <main className="flex flex-col items-center pt-6 h-screen bg-gray-100">
        <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-4 h-[70vh] flex flex-col">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Czat</h2>

          <div className="flex-1 overflow-y-auto border-b pb-2">
            {messages.map((msg, index) => (
              <div
                key={msg.id || index}
                className={`p-2 my-1 max-w-[75%] rounded-md ${
                  msg.sender === "Me"
                    ? "ml-auto bg-blue-500 text-white"
                    : "mr-auto bg-gray-300 text-black"
                }`}
              >
                <span className="text-xs block text-gray-600">
                  {msg.sender === "Me" ? "Ty" : "Ktoś"}
                </span>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Napisz wiadomość..."
              className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Wyślij
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
