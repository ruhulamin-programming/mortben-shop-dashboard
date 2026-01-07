import { baseApi } from "./baseApi";

const consultationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteConsultations: builder.mutation({
      query: (id) => ({
        url: `/consultations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["consultations"],
    }),

    deleteConsultationTime: builder.mutation({
      query: (id) => ({
        url: `/consultations/delete-consultation/time/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["consultationTime"],
    }),

    updateConsultation: builder.mutation({
      query: ({ updateData, id }) => ({
        url: `/consultations/${id}`,
        method: "PATCH",
        body: updateData,
      }),
      invalidatesTags: ["consultations"],
    }),

    singleFood: builder.query({
      query: (consationId) => `/consultations/${consationId}`,
    }),

    getConsultations: builder.query({
      query: ({ page = 1, limit = 15 }) =>
        `/consultations?page=${page}&limit=${limit}`,
      providesTags: ["consultations"],
    }),

    createConsultationTime: builder.mutation({
      query: (payload) => ({
        url: "/consultations/create-consultaion/time",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["consultationTime"],
    }),

    getConsultationTime: builder.query({
      query: () => `/consultations/all-consultation/time`,
      providesTags: ["consultationTime"],
    }),
  }),
});

export const {
  useGetConsultationsQuery,
  useUpdateConsultationMutation,
  useSingleFoodQuery,
  useDeleteConsultationsMutation,
  useCreateConsultationTimeMutation,
  useGetConsultationTimeQuery,
  useDeleteConsultationTimeMutation,
} = consultationApi;
