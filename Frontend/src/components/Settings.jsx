import React, { useState } from "react";
import {
  FiUser,
  FiBriefcase,
  FiSliders,
  FiTarget,
  FiBell,
} from "react-icons/fi";
import { AuthContext } from "../contexts/AuthContext";
import SettingsProfile from "./SettingsProfile";
import SettingsProfessional from "./SettingsProfessional";
import SettingsPreferences from "./SettingsPreferences";
import SettingsGoals from "./SettingsGoals";
import SettingsNotifications from "./SettingsNotifications";

const TABS = [
  { key: "profile", label: "Profile", icon: <FiUser /> },
  { key: "professional", label: "Professional", icon: <FiBriefcase /> },
  { key: "preferences", label: "Preferences", icon: <FiSliders /> },
  { key: "goals", label: "Goals", icon: <FiTarget /> },
  { key: "notifications", label: "Notifications", icon: <FiBell /> },
];

export default function Settings() {
  const [tab, setTab] = useState("profile");

  function renderTab() {
    switch (tab) {
      case "professional":
        return <SettingsProfessional />;
      case "preferences":
        return <SettingsPreferences />;
      case "goals":
        return <SettingsGoals />;
      case "notifications":
        return <SettingsNotifications />;
      default:
        return <SettingsProfile />;
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-full bg-gray-900">
      <div className="w-full md:w-64 bg-gray-800 border-b md:border-b-0 md:border-r border-gray-700 p-4 md:p-6">
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
          {TABS.map((t) => (
            <div
              key={t.key}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors whitespace-nowrap ${
                t.key === tab
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setTab(t.key)}
            >
              {t.icon}
              <span>{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-auto">{renderTab()}</div>
    </div>
  );
}
