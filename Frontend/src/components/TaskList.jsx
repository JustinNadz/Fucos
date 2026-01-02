import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiCheck,
  FiSquare,
  FiSave,
  FiX,
} from "react-icons/fi";

const STORAGE_KEY = "focus_tasks_v1";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTasks(JSON.parse(raw));
    } catch (e) {
      console.error("Error loading tasks:", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error("Error saving tasks:", e);
    }
  }, [tasks]);

  function addTask() {
    if (!text.trim()) return;
    const t = { id: Date.now(), text: text.trim(), done: false };
    setTasks((s) => [t, ...s]);
    setText("");
  }

  function removeTask(id) {
    setTasks((s) => s.filter((t) => t.id !== id));
  }

  function toggleDone(id) {
    setTasks((s) => s.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  function startEdit(t) {
    setEditingId(t.id);
    setEditingText(t.text);
  }

  function saveEdit(id) {
    setTasks((s) =>
      s.map((t) => (t.id === id ? { ...t, text: editingText } : t))
    );
    setEditingId(null);
    setEditingText("");
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
            className="bg-blue-500 hover:bg-blue-600 text-white border-none px-6 py-3 rounded-lg cursor-pointer font-medium transition-colors flex items-center justify-center"
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
          <div className="bg-green-600 px-4 py-2 rounded-lg">
            <span className="text-gray-300 text-sm mr-2">DONE</span>
            <span className="text-white font-semibold">
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
