import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchReturnPolicies,
  fetchReturnPolicyById,
  createReturnPolicy,
  updateReturnPolicy,
  deleteReturnPolicy,
} from "../../services/returnPolicyService";

// Get All
export const getAllReturnPolicies = createAsyncThunk(
  "returnPolicy/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchReturnPolicies();
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Get By ID
export const getReturnPolicyById = createAsyncThunk(
  "returnPolicy/getById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await fetchReturnPolicyById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Create
export const addReturnPolicy = createAsyncThunk(
  "returnPolicy/create",
  async (requestDTO, { rejectWithValue }) => {
    try {
      const data = await createReturnPolicy(requestDTO);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//  Update
export const editReturnPolicy = createAsyncThunk(
  "returnPolicy/update",
  async ({ id, requestDTO }, { rejectWithValue }) => {
    try {
      const data = await updateReturnPolicy(id, requestDTO);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 5 Delete
export const removeReturnPolicy = createAsyncThunk(
  "returnPolicy/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteReturnPolicy(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const returnPolicySlice = createSlice({
  name: "returnPolicy",
  initialState: {
    items: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearReturnPolicyError: (state) => {
      state.error = null;
    },
    clearCurrentReturnPolicy: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(getAllReturnPolicies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllReturnPolicies.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getAllReturnPolicies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // GET BY ID
      .addCase(getReturnPolicyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReturnPolicyById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(getReturnPolicyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // CREATE
      .addCase(addReturnPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReturnPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addReturnPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // UPDATE
      .addCase(editReturnPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editReturnPolicy.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(editReturnPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // DELETE
      .addCase(removeReturnPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeReturnPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((p) => p.id !== action.payload);
      })
      .addCase(removeReturnPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearReturnPolicyError, clearCurrentReturnPolicy } =
  returnPolicySlice.actions;

export default returnPolicySlice.reducer;
