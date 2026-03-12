import { useEffect, useState } from "react";
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

function ProjectCard({ href, image, name, location, className }) {
  return (
    <a
      href={href}
      className={`project-card relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg group border border-gray-100 dark:border-gray-700 block transition-colors duration-200 ${className}`}
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
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
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

export default function ProjectsSectionClient({ baseUrl: baseUrlProp }) {
  const baseUrl = baseUrlProp || buildBaseUrl();
  const [completedProjects, setCompletedProjects] = useState([]);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("completed");
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

  if (loading && completedProjects.length === 0 && ongoingProjects.length === 0) {
    return (
      <div className="relative py-8">
        <div className="flex justify-center text-gray-500 dark:text-gray-400">Yükleniyor...</div>
      </div>
    );
  }

  const cardClass = "shrink-0 w-[260px] sm:w-[320px] md:w-[360px] lg:w-[380px] xl:w-[400px] snap-start";

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-4 mb-8 md:mb-12 border-b border-gray-200 dark:border-gray-600">
        <button
          type="button"
          className={`project-tab px-4 py-2 md:px-6 md:py-3 text-sm md:text-base font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "completed"
              ? "active-tab border-[#E30A17] text-[#E30A17]"
              : "border-transparent text-[#262322] dark:text-gray-200 hover:text-[#E30A17]"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          Tamamlanan Projelerimiz
        </button>
        <button
          type="button"
          className={`project-tab px-4 py-2 md:px-6 md:py-3 text-sm md:text-base font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "ongoing"
              ? "active-tab border-[#E30A17] text-[#E30A17]"
              : "border-transparent text-[#262322] dark:text-gray-200 hover:text-[#E30A17]"
          }`}
          onClick={() => setActiveTab("ongoing")}
        >
          Devam Eden Projelerimiz
        </button>
      </div>

      {activeTab === "completed" && (
        <div className="projects-scroll flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory py-2 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {completedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              href={`${baseUrl}projeler/${project.id}`}
              image={project.image}
              name={project.name}
              location={project.location}
              className={cardClass}
            />
          ))}
        </div>
      )}

      {activeTab === "ongoing" && (
        <div className="projects-scroll flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory py-2 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {ongoingProjects.map((project) => (
            <ProjectCard
              key={project.id}
              href={`${baseUrl}projeler/${project.id}`}
              image={project.image}
              name={project.name}
              location={project.location}
              className={cardClass}
            />
          ))}
        </div>
      )}
    </div>
  );
}
