import { useEffect, useState } from "react";
import { BASE_API_URL, IMAGE_BASE_URL } from "../api/constants";

/**
 * Aynı API cevabı; HizmetlerServicesClient ile uyumlu.
 */
export default function HizmetDetayDinamik({ baseUrl = "/" }) {
  const [state, setState] = useState({
    status: "loading",
    service: null,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) {
      setState({ status: "missing", service: null });
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${BASE_API_URL}/Website/get-services`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          if (!cancelled) setState({ status: "error", service: null });
          return;
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          if (!cancelled) setState({ status: "error", service: null });
          return;
        }
        const all = data.flatMap((c) => c?.services ?? []);
        const found = all.find((s) => s?.id === id);
        if (!found) {
          if (!cancelled) setState({ status: "notfound", service: null });
          return;
        }
        const service = {
          id: found.id,
          title: found.title || "",
          description: found.description || "",
          image: found.imageUrl
            ? `${IMAGE_BASE_URL}${found.imageUrl}`
            : `${baseUrl}service-image2.png`,
        };
        if (!cancelled) setState({ status: "ready", service });
      } catch (e) {
        console.error("Hizmet detay yüklenirken hata", e);
        if (!cancelled) setState({ status: "error", service: null });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [baseUrl]);

  const hizmetlerHref = `${baseUrl}hizmetler`;
  const whatsappNumber =
    typeof import.meta !== "undefined" && import.meta.env?.PUBLIC_WHATSAPP_PHONE
      ? import.meta.env.PUBLIC_WHATSAPP_PHONE
      : "905306544317";

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
        ? "Geçersiz bağlantı: hizmet bilgisi eksik."
        : state.status === "notfound"
          ? "Bu hizmet bulunamadı veya kaldırılmış olabilir."
          : "Hizmet bilgisi yüklenemedi.";

    return (
      <div className="w-full min-h-screen bg-white dark:bg-gray-900">
        <section className="w-full pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-24 px-4 md:px-6">
          <div className="max-w-[1200px] mx-auto text-center">
            <p className="text-[#262322] dark:text-gray-100 text-lg mb-6">{message}</p>
            <a
              href={hizmetlerHref}
              className="inline-flex items-center gap-2 text-[#E30A17] text-sm md:text-base font-medium hover:underline"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Hizmetlere dön
            </a>
          </div>
        </section>
      </div>
    );
  }

  const s = state.service;
  const whatsappMessage = encodeURIComponent(
    `Merhaba, "${s.title}" hizmeti hakkında bilgi almak istiyorum.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="w-full min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <section className="w-full pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-24 px-4 md:px-6">
        <div className="max-w-[1200px] mx-auto">
          <a
            href={hizmetlerHref}
            className="inline-flex items-center gap-2 text-[#E30A17] text-sm md:text-base font-medium hover:underline mb-8 dark:hover:text-[#ff4d4d]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Hizmetlere dön
          </a>

          <div className="flex flex-col lg:flex-row lg:gap-12 gap-10">
            <div className="flex-1 lg:max-w-md xl:max-w-lg shrink-0 order-1 lg:order-1">
              <div className="relative aspect-video lg:aspect-4/3 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg">
                <img
                  src={s.image}
                  alt={s.title}
                  width={560}
                  height={420}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0 order-2 lg:order-2">
              <h1 className="text-[#262322] dark:text-gray-100 text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-5 md:mb-6">
                {s.title}
              </h1>
              {s.description ? (
                <p className="text-[#525252] dark:text-gray-300 text-base md:text-lg leading-relaxed mb-8 whitespace-pre-wrap">
                  {s.description}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-[#E30A17] px-6 py-3 text-base font-medium text-[#E30A17] hover:bg-[#E30A17]/5 dark:hover:bg-[#E30A17]/10 transition-colors"
                >
                  Bilgi al
                </a>
                <button
                  type="button"
                  className="open-teklif-modal inline-flex items-center justify-center rounded-lg bg-[#E30A17] px-6 py-3 text-base font-medium text-white hover:bg-[#c00914] transition-colors"
                  data-related-service-id={s.id}
                >
                  Teklif talep et
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
