import { Provider } from "react-redux";
import { store } from "../store";

/**
 * RTK Query ve Redux store'u kullanan React bileşenleri için Provider.
 * Astro sayfalarında client:load ile kullan: <StoreProvider client:load><Component /></StoreProvider>
 */
export default function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
