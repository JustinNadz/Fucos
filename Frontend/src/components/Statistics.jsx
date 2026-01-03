import React, { useState, useEffect, useContext } from "react";
import { FiClock, FiTrendingUp, FiCalendar, FiZap } from "react-icons/fi";
import { sessionsApi } from "../lib/api";
import { AuthContext } from "../contexts/AuthContext";

const SESSIONS_KEY = "focus_sessions_v1";

export default function Statistics() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (user?.isGuest) {
        // Guest mode - calculate from localStorage
        try {
          const raw = localStorage.getItem(SESSIONS_KEY) || "[]";
          const sessions = JSON.parse(raw);

          const totalSessions = sessions.length;
          const totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0);
          const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

          // Today's stats
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todaySessions = sessions.filter(
            (s) => new Date(s.completedAt) >= today
          );
          const todayMinutes = todaySessions.reduce((sum, s) => sum + s.minutes, 0);

          // Week stats
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          weekStart.setHours(0, 0, 0, 0);
          const weekSessions = sessions.filter(
            (s) => new Date(s.completedAt) >= weekStart
          );
          const weekMinutes = weekSessions.reduce((sum, s) => sum + s.minutes, 0);

          setStats({
            totalSessions,
            totalMinutes,
            totalHours,
            todaySessions: todaySessions.length,
            todayMinutes,
            weekSessions: weekSessions.length,
            weekMinutes,
            streak: 0,
          });
        } catch (e) {
          console.error("Error loading stats:", e);
        }
      } else if (user) {
        // Authenticated - use API
        try {
          const apiStats = await sessionsApi.stats();
          setStats(apiStats);
        } catch (e) {
          console.error("Error loading stats:", e);
        }
      }
      setLoading(false);
    }
    loadStats();
  }, [user]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Loading statistics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No statistics available yet.</p>
      </div>
    );
  }

  const statCards = [
    {
      icon: <FiClock size={24} />,
      label: "Today",
      value: `${stats.todayMinutes} min`,
      sub: `${stats.todaySessions} sessions`,
      color: "blue",
    },
    {
      icon: <FiCalendar size={24} />,
      label: "This Week",
      value: `${Math.round(stats.weekMinutes / 60 * 10) / 10} hrs`,
      sub: `${stats.weekSessions} sessions`,
      color: "green",
    },
    {
      icon: <FiTrendingUp size={24} />,
      label: "All Time",
      value: `${stats.totalHours} hrs`,
      sub: `${stats.totalSessions} sessions`,
      color: "purple",
    },
    {
      icon: <FiZap size={24} />,
      label: "Current Streak",
      value: `${stats.streak} days`,
      sub: "Keep it up!",
      color: "orange",
    },
  ];

  const colorMap = {
    blue: "bg-blue-500/20 text-blue-400",
    green: "bg-green-500/20 text-green-400",
    purple: "bg-purple-500/20 text-purple-400",
    orange: "bg-orange-500/20 text-orange-400",
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-gray-800 border border-gray-700 rounded-xl p-5"
          >
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorMap[card.color]}`}
            >
              {card.icon}
            </div>
            <div className="text-gray-400 text-sm mb-1">{card.label}</div>
            <div className="text-2xl font-bold text-white mb-1">{card.value}</div>
            <div className="text-gray-500 text-sm">{card.sub}</div>
          </div>
        ))}
      </div>

      {stats.totalSessions === 0 && (
        <div className="text-center mt-8 p-8 bg-gray-800 rounded-xl border border-gray-700">
          <FiClock size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No sessions yet
          </h3>
          <p className="text-gray-500">
            Complete your first focus session to see your statistics here.
          </p>
        </div>
      )}
    </div>
  );
}
