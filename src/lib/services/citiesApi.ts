import { baseApi } from "./baseApi";

const citiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCity: builder.mutation({
      query: (data) => ({
        url: "/auth/add-city",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["cities"],
    }),
    deleteCity: builder.mutation({
      query: (id) => ({
        url: `/auth/delete-city/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["cities"],
    }),

    updateCity: builder.mutation({
      query: ({ updateData, id }) => ({
        url: `/auth/update-city/${id}`,
        method: "PATCH",
        body: updateData,
      }),
      invalidatesTags: ["cities"],
    }),

    singleFood: builder.query({
      query: (foodId) => `/foods/${foodId}`,
    }),

    allCities: builder.query({
      query: ({ page = 1, limit = 15 }) =>
        `/auth/all-cities?page=${page}&limit=${limit}`,
      providesTags: ["cities"],
    }),
  }),
});

export const {
  useCreateCityMutation,
  useAllCitiesQuery,
  useUpdateCityMutation,
  useSingleFoodQuery,
  useDeleteCityMutation,
} = citiesApi;
