export type ProjectStatus = "tamamlandi" | "devam-ediyor";

export type MapDistrictProject = {
  name: string;
  address: string;
  slug?: string;
  status: ProjectStatus;
};

export type MapDistrict = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  projects: MapDistrictProject[];
};

export const mapDistricts: MapDistrict[] = [
  {
    id: "caddebostan",
    name: "Caddebostan",
    lat: 40.9728,
    lng: 29.0778,
    projects: [
      { name: "Zümrüt Apartmanı", address: "Erenköy Mahallesi Bahariyeli Sokak 58 - Kadıköy", slug: "nigar-apartmani", status: "tamamlandi" },
    ],
  },
  {
    id: "bostanci",
    name: "Bostancı",
    lat: 40.9708,
    lng: 29.0828,
    projects: [
      { name: "Nigar Apartmanı", address: "Bostancı Mahallesi Şehit Ömer Caddesi 42 - Kadıköy", slug: "nigar-apartmani", status: "devam-ediyor" },
    ],
  },
  {
    id: "maltepe",
    name: "Maltepe",
    lat: 40.9353,
    lng: 29.1289,
    projects: [
      { name: "Yıldız Apartmanı", address: "Küçükyalı Mahallesi Atatürk Caddesi 15 - Maltepe", slug: "yildiz-apartmani", status: "tamamlandi" },
    ],
  },
  {
    id: "pendik",
    name: "Pendik",
    lat: 40.8756,
    lng: 29.2333,
    projects: [
      { name: "Yeşil Vadisi Projesi", address: "Esenyalı Mahallesi 100. Yıl Caddesi 28 - Pendik", slug: "yesil-vadisi-projesi", status: "devam-ediyor" },
    ],
  },
  {
    id: "kadikoy",
    name: "Kadıköy",
    lat: 40.9906,
    lng: 29.0288,
    projects: [
      { name: "Şahin Apartmanı", address: "Caferağa Mahallesi Moda Caddesi 24 - Kadıköy", slug: "sahin-apartmani", status: "tamamlandi" },
    ],
  },
];

/** Maltepe, Kadıköy, Bostancı çevresindeki tüm proje marker konumları */
export const mapMarkerLocations: { lat: number; lng: number; title?: string }[] = [
  { lat: 40.9906, lng: 29.0288, title: "Kadıköy Merkez" },
  { lat: 40.9848, lng: 29.0312, title: "Moda" },
  { lat: 40.9878, lng: 29.0265, title: "Caferağa" },
  { lat: 40.9728, lng: 29.0778, title: "Caddebostan" },
  { lat: 40.9708, lng: 29.0828, title: "Bostancı" },
  { lat: 40.965, lng: 29.07, title: "Suadiye" },
  { lat: 40.978, lng: 29.095, title: "İçerenköy" },
  { lat: 40.962, lng: 29.088, title: "Kozyatağı" },
  { lat: 40.9353, lng: 29.1289, title: "Maltepe" },
  { lat: 40.942, lng: 29.135, title: "Küçükyalı" },
  { lat: 40.928, lng: 29.12, title: "Cevizli" },
  { lat: 40.938, lng: 29.15, title: "Bağdat Cad." },
  { lat: 40.945, lng: 29.118, title: "Altayçeşme" },
  { lat: 40.982, lng: 29.045, title: "Fenerbahçe" },
  { lat: 40.975, lng: 29.065, title: "Göztepe" },
];
