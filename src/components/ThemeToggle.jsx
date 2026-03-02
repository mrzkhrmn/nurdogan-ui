import { useState, useEffect } from "react";
import { IoSunnyOutline } from "react-icons/io5";
import { IoMoonOutline } from "react-icons/io5";

const STORAGE_KEY = "theme";

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  localStorage.setItem(STORAGE_KEY, theme);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    if (theme) applyTheme(theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <button
      type="button"
      onClick={toggle}
      className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-14 2xl:h-14 shrink-0 flex items-center justify-center rounded-full text-white hover:bg-white/20 transition-colors"
      aria-label={theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç"}
      title={theme === "dark" ? "Açık mod" : "Koyu mod"}
    >
      {theme === "dark" ? (
        <IoSunnyOutline className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" />
      ) : (
        <IoMoonOutline className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" />
      )}
    </button>
  );
}
