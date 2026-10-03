import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobDetail } from "../api/jobs";
import { toggleSaveJob, markApplied } from "../api/applications";
import { useAuth } from "../context/AuthContext";

function matchStyle(tag) {
  if (tag === "High match") return { badge: "bg-emerald-100 text-emerald-700", bar: "bg-emerald-500" };
  if (tag === "Medium match") return { badge: "bg-amber-100 text-amber-700", bar: "bg-amber-500" };
  return { badge: "bg-slate-100 text-slate-600", bar: "bg-slate-400" };
}

function useTranslatedDescription(job) {
  const [translated, setTranslated] = useState(null);
  const [translating, setTranslating] = useState(false);

  const translate = async () => {
    if (!job?.description) return;
    setTranslating(true);
    try {
      const plainText = job.description.replace(/<[^>]+>/g, " ").slice(0, 490);
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(plainText)}&langpair=${job.language}|en`
      );
      const data = await res.json();
      setTranslated(data.responseData?.translatedText || "Translation unavailable.");
    } catch {
      setTranslated("Translation failed. Try again.");
    } finally {
      setTranslating(false);
    }
  };

  return { translated, translating, translate };
}

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getJobDetail(id)
      .then((res) => setJob(res.data))
      .catch(() => setError("Couldn't load this job."))
      .finally(() => setLoading(false));
  }, [id]);

  const { translated, translating, translate } = useTranslatedDescription(job);

  const handleToggleSave = async () => {
    const res = await toggleSaveJob(job.id);
    setJob((prev) => ({ ...prev, is_saved: res.data.saved }));
  };

  const handleApply = async () => {
    window.open(job.redirect_url, "_blank", "noopener,noreferrer");
    await markApplied(job.id);
    setJob((prev) => ({ ...prev, is_applied: true }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Loading job...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-red-600">{error || "Job not found."}</p>
      </div>
    );
  }

  const style = matchStyle(job.match_tag);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white/80 backdrop-blur border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Back
          </button>
          <div className="flex gap-5 items-center">
            <a href="/feed" className="text-sm font-medium text-slate-600 hover:text-slate-900">Feed</a>
            <a href="/saved" className="text-sm font-medium text-slate-600 hover:text-slate-900">Saved</a>
            <a href="/profile" className="text-sm font-medium text-slate-600 hover:text-slate-900">Profile</a>
            <button onClick={logout} className="text-sm font-medium text-slate-600 hover:text-slate-900">Log out</button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
              <p className="text-slate-500 mt-1">
                {job.company} {job.location && `· ${job.location}`}
              </p>
              <div className="flex gap-2 mt-3">
                <span className="text-xs bg-slate-100 text-slate-600 rounded-full px-2.5 py-1 capitalize">
                  {job.work_mode}
                </span>
                {job.is_expired && (
                  <span className="text-xs bg-red-100 text-red-700 rounded-full px-2.5 py-1">Expired</span>
                )}
              </div>
            </div>
            <button
              onClick={handleToggleSave}
              className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 transition text-xl"
              title={job.is_saved ? "Unsave" : "Save"}
            >
              <span className={job.is_saved ? "text-indigo-600" : "text-slate-300"}>
                {job.is_saved ? "★" : "☆"}
              </span>
            </button>
          </div>

          <button
            onClick={handleApply}
            disabled={job.is_expired}
            className={
              "w-full mt-5 text-sm font-medium rounded-lg py-3 transition " +
              (job.is_applied
                ? "bg-emerald-50 text-emerald-700"
                : "bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40")
            }
          >
            {job.is_applied ? "✓ Applied — view status in Applications" : "Apply on company site →"}
          </button>
        </div>

        {/* Why this match */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-slate-900 mb-4">Why this match</h2>

          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className={"text-xs font-semibold px-2.5 py-1 rounded-full " + style.badge}>
                  {job.match_tag}
                </span>
                <span className="text-sm font-semibold text-slate-700">{job.final_score}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className={"h-2 rounded-full " + style.bar} style={{ width: Math.min(100, job.final_score) + "%" }} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-slate-500 text-xs mb-1">Skill match</p>
              <p className="font-semibold text-slate-900">{job.skill_score}%</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-slate-500 text-xs mb-1">Resume similarity</p>
              <p className="font-semibold text-slate-900">{job.description_score}%</p>
            </div>
          </div>

          {job.matched_skills?.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-slate-500 mb-2">Skills you have</p>
              <div className="flex flex-wrap gap-1.5">
                {job.matched_skills.map((s) => (
                  <span key={s} className="text-xs bg-emerald-50 text-emerald-700 rounded-full px-2.5 py-1">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.missing_skills?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">Skills you're missing</p>
              <div className="flex flex-wrap gap-1.5">
                {job.missing_skills.map((s) => (
                  <span key={s} className="text-xs bg-slate-100 text-slate-500 rounded-full px-2.5 py-1">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.matched_skills?.length === 0 && job.missing_skills?.length === 0 && (
            <p className="text-sm text-slate-400">No specific skills listed for this job.</p>
          )}
        </div>

        {/* Language / translate banner */}
        {job.language && job.language !== "en" && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 flex justify-between items-center flex-wrap gap-3">
            <p className="text-sm text-amber-800">
              This listing appears to be in <span className="font-medium uppercase">{job.language}</span>.
            </p>
            <button
              onClick={translate}
              disabled={translating}
              className="text-sm font-medium bg-white border border-amber-200 rounded-lg px-3 py-1.5 text-amber-800 hover:bg-amber-100 transition disabled:opacity-50"
            >
              {translating ? "Translating..." : "Translate to English"}
            </button>
          </div>
        )}

        {translated && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-slate-900 mb-3">Translation (auto-generated)</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{translated}</p>
          </div>
        )}

        {/* Description */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-3">Job description</h2>
          <div
            className="text-sm text-slate-600 leading-relaxed prose-sm max-w-none [&_a]:text-indigo-600 [&_p]:mb-3"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        </div>
      </div>
    </div>
  );
}

export default JobDetail;