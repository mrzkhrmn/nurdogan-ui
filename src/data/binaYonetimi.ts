/**
 * Bina Yönetimi sayfası görselleri.
 * Ana görsel (5) üstte, alttaki üç görsel (6, 7, 8) bu diziden okunur; sıra veya dosya adları değiştirilerek güncellenebilir.
 */
const folder = "bina-yonetimi";

export const binaYonetimiGorselleri = {
  /** Üstteki ana görsel (5 numaralı) */
  anaGorsel: `${folder}/5.png`,
  /** Alttaki değişebilir üç görsel (6, 7, 8). Sırayı veya dosya adlarını değiştirerek güncelleyebilirsiniz. */
  altGorseller: [`${folder}/6.png`, `${folder}/7.png`, `${folder}/8.png`],
} as const;
