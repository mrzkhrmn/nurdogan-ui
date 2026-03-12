import { useEffect, useState } from "react";
import { BASE_API_URL, IMAGE_BASE_URL } from "../api/constants";

export default function HizmetlerServicesClient({ baseUrl = "/" }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${BASE_API_URL}/Website/get-services`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;

        const mapped = data
          .slice()
          .sort(
            (a, b) =>
              (a?.listOrder ?? 0) - (b?.listOrder ?? 0),
          )
          .map((category) => ({
            id: category?.id || "",
            name: category?.name || "",
            services: (category?.services ?? [])
              .slice()
              .sort(
                (a, b) =>
                  (a?.listOrder ?? 0) - (b?.listOrder ?? 0),
              )
              .map((service) => ({
                id: service?.id || "",
                title: service?.title || "",
                description: service?.description || "",
                image: service?.imageUrl
                  ? `${IMAGE_BASE_URL}${service.imageUrl}`
                  : `${baseUrl}service-image2.png`,
              })),
          }));

        if (!cancelled) {
          setCategories(mapped);
        }
      } catch (e) {
        console.error("Error while fetching services for page (client)", e);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [baseUrl]);

  if (!categories.length) {
    return null;
  }

  return (
    <section
      id="hizmetler-listesi"
      className="w-full py-16 md:py-24 px-4 md:px-6 scroll-mt-24 bg-gray-100 dark:bg-gray-900 transition-colors duration-200"
    >
      <div className="max-w-[1200px] mx-auto">
        {categories.map((category) => (
          <div key={category.id || category.name} className="mb-16 md:mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl bg-[#E30A17] flex items-center justify-center text-white">
                <svg
                  className="w-6 h-6 md:w-7 md:h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-[#262322] dark:text-gray-100 text-xl md:text-2xl font-bold">
                {category.name}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {category.services.map((item) => (
                <div
                  key={item.id || item.title}
                  className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={item.image}
                      alt={item.title}
                      width={400}
                      height={225}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 md:p-5 flex flex-col flex-1">
                    <h4 className="text-[#262322] dark:text-gray-100 text-base md:text-lg font-semibold leading-snug group-hover:text-[#E30A17] transition-colors">
                      {item.title}
                    </h4>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-[#E30A17] text-sm font-medium">
                      Detay
                      <svg
                        className="w-4 h-4"
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
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

