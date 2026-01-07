import { baseApi } from "./baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/delete/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),

    adminLogin: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    profileUpdate: builder.mutation({
      query: (data) => ({
        url: "/auth/profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["profile"],
    }),

    profileImageUpdate: builder.mutation({
      query: (data: FormData) => ({
        url: "/auth/profile-image",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["profile"],
    }),

    otpVerification: builder.mutation({
      query: (data) => ({
        url: "/auth/admin-verification",
        method: "POST",
        body: data,
      }),
    }),

    myProfile: builder.query({
      query: () => "/auth/profile",
      providesTags: ["profile"],
    }),

    users: builder.query({
      query: ({ page = 1, limit = 15 }) => `/users?page=${page}&limit=${limit}`,
      providesTags: ["users"],
    }),

    user: builder.query({
      query: (userId) => `/users/${userId}`,
    }),

    updateUser: builder.mutation({
      query: ({ data, userId }) => ({
        url: `/users/${userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useDeleteUserMutation,
  useAdminLoginMutation,
  useOtpVerificationMutation,
  useMyProfileQuery,
  useProfileUpdateMutation,
  useUsersQuery,
  useUserQuery,
  useUpdateUserMutation,
  useProfileImageUpdateMutation,
} = userApi;
