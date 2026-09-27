import { useState, useEffect } from "react";
import { getProfile, updateProfile, addSkill } from "../api/profile";

function ProfileSetup() {
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [newProficiency, setNewProficiency] = useState(3);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getProfile()
      .then((res) => {
        setBio(res.data.bio || "");
        setSkills(res.data.seeker_skills || []);
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

  if (loading) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="max-w-xl mx-auto mt-12 p-6">
      <h1 className="text-2xl font-semibold mb-6">Your Profile</h1>

      <form onSubmit={handleSaveBio} className="mb-8">
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="w-full border rounded px-3 py-2"
          placeholder="Tell us a bit about yourself..."
        />
        <button
          type="submit"
          disabled={saving}
          className="mt-2 bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Bio"}
        </button>
      </form>

      <div>
        <h2 className="text-lg font-medium mb-2">Skills</h2>

        <ul className="mb-4 flex flex-wrap gap-2">
          {skills.map((s) => (
            <li
              key={s.id}
              className="bg-gray-100 rounded-full px-3 py-1 text-sm"
            >
              {s.skill_name} · {s.proficiency}/5
            </li>
          ))}
        </ul>

        <form onSubmit={handleAddSkill} className="flex gap-2">
          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="e.g. Python"
            className="border rounded px-3 py-2 flex-1"
          />
          <select
            value={newProficiency}
            onChange={(e) => setNewProficiency(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2">
            Add
          </button>
        </form>
      </div>

      {message && <p className="text-sm mt-4 text-gray-600">{message}</p>}
    </div>
  );
}

export default ProfileSetup;