/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Form, Select, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  loadCategoryTree,
  loadParentLine,
} from "../../../../redux/slices/categorySlice";

const { Option } = Select;

const CategorySelector = ({ form }) => {
  const dispatch = useDispatch();
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [selectedChildId, setSelectedChildId] = useState(null);

  const parentLine = useSelector((state) => state.category.parentLine);
  const categoryTree = useSelector((state) => state.category.categoryTree);
  const loadingTree = useSelector((state) => state.category.loadingTree);
  const CategoryId = form.getFieldValue("category_id");

  useEffect(() => {
    dispatch(loadCategoryTree());
    if (CategoryId) {
      dispatch(loadParentLine(CategoryId));
    }
  }, [dispatch, CategoryId]);

  useEffect(() => {
    if (parentLine?.length > 0) {
      const level3 = parentLine.find((item) => item.level === 3);
      const level2 = parentLine.find((item) => item.level === 2);
      const level1 = parentLine.find((item) => item.level === 1);

      form.setFieldsValue({
        parent_category_id: level1?.id,
        child_category_id: level2?.id,
        category_id: level3?.id,
      });

      setSelectedParentId(level1?.id || null);
      setSelectedChildId(level2?.id || null);
    }
  }, [parentLine, form]);

  const handleParentChange = (parentId) => {
    setSelectedParentId(parentId);
    setSelectedChildId(null);
    form.setFieldsValue({
      parent_category_id: parentId,
      child_category_id: undefined,
      category_id: undefined,
    });
  };

  const handleChildChange = (childId) => {
    setSelectedChildId(childId);
    form.setFieldsValue({
      child_category_id: childId,
      category_id: undefined,
    });
  };

  const handleGrandChildChange = (grandChildId) => {
    form.setFieldsValue({
      category_id: grandChildId,
    });
  };

  const childCategories = selectedParentId
    ? categoryTree.find((parent) => parent.id === selectedParentId)?.children || []
    : [];

  const grandChildCategories = selectedChildId
    ? childCategories.find((child) => child.id === selectedChildId)?.children || []
    : [];

  return (
    <>
      <Form.Item
        label="Ngành hàng (Cấp 1)"
        name="parent_category_id"
        rules={[{ required: true, message: "Vui lòng chọn ngành hàng" }]}
      >
        <Select
          placeholder="Chọn ngành hàng"
          onChange={handleParentChange}
          allowClear
          loading={loadingTree}
        >
          {categoryTree.map((parent) => (
            <Option key={parent.id} value={parent.id}>
              {parent.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Danh mục con (Cấp 2)"
        name="child_category_id"
        rules={[{ required: true, message: "Vui lòng chọn danh mục con" }]}
      >
        <Select
          placeholder={
            selectedParentId ? "Chọn danh mục con" : "Chọn ngành hàng trước"
          }
          onChange={handleChildChange}
          disabled={!selectedParentId}
          allowClear
        >
          {childCategories.map((child) => (
            <Option key={child.id} value={child.id}>
              {child.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Danh mục chi tiết (Cấp 3)"
        name="category_id"
        rules={[{ required: true, message: "Vui lòng chọn danh mục chi tiết" }]}
      >
        <Select
          placeholder={
            selectedChildId
              ? "Chọn danh mục chi tiết"
              : "Chọn danh mục con trước"
          }
          onChange={handleGrandChildChange}
          disabled={!selectedChildId}
          allowClear
        >
          {grandChildCategories.map((grandchild) => (
            <Option key={grandchild.id} value={grandchild.id}>
              {grandchild.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Nhãn hàng"
        name="brand"
        rules={[{ required: true, message: "Vui lòng nhập nhãn hàng" }]}
      >
        <Input placeholder="Nhập tên nhãn hàng" />
      </Form.Item>
    </>
  );
};

export default CategorySelector;
