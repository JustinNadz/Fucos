import React, { useEffect, useState, useRef } from "react";
import { FiCheck } from "react-icons/fi";

const PROF_KEY = "focus_professional_v1";
const SKILLS_KEY = "focus_skills_v1";

export default function SettingsProfessional() {
  const [occupation, setOccupation] = useState(() => {
    try {
      const prof = localStorage.getItem(PROF_KEY);
      if (prof) return JSON.parse(prof).occupation || "Software Developer";
    } catch (err) {
      console.error("Error reading occupation:", err);
    }
    return "Software Developer";
  });

  const [industry, setIndustry] = useState(() => {
    try {
      const prof = localStorage.getItem(PROF_KEY);
      if (prof) return JSON.parse(prof).industry || "Technology";
    } catch (err) {
      console.error("Error reading industry:", err);
    }
    return "Technology";
  });

  const [experience, setExperience] = useState(() => {
    try {
      const prof = localStorage.getItem(PROF_KEY);
      if (prof) return JSON.parse(prof).experience || "intermediate";
    } catch (err) {
      console.error("Error reading experience:", err);
    }
    return "intermediate";
  });

  const [skillText, setSkillText] = useState("");
  const [skills, setSkills] = useState(() => {
    try {
      const raw = localStorage.getItem(SKILLS_KEY) || "[]";
      return JSON.parse(raw);
    } catch (err) {
      console.error("Error reading skills:", err);
    }
    return [];
  });
  const [saved, setSaved] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const toastTimeout = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(SKILLS_KEY, JSON.stringify(skills));
    } catch (err) {
      console.error("Error saving skills:", err);
    }
  }, [skills]);

  function addSkill() {
    if (!skillText.trim()) return;
    setSkills((s) => [skillText.trim(), ...s]);
    setSkillText("");
  }

  function removeSkill(idx) {
    setSkills((s) => s.filter((_, i) => i !== idx));
  }

  function save() {
    try {
      localStorage.setItem(
        PROF_KEY,
        JSON.stringify({ occupation, industry, experience })
      );

      // Show notification
      setNotification("Professional details saved successfully!");
      setShowToast(true);
      clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setShowToast(false), 3000);
    } catch (e) {
      console.error("Error saving professional details:", e);
    }
  }

  return (
    <div className="rounded-lg p-6 max-w-4xl">
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-white mb-2">
          Professional Details
        </h3>
        <p className="text-gray-400">
          Manage your work info and technical skills.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Occupation
          </label>
          <input
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            placeholder="e.g., Software Developer, Student"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Industry
          </label>
          <select
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          >
            <option value="Technology">Technology</option>
            <option value="Education">Education</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Creative">Creative</option>
            <option value="Business">Business</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-4">
            Experience Level
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              className={`p-4 rounded-lg border-2 transition-all ${
                experience === "beginner"
                  ? "border-blue-500 bg-blue-500/20 text-white"
                  : "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
              }`}
              onClick={() => setExperience("beginner")}
            >
              <div className="text-center">
                <span className="text-2xl mb-2 block">🌱</span>
                <div className="font-medium">Beginner</div>
                <div className="text-sm text-gray-400">Just starting out</div>
              </div>
            </button>

            <button
              type="button"
              className={`p-4 rounded-lg border-2 transition-all ${
                experience === "intermediate"
                  ? "border-blue-500 bg-blue-500/20 text-white"
                  : "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
              }`}
              onClick={() => setExperience("intermediate")}
            >
              <div className="text-center">
                <span className="text-2xl mb-2 block">📈</span>
                <div className="font-medium">Intermediate</div>
                <div className="text-sm text-gray-400">1-3 years exp.</div>
              </div>
            </button>

            <button
              type="button"
              className={`p-4 rounded-lg border-2 transition-all ${
                experience === "expert"
                  ? "border-blue-500 bg-blue-500/20 text-white"
                  : "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
              }`}
              onClick={() => setExperience("expert")}
            >
              <div className="text-center">
                <span className="text-2xl mb-2 block">⭐</span>
                <div className="font-medium">Expert</div>
                <div className="text-sm text-gray-400">3+ years deep exp.</div>
              </div>
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Skills & Expertise
          </label>
          <div className="flex gap-2 mb-4">
            <input
              placeholder="Add a skill (e.g., JavaScript)"
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={skillText}
              onChange={(e) => setSkillText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSkill()}
            />
            <button
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              type="button"
              onClick={addSkill}
            >
              +
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.length === 0 ? (
              <p className="text-gray-400 text-sm">No skills added yet</p>
            ) : (
              skills.map((s, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-gray-700 text-white rounded-full text-sm"
                >
                  {s}
                  <button
                    className="text-gray-400 hover:text-red-400 transition-colors"
                    onClick={() => removeSkill(i)}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-700">
        <div></div>
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition-colors hover:bg-blue-700"
          onClick={save}
        >
          Save Details
        </button>
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
