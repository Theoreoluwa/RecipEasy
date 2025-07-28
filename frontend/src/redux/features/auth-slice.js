import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  auth: false,
  data: null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, { payload }) {
      const newData = state.data ? { ...state.data, ...payload.data } : payload.data;
      state.data = newData;
      state.auth = true;
      state.loading = false;
    },
    logout(state) {
      state.data = null;
      state.auth = false;
      state.loading = false;
    },
    setData(state, { payload }) {
      const newData = state.data ? { ...state.data, ...payload.data } : payload.data;
      state.data = newData;
      state.loading = false;
    },
  },
});

export const { login, logout, setData } = authSlice.actions;
export default authSlice.reducer;
