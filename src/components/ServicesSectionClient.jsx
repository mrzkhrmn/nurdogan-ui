import { useEffect, useState } from "react";
import { BASE_API_URL, IMAGE_BASE_URL } from "../api/constants";

function buildBaseUrl() {
  return (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
}

export default function ServicesSectionClient() {
  const [services, setServices] = useState([]);

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

        // data: ServiceCategoryDto[]
        const flatServices = data
          .slice()
          .sort(
            (a, b) =>
              (a?.listOrder ?? 0) - (b?.listOrder ?? 0),
          )
          .flatMap((category) =>
            (category?.services ?? [])
              .slice()
              .sort(
                (a, b) =>
                  (a?.listOrder ?? 0) - (b?.listOrder ?? 0),
              ),
          );

        const baseUrl = buildBaseUrl();

        const mapped = flatServices.slice(0, 9).map((service, index) => ({
          number: String(index + 1).padStart(2, "0"),
          title: service?.title || "",
          description: service?.description || "",
          image: service?.imageUrl
            ? `${IMAGE_BASE_URL}${service.imageUrl}`
            : `${baseUrl}service-image2.png`,
        }));

        if (!cancelled) {
          setServices(mapped);
        }
      } catch (e) {
        console.error("Error while fetching services (client)", e);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!services.length) {
    return null;
  }

  const baseUrl = buildBaseUrl();

  return (
    <div className="overflow-x-auto overflow-y-auto scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 max-h-[350px] md:max-h-[800px] py-8 sm:py-12 md:py-16">
      <div className="flex-col flex-nowrap md:flex gap-8 md:gap-12 w-max md:w-full">
        {services.map((service, index) => (
          <div
            key={index}
            className="group flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-4 px-4 md:px-12 lg:px-[72px] py-6 rounded-3xl bg-gray-50/50 dark:bg-gray-700/50 hover:bg-[#E30A17] hover:py-8 md:hover:py-16 transition-all duration-400 relative w-[400px] sm:w-[620px] md:w-[820px] lg:min-w-full shrink-0 md:shrink border border-transparent dark:border-gray-600"
          >
            <div className="flex items-start gap-2 md:gap-4 md:w-[25%]">
              <p className="text-[#E30A17] group-hover:text-white text-2xl md:text-3xl lg:text-4xl font-semibold leading-none transition-colors duration-300 shrink-0">
                {service.number}.
              </p>
              <p className="text-[#262322] dark:text-gray-200 group-hover:text-white text-lg md:text-xl lg:text-2xl font-semibold leading-tight transition-colors duration-300">
                {service.title}
              </p>
            </div>
            <img
              src={service.image}
              alt={service.title}
              width={50}
              height={50}
              className="w-[40%] md:w-[30%] absolute scale-0 group-hover:scale-100 transition-all duration-300 top-[50%] left-[50%] md:left-[46%] transform -translate-x-1/2 -translate-y-1/2 rotate-0 group-hover:-rotate-12 hidden md:block"
              loading="lazy"
            />
            <p className="text-[#585858] dark:text-gray-300 group-hover:text-white text-sm md:text-base lg:text-lg leading-relaxed w-full md:w-1/3">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

