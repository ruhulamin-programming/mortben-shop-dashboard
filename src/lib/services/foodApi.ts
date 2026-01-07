import { baseApi } from "./baseApi";

const foodApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createFood: builder.mutation({
      query: (formData: FormData) => ({
        url: "/foods/create-food",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["foods"],
    }),

    deleteFood: builder.mutation({
      query: (foodId) => ({
        url: `/foods/${foodId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["foods"],
    }),

    updateFood: builder.mutation({
      query: ({ foodId, formData: FormData }) => ({
        url: `/foods/${foodId}`,
        method: "PATCH",
        body: FormData,
      }),
      invalidatesTags: ["foods"],
    }),

    singleFood: builder.query({
      query: (foodId) => `/foods/${foodId}`,
    }),

    getFoods: builder.query({
      query: ({ page = 1, limit = 15, search = "" }) =>
        `/foods/get-foods?page=${page}&limit=${limit}&search=${search}`,
      providesTags: ["foods"],
    }),
  }),
});

export const {
  useCreateFoodMutation,
  useGetFoodsQuery,
  useUpdateFoodMutation,
  useSingleFoodQuery,
  useDeleteFoodMutation,
} = foodApi;
