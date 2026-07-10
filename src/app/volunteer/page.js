"use client";
import { useState, useEffect } from "react";

export default function VolunteerPage() {
  const [user, setUser] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [name, setName] = useState("");
  const [event, setEvent] = useState("Saylani IT Convocation 2026");
  const [availability, setAvailability] = useState("");
  const [message, setMessage] = useState({ text: "", isError: false });

  // Upcoming Events Array for Dropdown
  const events = [
    "Saylani IT Convocation 2026",
    "Mass IT Entrance Test Duty",
    "Web3 & AI Seminar Coordination",
    "Campus Cleanliness Drive",
    "Ramzan Rashan Drive Management"
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      window.location.href = "/";
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    
    // Form mein default name user ka email prefix set kardete hain convenience k liye
    setName(parsedUser.name || "");
    
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const res = await fetch("/api/volunteer");
      const json = await res.json();
      if (json.success) setVolunteers(json.data);
    } catch (err) {
      console.error("Error fetching volunteer:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", isError: false });

    if (!name || !availability) {
      setMessage({ text: "Please fill in all required fields.", isError: true });
      return;
    }

    try {
      const res = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          event,
          availability,
          createdBy: user.email,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setMessage({ text: "Successfully registered as a volunteer! Thank you.", isError: false });
        setAvailability("");
        fetchVolunteers(); // Refresh list view
      } else {
        setMessage({ text: json.error || "Registration failed", isError: true });
      }
    } catch (err) {
      setMessage({ text: "Server error, please try again.", isError: true });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-saylani-blue">Volunteer Registration</h1>
        <p className="text-gray-500 text-sm">Join the Saylani force. Register yourself to manage and coordinate campus mega-events.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Registration Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Sign Up for an Event</h2>

          {message.text && (
            <div className={`p-3 rounded mb-4 text-sm font-medium ${message.isError ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-600 border border-green-200"}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-saylani-blue text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Select Target Event</label>
              <select
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:border-saylani-blue text-gray-800"
              >
                {events.map((ev) => (
                  <option key={ev} value={ev}>{ev}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Your Availability Details</label>
              <input
                type="text"
                placeholder="e.g., Saturday (2 PM - 6 PM) or Full Day"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-saylani-blue text-gray-800"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-saylani-green hover:bg-opacity-90 text-white font-semibold py-2 rounded transition shadow-sm"
            >
              Register as Volunteer
            </button>
          </form>
        </div>

        {/* Volunteer List Panel */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Current Volunteers Roster</h2>

          {loading ? (
            <div className="text-gray-500 text-sm">Loading Squad Roster...</div>
          ) : volunteers.length === 0 ? (
            <div className="bg-gray-50 text-center p-8 rounded border border-gray-200 text-gray-500 text-sm">
              No volunteers registered yet. Be the first hero!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {volunteers.map((vol) => (
                <div key={vol._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm relative overflow-hidden">
                  {/* Decorative corner tag for theme */}
                  <div className="absolute top-0 right-0 w-3 h-full bg-saylani-green"></div>
                  
                  <h3 className="font-bold text-gray-800 text-base">{vol.name}</h3>
                  <p className="text-xs text-saylani-blue font-semibold mt-1">{vol.event}</p>
                  
                  <div className="mt-3 pt-2 border-t border-gray-100 flex flex-col gap-1 text-xs text-gray-500">
                    <p><strong>Availability:</strong> {vol.availability}</p>
                    <p className="text-gray-400">Contact: {vol.createdBy}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}