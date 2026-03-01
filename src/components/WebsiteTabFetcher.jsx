import { useEffect, useState, useRef } from "react";
import { useGetWebsiteTabQuery } from "../api/baseApi";
import { getImageUrl } from "../api";
import StoreProvider from "./StoreProvider";
import {
  ArrowRightIcon,
  LocationIcon,
  MailIcon,
  PhoneIcon,
  KepIcon,
  CheckmarkIcon,
} from "./icons";
import StatIcon from "./StatIcon.jsx";

function TabFetcher({ code }) {
  const { data, isLoading, error, isSuccess } = useGetWebsiteTabQuery(code);

  useEffect(() => {
    if (isLoading) {
      console.log(`[WebsiteTab] ${code}: yükleniyor...`);
      return;
    }
    if (error) {
      console.log(`[WebsiteTab] ${code}: hata`, error);
      return;
    }
    if (isSuccess && data !== undefined) {
      console.log(`[WebsiteTab] ${code}:`, data);
    }
  }, [code, data, isLoading, error, isSuccess]);

  return null;
}

/** API tab verisinden section ve item code ile alan yardımcı. Veri: { name, code, sections: [...] } */
function getSectionByCode(data, code) {
  const sections = Array.isArray(data) ? data : data?.sections;
  if (!Array.isArray(sections)) return null;
  return sections.find((s) => s.code === code) || null;
}
function getItemByCode(section, code) {
  if (!section?.items || !Array.isArray(section.items)) return "";
  const item = section.items.find((i) => i.code === code);
  return item?.content ?? "";
}

