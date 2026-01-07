import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://mortben-backend.ruhulamin.live/api/v1",
    prepareHeaders: (headers) => {
      const accessToken = Cookies?.get("accessToken");
      if (accessToken) {
        headers.set("Authorization", `${accessToken}`);
        return;
      }
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "login",
    "users",
    "foods",
    "meals",
    "profile",
    "user",
    "food",
    "orders",
    "consultations",
    "cities",
    "consultationTime",
    "diet-orders",
    "calories",
    "admin_packages",
    "generated-meals",
  ],
});
