import { useState, useEffect } from "react";
import { getJobs } from "../api/jobs";
import { useAuth } from "../context/AuthContext";

function Feed() {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getJobs()
      .then((res) => setJobs(res.data))
      .catch(() => setError("Couldn't load jobs. Try refreshing."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Job Feed</h1>
          <p className="text-sm text-gray-500">Welcome, {user?.username}</p>
        </div>
        <div className="flex gap-4">
          <a href="/profile" className="text-blue-600 text-sm">Edit Profile</a>
          <button onClick={logout} className="text-blue-600 text-sm">Log out</button>
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading jobs...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="flex flex-col gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="border rounded-lg p-4 hover:shadow-sm transition">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-medium text-lg">{job.title}</h2>
                <p className="text-sm text-gray-600">
                  {job.company} {job.location && `· ${job.location}`}
                </p>
              </div>
              {job.is_expired && (
                <span className="text-xs bg-red-100 text-red-700 rounded-full px-2 py-1">
                  Expired
                </span>
              )}
            </div>

            {job.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {job.skills.map((skill) => (
                  <span key={skill} className="text-xs bg-gray-100 rounded-full px-2 py-1">
                    {skill}
                  </span>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-gray-400 uppercase">{job.source}</span>
              <a href={job.redirect_url} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white text-sm rounded px-4 py-1.5">
                {job.is_expired ? "View (Expired)" : "Apply"}
              </a>
            </div>
          </div>
        ))}
      </div>

      {!loading && jobs.length === 0 && !error && (
        <p className="text-gray-500">No jobs found yet.</p>
      )}
    </div>
  );
}

export default Feed;