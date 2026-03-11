import { useEffect, useState } from "react";
import { BASE_API_URL } from "../api/constants";
import { getImageUrl } from "../api";

function mapApiToUi(p) {
  const baseUrl = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
  return {
    name: p?.name || "",
    position: p?.title || "",
    image: getImageUrl(p?.photoUrl) || `${baseUrl}worker-1.png`,
    description: p?.description || "",
    startDate: String(p?.startYear ?? ""),
    email: p?.email || "",
    experience:
      typeof p?.experience === "number"
        ? `${p.experience} Yıl`
        : String(p?.experience ?? ""),
  };
}

export default function EmployeeSectionClient() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${BASE_API_URL}/Website/get-personels`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) {
          setEmployees(data.map(mapApiToUi));
        }
      } catch (e) {
        console.error("Error while fetching personels (client)", e);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!employees.length) {
    return null;
  }

  return (
    <div className="relative">
      <div className="carousel-container overflow-x-auto overflow-y-hidden">
        <div className="carousel-track flex py-6 sm:py-8" id="carousel-track">
          {employees.map((employee, index) => (
            <div
              key={index}
              className="carousel-slide min-w-[70%] sm:min-w-[50%] md:min-w-[33.333%] lg:min-w-[25%] px-1 sm:px-2 md:px-3"
              data-index={index}
            >
              <div className="employee-card-container h-full">
                <div className="employee-card h-full">
                  <div className="employee-card-front w-full h-full">
                    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-white dark:bg-gray-700 shadow-lg transition-colors duration-200">
                      <img
                        src={employee.image}
                        alt={employee.name}
                        width={400}
                        height={533}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/70 to-transparent p-3 sm:p-4 md:p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white text-lg sm:text-lg md:text-xl font-bold mb-0.5 sm:mb-1 leading-tight">
                              {employee.name}
                            </h3>
                            <p className="text-white text-sm sm:text-sm md:text-base opacity-90">
                              {employee.position}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="employee-card-back w-full h-full">
                    <div className="w-full h-full bg-linear-to-br from-[#262322] to-[#1a1817] rounded-2xl p-3 sm:p-6 md:p-4 lg:p-5 xl:p-6 flex flex-col justify-between text-white shadow-lg">
                      <div>
                        <h3 className="text-white text-lg sm:text-xl md:text-lg lg:text-xl xl:text-2xl font-bold mb-1.5 sm:mb-2 md:mb-1.5 lg:mb-2 xl:mb-2 leading-tight">
                          {employee.name}
                        </h3>
                        <p className="text-[#E30A17] text-sm sm:text-base md:text-xs lg:text-sm xl:text-base font-medium mb-2 sm:mb-4 md:mb-2.5 lg:mb-3 xl:mb-4">
                          {employee.position}
                        </p>
                        <p className="text-white/90 text-sm sm:text-base md:text-xs lg:text-sm xl:text-base leading-relaxed mb-3 sm:mb-5 md:mb-3 lg:mb-4 xl:mb-6">
                          {employee.description}
                        </p>
                      </div>

                      <div className="space-y-2.5 sm:space-y-3 md:space-y-2 lg:space-y-2.5 xl:space-y-3 border-t border-white/20 pt-3 sm:pt-4 md:pt-2.5 lg:pt-3 xl:pt-4">
                        <div className="flex items-center gap-2.5 sm:gap-3 md:gap-2 lg:gap-2.5 xl:gap-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-8 xl:h-8 rounded-full bg-[#E30A17]/20 flex items-center justify-center shrink-0">
                            <svg
                              width="16"
                              height="16"
                              className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8 1V15M1 8H15"
                                stroke="#E30A17"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="text-white/70 text-[11px] sm:text-xs md:text-[10px] lg:text-xs xl:text-xs">
                              İşe Başlama
                            </p>
                            <p className="text-white font-semibold text-xs sm:text-sm md:text-xs lg:text-xs xl:text-sm">
                              {employee.startDate}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 sm:gap-3 md:gap-2 lg:gap-2.5 xl:gap-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-8 xl:h-8 rounded-full bg-[#E30A17]/20 flex items-center justify-center shrink-0">
                            <svg
                              width="16"
                              height="16"
                              className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M2 4L8 8L14 4M2 4H14M2 4V12H14V4"
                                stroke="#E30A17"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="text-white/70 text-[11px] sm:text-xs md:text-[10px] lg:text-xs xl:text-xs">
                              E-posta
                            </p>
                            <p className="text-white font-semibold text-xs sm:text-sm md:text-xs lg:text-xs xl:text-sm truncate">
                              {employee.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 sm:gap-3 md:gap-2 lg:gap-2.5 xl:gap-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-8 xl:h-8 rounded-full bg-[#E30A17]/20 flex items-center justify-center shrink-0">
                            <svg
                              width="16"
                              height="16"
                              className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8 1L10.5 5.5L15.5 6.5L12 10L12.5 15L8 12.5L3.5 15L4 10L0.5 6.5L5.5 5.5L8 1Z"
                                stroke="#E30A17"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="text-white/70 text-[11px] sm:text-xs md:text-[10px] lg:text-xs xl:text-xs">
                              Deneyim
                            </p>
                            <p className="text-white font-semibold text-xs sm:text-sm md:text-xs lg:text-xs xl:text-sm">
                              {employee.experience}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

