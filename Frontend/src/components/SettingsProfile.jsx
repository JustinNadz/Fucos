import React, { useState, useContext, useRef } from "react";
import { FiSave, FiCamera, FiCheck } from "react-icons/fi";
import { AuthContext } from "../contexts/AuthContext";

const PROFILE_KEY = "focus_profile_v1";

export default function SettingsProfile() {
  const { user, updateUser } = useContext(AuthContext);

  const [name, setName] = useState(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (!raw) {
        return user?.name || "";
      }
      const saved = JSON.parse(raw);
      if (user?.email) {
        if (saved.profiles && saved.profiles[user.email]) {
          return saved.profiles[user.email].name || user.name || "";
        }
        if (saved.email && saved.email === user.email)
          return saved.name || user.name || "";
        return user.name || "";
      }
      return saved.name || user?.name || "";
    } catch (err) {
      console.error("Error reading profile name:", err);
      return user?.name || "";
    }
  });

  const [email, setEmail] = useState(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (!raw) return user?.email || "";
      const saved = JSON.parse(raw);
      if (user?.email) {
        if (saved.profiles && saved.profiles[user.email]) {
          return saved.profiles[user.email].email || user.email || "";
        }
        if (saved.email && saved.email === user.email)
          return saved.email || user.email || "";
        return user.email || "";
      }
      return saved.email || user?.email || "";
    } catch (err) {
      console.error("Error reading profile email:", err);
      return user?.email || "";
    }
  });

  const [bio, setBio] = useState(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (!raw) return "Passionate about productivity and deep work";
      const saved = JSON.parse(raw);
      if (user?.email) {
        if (saved.profiles && saved.profiles[user.email]) {
          return (
            saved.profiles[user.email].bio ||
            saved.bio ||
            "Passionate about productivity and deep work"
          );
        }
        if (saved.email && saved.email === user.email)
          return saved.bio || "Passionate about productivity and deep work";
      }
      return saved.bio || "Passionate about productivity and deep work";
    } catch (err) {
      console.error("Error reading profile bio:", err);
      return "Passionate about productivity and deep work";
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const toastTimeout = useRef(null);

  function save() {
    // Show notification immediately
    setNotification("Profile details saved successfully!");
    setShowToast(true);
    clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setShowToast(false), 3000);

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
            console.error("Error parsing profile store, overwriting:", e);
          }
        }
        store.profiles[user.email] = { name, email, bio };
        localStorage.setItem(PROFILE_KEY, JSON.stringify(store));
      } else {
        localStorage.setItem(PROFILE_KEY, JSON.stringify({ name, email, bio }));
      }

      // Update user context
      if (updateUser) {
        updateUser({ name, email });
      }

      setTimeout(() => setIsSaving(false), 2000); // Visual feedback
    } catch (e) {
      console.error("Error saving profile:", e);
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-lg p-6 max-w-4xl">
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
              className={`px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition-colors hover:bg-blue-700 flex items-center gap-2${
                isSaving ? " cursor-not-allowed opacity-70" : ""
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

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg font-medium flex items-center gap-2">
            <FiCheck />
            {notification}
          </div>
        </div>
      )}
    </div>
  );
}
