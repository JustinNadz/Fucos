import React, { useEffect, useRef, useState, useContext } from "react";
import {
  FiPlay,
  FiPause,
  FiRotateCcw,
} from "react-icons/fi";
import { sessionsApi } from "../lib/api";
import { AuthContext } from "../contexts/AuthContext";

const SESSIONS_KEY = "focus_sessions_v1";

function msToTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function FocusSession() {
  const { user } = useContext(AuthContext);
  const [task, setTask] = useState("");
  const [mode, setMode] = useState("pomodoro");
  const [minutes, setMinutes] = useState(25);
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);

  const intervalRef = useRef(null);

  const totalSeconds = minutes * 60;
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  async function onComplete() {
    if (user?.isGuest) {
      // Guest mode - use localStorage
      try {
        const raw = localStorage.getItem(SESSIONS_KEY) || "[]";
        const sessions = JSON.parse(raw);
        sessions.unshift({
          id: Date.now(),
          task: task || null,
          minutes,
          completedAt: new Date().toISOString(),
        });
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
      } catch (e) {
        console.error("Error saving session:", e);
      }
    } else if (user) {
      // Authenticated - use API
      try {
        await sessionsApi.create(task || null, minutes);
      } catch (e) {
        console.error("Error saving session:", e);
      }
    }
  }

  useEffect(() => {
    setSecondsLeft(minutes * 60);
  }, [minutes]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            onComplete();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function startPause() {
    if (running) setRunning(false);
    else setRunning(true);
  }

  function resetTimer() {
    setRunning(false);
    setSecondsLeft(minutes * 60);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          What are you working on?
        </label>
        <input
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
          placeholder="Enter your task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === "pomodoro"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            onClick={() => {
              setMode("pomodoro");
              setMinutes(25);
            }}
          >
            Pomodoro
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === "custom"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            onClick={() => setMode("custom")}
          >
            Custom
          </button>
        </div>

        <div className="flex gap-2">
          <button
            className={`px-3 py-2 rounded-lg font-medium transition-colors ${minutes === 15 && mode !== "custom"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            onClick={() => {
              setMode("pomodoro");
              setMinutes(15);
            }}
          >
            15m
          </button>
          <button
            className={`px-3 py-2 rounded-lg font-medium transition-colors ${minutes === 25 && mode !== "custom"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            onClick={() => {
              setMode("pomodoro");
              setMinutes(25);
            }}
          >
            25m
          </button>
          <button
            className={`px-3 py-2 rounded-lg font-medium transition-colors ${minutes === 50 && mode !== "custom"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            onClick={() => {
              setMode("pomodoro");
              setMinutes(50);
            }}
          >
            50m
          </button>
        </div>

        {mode === "custom" && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Set custom duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="999"
              value={minutes}
              onChange={(e) =>
                setMinutes(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-32 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      <div className="text-center">
        <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 256 256"
          >
            {/* Background Circle */}
            <circle
              cx="128"
              cy="128"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-800"
            />
            {/* Progress Circle */}
            <circle
              cx="128"
              cy="128"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-blue-500 transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="text-5xl font-mono font-bold text-white relative z-10">
            {msToTime(secondsLeft)}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors flex items-center gap-2"
            onClick={startPause}
          >
            {running ? <FiPause /> : <FiPlay />}
            {running ? "Pause" : "Start"}
          </button>
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors flex items-center gap-2"
            onClick={resetTimer}
          >
            <FiRotateCcw />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
