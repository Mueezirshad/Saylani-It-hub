"use client";
import { useState, useEffect } from "react";
import StatusBadge from "@/components/StatusBadge";


export default function LostFoundPage() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("lost");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState({ text: "", isError: false });

  // Load User and Items
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      window.location.href = "/";
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchItems();
  }, []);

  // Polling Mechanism (Real-Time update simulation for hackathon)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchItems();
    }, 5000); // Har 5 seconds baad automatic fresh data fetch hoga
    return () => clearInterval(interval);
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/lost-found");
      const json = await res.json();
      if (json.success) setItems(json.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", isError: false });

    if (!title || !description) {
      setMessage({ text: "Please fill in all fields.", isError: true });
      return;
    }

    try {
      const res = await fetch("/api/lost-found", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          type,
          imageUrl: imageUrl || "https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=500", 
          createdBy: user.email,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setMessage({ text: "Item posted successfully!", isError: false });
        setTitle("");
        setDescription("");
        setImageUrl("");
        fetchItems(); // Refresh List
      } else {
        setMessage({ text: json.error || "Something went wrong", isError: true });
      }
    } catch (err) {
      setMessage({ text: "Server error, try again.", isError: true });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-saylani-blue">Lost & Found Hub</h1>
        <p className="text-gray-500 text-sm">Report lost belonging items or post items found on campus.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Report an Item</h2>
          
          {message.text && (
            <div className={`p-3 rounded mb-4 text-sm font-medium ${message.isError ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-600 border border-green-200"}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">I want to report a...</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType("lost")}
                  className={`py-2 rounded font-medium text-sm transition border ${type === "lost" ? "bg-orange-500 text-white border-orange-600" : "bg-gray-50 text-gray-700 border-gray-200"}`}
                >
                  Lost Item
                </button>
                <button
                  type="button"
                  onClick={() => setType("found")}
                  className={`py-2 rounded font-medium text-sm transition border ${type === "found" ? "bg-emerald-600 text-white border-emerald-700" : "bg-gray-50 text-gray-700 border-gray-200"}`}
                >
                  Found Item
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Item Title</label>
              <input
                type="text"
                placeholder="e.g., Black Wallet, Casio Watch"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-saylani-blue text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description & Location</label>
              <textarea
                rows="3"
                placeholder="Describe the item and where it was lost/found..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-saylani-blue text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL (Optional)</label>
              <input
                type="text"
                placeholder="Paste an image link for reference"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-saylani-blue text-gray-800"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-saylani-green hover:bg-opacity-90 text-white font-semibold py-2 rounded transition shadow-sm"
            >
              Submit Report
            </button>
          </form>
        </div>

        {/* Listings Column */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Campus Reports</h2>
          
          {loading ? (
            <div className="text-gray-500 text-sm">Loading feed data...</div>
          ) : items.length === 0 ? (
            <div className="bg-gray-50 text-center p-8 rounded border border-gray-200 text-gray-500 text-sm">
              No logs posted yet. Be the first to report!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item) => (
                <div key={item._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
                  {/* Image Block */}
                  <img 
                    src={item.imageUrl || "https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=500"} 
                    alt={item.title} 
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-gray-800 text-lg truncate">{item.title}</h3>
                        <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded ${item.type === "lost" ? "bg-orange-100 text-orange-700" : "bg-emerald-100 text-emerald-700"}`}>
                          {item.type}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-400">
                      <span>By: {item.createdBy.split("@")[0]}</span>
                      <StatusBadge status={item.status === "Pending" ? (item.type === "found" ? "Found" : "Pending") : "Resolved"} />
                    </div>
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