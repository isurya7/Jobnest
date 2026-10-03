import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getJobs } from "../api/jobs";
import { toggleSaveJob, markApplied } from "../api/applications";
import { useAuth } from "../context/AuthContext";

const PAGE_SIZE = 8;

function Feed() {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [country, setCountry] = useState("");
  const [skill, setSkill] = useState("");
  const [page, setPage] = useState(1);

  const fetchJobs = () => {
    setLoading(true);
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (workMode) params.work_mode = workMode;
    if (country.trim()) params.country = country.trim();
    if (skill.trim()) params.skill = skill.trim();

    getJobs(params)
      .then((res) => setJobs(res.data))
      .catch(() => setError("Couldn't load jobs. Try refreshing."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const totalPages = Math.max(1, Math.ceil(jobs.length / PAGE_SIZE));
  const pageJobs = jobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const highCount = jobs.filter((j) => j.match_tag === "High match").length;

  const handleToggleSave = async (jobId) => {
    const res = await toggleSaveJob(jobId);
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, is_saved: res.data.saved } : j)));
  };

  const handleApply = async (job) => {
    window.open(job.redirect_url, "_blank", "noopener,noreferrer");
    await markApplied(job.id);
    setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, is_applied: true } : j)));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white/80 backdrop-blur border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-lg font-bold text-slate-900">Jobnest</span>
          <div className="flex gap-5 items-center">
            <a href="/applications" className="text-sm font-medium text-slate-600 hover:text-slate-900">Applications</a>
            <a href="/saved" className="text-sm font-medium text-slate-600 hover:text-slate-900">Saved</a>
            <a href="/profile" className="text-sm font-medium text-slate-600 hover:text-slate-900">Profile</a>
            <button onClick={logout} className="text-sm font-medium text-slate-600 hover:text-slate-900">Log out</button>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-14 relative">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Welcome back, {user?.username}</h1>
          <p className="text-indigo-100 text-sm mb-6">{jobs.length} jobs found · {highCount} strong matches</p>

          <form onSubmit={handleSearchSubmit} className="bg-white rounded-2xl shadow-xl p-2 flex flex-wrap gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, company, or location..."
              className="flex-1 min-w-[180px] px-4 py-2.5 text-sm rounded-xl focus:outline-none"
            />
            <select value={workMode} onChange={(e) => setWorkMode(e.target.value)} className="px-3 py-2.5 text-sm rounded-xl bg-slate-50 text-slate-700 focus:outline-none">
              <option value="">Any work mode</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
              className="w-28 px-3 py-2.5 text-sm rounded-xl bg-slate-50 focus:outline-none"
            />
            <input
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="Skill"
              className="w-28 px-3 py-2.5 text-sm rounded-xl bg-slate-50 focus:outline-none"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-6 pb-20">
        <div className="bg-slate-50 rounded-t-2xl pt-6">
          <p className="text-sm text-slate-500 mb-4">{jobs.length} job{jobs.length !== 1 ? "s" : ""} found</p>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 h-40 animate-pulse" />
              ))}
            </div>
          )}
          {error && <p className="text-red-600">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pageJobs.map((job) => (
              <JobCard key={job.id} job={job} onToggleSave={handleToggleSave} onApply={handleApply} />
            ))}
          </div>

          {!loading && jobs.length === 0 && !error && (
            <div className="text-center py-20">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-slate-500 font-medium">No jobs match your search</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 disabled:opacity-30 hover:border-indigo-300 hover:text-indigo-600 transition">‹</button>
              {buildPageList(totalPages, page).map((item, idx) =>
                item === "..." ? (
                  <span key={"dots" + idx} className="w-9 text-center text-slate-300">···</span>
                ) : (
                  <button key={item} onClick={() => setPage(item)} className={"w-9 h-9 text-sm font-medium rounded-full transition " + (item === page ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600")}>{item}</button>
                )
              )}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 disabled:opacity-30 hover:border-indigo-300 hover:text-indigo-600 transition">›</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function buildPageList(totalPages, current) {
  const delta = 1;
  const range = [];
  for (let i = Math.max(2, current - delta); i <= Math.min(totalPages - 1, current + delta); i++) range.push(i);
  if (current - delta > 2) range.unshift("...");
  if (current + delta < totalPages - 1) range.push("...");
  range.unshift(1);
  if (totalPages > 1) range.push(totalPages);
  return range;
}

function matchStyle(tag) {
  if (tag === "High match") return { ring: "ring-emerald-100", badge: "bg-emerald-100 text-emerald-700", bar: "bg-emerald-500" };
  if (tag === "Medium match") return { ring: "ring-amber-100", badge: "bg-amber-100 text-amber-700", bar: "bg-amber-500" };
  return { ring: "ring-slate-100", badge: "bg-slate-100 text-slate-600", bar: "bg-slate-400" };
}

function JobCard({ job, onToggleSave, onApply }) {
  const style = matchStyle(job.match_tag);

  return (
    <div className={"bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition p-5 ring-1 " + style.ring}>
      <div className="flex justify-between items-start gap-3">
        <Link to={`/jobs/${job.id}`} className="min-w-0 flex-1">
          <h2 className="font-semibold text-slate-900 truncate hover:text-indigo-600">{job.title}</h2>
          <p className="text-sm text-slate-500 mt-0.5 truncate">{job.company} {job.location ? "· " + job.location : ""}</p>
        </Link>
        <button onClick={() => onToggleSave(job.id)} className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-50 transition text-lg" title={job.is_saved ? "Unsave" : "Save"}>
          <span className={job.is_saved ? "text-indigo-600" : "text-slate-300"}>{job.is_saved ? "★" : "☆"}</span>
        </button>
      </div>

      {job.match_tag && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className={"text-xs font-semibold px-2.5 py-1 rounded-full " + style.badge}>{job.match_tag}</span>
            <span className="text-xs text-slate-400 font-medium">{job.match_score}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div className={"h-1.5 rounded-full transition-all " + style.bar} style={{ width: Math.min(100, job.match_score) + "%" }} />
          </div>
        </div>
      )}

      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {job.skills.slice(0, 4).map((skill) => (
            <span key={skill} className="text-xs bg-indigo-50 text-indigo-700 rounded-full px-2.5 py-1">{skill}</span>
          ))}
          {job.skills.length > 4 && <span className="text-xs text-slate-400 px-1 py-1">+{job.skills.length - 4} more</span>}
        </div>
      )}

      <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-50">
        {job.is_expired ? (
          <span className="text-xs text-red-600 font-medium">Listing expired</span>
        ) : (
          <span className="text-xs text-slate-400 capitalize">{job.work_mode}</span>
        )}
        <button onClick={() => onApply(job)} disabled={job.is_expired} className={"text-sm font-medium rounded-lg px-4 py-2 transition " + (job.is_applied ? "bg-emerald-50 text-emerald-700" : "bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:hover:bg-indigo-600")}>
          {job.is_applied ? "✓ Applied" : "Apply"}
        </button>
      </div>
    </div>
  );
}

export default Feed;