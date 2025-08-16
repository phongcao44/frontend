import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUsers,
  addUser,
  changeUserRole,
  deleteUserRole,
  changeUserStatus,
  getAllUsersPaginateAndFilter,
  getUserDetail,
  updateUserDetail,
  getUserView,
} from "../../services/userService";

export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchUsers();
      return Array.isArray(data) ? { content: data } : data;
    } catch (error) {
      console.error("getUsers error:", error);
      return rejectWithValue(error.message || "Failed to fetch users");
    }
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await addUser(userData);
      return data;
    } catch (error) {
      console.error("createUser error:", error);
      return rejectWithValue(error.message || "Failed to add user");
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "users/updateUserRole",
  async ({ userId, roleId }, { rejectWithValue }) => {
    try {
      const data = await changeUserRole(userId, roleId);
      return data;
    } catch (error) {
      console.error("updateUserRole error:", error);
      return rejectWithValue(error.message || "Failed to change user role");
    }
  }
);

export const removeUserRole = createAsyncThunk(
  "users/removeUserRole",
  async ({ userId, roleId }, { rejectWithValue }) => {
    try {
      const data = await deleteUserRole(userId, roleId);
      return { userId, roleId };
    } catch (error) {
      console.error("removeUserRole error:", error);
      return rejectWithValue(error.message || "Failed to delete user role");
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  "users/updateUserStatus",
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      const data = await changeUserStatus(userId, status);
      return { userId, status: data.status };
    } catch (error) {
      console.error("updateUserStatus error:", error);
      return rejectWithValue(error.message || "Failed to change user status");
    }
  }
);

export const fetchUsersPaginateAndFilter = createAsyncThunk(
  "users/fetchUsersPaginateAndFilter",
  async (params, { rejectWithValue }) => {
    try {
      console.log("Gửi API với tham số:", params);
      const data = await getAllUsersPaginateAndFilter(params);
      return data;
    } catch (error) {
      console.error("fetchUsersPaginateAndFilter error:", error.response?.data || error.message);
      return rejectWithValue(error.message || "Failed to fetch paginated users");
    }
  }
);

export const fetchUserDetail = createAsyncThunk(
  "users/fetchUserDetail",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await getUserDetail(userId);
      return data;
    } catch (error) {
      console.error("fetchUserDetail error:", error);
      return rejectWithValue(error.message || "Failed to fetch user detail");
    }
  }
);

export const updateUserDetailThunk = createAsyncThunk(
  "users/updateUserDetail",
  async (userDetailRequest, { rejectWithValue }) => {
    try {
      const data = await updateUserDetail(userDetailRequest);
      return data;
    } catch (error) {
      console.error("updateUserDetailThunk error:", error);
      return rejectWithValue(error.response?.data || error.message || "Failed to update user detail");
    }
  }
);

