import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUsers,
  addUser,
  changeUserRole,
  deleteUserRole,
  changeUserStatus,
} from "../../services/userService";


const initialState = {
  users: [],
  loading: false,
  error: null,
};

export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchUsers();
      return data;
    } catch (error) {
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
      return rejectWithValue(error.message || "Failed to change user role");
    }
  }
);

export const removeUserRole = createAsyncThunk(
  "users/removeUserRole",
  async ({ userId, roleId }, { rejectWithValue }) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const data = await deleteUserRole(userId, roleId);
      return { userId, roleId };
    } catch (error) {
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
      return rejectWithValue(error.message || "Failed to change user status");
    }
  }
);

// User slice
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get users
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload.data);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update user role
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user.id === updatedUser.userId
            ? { ...user, roles: updatedUser.roles }
            : user
        );
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove user role
      .addCase(removeUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeUserRole.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, roleId } = action.payload;
        state.users = state.users.map((user) =>
          user.id === userId
            ? {
                ...user,
                roles: user.roles.filter((role) => role.id !== roleId),
              }
            : user
        );
      })
      .addCase(removeUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update user status
      .addCase(updateUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, status } = action.payload;
        state.users = state.users.map((user) =>
          user.id === userId ? { ...user, status } : user
        );
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
