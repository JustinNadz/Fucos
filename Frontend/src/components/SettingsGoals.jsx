import React, { useState, useEffect } from "react";

const GOALS_KEY = "focus_goals_v1";

export default function SettingsGoals() {
  const [dailyGoal, setDailyGoal] = useState(120);
  const [weeklyGoal, setWeeklyGoal] = useState(600);
  const [focusMode, setFocusMode] = useState("balanced");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(GOALS_KEY);
      if (saved) {
        const g = JSON.parse(saved);
        setDailyGoal(g.dailyGoal || 120);
        setWeeklyGoal(g.weeklyGoal || 600);
        setFocusMode(g.focusMode || "balanced");
      }
    } catch (e) {
      console.error("Error loading goals:", e);
    }
  }, []);

  function save() {
    try {
      localStorage.setItem(
        GOALS_KEY,
        JSON.stringify({ dailyGoal, weeklyGoal, focusMode })
      );
      alert("Goals saved!");
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
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            onClick={save}
          >
            Save Goals
          </button>
        </div>
      </div>
    </div>
  );
}
