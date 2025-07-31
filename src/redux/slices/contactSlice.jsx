import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sendContactForm } from "../../services/contactService.jsx";

export const submitContactForm = createAsyncThunk(
  "contact/submitContactForm",
  async (formData, thunkAPI) => {
    try {
      const res = await sendContactForm(formData);
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Unknown error");
    }
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetContactState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContactForm.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitContactForm.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetContactState } = contactSlice.actions;
export default contactSlice.reducer;
