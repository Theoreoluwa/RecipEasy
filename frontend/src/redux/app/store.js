import { configureStore } from '@reduxjs/toolkit';

import baseApi from '../features/api/base';
import authReducer from '../features/auth-slice';

import UserSlice from '../slice/userAuthSlice/userAuthSlice';
import recipeSlice from '../slice/recipeSlice/recipeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: UserSlice,
    recipe: recipeSlice,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});
