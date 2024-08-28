import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GetAllUser: builder.query({
    //   query: () => ({
    //     url: "/auth/users",
    //     method: "GET",
    //   }),
    // }),
    updatePassword: builder.mutation({
      query: ({ email, password }) => ({
        url: `/auth/users/${email}`,
        method: "PUT",
        body: { password },
      }),
    }),
    GetUserEmail: builder.query({
      query: (email: string) => ({
        url: `/auth/users/${email}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUserEmailQuery, useUpdatePasswordMutation } = authApi;
