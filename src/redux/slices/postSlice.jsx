import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAdminPosts,
  addAdminPost,
  editAdminPost,
  deleteAdminPost,
  getAdminPostById,
  fetchPublicPosts,
  getPublicPostById,
  getRelatedPosts,
} from "../../services/postService";

export const getAdminPosts = createAsyncThunk(
  "posts/getAdminPosts",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchAdminPosts();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch admin posts");
    }
  }
);

export const createAdminPost = createAsyncThunk(
  "posts/createAdminPost",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await addAdminPost(formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to create post");
    }
  }
);

export const updateAdminPost = createAsyncThunk(
  "posts/updateAdminPost",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const data = await editAdminPost(id, formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update post");
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id, { rejectWithValue }) => {
    try {
      await deleteAdminPost(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to delete post");
    }
  }
);

export const getPostById = createAsyncThunk(
  "posts/getPostById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await getAdminPostById(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch post by id");
    }
  }
);

export const getPublicPostList = createAsyncThunk(
  "posts/getPublicPostList",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchPublicPosts();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch public posts");
    }
  }
);

export const getPublicPostDetail = createAsyncThunk(
  "posts/getPublicPostDetail",
  async (id, { rejectWithValue }) => {
    try {
      const data = await getPublicPostById(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch public post");
    }
  }
);

export const getRelatedPostList = createAsyncThunk(
  "posts/getRelatedPostList",
  async (id, { rejectWithValue }) => {
    try {
      const data = await getRelatedPosts(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch related posts");
    }
  }
);

// Slice
const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    publicPosts: [],
    relatedPosts: [],
    currentPost: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPostError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin Posts
      .addCase(getAdminPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(getAdminPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createAdminPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdminPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.push(action.payload);
      })
      .addCase(createAdminPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateAdminPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.map((p) =>
          p.id === action.payload.id ? action.payload : p
        );
      })
      .addCase(updateAdminPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter((p) => p.id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Public Posts
      .addCase(getPublicPostList.fulfilled, (state, action) => {
        state.publicPosts = action.payload;
      })
      .addCase(getPublicPostDetail.fulfilled, (state, action) => {
        state.currentPost = action.payload;
      })
      .addCase(getRelatedPostList.fulfilled, (state, action) => {
        state.relatedPosts = action.payload;
      });
  },
});

export const { clearPostError } = postSlice.actions;
export default postSlice.reducer;
