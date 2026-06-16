import { useEffect, useMemo, useState } from "react";
import { BASE_API_URL } from "../api/constants";
import { getImageUrl } from "../api";

function buildBaseUrl() {
  return (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
}

function getProjectIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("id");
  if (fromQuery) return fromQuery;

  const parts = window.location.pathname.replace(/\/$/, "").split("/");
  const idx = parts.indexOf("projeler");
  if (idx >= 0) {
    const segment = parts[idx + 1];
    if (segment && segment !== "detay") return decodeURIComponent(segment);
  }
  return null;
}

function resolveMediaPath(m) {
  const raw = m?.mediaUrl ?? m?.MediaUrl;
  return typeof raw === "string" ? raw : "";
}

function resolveProjectMedias(project) {
  if (!project) return [];
  const raw = project.medias ?? project.Medias;
  return Array.isArray(raw) ? raw : [];
}

function resolveProjectImageUrl(project) {
  if (!project) return "";
  const raw = project.imageUrl ?? project.ImageUrl;
  return typeof raw === "string" ? raw : "";
}

function resolveMediaType(m) {
  const raw = m?.mediaType ?? m?.MediaType ?? "photo";
  return String(raw).toLowerCase();
}

function isVideoMedia(m) {
  return resolveMediaType(m) === "video";
}

function sortMedias(medias) {
  return [...medias].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function buildPhotoGalleryUrls(project, baseUrl) {
  const medias = resolveProjectMedias(project).filter((m) => !isVideoMedia(m));
  const coverMedia = medias.find((m) => m.isCover);
  const otherMedias = sortMedias(medias.filter((m) => !m.isCover));

  const galleryUrls = [];
  if (coverMedia) {
    const u = getImageUrl(resolveMediaPath(coverMedia));
    if (u) galleryUrls.push(u);
  }
  otherMedias.forEach((m) => {
    const url = getImageUrl(resolveMediaPath(m));
    if (url) galleryUrls.push(url);
  });
  if (galleryUrls.length === 0 && medias.length) {
    sortMedias(medias).forEach((m) => {
      const u = getImageUrl(resolveMediaPath(m));
      if (u) galleryUrls.push(u);
    });
  }

  const resolvedImageUrl = resolveProjectImageUrl(project);
  if (galleryUrls.length === 0 && resolvedImageUrl) {
    const u = getImageUrl(resolvedImageUrl);
    if (u) galleryUrls.push(u);
  }
  if (galleryUrls.length === 0) {
    galleryUrls.push(`${baseUrl}construction1.png`);
  }
  return galleryUrls;
}

function buildVideoUrls(project) {
  return sortMedias(resolveProjectMedias(project).filter(isVideoMedia))
    .map((m) => getImageUrl(resolveMediaPath(m)))
    .filter(Boolean);
}

function GalleryViewer({ images, projectName }) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const showImage = (index) => {
    const i = ((index % images.length) + images.length) % images.length;
    setCurrentIndex(i);
  };

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") showImage(currentIndex - 1);
      if (e.key === "ArrowRight") showImage(currentIndex + 1);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, currentIndex, images.length]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="mt-10 sm:mt-14 md:mt-20">
        <h2 className="text-[#262322] dark:text-gray-100 text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6">
          Proje Görselleri
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
          {images.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              className="relative aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E30A17] focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              onClick={() => {
                setCurrentIndex(i);
                setOpen(true);
              }}
              aria-label={`Görsel ${i + 1}'i aç`}
            >
              <img
                src={img}
                alt={`${projectName} - Görsel ${i + 1}`}
                width={400}
                height={300}
                className="w-full h-full object-cover pointer-events-none"
              />
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 p-3 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Proje görselleri"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <button
            type="button"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors touch-manipulation"
            aria-label="Kapat"
            onClick={() => setOpen(false)}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-4 w-full max-w-6xl flex-1 min-w-0">
            <button
              type="button"
              className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors touch-manipulation"
              aria-label="Önceki görsel"
              onClick={() => showImage(currentIndex - 1)}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1 flex items-center justify-center min-w-0 px-0 sm:px-1">
              <img
                src={images[currentIndex]}
                alt={`Görsel ${currentIndex + 1}`}
                className="max-h-[75vh] sm:max-h-[80vh] md:max-h-[85vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>
            <button
              type="button"
              className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors touch-manipulation"
              aria-label="Sonraki görsel"
              onClick={() => showImage(currentIndex + 1)}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <p className="mt-3 sm:mt-4 text-white/80 text-xs sm:text-sm md:text-base">
            {currentIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}

