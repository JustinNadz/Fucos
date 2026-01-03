import React, { useState, useEffect, useContext } from "react";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiCheck,
  FiSquare,
  FiSave,
  FiX,
} from "react-icons/fi";
import { tasksApi } from "../lib/api";
import { AuthContext } from "../contexts/AuthContext";
import socket from "../lib/socket";

const STORAGE_KEY = "focus_tasks_v1";

export default function TaskList() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  // Load tasks from API or localStorage (for guests)
  useEffect(() => {
    async function loadTasks() {
      if (user?.isGuest) {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) setTasks(JSON.parse(raw));
        } catch (e) {
          console.error("Error loading tasks:", e);
        }
      } else if (user) {
        try {
          const apiTasks = await tasksApi.list();
          setTasks(apiTasks);
        } catch (e) {
          console.error("Error loading tasks:", e);
        }
      }
      setLoading(false);
    }
    loadTasks();
  }, [user]);

  // Real-time socket listeners
  useEffect(() => {
    if (user?.isGuest) return;

    function onTaskCreated(task) {
      setTasks((prev) => {
        // Avoid duplicates
        if (prev.some((t) => t.id === task.id)) return prev;
        return [task, ...prev];
      });
    }

    function onTaskUpdated(task) {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    }

    function onTaskDeleted({ id }) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }

    socket.on("task:created", onTaskCreated);
    socket.on("task:updated", onTaskUpdated);
    socket.on("task:deleted", onTaskDeleted);

    return () => {
      socket.off("task:created", onTaskCreated);
      socket.off("task:updated", onTaskUpdated);
      socket.off("task:deleted", onTaskDeleted);
    };
  }, [user]);

  // Save tasks to localStorage for guests
  useEffect(() => {
    if (user?.isGuest) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (e) {
        console.error("Error saving tasks:", e);
      }
    }
  }, [tasks, user]);

  async function addTask() {
    if (!text.trim()) return;

    if (user?.isGuest) {
      const t = { id: Date.now().toString(), text: text.trim(), done: false };
      setTasks((s) => [t, ...s]);
    } else {
      try {
        // Optimistically add task for faster UI
        setTasks((prev) => [
          { id: "pending", text: text.trim(), done: false },
          ...prev,
        ]);
        await tasksApi.create(text.trim());
        // Force reload tasks for correct state
        const apiTasks = await tasksApi.list();
        setTasks(apiTasks);
      } catch (e) {
        console.error("Error creating task:", e);
      }
    }
    setText("");
  }

  async function removeTask(id) {
    if (user?.isGuest) {
      setTasks((s) => s.filter((t) => t.id !== id));
    } else {
      try {
        // Optimistically remove task for faster UI
        setTasks((prev) => prev.filter((t) => t.id !== id));
        await tasksApi.delete(id);
        // Force reload tasks for correct state
        const apiTasks = await tasksApi.list();
        setTasks(apiTasks);
      } catch (e) {
        console.error("Error deleting task:", e);
      }
    }
  }

  async function toggleDone(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    if (user?.isGuest) {
      setTasks((s) =>
        s.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
      );
    } else {
      try {
        // Optimistically update done state
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
        );
        await tasksApi.update(id, { done: !task.done });
        // Force reload tasks for correct state
        const apiTasks = await tasksApi.list();
        setTasks(apiTasks);
      } catch (e) {
        console.error("Error updating task:", e);
      }
    }
  }

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  function startEdit(t) {
    setEditingId(t.id);
    setEditingText(t.text);
  }

  async function saveEdit(id) {
    if (user?.isGuest) {
      setTasks((s) =>
        s.map((t) => (t.id === id ? { ...t, text: editingText } : t))
      );
    } else {
      try {
        // Optimistically update text
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, text: editingText } : t))
        );
        await tasksApi.update(id, { text: editingText });
        // Force reload tasks for correct state
        const apiTasks = await tasksApi.list();
        setTasks(apiTasks);
      } catch (e) {
        console.error("Error updating task:", e);
      }
    }
    setEditingId(null);
    setEditingText("");
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Loading tasks...</p>
      </div>
    );
  }

  return (
    <section className="mb-8">
      <div className="mb-6">
        <div className="flex gap-3 justify-center max-w-2xl mx-auto">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a new task..."
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            className="flex-1 min-w-0 px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-[#fff] border-none px-6 py-3 rounded-lg cursor-pointer font-medium transition-colors flex items-center justify-center"
            onClick={addTask}
            title="Add task (or press Enter)"
          >
            <FiPlus className="mr-2" /> Add
          </button>
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="flex gap-4 justify-center mb-6">
          <div className="bg-gray-700 px-4 py-2 rounded-lg">
            <span className="text-gray-300 text-sm mr-2">TO DO</span>
            <span className="text-white font-semibold">
              {tasks.filter((t) => !t.done).length}
            </span>
          </div>
          <div className="bg-blue-500 px-4 py-2 rounded-lg">
            <span className="text-[#fff] text-sm mr-2">DONE</span>
            <span className="text-[#fff] font-semibold">
              {tasks.filter((t) => t.done).length}
            </span>
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            No tasks yet. Add one to get started.
          </p>
        </div>
      ) : (
        <ul className="space-y-2 max-w-2xl mx-auto">
          {tasks.map((t) => (
            <li
              key={t.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                t.done
                  ? "bg-gray-700 border-gray-600 opacity-75"
                  : "bg-gray-800 border-gray-700"
              }`}
            >
              <div className="flex items-center flex-1 min-w-0">
                <div className="flex items-center flex-1 min-w-0">
                  <button
                    onClick={() => toggleDone(t.id)}
                    className={`mr-3 text-xl cursor-pointer transition-colors ${
                      t.done
                        ? "text-green-500"
                        : "text-gray-500 hover:text-blue-400"
                    } bg-transparent border-none p-0 flex items-center`}
                  >
                    {t.done ? <FiCheck /> : <FiSquare />}
                  </button>
                  {editingId === t.id ? (
                    <input
                      className="flex-1 min-w-0 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(t.id)}
                      autoFocus
                    />
                  ) : (
                    <span
                      className={`flex-1 min-w-0 ${
                        t.done ? "line-through text-gray-500" : "text-white"
                      }`}
                    >
                      {t.text}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                {editingId === t.id ? (
                  <>
                    <button
                      className="p-2 text-green-500 hover:bg-green-500/10 rounded transition-colors"
                      onClick={() => saveEdit(t.id)}
                      title="Save"
                    >
                      <FiSave size={18} />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:bg-gray-500/10 rounded transition-colors"
                      onClick={() => setEditingId(null)}
                      title="Cancel"
                    >
                      <FiX size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="p-2 text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                      onClick={() => startEdit(t)}
                      title="Edit"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      onClick={() => removeTask(t.id)}
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
