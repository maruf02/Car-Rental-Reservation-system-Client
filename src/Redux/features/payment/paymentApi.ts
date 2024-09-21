import { baseApi } from "../../api/baseApi";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPayment: builder.mutation({
      query: (BookingData) => ({
        url: "/payment",
        method: "POST",
        body: BookingData,
      }),
    }),
  }),
});

export const { useCreatePaymentMutation } = paymentApi;
