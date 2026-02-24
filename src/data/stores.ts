export type Store = {
  id: string;
  name: string;
  address: string;
  region: string;
  lat: number;
  lng: number;
  phone?: string;
};

/** Örnek veri: Bölgelere göre şube / iletişim noktaları */
export const stores: Store[] = [
  {
    id: "kadikoy",
    name: "Kadıköy Şube",
    address: "Caferağa Mah. Moda Cad. No: 24, Kadıköy / İstanbul",
    region: "İstanbul - Anadolu Yakası",
    lat: 40.9906,
    lng: 29.0288,
    phone: "+90 216  XXX XX XX",
  },
  {
    id: "bostanci",
    name: "Bostancı Şube",
    address: "Bostancı Mah. Şehit Ömer Cad. No: 42, Kadıköy / İstanbul",
    region: "İstanbul - Anadolu Yakası",
    lat: 40.9708,
    lng: 29.0828,
    phone: "+90 216  XXX XX XX",
  },
  {
    id: "maltepe",
    name: "Maltepe Şube",
    address: "Küçükyalı Mah. Atatürk Cad. No: 15, Maltepe / İstanbul",
    region: "İstanbul - Anadolu Yakası",
    lat: 40.9353,
    lng: 29.1289,
    phone: "+90 216  XXX XX XX",
  },
  {
    id: "pendik",
    name: "Pendik Şube",
    address: "Esenyalı Mah. 100. Yıl Cad. No: 28, Pendik / İstanbul",
    region: "İstanbul - Anadolu Yakası",
    lat: 40.8756,
    lng: 29.2333,
    phone: "+90 216  XXX XX XX",
  },
  {
    id: "ankara",
    name: "Ankara Ofis",
    address: "Çankaya Mah. Atatürk Bulvarı No: 88, Çankaya / Ankara",
    region: "Ankara",
    lat: 39.9334,
    lng: 32.8597,
    phone: "+90 312  XXX XX XX",
  },
  {
    id: "izmir",
    name: "İzmir Ofis",
    address: "Alsancak Mah. Kıbrıs Şehitleri Cad. No: 120, Konak / İzmir",
    region: "İzmir",
    lat: 38.4192,
    lng: 27.1287,
    phone: "+90 232  XXX XX XX",
  },
];
