"use client";
import { useState, useEffect } from "react";
import { auth } from "../../../../lib/firebase";
import { api } from "../../../../lib/api";
import { UserPlus, Mail, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminInvitationsPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkRole = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const res = await api.getMe(token);
      const data = res.data || res;
      setUserRole(data.role);
    };
    checkRole();
  }, []);

  const handleSendInvitation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();

      // Use your existing api helper which correctly routes to your Express backend
      const response = await api.inviteAdmin({ email }, token); // Or use api.post(...) depending on your api.js setup

      setMessage(`Invitation successfully sent to ${email}!`);
      setEmail("");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to send invitation.");
    } finally {
      setLoading(false);
    }
  };

  if (userRole && userRole !== 'SUPER_ADMIN') {
    return (
      <div className="p-8 flex items-center gap-3 text-red-600">
        <AlertCircle />
        <h1 className="font-bold text-lg">Access Denied: Requires Super Admin privileges.</h1>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="w-8 h-8 text-[#1ABC9C]" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "serif" }}>Admin Invitation Portal</h1>
          <p className="text-sm text-gray-500">Securely invite new administrators to help manage the exhibition.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <form onSubmit={handleSendInvitation} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">New Administrator Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                required
                placeholder="colleague@university.ac.lk" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full bg-[#114A3F] text-white py-2.5 rounded-xl font-semibold hover:bg-[#134E4A] transition-all disabled:opacity-50 cursor-pointer"
          >
            <UserPlus size={18} />
            {loading ? "Sending Invitation..." : "Send Secure Invitation"}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}