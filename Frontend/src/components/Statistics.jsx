import React, { useEffect, useState } from "react";
import { FiClock, FiCheckCircle, FiZap, FiList } from "react-icons/fi";

const SESSIONS_KEY = "focus_sessions_v1";
const TASKS_KEY = "focus_tasks_v1";

function StatCard({ title, value, subtitle, accent, icon }) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4"
        style={{ background: accent }}
      >
        {icon}
      </div>
      <div>
        <div className="text-gray-300 text-sm font-medium mb-1">{title}</div>
        <div className="text-white text-2xl font-bold mb-1">{value}</div>
        {subtitle ? (
          <div className="text-gray-400 text-sm">{subtitle}</div>
        ) : null}
      </div>
    </div>
  );
}

export default function Statistics() {
  const [sessions, setSessions] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSIONS_KEY) || "[]";
      setSessions(JSON.parse(raw));
    } catch (e) {
      console.error("Error loading sessions:", e);
    }
    try {
      const rawT = localStorage.getItem(TASKS_KEY) || "[]";
      setTasks(JSON.parse(rawT));
    } catch (e) {
      console.error("Error loading tasks:", e);
    }
  }, []);

  const totalMinutes = sessions.reduce((acc, s) => acc + (s.minutes || 0), 0);
  const sessionsCompleted = sessions.length;
  const today = new Date().toISOString().slice(0, 10);
  const sessionsToday = sessions.filter(
    (s) => s.completedAt && s.completedAt.slice(0, 10) === today
  ).length;
  const tasksCompleted = tasks.filter((t) => t.done).length;

  const days = Array.from(
    new Set(sessions.map((s) => (s.completedAt || "").slice(0, 10)))
  ).filter(Boolean);
  const streak = days.length;

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Focus Time"
          value={`${totalMinutes} min`}
          subtitle={`${Math.floor(totalMinutes / 60)} hours`}
          accent="rgba(59, 130, 246, 0.2)"
          icon={<FiClock className="text-blue-500" />}
        />
        <StatCard
          title="Sessions Completed"
          value={`${sessionsCompleted}`}
          subtitle={`${sessionsToday} today`}
          accent="rgba(16, 185, 129, 0.2)"
          icon={<FiCheckCircle className="text-green-500" />}
        />
        <StatCard
          title="Current Streak"
          value={`${streak} days`}
          subtitle={streak ? "Keep it up!" : "Start today!"}
          accent="rgba(245, 158, 11, 0.2)"
          icon={<FiZap className="text-amber-500" />}
        />
        <StatCard
          title="Tasks Completed"
          value={`${tasksCompleted}`}
          subtitle={`${tasks.length - tasksCompleted} remaining`}
          accent="rgba(139, 92, 246, 0.2)"
          icon={<FiList className="text-purple-500" />}
        />
      </div>
    </div>
  );
}
