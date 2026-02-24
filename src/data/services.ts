export type Service = {
  number: string;
  title: string;
  description: string;
  image: string;
};

export const services: Service[] = [
  {
    number: "01",
    title: "Mevcut Yapıya Alt Konum Ve Net Alan Tespiti (Rölöve Çalışması)",
    description:
      "Konusunda uzman mimarlarımız tarafından Belediyeden veya Tapu Müdürlüğünden mevcut binaya alt mimari proje temin edilerek, mevcut konumlar ve mevcut net metrekareler belirlenir.",
    image: "services/1.png",
  },
  {
    number: "02",
    title: "Yeni Yapılacak Binanın Tasarımı Ve Projelendirme",
    description:
      "Bölge koşulları ve arsa sahiplerinin metrekare talepleri doğrultusunda yüklenici firma ile paylaşım oranı belirlenir. Mevcut konum ve metrekareler esas alınarak adil kat paylaşımı yapılır. Malikler arasında uzlaşma sağlanamazsa SPK lisanslı değerleme desteğiyle paylaşım gerçekleştirilir. Nihai kat paylaşımına göre alternatif mimari projeler hazırlanır ve arsa sahiplerinin görüşleri doğrultusunda projeler son haline getirilir.",
    image: "services/2.png",
  },
  {
    number: "03",
    title: "Sözleşme (Hukuki Şartname)",
    description:
      "Konusunda uzman mimarlarımız tarafından Belediyeden veya Tapu Müdürlüğünden mevcut binaya ait mimari proje temin edilerek, mevcut konumlar ve mevcut net metrekareler belirlenir.",
    image: "services/3.png",
  },
  {
    number: "04",
    title: "Sözleşme (Hukuki Şartname)",
    description:
      "Konusunda uzman mimarlarımız tarafından Belediyeden veya Tapu Müdürlüğünden mevcut binaya ait mimari proje temin edilerek, mevcut konumlar ve mevcut net metrekareler belirlenir.",
    image: "services/4.png",
  },
  {
    number: "05",
    title: "Sözleşme (Hukuki Şartname)",
    description:
      "Konusunda uzman mimarlarımız tarafından Belediyeden veya Tapu Müdürlüğünden mevcut binaya ait mimari proje temin edilerek, mevcut konumlar ve mevcut net metrekareler belirlenir.",
    image: "services/5.png",
  },
  {
    number: "06",
    title: "Sözleşme (Hukuki Şartname)",
    description:
      "Konusunda uzman mimarlarımız tarafından Belediyeden veya Tapu Müdürlüğünden mevcut binaya ait mimari proje temin edilerek, mevcut konumlar ve mevcut net metrekareler belirlenir.",
    image: "services/6.png",
  },
  {
    number: "07",
    title: "Sözleşme (Hukuki Şartname)",
    description:
      "Konusunda uzman mimarlarımız tarafından Belediyeden veya Tapu Müdürlüğünden mevcut binaya ait mimari proje temin edilerek, mevcut konumlar ve mevcut net metrekareler belirlenir.",
    image: "services/7.png",
  },
  {
    number: "08",
    title: "Sözleşme (Hukuki Şartname)",
    description:
      "Konusunda uzman mimarlarımız tarafından Belediyeden veya Tapu Müdürlüğünden mevcut binaya ait mimari proje temin edilerek, mevcut konumlar ve mevcut net metrekareler belirlenir.",
    image: "services/8.png",
  },
  {
    number: "09",
    title: "Sözleşme (Hukuki Şartname)",
    description:
      "Konusunda uzman mimarlarımız tarafından Belediyeden veya Tapu Müdürlüğünden mevcut binaya ait mimari proje temin edilerek, mevcut konumlar ve mevcut net metrekareler belirlenir.",
    image: "services/9.png",
  },
];

export type AllServiceItem = {
  slug: string;
  title: string;
  description: string;
  image: string;
  advantages: [string, string, string];
};

/** Proje & Teknik Hizmetler kategorisindeki hizmet slug'ları */
export const projeTeknikSlugs: string[] = [
  "mevcut-yapiya-ait-konum-ve-net-alan-tespiti-rolove-calismasi",
  "yeni-yapilacak-binanin-tasarimi-ve-projelendirme",
  "teknik-sartname-hazirlanmasi",
  "insaat-imalat-kontrolu",
  "yapi-ve-yikim-ruhsatlarina-ait-is-takibi",
  "bagimsiz-bolum-degerleme-raporlarinin-olusturulmasi",
];

