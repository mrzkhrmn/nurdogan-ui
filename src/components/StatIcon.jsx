import { BsBuildingsFill } from "react-icons/bs";
import { MdApartment, MdConstruction } from "react-icons/md";
import { HiDocumentCheck } from "react-icons/hi2";

const icons = {
  building: BsBuildingsFill,
  "kentsel-donusum": MdApartment,
  construction: MdConstruction,
  document: HiDocumentCheck,
};

export default function StatIcon({ type, className = "w-10 h-10 md:w-12 md:h-12 text-[#E30A17] mx-auto mb-2" }) {
  const Icon = icons[type] || BsBuildingsFill;
  return <Icon className={className} aria-hidden />;
}
