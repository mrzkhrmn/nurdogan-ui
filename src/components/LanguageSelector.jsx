import { useState, useRef, useEffect } from "react";
import { IoGlobeOutline } from "react-icons/io5";

const LANGUAGES = [
  { code: "tr", label: "Türkçe" },
  { code: "en", label: "English" },
];

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("tr");
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 xl:gap-2 shrink-0 h-8 xl:h-10 2xl:h-14 px-2 xl:px-2.5 2xl:px-3 rounded-full text-white hover:bg-white/20 transition-colors"
        aria-label="Dil seçimi"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <IoGlobeOutline className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 shrink-0" />
        <span className="text-xs xl:text-sm 2xl:text-base font-semibold uppercase tracking-wide">
          {selected}
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 py-1 min-w-[120px] bg-white rounded-xl shadow-lg border border-gray-100 z-50"
          role="listbox"
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              role="option"
              aria-selected={selected === lang.code}
              onClick={() => {
                setSelected(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                selected === lang.code
                  ? "bg-[#E30A17]/10 text-[#E30A17]"
                  : "text-[#262322] hover:bg-gray-100"
              }`}
            >
              {lang.code.toUpperCase()} – {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
