import { baseApi } from "./baseApi";

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateOrder: builder.mutation({
      query: ({ updateData, mealId }) => ({
        url: `/meals/update/${mealId}`,
        method: "PATCH",
        body: updateData,
      }),
      invalidatesTags: ["orders"],
    }),

    singleFood: builder.query({
      query: (foodId) => `/foods/${foodId}`,
    }),

    getOrders: builder.query({
      query: ({ page = 1, limit = 15, paymentType = "", status = "" }) =>
        `/payment?page=${page}&limit=${limit}&paymentType=${paymentType}&status=${status}`,
      providesTags: ["orders"],
    }),

    dietShopOrders: builder.query({
      query: ({ page = 1, limit = 15 }) =>
        `/payment/diet-shop/orders?page=${page}&limit=${limit}`,
      providesTags: ["diet-orders"],
    }),

    updateDietShopOrder: builder.mutation({
      query: ({ updateData, mealId }) => ({
        url: `/payment/update/diet-shop/${mealId}`,
        method: "PATCH",
        body: updateData,
      }),
      invalidatesTags: ["diet-orders"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useUpdateOrderMutation,
  useSingleFoodQuery,
  useDietShopOrdersQuery,
  useUpdateDietShopOrderMutation,
} = orderApi;
