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
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const data = await logout();
      clearAuthFromStorage();
      Cookies.remove("access_token");
      Cookies.remove("user");
      dispatch(clearAuthState()); // Dispatch clearAuthState to reset Redux state
      return data;
    } catch (error) {
      clearAuthFromStorage();
      Cookies.remove("access_token");
      Cookies.remove("user");
      dispatch(clearAuthState()); // Dispatch clearAuthState even if API fails
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

export const googleLoginUser = createAsyncThunk(
  "auth/googleLogin",
  async (googleData, { rejectWithValue }) => {
    try {
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
      return response.data;
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
    restoreAuthState: (state) => {
      const authData = getAuthFromStorage();
      if (authData) {
        state.user = authData.user;
        state.isLoggedIn = true;
      }
    },
    clearAuthState: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
      clearAuthFromStorage();
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.error = null;
      })
      .addCase(forgotPasswordUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPasswordUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(resetPasswordUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPasswordUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(changePasswordUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePasswordUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePasswordUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
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
      .addCase(handleGoogleCallback.fulfilled, (state) => {
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