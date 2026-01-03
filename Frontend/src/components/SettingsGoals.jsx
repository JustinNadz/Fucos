import React, { useState, useRef } from "react";
import { FiCheck } from "react-icons/fi";

const GOALS_KEY = "focus_goals_v1";

export default function SettingsGoals() {
  const [dailyGoal, setDailyGoal] = useState(() => {
    try {
      const saved = localStorage.getItem(GOALS_KEY);
      if (saved) return JSON.parse(saved).dailyGoal || 120;
    } catch (err) {
      console.error("Error reading daily goal:", err);
    }
    return 120;
  });

  const [weeklyGoal, setWeeklyGoal] = useState(() => {
    try {
      const saved = localStorage.getItem(GOALS_KEY);
      if (saved) return JSON.parse(saved).weeklyGoal || 600;
    } catch (err) {
      console.error("Error reading weekly goal:", err);
    }
    return 600;
  });

  const [focusMode, setFocusMode] = useState(() => {
    try {
      const saved = localStorage.getItem(GOALS_KEY);
      if (saved) return JSON.parse(saved).focusMode || "balanced";
    } catch (err) {
      console.error("Error reading focus mode:", err);
    }
    return "balanced";
  });

  const [notification, setNotification] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const toastTimeout = useRef(null);

  function save() {
    try {
      localStorage.setItem(
        GOALS_KEY,
        JSON.stringify({ dailyGoal, weeklyGoal, focusMode })
      );

      // Show notification
      setNotification("Goals saved successfully!");
      setShowToast(true);
      clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setShowToast(false), 3000);
    } catch (e) {
      console.error("Error loading goals:", e);
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 max-w-4xl">
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-white mb-6">Goals</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Daily Focus Goal (minutes)
          </label>
          <input
            type="number"
            min="30"
            max="600"
            className="w-full max-w-xs px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={dailyGoal}
            onChange={(e) => setDailyGoal(parseInt(e.target.value))}
          />
          <p className="text-sm text-gray-400 mt-2">
            Target {dailyGoal} minutes of focused work per day
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Weekly Focus Goal (minutes)
          </label>
          <input
            type="number"
            min="150"
            max="3000"
            className="w-full max-w-xs px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={weeklyGoal}
            onChange={(e) => setWeeklyGoal(parseInt(e.target.value))}
          />
          <p className="text-sm text-gray-400 mt-2">
            Target {weeklyGoal} minutes per week
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Focus Mode
          </label>
          <select
            className="w-full max-w-xs px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={focusMode}
            onChange={(e) => setFocusMode(e.target.value)}
          >
            <option value="relaxed">Relaxed (Low pressure)</option>
            <option value="balanced">Balanced (Recommended)</option>
            <option value="intense">Intense (High challenge)</option>
          </select>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-700">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition-colors hover:bg-blue-700"
            onClick={save}
          >
            Save Goals
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
