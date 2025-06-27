import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadParentCategories,
  loadSubCategories,
  createParentCategory,
  createSubCategory,
  editParentCategory,
  editSubCategory,
  removeParentCategory,
  removeSubCategory,
  searchCategoryList,
} from "../redux/slices/categorySlice";

const CategoryTest = () => {
  const dispatch = useDispatch();
  const { parentList, subCategoryMap, searchResults, loading, error } =
    useSelector((state) => state.category);

  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    dispatch(loadParentCategories());
  }, [dispatch]);

  const handleLoadSub = (parentId) => {
    dispatch(loadSubCategories(parentId));
  };

  const handleAddParent = () => {
    dispatch(
      createParentCategory({
        id: 0,
        name: "Điện tử",
        description: "Các sản phẩm điện tử",
        parentId: 0,
      })
    );
  };

  const handleAddSub = (parentId) => {
    dispatch(
      createSubCategory({
        parentId,
        categoryData: { name: "Laptop", description: "Máy tính xách tay" },
      })
    );
  };

  const handleEditParent = (id) => {
    dispatch(
      editParentCategory({
        id,
        updatedData: {
          name: "Điện tử - Updated",
          description: "Updated mô tả",
        },
      })
    );
  };

  const handleEditSub = (id, parentId) => {
    dispatch(
      editSubCategory({
        id,
        updatedData: {
          name: "Laptop - Updated",
          description: "Mô tả cập nhật",
          parentId,
        },
      })
    );
  };

  const handleDeleteParent = (id) => {
    dispatch(removeParentCategory(id));
  };

  const handleDeleteSub = (id) => {
    dispatch(removeSubCategory(id));
  };

  const handleSearch = () => {
    dispatch(searchCategoryList(keyword));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Test Category Slice</h2>
      {loading && <p>Đang tải...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleAddParent}>+ Thêm danh mục cha</button>

      <div>
        <h3>Danh mục cha</h3>
        {parentList.map((parent) => (
          <div key={parent.id}>
            <strong>{parent.name}</strong>
            <button onClick={() => handleEditParent(parent.id)}>Sửa</button>
            <button onClick={() => handleDeleteParent(parent.id)}>Xóa</button>
            <button onClick={() => handleAddSub(parent.id)}>+ Thêm con</button>
            <button onClick={() => handleLoadSub(parent.id)}>Hiện con</button>

            {subCategoryMap[parent.id] &&
              subCategoryMap[parent.id].map((child) => (
                <div key={child.id} style={{ paddingLeft: 20 }}>
                  └ {child.name}
                  <button onClick={() => handleEditSub(child.id, parent.id)}>
                    Sửa
                  </button>
                  <button onClick={() => handleDeleteSub(child.id)}>Xóa</button>
                </div>
              ))}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40 }}>
        <h3>Tìm kiếm danh mục</h3>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Từ khóa..."
        />
        <button onClick={handleSearch}>Tìm</button>
        {searchResults.length > 0 && (
          <ul>
            {searchResults.map((cat) => (
              <li key={cat.id}>
                {cat.name} - {cat.description}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoryTest;
