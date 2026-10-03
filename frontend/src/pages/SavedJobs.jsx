import { useState, useEffect } from "react";
import { getSavedJobs, toggleSaveJob } from "../api/applications";
import { useAuth } from "../context/AuthContext";

function SavedJobs() {
  const { logout } = useAuth();
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSavedJobs()
      .then((res) => setSaved(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleUnsave = async (jobId, savedId) => {
    await toggleSaveJob(jobId);
    setSaved((prev) => prev.filter((s) => s.id !== savedId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-slate-50 to-slate-50">
      <header className="bg-white/80 backdrop-blur border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/feed" className="text-lg font-bold text-slate-900">Jobnest</a>
          <div className="flex gap-5 items-center">
            <a href="/feed" className="text-sm font-medium text-slate-600 hover:text-slate-900">Feed</a>
            <a href="/applications" className="text-sm font-medium text-slate-600 hover:text-slate-900">Applications</a>
            <a href="/profile" className="text-sm font-medium text-slate-600 hover:text-slate-900">Profile</a>
            <button onClick={logout} className="text-sm font-medium text-slate-600 hover:text-slate-900">Log out</button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Saved jobs</h1>
        <p className="text-sm text-slate-500 mb-8">{saved.length} job{saved.length !== 1 ? "s" : ""} saved for later</p>

        {loading && <p className="text-slate-500">Loading...</p>}

        <div className="flex flex-col gap-3">
          {saved.map((s) => (
            <div key={s.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-slate-900">{s.job_title}</p>
                <p className="text-sm text-slate-500">{s.job_company}</p>
              </div>
              <button
                onClick={() => handleUnsave(s.job, s.id)}
                className="text-sm text-slate-400 hover:text-red-600 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {!loading && saved.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500">You haven't saved any jobs yet.</p>
            <a href="/feed" className="text-indigo-600 text-sm font-medium mt-2 inline-block">Browse the feed →</a>
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedJobs;