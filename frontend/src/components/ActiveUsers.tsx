"use client";
import React from "react";
import Link from "next/link";

interface ActiveUsersListProps {
  activeUsers: number[];
}

export const ActiveUsersList: React.FC<ActiveUsersListProps> = ({
  activeUsers,
}) => {
  return (
    <div>
      <h3>Aktywni użytkownicy:</h3>
      {activeUsers.length > 0 ? (
        <ul>
          {activeUsers.map((userId) => (
            <li key={userId}>
              <Link href={`/dashboard/${userId}`}>
                <a className="text-blue-500 underline">
                  Chat z użytkownikiem {userId}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Brak aktywnych użytkowników.</p>
      )}
    </div>
  );
};
