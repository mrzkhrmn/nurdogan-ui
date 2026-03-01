import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_API_URL } from "./constants";

export interface WebsiteTabResponse {
  code?: string;
  [key: string]: unknown;
}

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API_URL,
    prepareHeaders(headers: Headers) {
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["WebsiteTab"],
  endpoints: (builder) => ({
    getWebsiteTab: builder.query<WebsiteTabResponse, string>({
      query: (code: string) => `/Website/tab/${encodeURIComponent(code)}`,
      providesTags: (_result: unknown, _error: unknown, code: string) => [
        { type: "WebsiteTab", id: code },
      ],
    }),
  }),
});

export const { useGetWebsiteTabQuery, useLazyGetWebsiteTabQuery } = baseApi;
