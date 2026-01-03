const PREFS_KEY = "focus_preferences_v1";

function isSystemDark() {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

function setLightMode(enable) {
  if (enable) {
    document.documentElement.classList.add("light-mode");
  } else {
    document.documentElement.classList.remove("light-mode");
  }
}

let mediaListener = null;

export function applyTheme(theme) {
  // Always remove any existing listener first
  if (mediaListener && window.matchMedia) {
    try {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", mediaListener);
    } catch (e) {
      console.error("Error removing media listener:", e);
    }
    mediaListener = null;
  }

  if (theme === "light") {
    setLightMode(true);
  } else if (theme === "dark") {
    setLightMode(false);
  } else if (theme === "auto") {
    // auto mode - follow system preference
    const update = () => {
      const dark = isSystemDark();
      setLightMode(!dark);
    };

    // initial
    update();

    // listen for changes
    if (window.matchMedia) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mediaListener = () => update();
      try {
        mq.addEventListener("change", mediaListener);
      } catch (e) {
        console.error("Error adding media listener:", e);
      }
    }
  }
}

export function initTheme() {
  try {
    const saved = localStorage.getItem(PREFS_KEY);
    if (saved) {
      const theme = JSON.parse(saved).theme || "light";
      applyTheme(theme);
      return;
    }
  } catch (e) {
    console.error("Error reading theme pref:", e);
  }
  // default to light
  applyTheme("light");
}

export default { applyTheme, initTheme };
