import { baseApi } from "../../api/baseApi";

const carApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    GetAllCars: builder.query({
      query: () => ({
        url: "/cars",
        method: "GET",
      }),
    }),
    GetCarById: builder.query({
      query: (carId: string) => ({
        url: `/cars/${carId}`,
        method: "GET",
      }),
    }),
    GetAllUser: builder.query({
      query: () => ({
        url: "/auth/users",
        method: "GET",
      }),
    }),
    addCarItem: builder.mutation({
      query: (carData) => ({
        url: "/cars",
        method: "POST",
        body: carData,
      }),
    }),

    updateCar: builder.mutation({
      query: ({ carId, carModifyData }) => ({
        url: `/cars/${carId}`,
        method: "PUT",
        body: carModifyData,
      }),
    }),
    deleteCar: builder.mutation({
      query: (carId: string) => ({
        url: `/cars/${carId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllCarsQuery,
  useAddCarItemMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
  useGetAllUserQuery,
  useGetCarByIdQuery,
} = carApi;
