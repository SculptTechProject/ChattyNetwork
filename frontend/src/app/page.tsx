"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToFeatures = () => { 
    const features = document.getElementById("features");
    if (features) {
      features.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="bg-gray-50 text-gray-800">
      <div className="sticky top-0 bg-gray-100 px-4 py-1.5 text-center text-sm font-bold text-neutral-content shadow-lg mx-auto">
        🏗️ App is still in beta!
      </div>

      {/* Navbar */}
      <header className="sticky top-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 relative">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-blue-600">
              ChattyNetwork
            </Link>

            {/* Linki + Login */}
            <div className="hidden md:flex items-center space-x-6">
              <nav className="space-x-6 bg-white">
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
      <main className="flex-grow">
        {/* Hero Section */}
        <section
          id="hero"
          className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center px-6"
        >
          <h1
            className="text-4xl md:text-6xl font-bold mb-4"
            data-aos="fade-up"
          >
            Welcome to ChattyNetwork
          </h1>
          <p
            className="text-lg md:text-2xl mb-8"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Create groups, share messages, and connect with friends.
          </p>
          <Link href="#features" onClick={scrollToFeatures}>
            <button
              className="px-6 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              Get Started
            </button>
          </Link>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-100 text-gray-800">
          <div className="max-w-7xl mx-auto px-6">
            <h2
              className="text-3xl md:text-4xl font-bold text-center mb-12"
              data-aos="fade-up"
            >
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1: Create Groups */}
              <div
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-2 transition-all"
                data-aos="fade-up"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 bg-blue-100 rounded-full">
                    <svg
                      className="w-12 h-12 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM8 10a2 2 0 114 0 2 2 0 01-4 0zm8 0a2 2 0 114 0 2 2 0 01-4 0zm-4 4a4 4 0 00-4 4v2h8v-2a4 4 0 00-4-4z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  Create Groups
                </h3>
                <p className="text-center text-gray-600">
                  Easily create private or public groups to chat with your
                  friends.
                </p>
              </div>

              {/* Feature 2: Share Messages */}
              <div
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-2 transition-all"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 bg-green-100 rounded-full">
                    <svg
                      className="w-12 h-12 text-green-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M2 2v20l4-4h16V2H2zm18 12H6.83L4 16.83V4h16v10z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  Share Messages
                </h3>
                <p className="text-center text-gray-600">
                  Instantly share messages, emojis, and GIFs in real-time.
                </p>
              </div>

              {/* Feature 3: Connect with Friends */}
              <div
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-2 transition-all"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 bg-red-100 rounded-full">
                    <svg
                      className="w-12 h-12 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.7 0 4.8-2.2 4.8-4.8S14.7 2.4 12 2.4 7.2 4.6 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2V19.2c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  Connect with Friends
                </h3>
                <p className="text-center text-gray-600">
                  Stay connected with real-time chats and updates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-gray-100 text-gray-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2" data-aos="fade-right">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  About ChattyNetwork
                </h2>
                <p className="mb-4">
                  ChattyNetwork is a modern platform that brings people
                  together. Our mission is to provide seamless communication and
                  foster community connections.
                </p>
                <p>
                  Join us and experience a new way to connect with friends and
                  communities. Stay updated, share your moments, and be part of
                  a thriving network.
                </p>
              </div>
              <div className="md:w-1/2 mt-8 md:mt-0" data-aos="fade-left">
                <Image
                  src="/devIl.svg"
                  alt="About ChattyNetwork"
                  width={500}
                  height={300}
                  unoptimized
                  className="rounded-lg pl-5"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section id="cta" className="py-20 bg-blue-600 text-white text-center">
          <div className="max-w-7xl mx-auto px-6">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              data-aos="fade-up"
            >
              Ready to Join?
            </h2>
            <p className="mb-8" data-aos="fade-up" data-aos-delay="100">
              Start connecting, creating groups, and sharing moments today.
            </p>
            <Link href="/register">
              <button
                className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-800 hover:text-white hover:shadow-2xl transition-all"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                Register Now!
              </button>
            </Link>
          </div>
        </section>
      </main>
      <footer className="w-full text-gray-300 text-center py-3 mt-auto">
        <p>Chatty Network &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
