import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    fetchProductSpecifications,
    fetchProductSpecificationById,
    fetchProductSpecificationByIdForUser, // Added import
    createProductSpecification,
    updateProductSpecification,
    deleteProductSpecification,
} from "../../services/productSpecificationService";

// Get All
export const getAllProductSpecifications = createAsyncThunk(
    "productSpecification/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchProductSpecifications();
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Get By ID (for admin)
export const getProductSpecificationById = createAsyncThunk(
    "productSpecification/getById",
    async (id, { rejectWithValue }) => {
        try {
            const data = await fetchProductSpecificationById(id);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Get By ID (for user)
export const getProductSpecificationByIdForUser = createAsyncThunk(
    "productSpecification/getByIdForUser",
    async (id, { rejectWithValue }) => {
        try {
            const data = await fetchProductSpecificationByIdForUser(id);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Create
export const addProductSpecification = createAsyncThunk(
    "productSpecification/add",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await createProductSpecification(payload);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Update
export const editProductSpecification = createAsyncThunk(
    "productSpecification/update",
    async ({ id, requestDTO }, { rejectWithValue }) => {
        try {
            const data = await updateProductSpecification(id, requestDTO);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Delete
export const removeProductSpecification = createAsyncThunk(
    "productSpecification/delete",
    async (id, { rejectWithValue }) => {
        try {
            await deleteProductSpecification(id);
            return id;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const productSpecificationSlice = createSlice({
    name: "productSpecification",
    initialState: {
        items: [],
        current: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearProductSpecificationError: (state) => {
            state.error = null;
        },
        clearCurrentProductSpecification: (state) => {
            state.current = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // GET ALL
            .addCase(getAllProductSpecifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllProductSpecifications.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(getAllProductSpecifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // GET BY ID (for admin)
            .addCase(getProductSpecificationById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductSpecificationById.fulfilled, (state, action) => {
                state.loading = false;
                state.current = action.payload;
            })
            .addCase(getProductSpecificationById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // GET BY ID (for user)
            .addCase(getProductSpecificationByIdForUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductSpecificationByIdForUser.fulfilled, (state, action) => {
                state.loading = false;
                state.current = action.payload;
            })
            .addCase(getProductSpecificationByIdForUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // CREATE
            .addCase(addProductSpecification.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProductSpecification.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(addProductSpecification.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // UPDATE
            .addCase(editProductSpecification.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editProductSpecification.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
            })
            .addCase(editProductSpecification.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // DELETE
            .addCase(removeProductSpecification.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeProductSpecification.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((s) => s.id !== action.payload);
            })
            .addCase(removeProductSpecification.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const {
    clearProductSpecificationError,
    clearCurrentProductSpecification,
} = productSpecificationSlice.actions;

export default productSpecificationSlice.reducer;