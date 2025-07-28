// src/redux/features/recipeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createRecipeApi } from "../../../Api/RecipeApis/recipeApi";// adjust path
import toast from "react-hot-toast";

export const createRecipe = createAsyncThunk(
  "createRecipe",
  async (formData) => {
    try {
      const response = await createRecipeApi(formData.data, formData.header);

      if (response.status === 200) {
        toast.success("Recipe Created Successfully!")
        return response.data;
      } else {
        toast.error(response.response.data.errorMessage);
      }
    } catch (error) {
      throw error;
    }
  }
);

const recipeSlice = createSlice({
  name: "recipe",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createRecipe.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});


export default recipeSlice.reducer;
