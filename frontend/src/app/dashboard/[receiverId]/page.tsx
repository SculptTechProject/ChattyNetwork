"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { LogOutBtn } from "@/components/LogOutBtn";
import { io, Socket } from "socket.io-client";
import { getCookie, getUserId } from "@/api/api";
import Link from "next/link";
import axios from "axios";

export default function DashboardPage() {
  const api_url = process.env.NEXT_PUBLIC_API_URL;

  if (!api_url) {
    throw new Error("API_URL is not defined in .env");
  }

  const [receiver, setReceiver] = useState<{
    firstName: string;
    lastName: string;
  } | null>(null);
  const { receiverId } = useParams();
  const socketRef = useRef<Socket | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { id?: string; text: string; sender: string }[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!receiverId) return;

    const fetchReceiver = async () => {
      try {
        const res = await axios.get(`${api_url}/user/${receiverId}`);
        setReceiver(res.data);
      } catch (error) {
        console.error("Error fetching receiver data:", error);
      }
    };

    fetchReceiver();
  }, [api_url, receiverId]);

  useEffect(() => {
    const token = getCookie("token");
    const newSocket = io("http://localhost:3000", {
      transports: ["websocket", "polling"],
      withCredentials: true,
      auth: { token },
    });
    socketRef.current = newSocket;
    const currentUserId = getUserId(token);

    newSocket.on("message", (payload) => {
      const { message: newMsg } = payload;
      setMessages((prev) => [
        ...prev,
        {
          id: newMsg.id,
          text: newMsg.content,
          sender: newMsg.senderId === currentUserId ? "Me" : `${receiverId}`,
        },
      ]);
      scrollToBottom();
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connect error:", err.message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [receiverId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const sendMessage = () => {
    if (message.trim() === "" || !socketRef.current) return;

    const parsedReceiverId = receiverId ? Number(receiverId) : null;
    if (!parsedReceiverId) {
      console.error("Empty receiverId in URL!");
      return;
    }

    const newMessage = { content: message, receiverId: parsedReceiverId };
    socketRef.current.emit("sendMessage", newMessage);

    setMessage("");
    scrollToBottom();
    console.log("Sent", message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      <header className="flex justify-between items-center bg-gray-800 p-4 text-white shadow-lg">
        <h1 className="text-xl font-bold hover:text-gray-200 cursor-pointer transition-all">
          Chatty Network
        </h1>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-500 hover:px-5 hover:py-3 transition-all"
        >
          Back to Home
        </Link>{" "}
        <LogOutBtn />
      </header>

      <main className="flex flex-col items-center pt-6 h-screen bg-gray-100">
        <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-4 h-[70vh] flex flex-col">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Chat z użytkownikiem{" "}
            {receiver
              ? `${receiver.firstName} ${receiver.lastName}`
              : `o ID: ${receiverId}`}
          </h2>

          <div className="flex-1 overflow-y-auto border-b pb-2">
            {messages.map((msg, index) => (
              <div
                key={msg.id || index}
                className={`p-2 my-1 max-w-[75%] rounded-md ${
                  msg.sender === "Me"
                    ? "ml-auto bg-blue-400 text-white"
                    : "mr-auto bg-gray-300 text-black"
                }`}
              >
                <span className="text-xs block text-gray-800">
                  {msg.sender === "Me"
                    ? "Ty"
                    : `${receiver ? receiver.firstName : receiverId}`}
                </span>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Napisz wiadomość..."
              className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              rows={3}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 hover:px-5 transition-all"
            >
              Wyślij
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