function ProjectVideos({ videos, projectName }) {
  if (videos.length === 0) return null;

  return (
    <div className="mt-10 sm:mt-14 md:mt-20">
      <h2 className="text-[#262322] dark:text-gray-100 text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6">
        Proje Videoları
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {videos.map((url, i) => (
          <div
            key={`${url}-${i}`}
            className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black shadow-lg"
          >
            <video
              src={url}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-contain"
              aria-label={`${projectName} - Video ${i + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProjeDetayDinamik({ baseUrl: baseUrlProp }) {
  const baseUrl = baseUrlProp || buildBaseUrl();
  const projelerHref = `${baseUrl}projeler`;
  const [state, setState] = useState({ status: "loading", project: null });

  useEffect(() => {
    const id = getProjectIdFromUrl();
    if (!id) {
      setState({ status: "missing", project: null });
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(
          `${BASE_API_URL}/Website/get-project/${encodeURIComponent(id)}`,
          { headers: { Accept: "application/json" } }
        );
        if (!res.ok) {
          if (!cancelled) setState({ status: res.status === 404 ? "notfound" : "error", project: null });
          return;
        }
        const project = await res.json();
        if (!cancelled) setState({ status: "ready", project });
      } catch (e) {
        console.error("Proje detay yüklenirken hata", e);
        if (!cancelled) setState({ status: "error", project: null });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const galleryUrls = useMemo(() => {
    if (state.status !== "ready" || !state.project) return [];
    return buildPhotoGalleryUrls(state.project, baseUrl);
  }, [state, baseUrl]);

  const videoUrls = useMemo(() => {
    if (state.status !== "ready" || !state.project) return [];
    return buildVideoUrls(state.project);
  }, [state]);

  if (state.status === "loading") {
    return (
      <div className="w-full min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
        <p className="text-[#525252] dark:text-gray-300">Yükleniyor…</p>
      </div>
    );
  }

  if (state.status === "missing" || state.status === "notfound" || state.status === "error") {
    const message =
      state.status === "missing"
        ? "Geçersiz bağlantı: proje bilgisi eksik."
        : state.status === "notfound"
          ? "Proje bulunamadı."
          : "Proje bilgisi yüklenemedi.";

    return (
      <div className="w-full min-h-screen bg-white dark:bg-gray-900">
        <section className="w-full pt-30 sm:pt-28 md:pt-42 pb-12 sm:pb-16 md:pb-24 px-4 sm:px-5 md:px-6">
          <div className="max-w-[1480px] mx-auto text-center">
            <p className="text-[#525252] dark:text-gray-400 text-lg mb-6">{message}</p>
            <a
              href={projelerHref}
              className="inline-flex items-center gap-2 rounded-full bg-[#E30A17] px-6 py-3 text-white font-medium hover:bg-[#c00914] transition-colors"
            >
              Projelere dön
            </a>
          </div>
        </section>
      </div>
    );
  }

  const project = state.project;
  const mainImage = galleryUrls[0];

  return (
    <div className="w-full min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <section className="w-full pt-30 sm:pt-28 md:pt-42 pb-12 sm:pb-16 md:pb-24 px-4 sm:px-5 md:px-6">
        <div className="max-w-[1480px] mx-auto">
          <a
            href={projelerHref}
            className="inline-flex items-center gap-2 text-[#E30A17] text-sm sm:text-base font-medium hover:underline mb-6 sm:mb-8 dark:hover:text-[#ff4d4d]"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Projelere dön
          </a>

          <div className="flex flex-col lg:flex-row lg:gap-8 xl:gap-12 gap-6">
            <div className="w-full lg:max-w-md xl:max-w-lg shrink-0">
              <div className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={project.name}
                    width={900}
                    height={675}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
                )}
              </div>
            </div>

            <div className="flex flex-col min-w-0">
              <h1 className="text-[#262322] dark:text-gray-100 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight mb-3 sm:mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#E30A17]/10 dark:bg-[#E30A17]/20 text-[#E30A17] shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </span>
                <span>{project.name}</span>
              </h1>

              {(project.shortAddress || project.address) && (
                <p className="text-[#525252] dark:text-gray-300 text-sm sm:text-base md:text-lg flex items-center gap-2 mb-4 sm:mb-6">
                  <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 dark:bg-gray-700 text-[#262322] dark:text-gray-200 shrink-0">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <span className="break-words">{project.shortAddress || project.address}</span>
                </p>
              )}

              {(project.blockCount || project.flatCount) && (
                <div className="flex flex-wrap gap-4 mb-4 sm:mb-6">
                  {project.blockCount && (
                    <span className="inline-flex items-center gap-2 text-[#525252] dark:text-gray-300 text-sm sm:text-base">
                      <span className="font-semibold text-[#262322] dark:text-gray-100">Blok:</span>
                      {project.blockCount}
                    </span>
                  )}
                  {project.flatCount && (
                    <span className="inline-flex items-center gap-2 text-[#525252] dark:text-gray-300 text-sm sm:text-base">
                      <span className="font-semibold text-[#262322] dark:text-gray-100">Daire:</span>
                      {project.flatCount}
                    </span>
                  )}
                </div>
              )}

              {project.description && (
                <p className="text-[#404040] dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                  {project.description}
                </p>
              )}

              {project.mapsUrl && (
                <a
                  href={project.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-6 text-[#E30A17] font-medium hover:underline"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  Haritada göster
                </a>
              )}
            </div>
          </div>

          <GalleryViewer images={galleryUrls} projectName={project.name} />
          <ProjectVideos videos={videoUrls} projectName={project.name} />
        </div>
      </section>
    </div>
  );
}
