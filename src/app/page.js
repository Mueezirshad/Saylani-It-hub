"use client";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Agar user pehle se logged in hai toh direct dashboard bhej do
    if (localStorage.getItem("user")) {
      window.location.href = "/dashboard";
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Quick Validation
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Hackathon Simulation Logic (Fast Auth without Firebase/NextAuth friction)
    let userSession = null;

    if (email === "admin@saylani.com" && password === "admin123") {
      userSession = { name: "Admin Staff", email, role: "admin" };
    } else if (email.endsWith("@saylani.com") && password.length >= 6) {
      // Koi bhi user name nikalna email se
      const name = email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1);
      userSession = { name, email, role: "student" };
    } else {
      setError("Invalid credentials. Hint: Use admin@saylani.com (pwd: admin123) or any student email with @saylani.com");
      return;
    }

    // Save session locally and redirect
    localStorage.setItem("user", JSON.stringify(userSession));
    window.location.href = "/dashboard";
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 w-full max-w-md">
        
        {/* Branding Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-saylani-blue">
            <span className="text-saylani-green">Saylani</span> Mass IT Hub
          </h1>
          <p className="text-gray-500 text-sm mt-2">Campus Management Portal</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="e.g., student@saylani.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-saylani-blue text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-saylani-blue text-gray-800"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-saylani-blue hover:bg-saylani-darkBlue text-white font-semibold py-2 rounded transition shadow-sm"
          >
            Sign In
          </button>
        </form>

        {/* Demo Guide Box for Judges */}
        <div className="bg-gray-50 border border-gray-200 rounded p-3 mt-6 text-xs text-gray-600">
          <p className="font-bold mb-1 text-saylani-blue">📌 Hackathon Quick Access Info:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li><strong>Admin View:</strong> admin@saylani.com | admin123</li>
            <li><strong>Student View:</strong> user@saylani.com | 123456</li>
          </ul>
        </div>

      </div>
    </div>
  );
}