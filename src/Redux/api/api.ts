import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseAPi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://b3a4-camper-shop.vercel.app" }),
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => ({
        url: "/api/products",
        method: "GET",
      }),
    }),

    addProductItem: builder.mutation({
      query: (productData) => ({
        url: "/api/products",
        method: "POST",
        body: productData,
      }),
    }),
  }),
});

export const { useGetAllProductsQuery, useAddProductItemMutation } = baseApi;
