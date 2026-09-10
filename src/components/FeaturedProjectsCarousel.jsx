import { useEffect, useRef, useState } from "react";
import { BASE_API_URL } from "../api/constants";
import { getImageUrl } from "../api";
import { ArrowRightIcon } from "./icons";

function buildBaseUrl() {
  return (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
}

function mapFeaturedProject(p, baseUrl) {
  return {
    id: p.id,
    name: p.name || "",
    location: p.shortAddress || "",
    image: getImageUrl(p.imageUrl) || `${baseUrl}new.png`,
    featuredOrder: Number(p.featuredOrder ?? 0),
  };
}

function getCircularOffset(index, activeIndex, count) {
  if (count <= 1) return 0;
  let offset = index - activeIndex;
  const half = Math.floor(count / 2);
  if (offset > half) offset -= count;
  if (offset < -half) offset += count;
  return offset;
}

function LocationPin({ className = "w-3.5 h-3.5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
    </svg>
  );
}

function ProjectSlideCard({ project, href, isActive, offset, style }) {
  const abs = Math.abs(offset);
  const isNear = abs === 1;
  const isFar = abs === 2;
  return (
    <a
      href={href}
      style={style}
      tabIndex={isActive ? 0 : -1}
      className={`featured-slide group absolute top-1/2 left-1/2 block overflow-hidden rounded-2xl shadow-[0_18px_40px_rgba(0,0,0,0.22)] will-change-transform ${
        isActive
          ? "pointer-events-auto"
          : isNear
            ? "pointer-events-none max-sm:!opacity-0 sm:pointer-events-auto"
            : isFar
              ? "pointer-events-none max-md:!opacity-0 md:pointer-events-auto"
              : "pointer-events-none"
      }`}
      aria-current={isActive ? "true" : undefined}
      aria-hidden={!isActive}
    >
      <img
        src={project.image}
        alt={project.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
        draggable={false}
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6">
        <span
          className={`mb-3 block h-0.5 w-10 rounded-full bg-[#E30A17] transition-all duration-500 ease-out ${
            isActive
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-1"
          }`}
          aria-hidden="true"
        />
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3
              className={`font-semibold text-white leading-tight drop-shadow-sm transition-[font-size] duration-500 ease-out ${
                isActive
                  ? "text-xl sm:text-2xl md:text-3xl"
                  : "text-base sm:text-lg md:text-xl"
              }`}
            >
              {project.name}
            </h3>
            {project.location && (
              <p className="mt-2 flex items-center gap-1.5 text-sm sm:text-base text-white/95">
                <LocationPin className="w-3.5 h-3.5 text-[#E30A17] shrink-0" />
                <span className="truncate">{project.location}</span>
              </p>
            )}
          </div>

          <span
            className={`inline-flex shrink-0 items-center justify-center rounded-full transition-all duration-500 ease-out ${
              isActive
                ? "h-11 w-11 sm:h-12 sm:w-12 bg-[#E30A17] text-white shadow-lg shadow-black/25 scale-100"
                : "h-9 w-9 sm:h-10 sm:w-10 border border-white/70 bg-black/35 text-white backdrop-blur-sm scale-95"
            }`}
            aria-hidden="true"
          >
            <span className="[&_svg]:w-[0.95em] [&_svg]:h-[0.95em]">
              <ArrowRightIcon color="#FFFFFF" />
            </span>
          </span>
        </div>
      </div>
    </a>
  );
}

export default function FeaturedProjectsCarousel({ baseUrl: baseUrlProp }) {
  const baseUrl = baseUrlProp || buildBaseUrl();
  const [projects, setProjects] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const animTimeoutRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${BASE_API_URL}/Website/get-projects`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !Array.isArray(data)) return;

        const featured = data
          .filter((p) => p.isFeatured === true)
          .sort(
            (a, b) =>
              Number(a.featuredOrder ?? 0) - Number(b.featuredOrder ?? 0),
          )
          .map((p) => mapFeaturedProject(p, baseUrl));

        setProjects(featured);
        setActiveIndex(0);
      } catch (e) {
        console.error("Error while fetching featured projects", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [baseUrl]);

  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, []);

  const count = projects.length;
  const durationMs = reduceMotion ? 0 : 650;

  const changeSlide = (nextIndex) => {
    if (count < 2 || nextIndex === activeIndex) return;
    if (isAnimating && !reduceMotion) return;

    setIsAnimating(true);
    setActiveIndex(nextIndex);

    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    animTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, durationMs);
  };

  const goPrev = () => changeSlide((activeIndex - 1 + count) % count);
  const goNext = () => changeSlide((activeIndex + 1) % count);

  const getSlideStyle = (offset) => {
    const abs = Math.abs(offset);
    const isActive = offset === 0;
    const easing = `cubic-bezier(0.22, 1, 0.36, 1)`;
    const transition = reduceMotion
      ? "none"
      : [
          `transform ${durationMs}ms ${easing}`,
          `opacity ${durationMs}ms ease`,
          `width ${durationMs}ms ${easing}`,
          `height ${durationMs}ms ${easing}`,
          `filter ${durationMs}ms ease`,
        ].join(", ");

    // 5 kart: -2,-1,0,1,2 — full genişlik, az boşluk / hafif overlap
    if (isActive) {
      return {
        width: "min(46vw, 34rem)",
        height: "clamp(280px, 42vw, 440px)",
        opacity: 1,
        zIndex: 40,
        filter: "none",
        transform: "translate3d(-50%, -50%, 0) scale(1)",
        transition,
      };
    }

    if (abs === 1) {
      const shift = offset < 0 ? "-18vw" : "18vw";
      return {
        width: "min(34vw, 26rem)",
        height: "clamp(240px, 34vw, 360px)",
        opacity: 1,
        zIndex: 30,
        filter: "brightness(0.92)",
        transform: `translate3d(calc(-50% + ${shift}), -50%, 0) scale(0.92)`,
        transition,
      };
    }

    if (abs === 2) {
      const shift = offset < 0 ? "-32vw" : "32vw";
      return {
        width: "min(28vw, 22rem)",
        height: "clamp(210px, 28vw, 300px)",
        opacity: 1,
        zIndex: 20,
        filter: "brightness(0.82)",
        transform: `translate3d(calc(-50% + ${shift}), -50%, 0) scale(0.82)`,
        transition,
      };
    }

    const farShift = offset < 0 ? "-48vw" : "48vw";
    return {
      width: "min(24vw, 18rem)",
      height: "clamp(180px, 24vw, 260px)",
      opacity: 0,
      zIndex: 10,
      filter: "brightness(0.75)",
      transform: `translate3d(calc(-50% + ${farShift}), -50%, 0) scale(0.7)`,
      transition,
    };
  };

  if (loading) {
    return (
      <section className="relative w-full overflow-hidden bg-white dark:bg-gray-900 pt-28 md:pt-36 lg:pt-40 pb-12 md:pb-16 px-4">
        <div className="mx-auto max-w-[1200px] animate-pulse space-y-6 text-center">
          <div className="mx-auto h-4 w-48 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mx-auto h-10 w-80 max-w-full rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mx-auto h-[360px] w-full max-w-3xl rounded-2xl bg-gray-200 dark:bg-gray-800" />
        </div>
      </section>
    );
  }

  if (count === 0) return null;

  return (
    <section
      className="relative w-full overflow-hidden bg-white dark:bg-gray-900 pt-28 md:pt-36 lg:pt-40 pb-12 md:pb-16 lg:pb-20"
      aria-label="Öne çıkan projeler"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-[0.35] dark:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 0%, rgba(227,10,23,0.08), transparent 55%), radial-gradient(ellipse at 80% 10%, rgba(0,0,0,0.04), transparent 50%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full px-2 sm:px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center mb-8 mt-10 md:mb-12">
          <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 font-medium mb-3">
            Daha İyi Yaşam Alanları
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#262322] dark:text-gray-100 leading-tight">
            Güçlü Yapılar,{" "}
            <span className="text-[#E30A17]">Daha Güzel Yarınlar</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
            Modern mimari, kaliteli işçilik ve sürdürülebilir çözümlerle yaşam
            alanlarına değer katıyoruz.
          </p>
        </div>

        <div className="relative flex items-center justify-center min-h-[320px] sm:min-h-[380px] md:min-h-[440px] lg:min-h-[480px] w-full overflow-x-clip">
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                disabled={isAnimating && !reduceMotion}
                className="absolute left-1 sm:left-3 md:left-4 z-50 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-gray-500 shadow-md border border-gray-100 hover:text-[#E30A17] hover:border-[#E30A17]/30 transition-colors disabled:opacity-60"
                aria-label="Önceki proje"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={isAnimating && !reduceMotion}
                className="absolute right-1 sm:right-3 md:right-4 z-50 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-gray-500 shadow-md border border-gray-100 hover:text-[#E30A17] hover:border-[#E30A17]/30 transition-colors disabled:opacity-60"
                aria-label="Sonraki proje"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          <div className="relative w-full h-[320px] sm:h-[380px] md:h-[440px] lg:h-[480px]">
            {projects.map((project, index) => {
              const offset = getCircularOffset(index, activeIndex, count);
              return (
                <ProjectSlideCard
                  key={project.id}
                  project={project}
                  href={`${baseUrl}projeler/detay?id=${encodeURIComponent(project.id)}`}
                  isActive={offset === 0}
                  offset={offset}
                  style={getSlideStyle(offset)}
                />
              );
            })}
          </div>
        </div>

        {count > 1 && (
          <div
            className="mt-6 md:mt-8 flex items-center justify-center gap-2"
            role="tablist"
            aria-label="Öne çıkan proje sayfaları"
          >
            {projects.map((p, i) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Proje ${i + 1}: ${p.name}`}
                onClick={() => changeSlide(i)}
                disabled={isAnimating && !reduceMotion}
                className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
                  i === activeIndex
                    ? "w-6 bg-[#E30A17]"
                    : "w-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
