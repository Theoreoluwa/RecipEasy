import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../../Api/helper';

const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const user = localStorage.getItem('user');
      if (user) {
        const data = JSON.parse(user);
        if (data.result?.token) headers.set('Authorization', data.result.token);
      }
      return headers;
    },
  }),
  keepUnusedDataFor: 3600,
  reducerPath: 'baseApi',
  tagTypes: ['Auth', 'Recipe'],
  endpoints: () => ({}),
});

export default baseApi;
