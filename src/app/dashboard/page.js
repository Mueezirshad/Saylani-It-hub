"use client";
import { useState, useEffect } from "react";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      const [itemsRes, complaintsRes, volunteersRes] = await Promise.all([
        fetch("/api/lost-found"),
        fetch("/api/complaints"),
        fetch("/api/volunteer"),
      ]);

      const [itemsJson, complaintsJson, volunteersJson] = await Promise.all([
        itemsRes.json(),
        complaintsRes.json(),
        volunteersRes.json(),
      ]);

      if (itemsJson.success) setItems(itemsJson.data);
      if (complaintsJson.success) setComplaints(complaintsJson.data);
      if (volunteersJson.success) setVolunteers(volunteersJson.data);
    } catch (err) {
      console.error("Dashboard multi-fetch error:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      window.location.href = "/";
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchAllData();
  }, []); 

  // Polling for real-time dashboard updates (Every 6 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllData();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  

  // Stats computation
  const pendingItemsCount = items.filter(i => i.status === "Pending").length;
  const openComplaintsCount = complaints.filter(c => c.status !== "Resolved").length;
  const totalVolunteersCount = volunteers.length;

  if (loading) return <div className="text-gray-500 text-sm p-8">Loading Campus Dashboard...</div>;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-saylani-blue text-white rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-gray-200 text-sm mt-1">Here is the real-time status overview for Saylani Mass IT Hub campus.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/complaints" className="bg-saylani-green hover:bg-opacity-90 px-4 py-2 rounded text-sm font-semibold transition">
            File Complaint
          </Link>
          <Link href="/lost-found" className="bg-white text-saylani-blue hover:bg-gray-100 px-4 py-2 rounded text-sm font-semibold transition">
            Report Lost Item
          </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Unresolved Lost/Found</p>
            <h3 className="text-3xl font-extrabold text-gray-800 mt-1">{pendingItemsCount}</h3>
          </div>
          <div className="bg-orange-100 text-orange-600 p-3 rounded-full text-xl font-bold">🔍</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Active Complaints</p>
            <h3 className="text-3xl font-extrabold text-gray-800 mt-1">{openComplaintsCount}</h3>
          </div>
          <div className="bg-blue-100 text-saylani-blue p-3 rounded-full text-xl font-bold">🛠️</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Registered Volunteers</p>
            <h3 className="text-3xl font-extrabold text-gray-800 mt-1">{totalVolunteersCount}</h3>
          </div>
          <div className="bg-green-100 text-saylani-green p-3 rounded-full text-xl font-bold">🙌</div>
        </div>
      </div>

      {/* Grid Layout split for Quick Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Complaints Track */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h2 className="font-bold text-gray-800 text-lg">Live Complaints Tracker</h2>
            <Link href="/complaints" className="text-xs text-saylani-blue hover:underline font-semibold">View All</Link>
          </div>
          <div className="divide-y divide-gray-100 max-h-[350px] overflow-y-auto pr-1">
            {complaints.slice(0, 5).map((c) => (
              <div key={c._id} className="py-3 flex justify-between items-center gap-4 hover:bg-gray-50 px-2 rounded transition">
                <div className="truncate">
                  <h4 className="font-bold text-sm text-gray-800">{c.category}</h4>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{c.description}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
            {complaints.length === 0 && <p className="text-gray-400 text-xs text-center py-4">No active system complaints.</p>}
          </div>
        </div>

        {/* Recent Lost & Found Activity */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h2 className="font-bold text-gray-800 text-lg">Recent Lost & Found Posts</h2>
            <Link href="/lost-found" className="text-xs text-saylani-blue hover:underline font-semibold">View All</Link>
          </div>
          <div className="divide-y divide-gray-100 max-h-[350px] overflow-y-auto pr-1">
            {items.slice(0, 5).map((i) => (
              <div key={i._id} className="py-3 flex justify-between items-center gap-4 hover:bg-gray-50 px-2 rounded transition">
                <div className="flex items-center gap-3 truncate">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${i.type === 'lost' ? 'bg-orange-500' : 'bg-emerald-500'}`}></span>
                  <div className="truncate">
                    <h4 className="font-bold text-sm text-gray-800 truncate">{i.title}</h4>
                    <p className="text-xs text-gray-400 truncate">Posted by: {i.createdBy.split("@")[0]}</p>
                  </div>
                </div>
                <StatusBadge status={i.status === "Pending" ? (i.type === "found" ? "Found" : "Pending") : "Resolved"} />
              </div>
            ))}
            {items.length === 0 && <p className="text-gray-400 text-xs text-center py-4">No lost/found reports log.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}