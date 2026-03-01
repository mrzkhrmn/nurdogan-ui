export { BASE_API_URL, IMAGE_BASE_URL } from "./constants";
export {
  baseApi,
  useGetWebsiteTabQuery,
  useLazyGetWebsiteTabQuery,
  type WebsiteTabResponse,
} from "./baseApi";

/**
 * API'den gelen resim path'i ile tam URL oluşturur.
 * @param path - Örn: "/uploads/xyz.jpg" veya "uploads/xyz.jpg"
 */
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return "";
  const base = "https://nurdogan-api.ranna.com.tr";
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
