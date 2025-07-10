import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../../services/authService";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (formLogin, { rejectWithValue }) => {
    try {
      const data = await login(formLogin);
      console.log("login", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (formRegister, { rejectWithValue }) => {
    try {
      const data = await register(formRegister);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const data = await logout();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const forgotPasswordUser = createAsyncThunk(
  "auth/forgotPassword",
  async (request, { rejectWithValue }) => {
    try {
      const data = await forgotPassword(request);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const resetPasswordUser = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, request }, { rejectWithValue }) => {
    try {
      const data = await resetPassword(token, request);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const changePasswordUser = createAsyncThunk(
  "auth/changePassword",
  async (request, { rejectWithValue }) => {
    try {
      const data = await changePassword(request);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })

      // Forgot Password
      .addCase(forgotPasswordUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(forgotPasswordUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Reset Password
      .addCase(resetPasswordUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(resetPasswordUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Change Password
      .addCase(changePasswordUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePasswordUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(changePasswordUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearAuthError, setUser } = authSlice.actions;
export default authSlice.reducer;
