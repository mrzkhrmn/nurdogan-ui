import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_API_URL } from "./constants";

export interface WebsiteTabResponse {
  code?: string;
  [key: string]: unknown;
}

export interface ReferenceDto {
  id: string;
  referenceName: string;
  referenceImageUrl: string;
  referenceUrl: string;
  shortAddress: string;
  listOrder: number;
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
  tagTypes: ["WebsiteTab", "References"],
  endpoints: (builder) => ({
    getWebsiteTab: builder.query<WebsiteTabResponse, string>({
      query: (code: string) => `/Website/tab/${encodeURIComponent(code)}`,
      providesTags: (_result: unknown, _error: unknown, code: string) => [
        { type: "WebsiteTab", id: code },
      ],
    }),
    getReferences: builder.query<ReferenceDto[], void>({
      query: () => "/Website/get-references",
      providesTags: ["References"],
    }),
  }),
});

export const { useGetWebsiteTabQuery, useLazyGetWebsiteTabQuery, useGetReferencesQuery } = baseApi;
