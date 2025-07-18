import { useEffect, useState } from "react";
import { Form, Select, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { loadCategoryTree } from "../../../redux/slices/categorySlice";

const { Option } = Select;

// eslint-disable-next-line react/prop-types
const CategorySelector = ({ form }) => {
  const dispatch = useDispatch();
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [selectedChildId, setSelectedChildId] = useState(null);

  const categoryTree = useSelector((state) => state.category.categoryTree);
  const loadingTree = useSelector((state) => state.category.loadingTree);

  useEffect(() => {
    dispatch(loadCategoryTree());
  }, [dispatch]);

  const handleParentChange = (parentId) => {
    setSelectedParentId(parentId);
    setSelectedChildId(null);
    // eslint-disable-next-line react/prop-types
    form.setFieldsValue({ child_category_id: undefined, category_id: undefined });
  };

  const handleChildChange = (childId) => {
    setSelectedChildId(childId);
    // eslint-disable-next-line react/prop-types
    form.setFieldsValue({ category_id: undefined });
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
        label="Ngành hàng (Danh mục cha)"
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
        label="Danh mục con"
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
        label="Danh mục chi tiết"
        name="category_id"
        rules={[{ required: true, message: "Vui lòng chọn danh mục chi tiết" }]}
      >
        <Select
          placeholder={
            selectedChildId
              ? "Chọn danh mục chi tiết"
              : "Chọn danh mục con trước"
          }
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