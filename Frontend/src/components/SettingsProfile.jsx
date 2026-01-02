import React, { useState, useContext, useEffect } from "react";
import { FiSave, FiCamera } from "react-icons/fi";
import { AuthContext } from "../contexts/AuthContext";

const PROFILE_KEY = "focus_profile_v1";

export default function SettingsProfile() {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState("Passionate about productivity and deep work");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (!raw) {
        if (user) {
          setName(user.name || "");
          setEmail(user.email || "");
        }
        return;
      }

      const saved = JSON.parse(raw);

      if (user) {
        // If user has a non-empty email, try per-user stored profile first
        if (user.email) {
          if (saved.profiles && saved.profiles[user.email]) {
            const p = saved.profiles[user.email];
            if (p.name) setName(p.name);
            if (p.email) setEmail(p.email);
            if (p.bio) setBio(p.bio);
            return;
          }

          if (saved.email && saved.email === user.email) {
            if (saved.name) setName(saved.name);
            if (saved.bio) setBio(saved.bio);
            return;
          }

          setName(user.name || "");
          setEmail(user.email || "");
          return;
        }

        // Signed in but no email (e.g. Guest) -> do not load other users' stored profile
        setName(user.name || "");
        setEmail(user.email || "");
        return;
      }

      if (saved.name) setName(saved.name);
      if (saved.email) setEmail(saved.email);
      if (saved.bio) setBio(saved.bio);
    } catch (e) {
      // ignore
    }
  }, [user]);

  function save() {
    setIsSaving(true);
    try {
      if (user && user.email) {
        const raw = localStorage.getItem(PROFILE_KEY);
        let store = { profiles: {} };
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.profiles) store = parsed;
          } catch (e) {
            // ignore and overwrite
          }
        }
        store.profiles[user.email] = { name, email, bio };
        localStorage.setItem(PROFILE_KEY, JSON.stringify(store));
      } else {
        localStorage.setItem(PROFILE_KEY, JSON.stringify({ name, email, bio }));
      }

      setTimeout(() => setIsSaving(false), 2000); // Visual feedback
    } catch (e) {
      setIsSaving(false);
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 max-w-4xl">
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-white mb-2">
          Profile Information
        </h3>
        <p className="text-gray-400">
          Update your personal details and public bio.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center md:items-start">
          <div>
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4 relative">
              <span>{(name || " ").charAt(0).toUpperCase()}</span>
              <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-gray-700 rounded-full flex items-center justify-center text-white text-sm">
                <FiCamera size={14} />
              </div>
            </div>
          </div>
          <button
            type="button"
            className="mt-6 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Change Photo
          </button>
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              type="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="pt-4">
            <button
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                isSaving
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              onClick={save}
              disabled={isSaving}
            >
              {isSaving ? (
                "Saving..."
              ) : (
                <>
                  <FiSave /> Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
