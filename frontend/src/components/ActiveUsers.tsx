"use client";
import React from "react";
import Link from "next/link";

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

interface ActiveUsersListProps {
  activeUsers: User[];
}

export const ActiveUsersList: React.FC<ActiveUsersListProps> = ({
  activeUsers,
}) => {
  return (
    <div>
      <h3>Aktywni użytkownicy:</h3>
      {activeUsers.length > 0 ? (
        <ul>
          {activeUsers.map((user) => (
            <li key={user.id}>
              <Link href={`/dashboard/${user.id}`}>
                <a className="text-blue-500 underline">
                  Chat z użytkownikiem {user.firstName}{" "}{user.lastName}
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
