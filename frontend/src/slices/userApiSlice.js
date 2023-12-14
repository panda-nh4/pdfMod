import { apiSlice } from "./apiSlice";
const USERS_URL = "/api/user";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/update`,
        method: "PUT",
        body: data,
      }),
    }),
    UserUpload: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/upload`,
        method: "POST",
        body: data,
      }),
    }),
    UserViewFile: builder.query({
      query: (data) => ({
        url: `${USERS_URL}/view`,
        method: "GET",
        params: data,
        responseHandler: (response) => response.arrayBuffer(),
      }),
    }),
    UserExtract: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/extract`,
        method: "POST",
        body: data,
      }),
    }),
    UserGetFiles: builder.query({
      query: (data) => ({
        url: `${USERS_URL}/files`,
        method: "GET",
      }),
    }),
    UserGetShared: builder.query({
      query: (data) => ({
        url: `${USERS_URL}/shared`,
        method: "GET",
      }),
    }),
    ShareFile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/share`,
        method: "POST",
        body: data,
      }),
    }),
    DeleteFile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/delete`,
        method: "POST",
        body: data,
      }),
    }),
    GetFileShareLink: builder.query({
      query: (data) => ({
        url: `${USERS_URL}/getShareLink`,
        method: "GET",
        params: data,
      }),
    }),
    StopFileShare: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/stopShare`,
        method: "POST",
        body: data,
      }),
    }),
    updateFile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/updateFile`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useLazyUserViewFileQuery,
  useUserUploadMutation,
  useUserExtractMutation,
  useLazyUserGetFilesQuery,
  useLazyUserGetSharedQuery,
  useShareFileMutation,
  useDeleteFileMutation,
  useLazyGetFileShareLinkQuery,
  useStopFileShareMutation,
  useUpdateFileMutation,
} = userApiSlice;
