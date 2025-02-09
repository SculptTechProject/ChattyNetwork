"use client";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  return (
    <div className="bg-gray-50 text-gray-800">
      <div className="sticky top-0 bg-gray-100 px-4 py-1.5 text-center text-sm font-bold text-neutral-content shadow-lg mx-auto">
        🏗️ App is still in beta!
      </div>

      {/* Navbar */}
      <header className="sticky top-0 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 relative">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-blue-600">
              ChattyNetwork
            </Link>

            {/* Linki + Login */}
            <div className="hidden md:flex items-center space-x-6">
              <nav className="space-x-6">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Home
                </Link>
                <Link
                  href="/features"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Features
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Contact
                </Link>
              </nav>
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </Link>
            </div>

            {/* Hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Menu mobilne */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-16 inset-x-0 mx-auto bg-white shadow-md rounded-b-lg p-4 space-y-2 max-w-sm flex flex-col items-center">
              <Link
                href="/"
                className="block text-gray-700 hover:text-blue-600 transition-all"
              >
                Home
              </Link>
              <Link
                href="/features"
                className="block text-gray-700 hover:text-blue-600 transition-all"
              >
                Features
              </Link>
              <Link
                href="/contact"
                className="block text-gray-700 hover:text-blue-600 transition-all"
              >
                Contact
              </Link>
              <Link
                href="/login"
                className="block text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 text-center transition-all"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-red-400 to-sky-700 text-white text-center">
          <h1 className="sm:text-3xl lg:text-5xl font-bold" data-aos="fade-up">
            Welcome to Chatty Network!
          </h1>
          <p
            className="mt-4 sm:text-sm lg:text-lg"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Create groups, share messages, and connect with friends.
          </p>
          <Link href="#features">
            <button
              className="mt-6 px-6 py-3 bg-white sm:text-sm lg:text-xl text-blue-700 rounded-full font-semibold shadow-lg hover:bg-gray-200 transition-all"
              data-aos="fade-up"
            >
              Get Started
            </button>
          </Link>
        </section>
      </main>
    </div>
  );
}
