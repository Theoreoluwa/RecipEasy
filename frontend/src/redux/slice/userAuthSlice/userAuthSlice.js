import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { forgotpasswordApi, loginApi, registerApi } from '../../../Api/UserApis/userapi';
import toast from 'react-hot-toast';

//user register
export const userRegister = createAsyncThunk('userRegister', async (data) => {
  try {
    const response = await registerApi(data.data, data.header);

    if (response.status === 200) {
      toast.success('User Registered Successfully!');
      return response.data;
    } else {
      toast.error(response.response.data.errorMessage);
    }
  } catch (error) {
    throw error;
  }
});

//user login api
export const userLogin = createAsyncThunk('userLogin', async (data) => {
  try {
    const response = await loginApi(data);

    if (response.status === 200) {
      localStorage.setItem('usertoken', response.data.result.token);
      toast.success(response.data.message);
      return response.data;
    } else {
      toast.error(response.response.data.errorMessage);
    }
  } catch (error) {
    throw error;
  }
});

//forgot password api
export const forgotPassword = createAsyncThunk('forgotPassword', async (data) => {
  try {
    const response = await forgotpasswordApi(data);
    if (response.status === 200) {
      toast.success('An email to reset your password has been sent successfully!');
      return response.data;
    } else {
      toast.error(response.response.data.errorMessage);
    }
  } catch (error) {
    throw error;
  }
});

//Create Slice(for action and reducer)

export const UserSlice = createSlice({
  name: 'UserSlice',
  initialState: {
    user: [],
    userLoggedIn: [],
    loading: false,
    error: null,
    auth: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(userRegister.pending, (state) => {
        state.loading = true;
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    //user login add case
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.auth = true;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.auth = false;
      });

    //user forgot password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default UserSlice.reducer;
