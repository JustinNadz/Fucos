import React, { useState, useRef } from "react";
import { FiCheck } from "react-icons/fi";

const NOTIF_KEY = "focus_notifications_v1";

export default function SettingsNotifications() {
  const [sessionReminders, setSessionReminders] = useState(() => {
    try {
      const saved = localStorage.getItem(NOTIF_KEY);
      if (saved) return JSON.parse(saved).sessionReminders !== false;
    } catch (err) {
      console.error("Error reading session reminders:", err);
    }
    return true;
  });

  const [breakReminders, setBreakReminders] = useState(() => {
    try {
      const saved = localStorage.getItem(NOTIF_KEY);
      if (saved) return JSON.parse(saved).breakReminders !== false;
    } catch (err) {
      console.error("Error reading break reminders:", err);
    }
    return true;
  });

  const [streakNotifications, setStreakNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(NOTIF_KEY);
      if (saved) return JSON.parse(saved).streakNotifications !== false;
    } catch (err) {
      console.error("Error reading streak notifications:", err);
    }
    return true;
  });

  const [emailSummaries, setEmailSummaries] = useState(() => {
    try {
      const saved = localStorage.getItem(NOTIF_KEY);
      if (saved) return JSON.parse(saved).emailSummaries || false;
    } catch (err) {
      console.error("Error reading email summaries:", err);
    }
    return false;
  });

  const [emailFreq, setEmailFreq] = useState(() => {
    try {
      const saved = localStorage.getItem(NOTIF_KEY);
      if (saved) return JSON.parse(saved).emailFreq || "weekly";
    } catch (err) {
      console.error("Error reading email frequency:", err);
    }
    return "weekly";
  });

  const [notification, setNotification] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const toastTimeout = useRef(null);

  function save() {
    try {
      localStorage.setItem(
        NOTIF_KEY,
        JSON.stringify({
          sessionReminders,
          breakReminders,
          streakNotifications,
          emailSummaries,
          emailFreq,
        })
      );

      // Show notification
      setNotification("Notification settings saved successfully!");
      setShowToast(true);
      clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setShowToast(false), 3000);
    } catch (e) {
      console.error("Error saving notification settings:", e);
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 max-w-4xl">
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-white mb-6">
          Notifications
        </h3>
      </div>

      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <input
            type="checkbox"
            id="session-reminders"
            className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            checked={sessionReminders}
            onChange={(e) => setSessionReminders(e.target.checked)}
          />
          <div className="flex-1">
            <label
              htmlFor="session-reminders"
              className="text-white font-medium block"
            >
              Session Reminders
            </label>
            <p className="text-gray-400 text-sm mt-1">
              Get reminded when it's time to start a focus session
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <input
            type="checkbox"
            id="break-reminders"
            className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            checked={breakReminders}
            onChange={(e) => setBreakReminders(e.target.checked)}
          />
          <div className="flex-1">
            <label
              htmlFor="break-reminders"
              className="text-white font-medium block"
            >
              Break Reminders
            </label>
            <p className="text-gray-400 text-sm mt-1">
              Get reminded to take breaks between sessions
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <input
            type="checkbox"
            id="streak-notifications"
            className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            checked={streakNotifications}
            onChange={(e) => setStreakNotifications(e.target.checked)}
          />
          <div className="flex-1">
            <label
              htmlFor="streak-notifications"
              className="text-white font-medium block"
            >
              Streak Notifications
            </label>
            <p className="text-gray-400 text-sm mt-1">
              Celebrate your streaks and milestones
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="flex items-start space-x-4">
            <input
              type="checkbox"
              id="email-summaries"
              className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              checked={emailSummaries}
              onChange={(e) => setEmailSummaries(e.target.checked)}
            />
            <div className="flex-1">
              <label
                htmlFor="email-summaries"
                className="text-white font-medium block"
              >
                Email Summaries
              </label>
              <p className="text-gray-400 text-sm mt-1">
                Receive productivity summaries via email
              </p>
            </div>
          </div>

          {emailSummaries && (
            <div className="mt-4 ml-8">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Frequency
              </label>
              <select
                className="w-full max-w-xs px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={emailFreq}
                onChange={(e) => setEmailFreq(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-700">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition-colors hover:bg-blue-700"
            onClick={save}
          >
            Save Settings
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
