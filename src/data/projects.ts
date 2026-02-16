export type Project = {
  name: string;
  slug: string;
  location: string;
  description: string;
  image: string;
  gallery: string[];
};

const defaultGallery = [
  "interior-1.png",
  "building-modern.jpg",
  "construction-image.png",
  "bulding-management-interior.jpg",
  "landing-photo.png",
];

export const completedProjects: Project[] = [
  {
    name: "Nigar Apartmanı",
    slug: "nigar-apartmani",
    location: "Kadıköy, İstanbul",
    description:
      "Kentsel dönüşüm kapsamında yenilenen Nigar Apartmanı, modern yaşam standartlarına uygun daireleri ve ortak kullanım alanlarıyla bölgenin öne çıkan projelerinden biridir.",
    image: "interior-1.png",
    gallery: defaultGallery,
  },
  {
    name: "Mumcuoğlu Apartmanı",
    slug: "mumcuoglu-apartmani",
    location: "Etiler, İstanbul",
    description:
      "Deprem güvenliği ve enerji verimliliği ön planda tutularak tamamlanan Mumcuoğlu Apartmanı projesi, maliklerine güvenli ve konforlu bir yaşam alanı sunmaktadır.",
    image: "interior-1.png",
    gallery: defaultGallery,
  },
  {
    name: "Kuzu Apartmanı",
    slug: "kuzu-apartmani",
    location: "Şişli, İstanbul",
    description:
      "Kuzu Apartmanı kentsel dönüşüm projesi ile bina güçlendirme ve cephe yenileme çalışmaları tamamlanmış, yapı güncel standartlara kavuşturulmuştur.",
    image: "interior-1.png",
    gallery: defaultGallery,
  },
  {
    name: "Oda Apartmanı",
    slug: "oda-apartmani",
    location: "Beşiktaş, İstanbul",
    description:
      "Oda Apartmanı'nda yapılan kapsamlı dönüşüm çalışması ile daireler yeniden düzenlenmiş, ortak alanlar modernize edilmiştir.",
    image: "interior-1.png",
    gallery: defaultGallery,
  },
  {
    name: "Yıldız Apartmanı",
    slug: "yildiz-apartmani",
    location: "Küçükyalı, İstanbul",
    description:
      "Yıldız Apartmanı projesi kapsamında yapı deprem yönetmeliğine uygun hale getirilmiş, cephe ve iç mekân iyileştirmeleri tamamlanmıştır.",
    image: "interior-1.png",
    gallery: defaultGallery,
  },
  {
    name: "Şahin Apartmanı",
    slug: "sahin-apartmani",
    location: "Kadıköy, İstanbul",
    description:
      "Şahin Apartmanı kentsel dönüşümü ile malikler yeni nesil konut standartlarına kavuşmuş, bina ömrü uzatılmıştır.",
    image: "interior-1.png",
    gallery: defaultGallery,
  },
  {
    name: "Güneş Apartmanı",
    slug: "gunes-apartmani",
    location: "Lara, Antalya",
    description:
      "Antalya Lara bölgesinde tamamlanan Güneş Apartmanı projesi, denize yakın konumu ve modern tasarımı ile dikkat çekmektedir.",
    image: "interior-1.png",
    gallery: defaultGallery,
  },
  {
    name: "Ay Apartmanı",
    slug: "ay-apartmani",
    location: "Etiler, İstanbul",
    description:
      "Ay Apartmanı'nda gerçekleştirilen kentsel dönüşüm ile yapısal güçlendirme ve kat mülkiyeti uyumu sağlanmıştır.",
    image: "interior-1.png",
    gallery: defaultGallery,
  },
];

export const ongoingProjects: Project[] = [
  {
    name: "Merkez Kentsel Dönüşüm Projesi",
    slug: "merkez-kentsel-donusum",
    location: "Kadıköy, İstanbul",
    description:
      "Merkez bölgede devam eden kentsel dönüşüm projesi kapsamında yapı ruhsatı, malik anlaşmaları ve inşaat aşamaları yürütülmektedir.",
    image: "interior-1.png",
    gallery: defaultGallery,
  },
  {
    name: "Bahçelievler Yeni Yaşam",
    slug: "bahcelievler-yeni-yasam",
    location: "Bahçelievler, İstanbul",
    description:
      "Bahçelievler Yeni Yaşam projesi ile bölgede yeni konut alanları oluşturulmakta, yeşil alan ve sosyal tesisler planlanmaktadır.",
    image: "interior-1.png",
    gallery: defaultGallery,
  },
  {
    name: "Modern Konut Kompleksi",
    slug: "modern-konut-kompleksi",
    location: "Şişli, İstanbul",
    description:
      "Modern Konut Kompleksi projesinde inşaat aşaması devam etmekte olup, daire teslimleri planlanan takvimde ilerlemektedir.",
    image: "interior-1.png",
    gallery: defaultGallery,
  },
  {
    name: "Şehir Merkezi Rezidans",
    slug: "sehir-merkezi-rezidans",
    location: "Beşiktaş, İstanbul",
    description:
      "Şehir merkezinde konumlanan rezidans projesinde taşıyıcı sistem tamamlanmış, iç mekân ve cephe işleri sürmektedir.",
    image: "interior-1.png",
    gallery: defaultGallery,
  },
  {
    name: "Yeşil Vadisi Projesi",
    slug: "yesil-vadisi-projesi",
    location: "Kartal, İstanbul",
    description:
      "Yeşil Vadisi projesi ile doğaya uyumlu, enerji verimli konutlar inşa edilmekte; peyzaj ve altyapı çalışmaları devam etmektedir.",
    image: "interior-1.png",
    gallery: defaultGallery,
  },
  {
    name: "Premium Residence",
    slug: "premium-residence",
    location: "Etiler, İstanbul",
    description:
      "Premium Residence projesinde lüks daireler ve ortak kullanım alanları üzerinde çalışmalar sürdürülmektedir.",
    image: "interior-1.png",
    gallery: defaultGallery,
  },
];
