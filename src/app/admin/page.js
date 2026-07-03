"use client";
import { useState, useEffect } from "react";
import StatusBadge from "@/components/StatusBadge";

export default function AdminPage() {
  const [complaints, setComplaints] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || JSON.parse(storedUser).role !== "admin") {
      // Security Check: Guard against non-admins
      window.location.href = "/dashboard";
      return;
    }
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [compRes, volRes] = await Promise.all([
        fetch("/api/complaints"),
        fetch("/api/volunteers"),
      ]);
      const compJson = await compRes.json();
      const volJson = await volRes.json();

      if (compJson.success) setComplaints(compJson.data);
      if (volJson.success) setVolunteers(volJson.data);
    } catch (err) {
      console.error("Admin load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/complaints/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        // Local list updates instantly
        setComplaints(prev => prev.map(c => c._id === id ? { ...c, status: newStatus } : c));
      }
    } catch (err) {
      console.error("Status update execution error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="text-gray-500 text-sm p-8">Loading Admin Authority Center...</div>;

  return (
    <div className="space-y-10">
      {/* Admin Title */}
      <div className="border-b border-gray-200 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-saylani-blue">Admin Command Desk</h1>
          <p className="text-gray-500 text-sm">Manage ticket updates for campus infrastructure complaints and view active duty squads.</p>
        </div>
        <span className="bg-red-100 text-red-800 text-xs font-bold uppercase border border-red-200 px-3 py-1 rounded-md">
          Authorized Admin Access
        </span>
      </div>

      {/* Management Sections Split */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">🛠️ Infrastructure Tickets Management</h2>
        
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3">User Email</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Current Badge</th>
                  <th className="px-6 py-3 text-center">Modify Operations Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {complaints.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-xs text-gray-500 whitespace-nowrap">{c.createdBy}</td>
                    <td className="px-6 py-4 font-bold text-saylani-blue whitespace-nowrap">{c.category}</td>
                    <td className="px-6 py-4 max-w-sm truncate">{c.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={c.status} /></td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <select
                        disabled={updatingId === c._id}
                        value={c.status}
                        onChange={(e) => handleStatusChange(c._id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded bg-white text-xs font-medium focus:outline-none focus:border-saylani-blue disabled:opacity-50 text-gray-800"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {complaints.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-400 text-xs">No filed complaints records available inside the system.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Volunteer Duty Matrix Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">🙌 Registered Volunteers Contacts Sheet</h2>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3">Volunteer Full Name</th>
                  <th className="px-6 py-3">Assigned Campaign / Event</th>
                  <th className="px-6 py-3">Declared Slot Availability</th>
                  <th className="px-6 py-3">Official Communication Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {volunteers.map((v) => (
                  <tr key={v._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-bold text-gray-800 whitespace-nowrap">{v.name}</td>
                    <td className="px-6 py-4 font-semibold text-saylani-green whitespace-nowrap">{v.event}</td>
                    <td className="px-6 py-4 text-xs whitespace-nowrap font-medium text-orange-700">{v.availability}</td>
                    <td className="px-6 py-4 text-xs text-gray-400 whitespace-nowrap">{v.createdBy}</td>
                  </tr>
                ))}
                {volunteers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-400 text-xs">No students registered as event volunteer staff yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}