// redux/slices/blogSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllBlogs, getBlogById } from "../../services/blogService";

// Async thunk lấy toàn bộ blog
export const fetchBlogs = createAsyncThunk("blogs/fetchAll", async () => {
    const res = await getAllBlogs();
    console.log("Kết quả fetch blogs:", res); // kiểm tra ở đây
    return res;
});

// Async thunk lấy chi tiết blog
export const fetchBlogDetail = createAsyncThunk("blogs/fetchById", async (id) => {
    const res = await getBlogById(id);
    return res;
});

// ✅ Khởi tạo state ban đầu đúng cấu trúc
const initialState = {
    blogs: [],
    blogDetail: null,
    loading: false,
    error: null,
};

const blogSlice = createSlice({
    name: "blogs",
    initialState,
    reducers: {
        setBlogs: (state, action) => {
            state.blogs = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = action.payload;
            })
            .addCase(fetchBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchBlogDetail.pending, (state) => {
                state.loading = true;
                state.blogDetail = null;
            })
            .addCase(fetchBlogDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.blogDetail = action.payload; // ✅ gán đúng detail
            })
            .addCase(fetchBlogDetail.rejected, (state) => {
                state.loading = false;
                state.blogDetail = null;
            });
    }
});

// ✅ Xuất reducer và actions
export const { setBlogs } = blogSlice.actions;
export default blogSlice.reducer;
