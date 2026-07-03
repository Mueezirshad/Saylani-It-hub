"use client";
import { useState, useEffect } from "react";
import StatusBadge from "@/components/StatusBadge";

export default function ComplaintsPage() {
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [category, setCategory] = useState("Internet");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState({ text: "", isError: false });

  // Categories Array
  const categories = ["Internet", "Electricity / AC", "Water Supply", "Maintenance", "Cleanliness"];

useEffect(() => {
  // 1. Ek self-contained async function banaya
  const initDashboard = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        window.location.href = "/";
        return;
      }

      setUser(JSON.parse(storedUser));

      // 2. Direct API call isi ke andar bina kisi external function par depend kiye
      const res = await fetch("/api/complaints");
      const json = await res.json();
      
      if (json.success) {
        setComplaints(json.data);
      }
    } catch (err) {
      console.error("Dashboard init error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Function ko execute kiya
  initDashboard();
}, []);


// Polling for Real-Time Status Tracking (Har 5 seconds mein fetch)
useEffect(() => {
  const pollData = async () => {
    try {
      const res = await fetch("/api/complaints");
      const json = await res.json();
      if (json.success) {
        setComplaints(json.data);
      }
    } catch (err) {
      console.error("Polling error:", err);
    }
  };

  const interval = setInterval(() => {
    pollData();
  }, 5000);

  return () => clearInterval(interval);
}, []);

  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/complaints");
      const json = await res.json();
      if (json.success) setComplaints(json.data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", isError: false });

    if (!description) {
      setMessage({ text: "Please enter your complaint description.", isError: true });
      return;
    }

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          description,
          createdBy: user.email,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setMessage({ text: "Complaint submitted successfully!", isError: false });
        setDescription("");
        fetchComplaints(); // Refresh table data
      } else {
        setMessage({ text: json.error || "Submission failed", isError: true });
      }
    } catch (err) {
      setMessage({ text: "Server error, please try again.", isError: true });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-saylani-blue">Campus Complaints Desk</h1>
        <p className="text-gray-500 text-sm">Lodge complaints regarding infrastructure or facilities for quick resolution.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Box */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-4">File a Complaint</h2>

          {message.text && (
            <div className={`p-3 rounded mb-4 text-sm font-medium ${message.isError ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-600 border border-green-200"}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Issue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:border-saylani-blue text-gray-800"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Detailed Description</label>
              <textarea
                rows="4"
                placeholder="Mention the classroom/lab number and describe the problem in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-saylani-blue text-gray-800"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-saylani-blue hover:bg-saylani-darkBlue text-white font-semibold py-2 rounded transition shadow-sm"
            >
              Submit Complaint
            </button>
          </form>
        </div>

        {/* Status Tracker Table */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Complaint Log & Real-Time Tracking</h2>

          {loading ? (
            <div className="text-gray-500 text-sm">Loading data...</div>
          ) : complaints.length === 0 ? (
            <div className="bg-gray-50 text-center p-8 rounded border border-gray-200 text-gray-500 text-sm">
              No complaints filed yet. Everything looks perfect!
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left">
                  <thead className="bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3">Description</th>
                      <th className="px-6 py-3">Filed By</th>
                      <th className="px-6 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                    {complaints.map((comp) => (
                      <tr key={comp._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-semibold text-saylani-blue whitespace-nowrap">{comp.category}</td>
                        <td className="px-6 py-4 max-w-xs truncate">{comp.description}</td>
                        <td className="px-6 py-4 text-xs text-gray-400 whitespace-nowrap">{comp.createdBy.split("@")[0]}</td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <StatusBadge status={comp.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}