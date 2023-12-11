import { apiSlice } from "./apiSlice";
const PUBLIC_URL = "/api/file";

export const publicApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    upload: builder.mutation({
      query: (data) => ({
        url: `${PUBLIC_URL}/upload`,
        method: "POST",
        body: data,
      }),
    }),
    viewFile: builder.query({
      query: (data) => ({
        url: `${PUBLIC_URL}/view`,
        method: "GET",
        params: data,
        responseHandler: (response) => response.arrayBuffer(),
      }),
    }),
  }),
});

export const { useUploadMutation, useLazyViewFileQuery } = publicApiSlice;
