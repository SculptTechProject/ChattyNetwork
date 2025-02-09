"use client"
import React from "react";
import { useRouter } from "next/navigation";

//TODO Make a request to the server to logout the user
export const LogOutBtn = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");

      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
    >
      Logout
    </button>
  );
};