export const fetchUserView = createAsyncThunk(
  "users/fetchUserView",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Dispatching fetchUserView");
      const data = await getUserView();
      return data;
    } catch (error) {
      console.error("fetchUserView error:", error);
      return rejectWithValue(error.message || "Failed to fetch user view");
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: {
      content: [],
      pageable: {},
      last: false,
      totalPages: 0,
      totalElements: 0,
    },
    userDetail: null,
    loading: {
      getUsers: false,
      createUser: false,
      updateUserRole: false,
      removeUserRole: false,
      updateUserStatus: false,
      fetchUsersPaginateAndFilter: false,
      fetchUserDetail: false,
      updateUserDetail: false,
      fetchUserView: false,
    },
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUserDetail: (state) => {
      state.userDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get users
      .addCase(getUsers.pending, (state) => {
        state.loading.getUsers = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading.getUsers = false;
        state.users.content = action.payload.content || action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading.getUsers = false;
        state.error = action.payload;
      })

      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading.createUser = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading.createUser = false;
        state.users.content.push(action.payload.data);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading.createUser = false;
        state.error = action.payload;
      })

      // Update user role
      .addCase(updateUserRole.pending, (state) => {
        state.loading.updateUserRole = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading.updateUserRole = false;
        const updatedUser = action.payload;
        if (state.users.content && Array.isArray(state.users.content)) {
          state.users.content = state.users.content.map((user) =>
            user.id === updatedUser.userId
              ? { ...user, roles: updatedUser.roles }
              : user
          );
        }
        if (state.userDetail && state.userDetail.userId === updatedUser.userId) {
          state.userDetail = { ...state.userDetail, roles: updatedUser.roles };
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading.updateUserRole = false;
        state.error = action.payload;
      })

      // Remove user role
      .addCase(removeUserRole.pending, (state) => {
        state.loading.removeUserRole = true;
        state.error = null;
      })
      .addCase(removeUserRole.fulfilled, (state, action) => {
        state.loading.removeUserRole = false;
        const { userId, roleId } = action.payload;
        if (state.users.content && Array.isArray(state.users.content)) {
          state.users.content = state.users.content.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  roles: (user.roles || []).filter((role) => role.id !== roleId),
                }
              : user
          );
        }
        if (state.userDetail && state.userDetail.userId === userId) {
          state.userDetail = {
            ...state.userDetail,
            roles: (state.userDetail.roles || []).filter(
              (role) => role.id !== roleId
            ),
          };
        }
      })
      .addCase(removeUserRole.rejected, (state, action) => {
        state.loading.removeUserRole = false;
        state.error = action.payload;
      })

      // Get authenticated user's view
      .addCase(fetchUserView.pending, (state) => {
        state.loading.fetchUserView = true;
        state.error = null;
      })
      .addCase(fetchUserView.fulfilled, (state, action) => {
        state.loading.fetchUserView = false;
        state.userDetail = action.payload;
      })
      .addCase(fetchUserView.rejected, (state, action) => {
        state.loading.fetchUserView = false;
        state.error = action.payload;
      })

      // Update user status
      .addCase(updateUserStatus.pending, (state) => {
        state.loading.updateUserStatus = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.loading.updateUserStatus = false;
        const { userId, status } = action.payload;
        if (state.users.content && Array.isArray(state.users.content)) {
          state.users.content = state.users.content.map((user) =>
            user.id === userId ? { ...user, status } : user
          );
        } else {
          console.warn("state.users.content is not an array:", state.users.content);
        }
        if (state.userDetail && state.userDetail.userId === userId) {
          state.userDetail = { ...state.userDetail, status };
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.loading.updateUserStatus = false;
        state.error = action.payload;
      })

      // Fetch users with pagination and filter
      .addCase(fetchUsersPaginateAndFilter.pending, (state) => {
        state.loading.fetchUsersPaginateAndFilter = true;
        state.error = null;
      })
      .addCase(fetchUsersPaginateAndFilter.fulfilled, (state, action) => {
        state.loading.fetchUsersPaginateAndFilter = false;
        state.users = action.payload;
      })
      .addCase(fetchUsersPaginateAndFilter.rejected, (state, action) => {
        state.loading.fetchUsersPaginateAndFilter = false;
        state.error = action.payload;
      })
      // Get user detail
      .addCase(fetchUserDetail.pending, (state) => {
        state.loading.fetchUserDetail = true;
        state.error = null;
      })
      .addCase(fetchUserDetail.fulfilled, (state, action) => {
        state.loading.fetchUserDetail = false;
        state.userDetail = action.payload;
      })
      .addCase(fetchUserDetail.rejected, (state, action) => {
        state.loading.fetchUserDetail = false;
        state.error = action.payload;
      })

      // Update user detail
      .addCase(updateUserDetailThunk.pending, (state) => {
        state.loading.updateUserDetail = true;
        state.error = null;
      })
      .addCase(updateUserDetailThunk.fulfilled, (state, action) => {
        state.loading.updateUserDetail = false;
        state.userDetail = action.payload;
        if (state.users.content && Array.isArray(state.users.content)) {
          state.users.content = state.users.content.map((user) =>
            user.id === action.payload.userId
              ? { ...user, ...action.payload }
              : user
          );
        }
      })
      .addCase(updateUserDetailThunk.rejected, (state, action) => {
        state.loading.updateUserDetail = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearUserDetail } = userSlice.actions;
export default userSlice.reducer;