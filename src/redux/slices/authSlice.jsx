import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  getGoogleLoginUrl,
  exchangeGoogleCodeForToken,
  redirectToGoogle,
} from "../../services/authService";
import Cookies from "js-cookie";
import { saveAuthToStorage, clearAuthFromStorage, getAuthFromStorage } from "../../utils/authUtils";
import api from "../../services/api";
import { resetCart } from "./cartSlice";
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formLogin, { rejectWithValue }) => {
    try {
      const data = await login(formLogin);

      const userInfo = {
        id: data?.data?.user?.id || "",
        username: data?.data?.user?.username || "",
        email: data?.data?.user?.email || "",
        status: data?.data?.user?.status || "",
        createdAt: data?.data?.user?.createdAt || "",
        updatedAt: data?.data?.user?.updatedAt || "",
        userPoint: data?.data?.user?.userPoint || 0,
        roles: data?.data?.roles || [],
      };

      Cookies.set("access_token", data?.data?.accessToken || "", {
        sameSite: "Strict",
        secure: true,
        path: "/",
      });

      Cookies.set("user", JSON.stringify(userInfo), {
        sameSite: "Strict",
        secure: true,
        path: "/",
      });

      // Save to localStorage with expiration
      saveAuthToStorage(userInfo, data?.data?.accessToken);

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
      // Clear localStorage and cookies
      clearAuthFromStorage();
      Cookies.remove("access_token");
      Cookies.remove("user");
            dispatch(resetCart()); // reset giỏ hàng

      return data;
    } catch (error) {
      // Even if logout API fails, clear local storage and cookies
      clearAuthFromStorage();
      Cookies.remove("access_token");
      Cookies.remove("user");
            dispatch(resetCart()); // reset giỏ hàng

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

// Google OAuth Actions
export const googleLoginUser = createAsyncThunk(
  "auth/googleLogin",
  async (googleData, { rejectWithValue }) => {
    try {
      // Lưu token và thông tin user từ Google response
      const userInfo = {
        id: googleData?.user?.id || "",
        username: googleData?.user?.username || "",
        email: googleData?.user?.email || "",
        status: googleData?.user?.status || "ACTIVE",
        createdAt: googleData?.user?.createdAt || "",
        updatedAt: googleData?.user?.updatedAt || "",
        userPoint: googleData?.user?.userPoint || 0,
        roles: googleData?.roles || [],
      };

      Cookies.set("access_token", googleData?.accessToken || "", {
        sameSite: "Strict",
        secure: true,
        path: "/",
      });

      Cookies.set("user", JSON.stringify(userInfo), {
        sameSite: "Strict",
        secure: true,
        path: "/",
      });

      // Save to localStorage with expiration
      saveAuthToStorage(userInfo, googleData?.accessToken);

      return {
        data: {
          user: userInfo,
          accessToken: googleData?.accessToken,
          roles: googleData?.roles
        }
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const initiateGoogleLogin = createAsyncThunk(
  "auth/initiateGoogleLogin",
  async (_, { rejectWithValue }) => {
    try {
      await redirectToGoogle();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const handleGoogleCallback = createAsyncThunk(
  "auth/handleGoogleCallback",
  async ({ code, redirectUri }, { rejectWithValue }) => {
    try {
      const data = await exchangeGoogleCodeForToken(code, redirectUri);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const fetchUserInfo = createAsyncThunk(
  "auth/fetchUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("access_token");
      const response = await api.get("/users/view", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // user data mới
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoggedIn: false,
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
    // New action to restore auth state from localStorage
    restoreAuthState: (state) => {
      const authData = getAuthFromStorage();
      if (authData) {
        state.user = authData.user;
        state.isLoggedIn = true;
      }
    },
    // New action to clear auth state
    clearAuthState: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      clearAuthFromStorage();
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
        state.isLoggedIn = true;
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
        state.isLoggedIn = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if logout API fails, clear the state
        state.user = null;
        state.isLoggedIn = false;
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
      })

      // Google OAuth
      .addCase(googleLoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLoginUser.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.loading = false;
        state.isLoggedIn = true;
      })
      .addCase(googleLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(initiateGoogleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiateGoogleLogin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(initiateGoogleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(handleGoogleCallback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleGoogleCallback.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(handleGoogleCallback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
  .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
  .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
      },
});

export const { clearAuthError, setUser, restoreAuthState, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
