import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sendContactForm, getAdminContacts, deleteAdminContact } from "../../services/contactService.jsx";

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

// Admin: fetch all contacts
export const fetchAdminContacts = createAsyncThunk(
  "contact/fetchAdminContacts",
  async (_, thunkAPI) => {
    try {
      const res = await getAdminContacts();
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Unknown error");
    }
  }
);

// Admin: delete a contact by id
export const removeAdminContact = createAsyncThunk(
  "contact/removeAdminContact",
  async (id, thunkAPI) => {
    try {
      const res = await deleteAdminContact(id);
      return { id, res };
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
    // Admin state
    contacts: [],
    listLoading: false,
    listError: null,
    deleteLoadingId: null,
    deleteError: null,
  },
  reducers: {
    resetContactState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      // keep admin list as-is
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
      })
      // Admin: fetch contacts
      .addCase(fetchAdminContacts.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchAdminContacts.fulfilled, (state, action) => {
        state.listLoading = false;
        state.contacts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAdminContacts.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload;
      })
      // Admin: delete contact
      .addCase(removeAdminContact.pending, (state, action) => {
        state.deleteLoadingId = action.meta.arg;
        state.deleteError = null;
      })
      .addCase(removeAdminContact.fulfilled, (state, action) => {
        state.deleteLoadingId = null;
        const id = action.payload?.id;
        if (id != null) {
          state.contacts = state.contacts.filter((c) => c.id !== id);
        }
      })
      .addCase(removeAdminContact.rejected, (state, action) => {
        state.deleteLoadingId = null;
        state.deleteError = action.payload;
      });
  },
});

export const { resetContactState } = contactSlice.actions;
export default contactSlice.reducer;
