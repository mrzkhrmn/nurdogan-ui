import { useEffect, useState, useMemo } from "react";
import { BASE_API_URL } from "../api/constants";
import { getImageUrl } from "../api";

function buildBaseUrl() {
  return (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
}

function mapApiToUi(p, baseUrl) {
  return {
    id: p.id,
    name: p.name || "",
    description: p.description || "",
    image: getImageUrl(p.imageUrl) || `${baseUrl}construction1.png`,
    location: p.shortAddress || "",
  };
}

function normalize(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function ProjectCard({ href, image, name, location, searchName }) {
  return (
    <a
      href={href}
      className="project-card relative w-full overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg group border border-gray-100 dark:border-gray-700 block transition-colors duration-200"
      data-project-name={searchName}
    >
      <div className="aspect-[3/4] md:aspect-[2/3] relative overflow-hidden">
        <img
          src={image}
          alt={name}
          width={400}
          height={300}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/70 to-transparent space-y-1.5">
          <p className="text-white text-sm md:text-base font-semibold flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {name}
          </p>
          <p className="text-white/90 text-xs md:text-sm flex items-center gap-2">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </p>
        </div>
      </div>
    </a>
  );
}

export default function ProjelerPageProjectsClient({ baseUrl: baseUrlProp }) {
  const baseUrl = baseUrlProp || buildBaseUrl();
  const [completedProjects, setCompletedProjects] = useState([]);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("ongoing");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${BASE_API_URL}/Website/get-projects`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) {
          const completed = data.filter((p) => p.isFinished).map((p) => mapApiToUi(p, baseUrl));
          const ongoing = data.filter((p) => !p.isFinished).map((p) => mapApiToUi(p, baseUrl));
          setCompletedProjects(completed);
          setOngoingProjects(ongoing);
        }
      } catch (e) {
        console.error("Error while fetching projects (client)", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [baseUrl]);

  const q = useMemo(() => normalize(searchQuery), [searchQuery]);

  const filteredCompleted = useMemo(() => {
    if (!q) return completedProjects;
    return completedProjects.filter((p) => normalize(p.name).includes(q));
  }, [completedProjects, q]);

  const filteredOngoing = useMemo(() => {
    if (!q) return ongoingProjects;
    return ongoingProjects.filter((p) => normalize(p.name).includes(q));
  }, [ongoingProjects, q]);

  if (loading && completedProjects.length === 0 && ongoingProjects.length === 0) {
    return (
      <div className="py-12">
        <div className="flex justify-center text-gray-500 dark:text-gray-400">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 mb-8 border-b border-gray-200 dark:border-gray-600">
        <button
          type="button"
          className={`project-page-tab px-4 py-2 md:px-6 md:py-3 text-sm md:text-base font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "ongoing"
              ? "active-tab border-[#E30A17] text-[#E30A17]"
              : "border-transparent text-[#262322] dark:text-gray-200 hover:text-[#E30A17]"
          }`}
          onClick={() => setActiveTab("ongoing")}
        >
          Devam Eden Projelerimiz
        </button>
        <button
          type="button"
          className={`project-page-tab px-4 py-2 md:px-6 md:py-3 text-sm md:text-base font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "completed"
              ? "active-tab border-[#E30A17] text-[#E30A17]"
              : "border-transparent text-[#262322] dark:text-gray-200 hover:text-[#E30A17]"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          Tamamlanan Projelerimiz
        </button>
      </div>

      <div className="flex justify-center mb-10 md:mb-12">
        <div className="w-full max-w-xl relative">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Proje ara..."
            className="w-full px-4 py-3 md:px-5 md:py-4 pl-11 md:pl-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 text-[#262322] placeholder-gray-400 dark:placeholder-gray-400 focus:border-[#E30A17] focus:outline-none transition-colors"
            aria-label="Proje ara"
          />
          <svg className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {activeTab === "ongoing" && (
        <div className="projects-panel">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6" id="ongoing-list">
            {filteredOngoing.map((project) => (
              <ProjectCard
                key={project.id}
                href={`${baseUrl}projeler/${project.id}`}
                image={project.image}
                name={project.name}
                location={project.location}
                searchName={project.name.toLowerCase()}
              />
            ))}
          </div>
          {(filteredOngoing.length === 0 && searchQuery) && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-4" id="ongoing-empty">
              Arama kriterine uygun devam eden proje bulunamadı.
            </p>
          )}
        </div>
      )}

      {activeTab === "completed" && (
        <div className="projects-panel">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6" id="completed-list">
            {filteredCompleted.map((project) => (
              <ProjectCard
                key={project.id}
                href={`${baseUrl}projeler/${project.id}`}
                image={project.image}
                name={project.name}
                location={project.location}
                searchName={project.name.toLowerCase()}
              />
            ))}
          </div>
          {(filteredCompleted.length === 0 && searchQuery) && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-4" id="completed-empty">
              Arama kriterine uygun tamamlanan proje bulunamadı.
            </p>
          )}
        </div>
      )}
    </>
  );
}
