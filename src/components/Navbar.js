"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };


  return (
    <nav className="bg-saylani-blue text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Branding */}
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold flex items-center gap-2">
              <span className="text-saylani-green">Saylani</span> Mass IT Hub
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/dashboard" className="hover:bg-saylani-darkBlue px-3 py-2 rounded-md text-sm font-medium transition">
              Dashboard
            </Link>
            <Link href="/lost-found" className="hover:bg-saylani-darkBlue px-3 py-2 rounded-md text-sm font-medium transition">
              Lost & Found
            </Link>
            <Link href="/complaints" className="hover:bg-saylani-darkBlue px-3 py-2 rounded-md text-sm font-medium transition">
              Complaints
            </Link>
            <Link href="/volunteer" className="hover:bg-saylani-darkBlue px-3 py-2 rounded-md text-sm font-medium transition">
              Volunteer
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin" className="bg-saylani-green text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 transition">
                Admin Panel
              </Link>
            )}
          </div>

          {/* User Profile / Logout */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-200 hidden sm:inline">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm font-medium transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/" className="bg-saylani-green text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-opacity-90 transition">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