/** Hukuki & Resmi Süreçler kategorisindeki hizmet slug'ları */
export const hukukiSlugs: string[] = [
  "sozlesme-hukuki-sartname-hazirlanmasi",
  "vekaletname-ve-muvafakatnameler",
  "arsa-payi-satisi-surec-yonetimi",
  "devlet-hibe-ve-kredi-destegi-alimi",
  "tum-surece-ait-hukuki-destek-hizmeti",
];

/** İlgili hizmetlerde gösterilecek maksimum kart sayısı */
export const RELATED_SERVICES_LIMIT = 3;

function slugify(title: string): string {
  const tr: Record<string, string> = {
    ç: "c",
    ğ: "g",
    ı: "i",
    ö: "o",
    ş: "s",
    ü: "u",
    Ç: "c",
    Ğ: "g",
    İ: "i",
    Ö: "o",
    Ş: "s",
    Ü: "u",
  };
  return title
    .toLowerCase()
    .split("")
    .map((c) => tr[c] || c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const allServicesList: AllServiceItem[] = [
  {
    slug: "apartman-ve-site-yonetimi",
    title: "Apartman ve Site Yönetimi",
    description:
      "Apartman ve sitenizin günlük idari işlemleri, aidat takibi, personel yönetimi ve ortak alanların koordinasyonu profesyonel ekibimizce yürütülür.",
    image: "service-image2.png",
    advantages: [
      "Deneyimli yönetim kadrosu",
      "Şeffaf aidat ve gider takibi",
      "7/24 destek ve iletişim",
    ],
  },
  {
    slug: "aylik-islemler-yonetimi",
    title: "Aylık İşlemler Yönetimi",
    description:
      "Aidat listelerinin hazırlanması, tebliğ ve tahsilatı, asansör ve tesisat bakımları ile aylık rutin işlemlerin takibi yapılır.",
    image: "service-image2.png",
    advantages: [
      "Düzenli aidat takibi",
      "Bakım planlaması",
      "Raporlama ve belgelendirme",
    ],
  },
  {
    slug: "donemsel-islemler-yonetimi",
    title: "Dönemsel İşlemler Yönetimi",
    description:
      "Yıllık bütçe hazırlığı, yangın tüpü kontrolleri, düzenli ilaçlama ve periyodik bakım işlemleri planlanır ve uygulanır.",
    image: "service-image2.png",
    advantages: [
      "Yıllık bütçe planlaması",
      "Periyodik güvenlik kontrolleri",
      "Zamanında bakım takvimi",
    ],
  },
  {
    slug: "kanunen-yapilacak-islemler",
    title: "Kanunen Yapılacak İşlemler",
    description:
      "Kat Mülkiyeti Kanunu kapsamında olağan ve olağanüstü genel kurul toplantıları, işletme projesi ve yasal yükümlülükler takip edilir.",
    image: "service-image2.png",
    advantages: [
      "Genel kurul organizasyonu",
      "Yasal uyum desteği",
      "İşletme projesi hazırlığı",
    ],
  },
  {
    slug: "idari-mali-ve-teknik-surec-yonetimi",
    title: "İdari, Mali ve Teknik Süreç Yönetimi",
    description:
      "Borç tasnifi, tahsilat raporları, su-elektrik-doğalgaz abonelik dönüşümleri gibi idari ve teknik süreçler yönetilir.",
    image: "service-image2.png",
    advantages: [
      "Mali raporlama",
      "Abonelik dönüşüm danışmanlığı",
      "Teknik süreç koordinasyonu",
    ],
  },
  {
    slug: "mevcut-binanin-tahliye-islemleri",
    title: "Mevcut Binanın Tahliye İşlemleri",
    description:
      "Kentsel dönüşüm öncesi binanın güvenli tahliyesi, kiracı ve malik koordinasyonu ile hukuki süreçler yürütülür.",
    image: "service-image2.png",
    advantages: [
      "Güvenli tahliye planlaması",
      "Kiracı-malik koordinasyonu",
      "Hukuki süreç desteği",
    ],
  },
  {
    slug: "mevcut-yapiya-ait-konum-ve-net-alan-tespiti-rolove-calismasi",
    title: "Mevcut Yapıya Ait Konum ve Net Alan Tespiti (Rölöve Çalışması)",
    description:
      "Konusunda uzman mimarlarımız tarafından Belediyeden veya Tapu Müdürlüğünden mevcut binaya ait mimari proje temin edilerek, mevcut konumlar ve mevcut net metrekareler belirlenir.",
    image: "services/1.png",
    advantages: [
      "Mevcut mimari proje temini",
      "Konum ve net alan tespiti",
      "Rölöve çalışması raporlaması",
    ],
  },
  {
    slug: "yeni-yapilacak-binanin-tasarimi-ve-projelendirme",
    title: "Yeni Yapılacak Binanın Tasarımı ve Projelendirme",
    description:
      "Mevcut konum ve metrekareler esas alınarak adil kat paylaşımı ve mimari projeler hazırlanır, malik görüşleriyle son haline getirilir.",
    image: "services/2.png",
    advantages: [
      "Adil kat paylaşımı",
      "Mimari proje alternatifleri",
      "Malik katılımı ile karar",
    ],
  },
  {
    slug: "teknik-sartname-hazirlanmasi",
    title: "Teknik Şartname Hazırlanması",
    description:
      "İnşaat ve tadilat işleri için teknik şartnameler, idari şartnameler ve ihale dokümanları uzman kadromuzca hazırlanır.",
    image: "services/3.png",
    advantages: [
      "Uzman teknik ekip",
      "Şartname ve ihale dokümanları",
      "Kalite ve standart uyumu",
    ],
  },
  {
    slug: "insaat-imalat-kontrolu",
    title: "İnşaat İmalat Kontrolü",
    description:
      "Şantiyede imalatların projeye ve şartnameye uygunluğu, mühendislik kontrolleri ile denetlenir ve raporlanır.",
    image: "services/4.png",
    advantages: [
      "Sahada mühendislik kontrolü",
      "Proje uyum denetimi",
      "Periyodik raporlama",
    ],
  },
  {
    slug: "yapi-ve-yikim-ruhsatlarina-ait-is-takibi",
    title: "Yapı ve Yıkım Ruhsatlarına Ait İş Takibi",
    description:
      "Yapı ruhsatı, yıkım ruhsatı ve gerekli belediye işlemlerinin takibi ve tamamlanması süreçleri yürütülür.",
    image: "services/5.png",
    advantages: [
      "Ruhsat başvuru takibi",
      "Belediye koordinasyonu",
      "Süreç raporlaması",
    ],
  },
  {
    slug: "bagimsiz-bolum-degerleme-raporlarinin-olusturulmasi",
    title: "Bağımsız Bölüm Değerleme Raporlarının Oluşturulması",
    description:
      "SPK lisanslı değerleme kuruluşları ile bağımsız bölüm değerleme raporları hazırlatılır ve paylaşım süreçlerinde kullanılır.",
    image: "services/6.png",
    advantages: [
      "SPK lisanslı değerleme",
      "Adil paylaşım desteği",
      "Resmi raporlama",
    ],
  },
  {
    slug: "sozlesme-hukuki-sartname-hazirlanmasi",
    title: "Sözleşme (Hukuki Şartname) Hazırlanması",
    description:
      "Yüklenici-malik sözleşmeleri, kat irtifakı ve kat mülkiyeti sözleşmeleri hukuki danışmanlık eşliğinde hazırlanır.",
    image: "services/7.png",
    advantages: [
      "Hukuki danışmanlık",
      "Sözleşme hazırlığı",
      "Taraflar arası denge",
    ],
  },
  {
    slug: "vekaletname-ve-muvafakatnameler",
    title: "Vekaletname ve Muvafakatnameler",
    description:
      "Genel kurul, tapu ve banka işlemleri için gerekli vekaletname ve muvafakatname metinleri hazırlanır ve süreçler yönetilir.",
    image: "services/8.png",
    advantages: ["Metin hazırlığı", "Resmi işlem desteği", "Süreç yönetimi"],
  },
  {
    slug: "arsa-payi-satisi-surec-yonetimi",
    title: "Arsa Payı Satışı Süreç Yönetimi",
    description:
      "Arsa payı satış sözleşmeleri, tapu işlemleri ve alıcı-satıcı koordinasyonu profesyonel olarak yürütülür.",
    image: "services/9.png",
    advantages: [
      "Sözleşme ve tapu takibi",
      "Alıcı-satıcı koordinasyonu",
      "Hukuki güvence",
    ],
  },
  {
    slug: "devlet-hibe-ve-kredi-destegi-alimi",
    title: "Devlet Hibe ve Kredi Desteği Alımı",
    description:
      "Kentsel dönüşüm ve konut finansmanına yönelik devlet hibe ve kredi başvurularının hazırlanması ve takibi yapılır.",
    image: "services/10.png",
    advantages: [
      "Başvuru hazırlığı",
      "Takip ve koordinasyon",
      "Uygun destek yönlendirmesi",
    ],
  },
  {
    slug: "tum-surece-ait-hukuki-destek-hizmeti",
    title: "Tüm Sürece Ait Hukuki Destek Hizmeti",
    description:
      "Kentsel dönüşüm ve yönetim sürecinin her aşamasında avukat desteği, uyuşmazlık çözümü ve hukuki danışmanlık sağlanır.",
    image: "services/11.png",
    advantages: ["Avukat desteği", "Uyuşmazlık çözümü", "Süreç danışmanlığı"],
  },
];
