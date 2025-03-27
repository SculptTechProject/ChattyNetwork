"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { io, Socket } from "socket.io-client";
import { getCookie, getUserId } from "@/api/api";

const api_url = process.env.NEXT_PUBLIC_API_URL;

if (!api_url) {
  throw new Error("API_URL is not defined in .env");
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

interface ActiveUsersListProps {
  activeUsers: User[];
}

const ActiveUsersList: React.FC<ActiveUsersListProps> = ({ activeUsers }) => {
  return (
    <div className="p-6 bg-white shadow-lg rounded-xl mx-auto max-w-3xl">
      <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Online users:
      </h3>
      {activeUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {activeUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-center p-4 border rounded-lg hover:bg-blue-50 transition-all hover:p-6"
            >
              <Link
                href={`/dashboard/${user.id}`}
                className="text-blue-700 font-semibold hover:underline hover:font-bold hover:text-blue-500 transition-all"
              >
                Chat with: {user.firstName}{" "}{user.lastName}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          Noone is active right now.
        </p>
      )}
    </div>
  );
};

export default function DashboardPage() {
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = getCookie("token");
    const myUserId = getUserId(token);

    const newSocket = io(`${api_url}`, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      auth: { token },
    });
    setSocket(newSocket);

    newSocket.on("activeUsers", (users: User[]) => {
      setActiveUsers(users.filter((user) => user.id !== myUserId));
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <ActiveUsersList activeUsers={activeUsers} />
    </main>
  );
}