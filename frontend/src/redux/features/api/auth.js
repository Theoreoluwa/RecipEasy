import baseApi from './base';

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Auth User
    getAuth: builder.query({
      query: () => '/userauth/api/userloggedin',
    }),

    // Verify Forgot Password
    verifyForgotPassword: builder.query({
      query: (data) => `/userauth/api/forgotpassword/${data.id}/${data.token}`,
    }),

    // Login User
    login: builder.mutation({
      invalidatesTags: ['Auth'],
      query: (data) => ({
        url: '/userauth/api/login',
        method: 'POST',
        body: data,
      }),
    }),

    // Register User
    register: builder.mutation({
      invalidatesTags: ['Auth'],
      query: (data) => ({
        url: '/userauth/api/register',
        method: 'POST',
        body: data,
      }),
    }),

    // Forgot Password
    forgotPassword: builder.mutation({
      invalidatesTags: ['Auth'],
      query: (data) => ({
        url: '/userauth/api/forgotpassword',
        method: 'POST',
        body: data,
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation({
      invalidatesTags: ['Auth'],
      query: (data) => ({
        url: `/userauth/api/resetpassword/${data.id}/${data.token}`,
        method: 'PUT',
        body: data.form,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAuthQuery,
  useVerifyForgotPasswordQuery,
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;

export default authApi;
