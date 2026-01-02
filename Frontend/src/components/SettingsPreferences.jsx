import React, { useState, useEffect } from "react";

const PREFS_KEY = "focus_preferences_v1";

export default function SettingsPreferences() {
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PREFS_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        setTheme(p.theme || "light");
        setNotifications(p.notifications !== false);
        setSoundEnabled(p.soundEnabled !== false);
        setWorkDuration(p.workDuration || 25);
        setBreakDuration(p.breakDuration || 5);
      }
    } catch (e) {}
  }, []);

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
      alert("Preferences saved!");
    } catch (e) {}
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 max-w-4xl">
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
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            onClick={save}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
