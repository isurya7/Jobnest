import { useState, useEffect, useRef } from "react";
import { getProfile, updateProfile, addSkill, uploadResume } from "../api/profile";
import { useAuth } from "../context/AuthContext";

function ProfileSetup() {
  const { user, logout } = useAuth();
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);
  const [resumeInfo, setResumeInfo] = useState(null);
  const [newSkill, setNewSkill] = useState("");
  const [newProficiency, setNewProficiency] = useState(3);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    getProfile()
      .then((res) => {
        setBio(res.data.bio || "");
        setSkills(res.data.seeker_skills || []);
        if (res.data.resume_file) setResumeInfo(res.data.resume_file);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveBio = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await updateProfile({ bio });
      setMessage("Bio saved.");
    } catch {
      setMessage("Couldn't save bio.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    try {
      await addSkill({ skill_name: newSkill, proficiency: Number(newProficiency) });
      const res = await getProfile();
      setSkills(res.data.seeker_skills || []);
      setNewSkill("");
      setNewProficiency(3);
    } catch {
      setMessage("Couldn't add skill.");
    }
  };

  const handleFileSelect = async (file) => {
    if (!file) return;
    setUploading(true);
    setUploadResult(null);
    try {
      const res = await uploadResume(file);
      setUploadResult(res.data);
      setResumeInfo(file.name);
      const profileRes = await getProfile();
      setSkills(profileRes.data.seeker_skills || []);
    } catch {
      setUploadResult({ error: true });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const initials = (user?.username || "?").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-slate-50 to-slate-50">
      <header className="bg-white/80 backdrop-blur border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/feed" className="text-lg font-bold text-slate-900">Jobnest</a>
          <div className="flex gap-5 items-center">
            <a href="/feed" className="text-sm font-medium text-slate-600 hover:text-slate-900">Feed</a>
            <a href="/applications" className="text-sm font-medium text-slate-600 hover:text-slate-900">Applications</a>
            <a href="/saved" className="text-sm font-medium text-slate-600 hover:text-slate-900">Saved</a>
            <button onClick={logout} className="text-sm font-medium text-slate-600 hover:text-slate-900">Log out</button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Profile header */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-md shadow-indigo-200">
            {initials}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{user?.username}</h1>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <div className="flex gap-2 mt-2">
              {user?.email_verified && (
                <span className="text-xs bg-emerald-100 text-emerald-700 rounded-full px-2.5 py-0.5 font-medium">Email verified</span>
              )}
              {user?.github_verified && (
                <span className="text-xs bg-emerald-100 text-emerald-700 rounded-full px-2.5 py-0.5 font-medium">GitHub connected</span>
              )}
              {!user?.email_verified && !user?.github_verified && (
                <span className="text-xs bg-slate-100 text-slate-500 rounded-full px-2.5 py-0.5 font-medium">No verifications yet</span>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading profile...</p>
        ) : (
          <>
            {/* Bio */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
              <h2 className="font-semibold text-slate-900 mb-1">About you</h2>
              <p className="text-sm text-slate-500 mb-4">This helps us understand the kind of work you're looking for.</p>
              <form onSubmit={handleSaveBio}>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="Tell us a bit about your experience and what you're looking for..."
                />
                <div className="flex items-center gap-3 mt-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg px-5 py-2 transition"
                  >
                    {saving ? "Saving..." : "Save bio"}
                  </button>
                  {message && <span className="text-sm text-slate-500">{message}</span>}
                </div>
              </form>
            </div>

            {/* Resume upload */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
              <h2 className="font-semibold text-slate-900 mb-1">Resume</h2>
              <p className="text-sm text-slate-500 mb-4">
                We'll extract your skills automatically and use it to find your best-matching jobs.
              </p>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-xl p-8 text-center cursor-pointer transition bg-slate-50/50"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                />
                {uploading ? (
                  <p className="text-sm text-slate-500">Uploading and processing...</p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      {resumeInfo ? `Current file: ${resumeInfo}` : "Drop your resume here"}
                    </p>
                    <p className="text-xs text-slate-400">PDF or DOCX, click to browse or drag and drop</p>
                  </>
                )}
              </div>

              {uploadResult && !uploadResult.error && (
                <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                  <p className="text-sm font-medium text-emerald-800 mb-2">Resume processed successfully</p>
                  {uploadResult.matched_skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {uploadResult.matched_skills.map((s) => (
                        <span key={s} className="text-xs bg-white text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-1">
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-700">No known skills detected automatically — add them manually below.</p>
                  )}
                </div>
              )}
              {uploadResult?.error && (
                <p className="text-sm text-red-600 mt-3">Couldn't process resume. Try a different file.</p>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-semibold text-slate-900 mb-1">Skills</h2>
              <p className="text-sm text-slate-500 mb-4">Detected from your resume, or add your own below.</p>

              <div className="flex flex-wrap gap-2 mb-5">
                {skills.length === 0 && (
                  <p className="text-sm text-slate-400">No skills added yet.</p>
                )}
                {skills.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2"
                  >
                    <span className="text-sm font-medium text-slate-800">{s.skill_name}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span
                          key={n}
                          className={"w-1.5 h-1.5 rounded-full " + (n <= s.proficiency ? "bg-indigo-500" : "bg-slate-200")}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="e.g. Python"
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <select
                  value={newProficiency}
                  onChange={(e) => setNewProficiency(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}/5</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition"
                >
                  Add
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileSetup;