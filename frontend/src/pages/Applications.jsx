import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { getApplications } from "../api/applications";
import { useAuth } from "../context/AuthContext";

const STATUS_OPTIONS = ["applied", "interviewing", "rejected", "offer"];

const STATUS_STYLE = {
  applied: "bg-slate-100 text-slate-600",
  interviewing: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
  offer: "bg-emerald-100 text-emerald-700",
};

function Applications() {
  const { logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApplications()
      .then((res) => setApplications(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    const res = await axiosClient.patch(`/applications/${appId}/status/`, { status: newStatus });
    setApplications((prev) => prev.map((a) => (a.id === appId ? res.data : a)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-slate-50 to-slate-50">
      <header className="bg-white/80 backdrop-blur border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/feed" className="text-lg font-bold text-slate-900">Jobnest</a>
          <div className="flex gap-5 items-center">
            <a href="/feed" className="text-sm font-medium text-slate-600 hover:text-slate-900">Feed</a>
            <a href="/saved" className="text-sm font-medium text-slate-600 hover:text-slate-900">Saved</a>
            <a href="/profile" className="text-sm font-medium text-slate-600 hover:text-slate-900">Profile</a>
            <button onClick={logout} className="text-sm font-medium text-slate-600 hover:text-slate-900">Log out</button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Your applications</h1>
        <p className="text-sm text-slate-500 mb-8">{applications.length} application{applications.length !== 1 ? "s" : ""} tracked</p>

        {loading && <p className="text-slate-500">Loading...</p>}

        <div className="flex flex-col gap-3">
          {applications.map((app) => (
            <div key={app.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-slate-900">{app.job_title}</p>
                <p className="text-sm text-slate-500">{app.job_company}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Applied {new Date(app.applied_at).toLocaleDateString()}
                </p>
              </div>
              <select
                value={app.status}
                onChange={(e) => handleStatusChange(app.id, e.target.value)}
                className={"text-xs font-semibold rounded-full px-3 py-1.5 border-0 cursor-pointer " + STATUS_STYLE[app.status]}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {!loading && applications.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500">No applications tracked yet.</p>
            <a href="/feed" className="text-indigo-600 text-sm font-medium mt-2 inline-block">Browse the feed →</a>
          </div>
        )}
      </div>
    </div>
  );
}

export default Applications;