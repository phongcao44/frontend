import { useEffect, useState } from "react";
import { Form, Select, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  loadParentCategories,
  loadSubCategories,
} from "../../redux/slices/categorySlice";

const { Option } = Select;

// eslint-disable-next-line react/prop-types
const CategorySelector = ({ form }) => {
  const dispatch = useDispatch();
  const [selectedParentId, setSelectedParentId] = useState(null);

  const parentCategories = useSelector((state) => state.category.parentList);
  const subCategoryMap = useSelector((state) => state.category.subCategoryMap);
  const subCategories = subCategoryMap[selectedParentId] || [];

  useEffect(() => {
    dispatch(loadParentCategories());
  }, [dispatch]);

  const handleParentChange = (parentId) => {
    setSelectedParentId(parentId);
    // eslint-disable-next-line react/prop-types
    form.setFieldsValue({ category_id: undefined });
    if (parentId) {
      dispatch(loadSubCategories(parentId));
    }
  };

  return (
    <>
      {/* Danh mục cha */}
      <Form.Item
        label="Ngành hàng (Danh mục cha)"
        name="parent_category_id"
        rules={[{ required: true, message: "Vui lòng chọn ngành hàng" }]}
      >
        <Select
          placeholder="Chọn ngành hàng"
          onChange={handleParentChange}
          allowClear
        >
          {parentCategories.map((parent) => (
            <Option key={parent.id} value={parent.id}>
              {parent.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Danh mục con */}
      <Form.Item
        label="Danh mục con"
        name="category_id"
        rules={[{ required: true, message: "Vui lòng chọn danh mục con" }]}
      >
        <Select
          placeholder={
            selectedParentId ? "Chọn danh mục con" : "Chọn ngành hàng trước"
          }
          disabled={!selectedParentId}
          allowClear
        >
          {subCategories.map((child) => (
            <Option key={child.id} value={child.id}>
              {child.name}
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
