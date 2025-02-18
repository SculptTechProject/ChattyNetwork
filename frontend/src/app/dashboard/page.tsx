import React from "react";
import { LogOutBtn } from "@/components/LogOutBtn";

export default function DashboardPage() {
  return (
    <>
      <header className="flex flex-row justify-center pt-8">
        <h1 className="font-bold text-gray-600 text-2xl drop-shadow-2xl">
          Chatty Network
        </h1>
        <LogOutBtn/>
      </header>
      <main>This is main</main>
    </>
  );
}
