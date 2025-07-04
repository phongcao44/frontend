import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchParentCategories,
  fetchSubCategories,
  fetchParentLine,
  fetchFlatCategoryList,
  addCategory,
  addParentCategory,
  addSubCategory,
  updateParentCategory,
  updateSubCategory,
  deleteParentCategory,
  deleteSubCategory,
  searchCategories,
  fetchCategoryTree,
} from "../../services/categoryService";

export const loadParentCategories = createAsyncThunk(
  "category/loadParent",
  async (
    { page = 0, limit = 100, sortBy = "id", orderBy = "asc" } = {},
    thunkAPI
  ) => {
    try {
      const data = await fetchParentCategories(page, limit, sortBy, orderBy);
      return data.content || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const loadSubCategories = createAsyncThunk(
  "category/loadSub",
  async (parentId, thunkAPI) => {
    try {
      const data = await fetchSubCategories(parentId);
      return { parentId, data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const loadParentLine = createAsyncThunk(
  "category/loadParentLine",
  async (sonId, thunkAPI) => {
    try {
      const data = await fetchParentLine(sonId);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const loadFlatCategoryList = createAsyncThunk(
  "category/loadFlatList",
  async (_, thunkAPI) => {
    try {
      const data = await fetchFlatCategoryList();
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  "category/add",
  async (categoryData, thunkAPI) => {
    try {
      const data = await addCategory(categoryData);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createParentCategory = createAsyncThunk(
  "category/addParent",
  async (categoryData, thunkAPI) => {
    try {
      const data = await addParentCategory(categoryData);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createSubCategory = createAsyncThunk(
  "category/addSub",
  async ({ parentId, categoryData }, thunkAPI) => {
    try {
      const data = await addSubCategory(parentId, categoryData);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const editParentCategory = createAsyncThunk(
  "category/updateParent",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const data = await updateParentCategory(id, updatedData);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const editSubCategory = createAsyncThunk(
  "category/updateSub",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const data = await updateSubCategory(id, updatedData);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const removeParentCategory = createAsyncThunk(
  "category/deleteParent",
  async (id, thunkAPI) => {
    try {
      await deleteParentCategory(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const removeSubCategory = createAsyncThunk(
  "category/deleteSub",
  async (id, thunkAPI) => {
    try {
      await deleteSubCategory(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const searchCategoryList = createAsyncThunk(
  "category/search",
  async (keyword, thunkAPI) => {
    try {
      const data = await searchCategories(keyword);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const loadCategoryTree = createAsyncThunk(
  "category/loadTree",
  async (_, thunkAPI) => {
    try {
      const data = await fetchCategoryTree();
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    parentList: [],
    subCategoryMap: {},
    parentLine: [],
    flatCategoryList: [],
    searchResults: [],
    loading: false,
    error: null,
    categoryTree: [],
    loadingTree: false,
    errorTree: null,
    loadingParentLine: false,
    errorParentLine: null,
    loadingFlatList: false,
    errorFlatList: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCategoryTree.pending, (state) => {
        state.loadingTree = true;
        state.errorTree = null;
      })
      .addCase(loadCategoryTree.fulfilled, (state, action) => {
        state.categoryTree = action.payload;
        state.loadingTree = false;
      })
      .addCase(loadCategoryTree.rejected, (state, action) => {
        state.loadingTree = false;
        state.errorTree = action.payload;
      })

      .addCase(loadParentCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadParentCategories.fulfilled, (state, action) => {
        state.parentList = action.payload;
        state.loading = false;
      })
      .addCase(loadParentCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loadSubCategories.fulfilled, (state, action) => {
        const { parentId, data } = action.payload;
        state.subCategoryMap[parentId] = data;
      })

      .addCase(loadParentLine.pending, (state) => {
        state.loadingParentLine = true;
        state.errorParentLine = null;
      })
      .addCase(loadParentLine.fulfilled, (state, action) => {
        state.parentLine = action.payload;
        state.loadingParentLine = false;
      })
      .addCase(loadParentLine.rejected, (state, action) => {
        state.loadingParentLine = false;
        state.errorParentLine = action.payload;
      })

      .addCase(loadFlatCategoryList.pending, (state) => {
        state.loadingFlatList = true;
        state.errorFlatList = null;
      })
      .addCase(loadFlatCategoryList.fulfilled, (state, action) => {
        state.flatCategoryList = action.payload;
        state.loadingFlatList = false;
      })
      .addCase(loadFlatCategoryList.rejected, (state, action) => {
        state.loadingFlatList = false;
        state.errorFlatList = action.payload;
      })

      .addCase(createCategory.fulfilled, (state, action) => {
        state.parentList.push(action.payload);
        state.flatCategoryList.push(action.payload);
      })

      .addCase(createParentCategory.fulfilled, (state, action) => {
        state.parentList.push(action.payload);
        state.flatCategoryList.push(action.payload);
      })

      .addCase(createSubCategory.fulfilled, (state, action) => {
        const newSub = action.payload;
        const parentId = newSub.parentId;
        if (!state.subCategoryMap[parentId]) {
          state.subCategoryMap[parentId] = [];
        }
        state.subCategoryMap[parentId].push(newSub);
        state.flatCategoryList.push(newSub);
      })

      .addCase(editParentCategory.fulfilled, (state, action) => {
        const index = state.parentList.findIndex(
          (cat) => cat.id === action.payload.id
        );
        if (index !== -1) {
          state.parentList[index] = action.payload;
        }
        const flatIndex = state.flatCategoryList.findIndex(
          (cat) => cat.id === action.payload.id
        );
        if (flatIndex !== -1) {
          state.flatCategoryList[flatIndex] = action.payload;
        }
      })

      .addCase(editSubCategory.fulfilled, (state, action) => {
        const updated = action.payload;
        const parentId = updated.parentId;
        const list = state.subCategoryMap[parentId] || [];
        const index = list.findIndex((cat) => cat.id === updated.id);
        if (index !== -1) {
          list[index] = updated;
        }
        const flatIndex = state.flatCategoryList.findIndex(
          (cat) => cat.id === updated.id
        );
        if (flatIndex !== -1) {
          state.flatCategoryList[flatIndex] = updated;
        }
      })

      .addCase(removeParentCategory.fulfilled, (state, action) => {
        state.parentList = state.parentList.filter(
          (cat) => cat.id !== action.payload
        );
        state.flatCategoryList = state.flatCategoryList.filter(
          (cat) => cat.id !== action.payload
        );
        delete state.subCategoryMap[action.payload];
      })

      .addCase(removeSubCategory.fulfilled, (state, action) => {
        const id = action.payload;
        Object.keys(state.subCategoryMap).forEach((parentId) => {
          state.subCategoryMap[parentId] = state.subCategoryMap[
            parentId
          ].filter((cat) => cat.id !== id);
        });
        state.flatCategoryList = state.flatCategoryList.filter(
          (cat) => cat.id !== action.payload
        );
      })

      .addCase(searchCategoryList.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      });
  },
});

export default categorySlice.reducer;
