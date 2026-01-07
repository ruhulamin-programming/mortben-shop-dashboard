import { baseApi } from "./baseApi";

const mealApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMeal: builder.mutation({
      query: (data) => ({
        url: "/meals/create-meal",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["meals"],
    }),

    deleteMeal: builder.mutation({
      query: (mealId) => ({
        url: `/meals/${mealId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["meals"],
    }),

    updateMeal: builder.mutation({
      query: ({ finalData, mealId }) => ({
        url: `/meals/${mealId}`,
        method: "PATCH",
        body: finalData,
      }),
      invalidatesTags: ["meals"],
    }),

    singleMeal: builder.query({
      query: (mealId) => `/meals/${mealId}`,
    }),

    getMeals: builder.query({
      query: ({ limit = 15, page = 1 }) =>
        `/meals/get-meals?limit=${limit}&page=${page}`,
      providesTags: ["meals"],
    }),

    generatedMeals: builder.query({
      query: ({ limit = 15, page = 1 }) =>
        `/meals/generated/meals?limit=${limit}&page=${page}`,
      providesTags: ["generated-meals"],
    }),

    deleteGeneratedMeal: builder.mutation({
      query: (mealId) => ({
        url: `/meals/delete/${mealId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["generated-meals"],
    }),

    generatedMealDetails: builder.query({
      query: (mealId) => `/meals/generated/details/${mealId}`,
      providesTags: ["generated-meals"],
    }),

    updateGeneratedMeal: builder.mutation({
      query: ({ finalData, mealId }) => ({
        url: `/meals/update/${mealId}`,
        method: "PATCH",
        body: finalData,
      }),
      invalidatesTags: ["generated-meals"],
    }),

    createCalories: builder.mutation({
      query: (data) => ({
        url: "/calories/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["calories"],
    }),

    getCalories: builder.query({
      query: () => `/calories/get-calories`,
      providesTags: ["calories"],
    }),

    deleteCalories: builder.mutation({
      query: (id) => ({
        url: `/calories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["calories"],
    }),

    createPackage: builder.mutation({
      query: (data) => ({
        url: "/admin-package/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["admin_packages"],
    }),

    getPackages: builder.query({
      query: () => `/admin-package/get-packages`,
      providesTags: ["admin_packages"],
    }),

    deletePackage: builder.mutation({
      query: (id) => ({
        url: `/admin-package/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["admin_packages"],
    }),

    updatePackage: builder.mutation({
      query: ({ updatedData, id }) => ({
        url: `/admin-package/${id}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: ["admin_packages"],
    }),
  }),
});

export const {
  useCreateMealMutation,
  useGetMealsQuery,
  useSingleMealQuery,
  useDeleteMealMutation,
  useUpdateMealMutation,
  useCreateCaloriesMutation,
  useGetCaloriesQuery,
  useDeleteCaloriesMutation,
  useCreatePackageMutation,
  useGetPackagesQuery,
  useDeletePackageMutation,
  useUpdatePackageMutation,
  useGeneratedMealsQuery,
  useDeleteGeneratedMealMutation,
  useGeneratedMealDetailsQuery,
  useUpdateGeneratedMealMutation,
} = mealApi;
