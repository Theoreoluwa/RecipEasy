import baseApi from './base';

const recipeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Recipes
    getRecipes: builder.query({
      query: ({ page = 1, search = '' }) => `/recipe/api/recipeData?page=${page}&search=${search}`,
      providesTags: ['Recipe'],
    }),

    // Get Single Recipe
    getRecipe: builder.query({
      query: ({ id }) => `/recipe/api/singleRecipe/${id}`,
      providesTags: ['Recipe'],
    }),

    // Create Recipe
    createRecipe: builder.mutation({
      invalidatesTags: ['Recipe'],
      query: (data) => ({
        url: '/recipe/api/create',
        method: 'POST',
        body: data,
      }),
    }),

    // Delete Recipe
    deleteRecipe: builder.mutation({
      invalidatesTags: ['Recipe'],
      query: (data) => ({
        url: `/recipe/api/deleterecipe/${data.id}`,
        method: 'DELETE',
      }),
    }),

    // Edit Recipe
    editRecipe: builder.mutation({
      invalidatesTags: ['Recipe'],
      query: (form) => ({
        url: `/recipe/api/updaterecipe/${form.id}`,
        method: 'PATCH',
        body: form.data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRecipesQuery,
  useGetRecipeQuery,
  useCreateRecipeMutation,
  useDeleteRecipeMutation,
  useEditRecipeMutation,
} = recipeApi;

export default recipeApi;