function HizmetlerHeroSection() {
  const { data, isLoading, error } = useGetWebsiteTabQuery("hizmetler");
  const hero = getSectionByCode(data, "hero");
  const title = getItemByCode(hero, "title");
  const subTitle = getItemByCode(hero, "sub-title");
  const resimContent = getItemByCode(hero, "resim");
  const heroImageSrc = resimContent ? getImageUrl(resimContent) : "";

  if (isLoading) {
    return (
      <section className="w-full pt-24 sm:pt-28 md:pt-48 pb-16 md:pb-20 px-4 md:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="animate-pulse flex flex-col lg:flex-row gap-10 lg:gap-14">
            <div className="flex-1 h-32 bg-gray-200 rounded-xl" />
            <div className="flex-1 h-64 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="w-full pt-24 sm:pt-28 md:pt-48 pb-16 md:pb-20 px-4 md:px-6">
        <div className="max-w-[1200px] mx-auto text-[#525252]">
          Hero içeriği yüklenemedi.
        </div>
      </section>
    );
  }

  return (
    <section className="w-full pt-24 sm:pt-28 md:pt-48 pb-16 md:pb-20 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-14">
          <div className="flex-1 order-2 lg:order-1">
            <h1 className="text-[#262322] text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-5 md:mb-6">
              {title}
            </h1>
            <p className="text-[#525252] text-base md:text-lg leading-relaxed mb-8 md:mb-10 max-w-xl">
              {subTitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#hizmetler-listesi"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E30A17] px-6 py-3.5 text-base font-medium text-white hover:bg-[#c00914] transition-colors w-fit"
              >
                Hizmetleri Keşfedin
                <ArrowRightIcon color="#fff" />
              </a>
              <button
                type="button"
                id="hizmetler-teklif-btn"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#E30A17] px-6 py-3.5 text-base font-medium text-[#E30A17] hover:bg-[#E30A17]/5 transition-colors w-fit"
              >
                Hemen Teklif Al
              </button>
            </div>
          </div>
          <div className="flex-1 order-1 lg:order-2 shrink-0 max-w-lg lg:max-w-md xl:max-w-lg mx-auto lg:mx-0">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gray-100">
              {heroImageSrc ? (
                <img
                  src={heroImageSrc}
                  alt="Hizmetlerimiz"
                  className="w-full h-full object-cover"
                  width={560}
                  height={420}
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HizmetlerWithData() {
  return (
    <StoreProvider>
      <TabFetcher code="hizmetler" />
      <HizmetlerHeroSection />
    </StoreProvider>
  );
}

/** options/maddeler JSON string ise parse eder: "[\"A\",\"B\"]" -> ["A","B"] */
function parseOptionsList(content) {
  if (!content) return [];
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
  } catch {
    return [content];
  }
}

/** Bina yönetimi hero: API'den main section (title, description, image, sub-image-1/2/3, options) */
function BinaYonetimiHeroSection({ baseUrl = "/" }) {
  const { data, isLoading, error } = useGetWebsiteTabQuery("bina-yonetimi");
  const main = getSectionByCode(data, "main");
  const title =
    getItemByCode(main, "title") ||
    "Apartmanınızın & Sitenizin Yönetimi Bize Emanet";
  const description = getItemByCode(main, "description") || "";
  const imageContent = getItemByCode(main, "image");
  const anaGorselSrc = imageContent ? getImageUrl(imageContent) : "";
  const sub1 = getItemByCode(main, "sub-image-1");
  const sub2 = getItemByCode(main, "sub-image-2");
  const sub3 = getItemByCode(main, "sub-image-3");
  const subImages = [sub1, sub2, sub3].filter(Boolean).map(getImageUrl);
  const optionsContent = getItemByCode(main, "options");
  const options = parseOptionsList(optionsContent);

  const [centerIndex, setCenterIndex] = useState(0);

  useEffect(() => {
    if (subImages.length !== 3) return;
    const t = setInterval(() => setCenterIndex((i) => (i + 1) % 3), 4000);
    return () => clearInterval(t);
  }, [subImages.length]);

  if (isLoading) {
    return (
      <section className="w-full bg-white pt-24 sm:pt-32 md:pt-36 lg:pt-44 pb-12 md:pb-20 px-4 md:px-6 mt-24">
        <div className="max-w-[1440px] mx-auto animate-pulse">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
            <div className="w-full lg:w-[50%] h-64 bg-gray-200 rounded-2xl" />
            <div className="flex-1 space-y-4">
              <div className="h-10 bg-gray-200 rounded w-3/4" />
              <div className="h-24 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        </div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="w-full bg-white pt-24 sm:pt-32 md:pt-36 lg:pt-44 pb-12 md:pb-20 px-4 md:px-6 mt-24">
        <div className="max-w-[1440px] mx-auto text-[#525252]">
          Bina yönetimi içeriği yüklenemedi.
        </div>
      </section>
    );
  }

  const getPosition = (index) => {
    const rel = (index - centerIndex + 3) % 3;
    if (rel === 0) return "left";
    if (rel === 1) return "center";
    return "right";
  };

  return (
    <section className="w-full bg-white pt-24 sm:pt-32 md:pt-36 lg:pt-44 pb-12 md:pb-20 px-4 md:px-6 mt-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row items-stretch gap-10 lg:gap-12">
          <div className="w-full lg:w-[50%] shrink-0 relative pb-[42%] md:pb-[38%]">
            <div className="absolute inset-0 flex flex-col">
              <div className="rounded-2xl overflow-hidden shadow-lg flex-1 min-h-0">
                {anaGorselSrc ? (
                  <img
                    src={anaGorselSrc}
                    alt="Bina yönetimi - Toplantı ve yönetim"
                    className="w-full h-full min-h-[200px] object-cover"
                    loading="eager"
                  />
                ) : (
                  <div className="w-full h-full min-h-[200px] bg-gray-200" />
                )}
              </div>
              {subImages.length >= 3 && (
                <div className="absolute bottom-0 left-0 right-0 h-[38%] md:h-[42%] flex items-end justify-center gap-0 pointer-events-none">
                  {subImages.map((src, index) => {
                    const pos = getPosition(index);
                    const isCenter = pos === "center";
                    const style =
                      pos === "left"
                        ? { left: 0, width: "26%", height: "85%", zIndex: 1 }
                        : isCenter
                          ? {
                              left: "28%",
                              width: "44%",
                              height: "100%",
                              zIndex: 10,
                            }
                          : {
                              left: "74%",
                              width: "26%",
                              height: "85%",
                              zIndex: 1,
                            };
                    return (
                      <div
                        key={index}
                        className={`absolute bottom-0 rounded-xl overflow-hidden border-2 shadow-lg pointer-events-auto transition-all duration-300 ${
                          isCenter
                            ? "border-[#E30A17] ring-2 ring-[#E30A17]/30"
                            : "border-gray-200"
                        }`}
                        style={style}
                      >
                        <img
                          src={src}
                          alt={`Bina yönetimi ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col justify-center">
            <h1 className="text-[#262322] text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              {title}
            </h1>
            <p className="text-[#585858] text-base md:text-lg leading-relaxed mb-8 whitespace-pre-line">
              {description}
            </p>
            <div className="space-y-4 mb-10">
              {options.map((service) => (
                <div key={service} className="flex items-start gap-3">
                  <div className="mt-1 shrink-0">
                    <div className="w-6 h-6 rounded-full bg-[#E30A17] flex items-center justify-center">
                      <CheckmarkIcon />
                    </div>
                  </div>
                  <p className="text-[#262322] text-base md:text-lg font-medium">
                    {service}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-8 sm:gap-16 pb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
                  <img
                    src={`${baseUrl}nurdogan-profile.png`}
                    alt="Nurdoğan Babadağ"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-[#262322] text-lg font-bold mb-1">
                    Nurdoğan Babadağ
                  </p>
                  <p className="text-[#585858] text-sm">Kurucu, CEO</p>
                </div>
              </div>
              <div className="w-24 h-24 rounded-full shrink-0">
                <img
                  src={`${baseUrl}nurdogan-signature.png`}
                  alt="İmza"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <button
              type="button"
              id="bina-yonetimi-teklif-btn"
              className="inline-flex items-center gap-3 rounded-full bg-[#E30A17] pl-2 pr-8 py-3 text-base text-white hover:bg-[#c00914] transition-colors w-fit cursor-pointer border-0"
              onClick={() => {
                const modal = document.getElementById("teklif-form-modal");
                if (modal) {
                  modal.classList.remove("hidden");
                  modal.classList.add("flex");
                  modal.setAttribute("aria-hidden", "false");
                  document.body.style.overflow = "hidden";
                }
              }}
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                <ArrowRightIcon color="#E30A17" />
              </div>
              Apartman ve Site Yönetimi İçin Teklif Alın
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BinaYonetimiWithData({ baseUrl = "/" }) {
  return (
    <StoreProvider>
      <TabFetcher code="bina-yonetimi" />
      <BinaYonetimiHeroSection baseUrl={baseUrl} />
    </StoreProvider>
  );
}

/** Anasayfa landing: API'den main tab, section landing-anasayfa (başlıklar, açıklamalar, görseller) */
function LandingContent({ baseUrl = "/" }) {
  const { data, isLoading, error } = useGetWebsiteTabQuery("main");
  const section = getSectionByCode(data, "landing-anasayfa");
  const leftTitle =
    getItemByCode(section, "landing-left-title") ||
    "Kentsel Dönüşüm Hizmetleri";
  const rightTitle =
    getItemByCode(section, "landing-right-title") ||
    "Bina Site Yönetim Hizmeti";
  const leftDesc =
    String(getItemByCode(section, "landing-left-description") || "").trim() ||
    "Riskli yapı tespitinden yenileme projelerine kadar kentsel dönüşüm süreçlerinizin tüm aşamalarında yanınızdayız.";
  const rightDesc =
    String(getItemByCode(section, "landing-right-description") || "").trim() ||
    "Profesyonel bina ve site yönetimi ile güvenli, düzenli ve değerini koruyan yaşam alanları sunuyoruz.";
  const leftImageContent = getItemByCode(section, "landing-left-image");
  const rightImageContent = getItemByCode(section, "landing-right-image");
  const leftImageSrc = leftImageContent
    ? getImageUrl(leftImageContent)
    : `${baseUrl}nurdoganlanding1.jpeg`;
  const rightImageSrc = rightImageContent
    ? getImageUrl(rightImageContent)
    : `${baseUrl}nurdoganlanding3.jpeg`;
  const leftHref = `${baseUrl}hizmetler`;
  const rightHref = `${baseUrl}bina-yonetimi`;

  if (isLoading) {
    return (
      <section
        className="split-landing relative flex w-full min-h-[calc(100vh-5rem)] overflow-hidden"
        aria-label="Hizmet seçimi"
      >
        <div className="flex-1 flex items-center justify-center bg-gray-200 animate-pulse">
          <div className="h-12 w-64 bg-gray-300 rounded" />
        </div>
        <div className="flex-1 flex items-center justify-center bg-gray-300 animate-pulse">
          <div className="h-12 w-64 bg-gray-400 rounded" />
        </div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="relative flex w-full min-h-[200px] items-center justify-center bg-gray-100 text-[#525252] px-4">
        Landing içeriği yüklenemedi.
      </section>
    );
  }

  return (
    <section
      className="split-landing relative flex w-full min-h-[calc(100vh-5rem)] overflow-hidden"
      id="hero-slider"
      aria-label="Hizmet seçimi"
    >
      <a
        href={leftHref}
        className="panel panel-left relative flex-1 flex items-center justify-center min-w-0 overflow-hidden transition-all duration-[800ms] ease-out cursor-pointer group"
      >
        <div className="absolute inset-0 z-0">
          <img
            src={leftImageSrc}
            alt="Kentsel dönüşüm"
            className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
        <div className="relative z-20 flex flex-col items-center justify-center gap-3 sm:gap-4 px-4 text-center">
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-wide drop-shadow-lg">
            {leftTitle}
          </h2>
          <p className="panel-desc text-white text-lg sm:text-xl md:text-2xl max-w-2xl transition-all duration-500 ease-out drop-shadow-md">
            {leftDesc}
          </p>
        </div>
      </a>
      <div
        className="center-line absolute top-0 bottom-0 w-1 sm:w-1.5 bg-white z-30 pointer-events-none transition-opacity duration-300 shadow-[0_0_16px_rgba(255,255,255,0.5)]"
        style={{ left: "50%", transform: "translateX(-50%)" }}
        aria-hidden="true"
      />
      <a
        href={rightHref}
        className="panel panel-right relative flex-1 flex items-center justify-center min-w-0 overflow-hidden transition-all duration-500 ease-out cursor-pointer group"
      >
        <div className="absolute inset-0 z-0">
          <img
            src={rightImageSrc}
            alt="Bina site yönetimi"
            className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
        <div className="relative z-20 flex flex-col items-center justify-center gap-3 sm:gap-4 px-4 text-center">
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-wide drop-shadow-lg">
            {rightTitle}
          </h2>
          <p className="panel-desc text-white text-lg sm:text-xl md:text-2xl max-w-2xl transition-all duration-500 ease-out drop-shadow-md">
            {rightDesc}
          </p>
        </div>
      </a>
    </section>
  );
}

/** YouTube video URL veya ID'den embed src üretir */
function getYoutubeEmbedSrc(content) {
  if (!content || typeof content !== "string")
    return "https://www.youtube.com/embed/YT9AUXiJTV4?rel=0";
  const s = content.trim();
  if (/^[a-zA-Z0-9_-]{10,12}$/.test(s))
    return `https://www.youtube.com/embed/${s}?rel=0`;
  if (s.includes("youtube.com/embed/"))
    return s.includes("?") ? s : `${s}?rel=0`;
  if (s.includes("youtube.com/watch?v=")) {
    const m = s.match(/[?&]v=([^&]+)/);
    return m
      ? `https://www.youtube.com/embed/${m[1]}?rel=0`
      : "https://www.youtube.com/embed/YT9AUXiJTV4?rel=0";
  }
  return "https://www.youtube.com/embed/YT9AUXiJTV4?rel=0";
}

const STAT_LABELS = [
  "Yıllık İnşaat Deneyimi",
  "Yıllık Kentsel Dönüşüm Deneyimi",
  "Devam Eden Proje",
  "Tamamlanan Proje",
];
const STAT_ICONS = ["building", "kentsel-donusum", "construction", "document"];
const STAT_PLUS = [false, false, true, true]; // 54+, 342+

/** Anasayfa Kentsel Dönüşüm Tanıtım: API'den main tab, section kentsel-donusum-tanitim */
function KentselDonusumTanitimContent({ baseUrl = "/" }) {
  const { data, isLoading, error } = useGetWebsiteTabQuery("main");
  const section = getSectionByCode(data, "kentsel-donusum-tanitim");
  const title =
    getItemByCode(section, "kentsel-donusum-tanitim-title") ||
    "Kentsel Dönüşüme Yön Veren Öncü Kuruluş";
  const description =
    getItemByCode(section, "kentsel-donusum-tanitim-description") ||
    "2012 yılından bu yana danışanlarımızı güvenli ve en avantajlı şekilde yeni binalarına kavuşturuyoruz.";
  const videoContent = getItemByCode(section, "kentsel-donusum-video-url");
  const videoSrc = getYoutubeEmbedSrc(videoContent);
  const numYillikInsaat =
    getItemByCode(section, "kentsel-donusum-tanitim-yillik-insaat") || "38";
  const numYillikDonusum =
    getItemByCode(section, "kentsel-donusum-tanitim-yillik-donusum") || "14";
  const numDevam =
    getItemByCode(section, "kentsel-donusum-tanitim-devam") || "54";
  const numTamamlanan =
    getItemByCode(section, "kentsel-donusum-tanitim-tamamlanan") || "342";
  const statNumbers = [
    numYillikInsaat,
    numYillikDonusum,
    numDevam,
    numTamamlanan,
  ];
  const statsContainerRef = useRef(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = statsContainerRef.current;
    if (!el || animated) return;
    const statItems = el.querySelectorAll(".stat-item");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setAnimated(true);
          statItems.forEach((statItem, idx) => {
            const numEl = statItem.querySelector(".stat-number");
            if (!numEl) return;
            const target = parseInt(
              statNumbers[idx]?.replace(/\D/g, "") || "0",
              10,
            );
            const hasPlus = STAT_PLUS[idx];
            let start = 0;
            const startTime = performance.now();
            const duration = 2000;
            function update(currentTime) {
              const progress = Math.min(
                (currentTime - startTime) / duration,
                1,
              );
              const easeOut = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(start + (target - start) * easeOut);
              numEl.textContent = current + (hasPlus ? "+" : "");
              if (progress < 1) requestAnimationFrame(update);
              else {
                numEl.textContent = target + (hasPlus ? "+" : "");
                const iconWrapper =
                  statItem.querySelector(".stat-icon-wrapper");
                if (iconWrapper) {
                  iconWrapper.classList.remove("opacity-0", "scale-75");
                  iconWrapper.classList.add("opacity-100", "scale-100");
                }
              }
            }
            requestAnimationFrame(update);
          });
          observer.disconnect();
        });
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animated, statNumbers]);

  if (isLoading) {
    return (
      <section className="w-full py-20 px-6 relative bg-gray-50">
        <div className="max-w-7xl mx-auto animate-pulse flex flex-col lg:flex-row gap-8 mb-20">
          <div className="w-full lg:w-1/2 h-64 bg-gray-200 rounded-2xl" />
          <div className="flex-1 h-32 bg-gray-200 rounded" />
        </div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="w-full py-20 px-6 relative bg-gray-50">
        <div className="max-w-7xl mx-auto text-[#525252]">
          Kentsel dönüşüm tanıtım içeriği yüklenemedi.
        </div>
      </section>
    );
  }

  return (
    <section
      className="w-full py-20 px-6 relative bg-gray-50 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/scetchbg.png')" }}
    >
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, rgba(249, 250, 251, 1) 50%)",
        }}
        aria-hidden="true"
      />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 mb-20">
          <div className="w-full lg:w-1/2 lg:max-w-xl lg:shrink-0 flex flex-col gap-4 order-2 lg:order-1">
            <div className="relative w-full aspect-video min-h-[280px] rounded-2xl overflow-hidden bg-black/5">
              <iframe
                src={videoSrc}
                title="YouTube video"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <a
              href={`${baseUrl}nurdogan.pdf`}
              download="nurdogan.pdf"
              className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-[#E30A17] px-6 py-3 text-base font-medium text-white hover:bg-[#e30a18df] transition"
            >
              <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#E30A17"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </span>
              Kentsel Dönüşüm Tanıtım PDF
            </a>
          </div>
          <div className="w-full lg:flex-1 flex flex-col justify-start text-left order-1 lg:order-2">
            <p className="inline-block text-[#E30A17] text-sm sm:text-base md:text-4xl font-bold mb-4 tracking-wider uppercase bg-[#E30A17]/15 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl">
              2012&apos;DEN GÜNÜMÜZE
            </p>
            <h2 className="text-[#262322] text-2xl md:text-5xl font-semibold mb-6 leading-tight">
              {title}
            </h2>
            <p className="text-[#585858] text-base md:text-lg leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
          id="stats-container"
          ref={statsContainerRef}
        >
          {statNumbers.map((num, index) => (
            <div
              key={index}
              className={`${index !== 0 ? "border-l border-[#DFDEDC]" : ""} text-center stat-item flex flex-col items-center`}
            >
              <div className="stat-icon-wrapper opacity-0 scale-75 transition-all duration-500 ease-out">
                <StatIcon type={STAT_ICONS[index]} />
              </div>
              <div className="text-[#262322] text-5xl md:text-6xl font-semibold mb-2 stat-number">
                0{STAT_PLUS[index] ? "+" : ""}
              </div>
              <div className="text-[#262322] text-sm md:text-base">
                {STAT_LABELS[index]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const HAKKIMIZDA_DEFAULT_TEXT =
  "İnşaat sektöründe 38 yılı aşkın sürede oluşan tecrübesini, 2012 yılından buyana kentsel dönüşüm alanında uygulayarak 300 adedi aşkın binanın kentsel dönüşümünü başarıyla tamamlayan ve MEKA KENTSEL DÖNÜŞÜM PROJE YÖNETİMİ VE DANIŞMANLIK LTD. ŞİRKETİNİN sahibi olan NURDOĞAN BABADAĞ, bu alanda ilk olduğu gibi bundan sonra da konusunda yüksek tecrübeye sahip 3 avukat, 3 inşaat mühendisi, 2 mimar, 1 iç mimar, 1 elektrik mühendisi ve diğer yardımcı idari personelden oluşan toplam 16 kişilik uzman kadrosuyla kentsel dönüşüme ihtiyaç duyan bina maliklerine sürecin başından sonuna kadar tam kapsamlı olarak hizmet verilmesinde öncü kuruluş olmaya devam edecektir. Özellikle Türkiye'nin kalbi niteliğindeki İstanbul'un Kadıköy ilçesinde yoğun kentsel dönüşüm faaliyetleri ile bilinen NURDOĞAN BABADAĞ, yine kentsel dönüşüm ihtiyacının en çok görüldüğü İstanbul'un Etiler, Şişli, Beşiktaş ve Küçükyalı bölgeleri ile Antalya'nın Lara mevkiinde de dönüşüm faaliyetlerini yoğun bir şekilde sürdürmektedir.";

/** Anasayfa Hakkımızda: API'den main tab, section hakkimizda (hakkimizda-text, hakkimizda-list) */
function HakkimizdaContent({ baseUrl = "/" }) {
  const { data, isLoading, error } = useGetWebsiteTabQuery("main");
  const section = getSectionByCode(data, "hakkimizda");
  const text =
    getItemByCode(section, "hakkimizda-text") || HAKKIMIZDA_DEFAULT_TEXT;
  const listContent = getItemByCode(section, "hakkimizda-list");
  const features = parseOptionsList(listContent).length
    ? parseOptionsList(listContent)
    : [
        "Doğru yönlendirme",
        "Hızlı bir dönüşüm",
        "38 yıllık inşaat tecrübesi",
        "14 yıllık kentsel dönüşüm deneyimi",
        "Hukuki, teknik ve idari danışmanlık",
        "Uzman kadro",
      ];

  if (isLoading) {
    return (
      <section
        id="hakkimizda"
        className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 overflow-hidden min-h-[50vh] flex items-center"
      >
        <div className="max-w-7xl mx-auto w-full animate-pulse rounded-2xl bg-white/90 p-8 h-64" />
      </section>
    );
  }
  if (error) {
    return (
      <section
        id="hakkimizda"
        className="relative w-full py-12 sm:py-16 px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto text-[#525252]">
          Hakkımızda içeriği yüklenemedi.
        </div>
      </section>
    );
  }

  return (
    <section
      id="hakkimizda"
      className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 overflow-hidden min-h-[auto] sm:min-h-[80vh] lg:min-h-[100vh] flex items-center"
    >
      <div className="absolute inset-0 z-0">
        <img
          src={`${baseUrl}building-modern.jpg`}
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-10 lg:p-12 xl:p-16 shadow-2xl">
          <p className="inline-block text-[#E30A17] text-sm sm:text-base md:text-4xl font-bold mb-4 tracking-wider uppercase bg-[#E30A17]/15 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl">
            38 YILI AŞKIN TECRÜBE
          </p>
          <h2 className="text-[#262322] text-2xl md:text-5xl font-semibold mb-4 sm:mb-5 md:mb-6 leading-tight">
            Hakkımızda
          </h2>
          <div className="text-[#585858] text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-7 md:mb-8 space-y-3 sm:space-y-4">
            <p>{text}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-2 sm:gap-3">
                <div className="shrink-0 bg-[#E30A17] rounded-full">
                  <CheckmarkIcon />
                </div>
                <span className="text-[#262322] text-sm sm:text-base md:text-lg">
                  {feature}
                </span>
              </div>
            ))}
          </div>
          <a
            href={`${baseUrl}projeler`}
            className="inline-flex items-center gap-2 sm:gap-3 rounded-full bg-[#E30A17] pl-1.5 sm:pl-2 pr-4 sm:pr-6 py-1.5 sm:py-2 text-sm sm:text-base font-medium text-white hover:bg-[#e30a18df] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center shrink-0">
              <ArrowRightIcon color="#E30A17" />
            </div>
            Projelere Göz At
          </a>
        </div>
      </div>
    </section>
  );
}

const MANAGED_BUILDINGS = [
  {
    number: "01",
    name: "Çam Apartmanı",
    imageKey: "bulding-management-interior.jpg",
  },
  { number: "02", name: "Ekşioğlu Apartmanı", imageKey: "building-modern.jpg" },
  {
    number: "03",
    name: "Dostlar Apartmanı",
    imageKey: "construction-image.png",
  },
  { number: "04", name: "Şans Apartmanı", imageKey: "landing-photo.png" },
  { number: "05", name: "Güven Apartmanı", imageKey: "interior-1.png" },
];

/** Anasayfa Bina Yönetimi bloğu: API'den main tab, section bina-yonetimi (başlık, açıklama) */
function BinaYonetimiSectionContent({ baseUrl = "/" }) {
  const { data, isLoading, error } = useGetWebsiteTabQuery("main");
  const section = getSectionByCode(data, "bina-yonetimi");
  const title =
    getItemByCode(section, "bina-yonetimi-title") || "Bina Yönetimi";
  const description =
    getItemByCode(section, "bina-yonetimi-description") ||
    "7 Yıldan Bu Yana Kadıköy ve Çevre İlçelerde Apartman & Site Yönetimi Faaliyetlerimizi Başarı ile Sürdürmekteyiz.";
  const [selectedIndex, setSelectedIndex] = useState(0);
  const buildings = MANAGED_BUILDINGS.map((b) => ({
    ...b,
    image: `${baseUrl}${b.imageKey}`,
  }));

  if (isLoading) {
    return (
      <section
        id="bina-yonetimi"
        className="relative w-full py-12 sm:py-16 md:py-20 lg:py-20 px-4 md:px-6 mb-12 md:mb-16 lg:mb-20 min-h-[300px] flex items-center justify-center"
      >
        <div className="animate-pulse h-12 w-64 bg-white/20 rounded" />
      </section>
    );
  }
  if (error) {
    return (
      <section
        id="bina-yonetimi"
        className="relative w-full py-12 px-4 md:px-6"
      >
        <div className="max-w-[1440px] mx-auto text-white/90">
          Bina yönetimi içeriği yüklenemedi.
        </div>
      </section>
    );
  }

  return (
    <section
      id="bina-yonetimi"
      className="relative w-full py-12 sm:py-16 md:py-20 lg:py-20 px-4 md:px-6 mb-12 md:mb-16 lg:mb-20"
    >
      <div className="absolute inset-0 -z-10">
        <img
          src={`${baseUrl}building-management-bg.jpg`}
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/40 md:bg-black/55" />
      </div>
      <div className="relative max-w-[1440px] mx-auto">
        <div className="text-center max-w-[980px] mx-auto">
          <p className="inline-block text-white/95 text-sm sm:text-base md:text-4xl font-bold tracking-wider mb-4 uppercase bg-white/15 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl">
            {title.toUpperCase()}
          </p>
          <h2 className="text-white text-2xl md:text-5xl font-semibold leading-tight mb-4 sm:mb-6 md:mb-8">
            {description}
          </h2>
          <a
            href={`${baseUrl}bina-yonetimi`}
            className="inline-flex items-center gap-3 rounded-full bg-[#E30A17] pl-2 pr-8 py-2 text-base font-medium text-white hover:bg-[#e30a18df] transition"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
              <ArrowRightIcon color="#E30A17" />
            </div>
            Daha Fazla
          </a>
        </div>
        <div className="mt-6 sm:mt-8 md:mt-12 lg:mt-14 flex flex-col lg:flex-row items-stretch gap-4 sm:gap-6 md:gap-8 lg:gap-8">
          <div className="w-full lg:w-[60%]">
            <div className="bg-white/95 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={buildings[selectedIndex].image}
                alt="Yönetilen apartman örneği"
                className="w-full h-[250px] sm:h-[300px] md:h-[380px] lg:h-[420px] object-cover transition-opacity duration-300"
              />
            </div>
          </div>
          <div className="w-full lg:w-[40%]">
            <div className="h-full bg-black/55 border border-white/10 rounded-2xl sm:rounded-3xl px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:py-8 text-white backdrop-blur-md flex flex-col">
              <div className="space-y-0 grow">
                {buildings.map((building, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    className={`bina-yonetimi-secenek w-full flex items-center justify-between py-2 sm:py-3 md:py-4 border-b border-white/10 text-left transition-colors hover:text-white cursor-pointer text-white/85 ${
                      index === selectedIndex
                        ? "active border-[#E30A17] border-b-2 text-[#E30A17]"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="text-sm sm:text-base font-semibold tracking-wide">
                        {building.number}.
                      </span>
                      <span className="text-sm sm:text-base md:text-lg font-medium">
                        {building.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingWithData({ baseUrl = "/" }) {
  return (
    <StoreProvider>
      <TabFetcher code="main" />
      <LandingContent baseUrl={baseUrl} />
      <KentselDonusumTanitimContent baseUrl={baseUrl} />
      <HakkimizdaContent baseUrl={baseUrl} />
    </StoreProvider>
  );
}

/** Anasayfa en alttaki Bina Yönetimi bloğu (ayrı store ile; sıralama için index’te ayrı render) */
export function BinaYonetimiSectionWithData({ baseUrl = "/" }) {
  return (
    <StoreProvider>
      <TabFetcher code="main" />
      <BinaYonetimiSectionContent baseUrl={baseUrl} />
    </StoreProvider>
  );
}

/** E-posta content JSON string ise parse eder: "[\"a@x.com\",\"b@x.com\"]" -> ["a@x.com","b@x.com"] */
function parseEmailList(content) {
  if (!content) return [];
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [String(parsed)];
  } catch {
    return [content];
  }
}

/** İletişim sayfası: API'den main section (title, sub-title, address, phone, kep, email, harita-url) */
function IletisimContent({ baseUrl = "/" }) {
  const { data, isLoading, error } = useGetWebsiteTabQuery("iletisim");
  const main = getSectionByCode(data, "main");
  const title = getItemByCode(main, "title") || "Bize Ulaşın";
  const subTitle =
    getItemByCode(main, "sub-title") ||
    "Adres ve iletişim bilgilerimize aşağıdan ulaşabilir, konumumuzu harita üzerinden görüntüleyebilirsiniz.";
  const address = getItemByCode(main, "address") || "";
  const phoneNumber = getItemByCode(main, "phone-number") || "";
  const kepMail = getItemByCode(main, "kep-mail") || "";
  const emailContent = getItemByCode(main, "email");
  const emailList = parseEmailList(emailContent);
  const haritaUrl = getItemByCode(main, "harita-url") || "";
  const phoneHref = phoneNumber ? `tel:${phoneNumber.replace(/\s/g, "")}` : "#";

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-white">
        <section className="w-full pt-24 sm:pt-28 md:pt-44 pb-10 md:pb-14 px-4 md:px-6">
          <div className="max-w-[1200px] mx-auto animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-32 mb-4" />
            <div className="h-12 bg-gray-200 rounded w-64 mb-4" />
            <div className="h-6 bg-gray-200 rounded max-w-2xl" />
          </div>
        </section>
        <section className="w-full pb-16 md:pb-24 px-4 md:px-6">
          <div className="max-w-[1200px] mx-auto h-96 bg-gray-100 rounded-2xl" />
        </section>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center p-8 text-[#525252]">
        İletişim içeriği yüklenemedi.
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <section
        id="iletisim"
        className="w-full pt-24 sm:pt-28 md:pt-44 pb-10 md:pb-14 px-4 md:px-6"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-12">
            <div className="flex-1">
              <p className="inline-block text-[#E30A17] text-sm sm:text-base md:text-lg font-bold mb-2 tracking-wider uppercase bg-[#E30A17]/15 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl">
                İLETİŞİM
              </p>
              <h1 className="text-[#262322] text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
                {title}
              </h1>
              <p className="text-[#525252] text-base md:text-lg leading-relaxed max-w-2xl">
                {subTitle}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:justify-end">
              <a
                href={`${baseUrl}teklif-al`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E30A17] px-6 py-3.5 text-base font-medium text-white hover:bg-[#c00914] transition-colors w-fit"
              >
                Teklif Al
                <ArrowRightIcon color="#fff" />
              </a>
              {emailList[0] && (
                <a
                  href={`mailto:${emailList[0]}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#E30A17] px-6 py-3.5 text-base font-medium text-[#E30A17] hover:bg-[#E30A17]/5 transition-colors w-fit"
                >
                  E-posta Gönder
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full pb-16 md:pb-24 px-4 md:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 items-stretch">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 h-full">
                <h2 className="text-[#262322] text-xl md:text-2xl font-bold mb-6">
                  İletişim Bilgileri
                </h2>
                <div className="space-y-4 md:space-y-5">
                  {phoneNumber && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#E30A17] flex items-center justify-center shrink-0">
                        <PhoneIcon color="#FFFFFF" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[#262322] font-semibold leading-snug">
                          Telefon
                        </p>
                        <a
                          href={phoneHref}
                          className="text-[#525252] hover:text-[#262322] transition-colors wrap-break-word"
                        >
                          {phoneNumber}
                        </a>
                      </div>
                    </div>
                  )}
                  {emailList.length > 0 && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#E30A17] flex items-center justify-center shrink-0">
                        <MailIcon />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[#262322] font-semibold leading-snug">
                          E-posta
                        </p>
                        <div className="space-y-1">
                          {emailList.map((email) => (
                            <a
                              key={email}
                              href={`mailto:${email}`}
                              className="block text-[#525252] hover:text-[#262322] transition-colors wrap-break-word"
                            >
                              {email}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {address && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#E30A17] flex items-center justify-center shrink-0">
                        <LocationIcon />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[#262322] font-semibold leading-snug">
                          Adres
                        </p>
                        <p className="text-[#525252] leading-relaxed">
                          {address}
                        </p>
                      </div>
                    </div>
                  )}
                  {kepMail && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#E30A17] flex items-center justify-center shrink-0">
                        <div className="[&>svg]:w-9 [&>svg]:h-auto">
                          <KepIcon />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[#262322] font-semibold leading-snug">
                          KEP
                        </p>
                        <a
                          href={`mailto:${kepMail}`}
                          className="text-[#525252] hover:text-[#262322] transition-colors wrap-break-word"
                        >
                          {kepMail}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-[#525252] leading-relaxed">
                    Harita üzerinden rota oluşturmak için sağdaki konum kartını
                    kullanabilirsiniz.
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full">
                <div className="px-6 md:px-8 py-5 md:py-6 border-b border-gray-200">
                  <h2 className="text-[#262322] text-xl md:text-2xl font-bold">
                    Konum
                  </h2>
                  <p className="text-[#525252] text-sm md:text-base mt-1">
                    Google Maps üzerinden konumumuzu görüntüleyin.
                  </p>
                </div>
                <div className="p-4 md:p-6">
                  <div className="rounded-xl overflow-hidden bg-gray-100 h-[360px] sm:h-[420px] md:h-[520px]">
                    {haritaUrl ? (
                      <iframe
                        src={haritaUrl}
                        width="600"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full"
                        title="Google Maps Konum"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#737373]">
                        Harita yüklenemedi.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function IletisimWithData({ baseUrl = "/" }) {
  return (
    <StoreProvider>
      <TabFetcher code="iletisim" />
      <IletisimContent baseUrl={baseUrl} />
    </StoreProvider>
  );
}

export default function WebsiteTabFetcher({ code }) {
  return (
    <StoreProvider>
      <TabFetcher code={code} />
    </StoreProvider>
  );
}
