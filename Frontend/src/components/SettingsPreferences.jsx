import React, { useState, useEffect, useRef } from "react";
import { applyTheme } from "../lib/theme";
import { FiCheck } from "react-icons/fi";

const PREFS_KEY = "focus_preferences_v1";

export default function SettingsPreferences() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(PREFS_KEY);
      if (saved) return JSON.parse(saved).theme || "light";
    } catch (err) {
      console.error("Error reading theme:", err);
    }
    return "light";
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(PREFS_KEY);
      if (saved) return JSON.parse(saved).notifications !== false;
    } catch (err) {
      console.error("Error reading notifications pref:", err);
    }
    return true;
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem(PREFS_KEY);
      if (saved) return JSON.parse(saved).soundEnabled !== false;
    } catch (err) {
      console.error("Error reading sound setting:", err);
    }
    return true;
  });

  const [workDuration, setWorkDuration] = useState(() => {
    try {
      const saved = localStorage.getItem(PREFS_KEY);
      if (saved) return JSON.parse(saved).workDuration || 25;
    } catch (err) {
      console.error("Error reading work duration:", err);
    }
    return 25;
  });

  const [breakDuration, setBreakDuration] = useState(() => {
    try {
      const saved = localStorage.getItem(PREFS_KEY);
      if (saved) return JSON.parse(saved).breakDuration || 5;
    } catch (err) {
      console.error("Error reading break duration:", err);
    }
    return 5;
  });

  const [notification, setNotification] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const toastTimeout = useRef(null);

  function save() {
    try {
      localStorage.setItem(
        PREFS_KEY,
        JSON.stringify({
          theme,
          notifications,
          soundEnabled,
          workDuration,
          breakDuration,
        })
      );
      // apply theme immediately
      try {
        applyTheme(theme);
      } catch (e) {
        console.error("Error applying theme:", e);
      }

      // Show notification
      setNotification("Preferences saved successfully!");
      setShowToast(true);
      clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setShowToast(false), 3000);
    } catch (e) {
      console.error("Error saving preferences:", e);
    }
  }

  useEffect(() => {
    try {
      applyTheme(theme);
      // Auto-save theme preference
      const saved = localStorage.getItem(PREFS_KEY);
      const prefs = saved ? JSON.parse(saved) : {};
      prefs.theme = theme;
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.error("Error applying/saving theme:", e);
    }
  }, [theme]);

  // Apply theme on mount
  useEffect(() => {
    try {
      applyTheme(theme);
    } catch (e) {
      console.error("Error applying theme on mount:", e);
    }
  }, []);

  return (
    <div className="rounded-lg p-6 max-w-4xl">
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-white mb-6">Preferences</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Theme
          </label>
          <select
            className="w-full max-w-xs px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Work Duration (minutes)
            </label>
            <input
              type="number"
              min="5"
              max="120"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={workDuration}
              onChange={(e) => setWorkDuration(parseInt(e.target.value))}
            />
          </div>

          <div>
            <label className="block textName-sm font-medium text-gray-300 mb-2">
              Break Duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={breakDuration}
              onChange={(e) => setBreakDuration(parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="notifications"
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            <label htmlFor="notifications" className="text-white font-medium">
              Enable notifications
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="sound"
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
            />
            <label htmlFor="sound" className="text-white font-medium">
              Enable sound
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-700">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition-colors hover:bg-blue-700"
            onClick={save}
          >
            Save Changes
          </button>
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
