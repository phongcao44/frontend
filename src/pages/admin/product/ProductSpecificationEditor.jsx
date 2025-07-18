import React, { useEffect, useState } from "react";
import { Form, Input, Button, Space, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const ProductSpecificationEditor = ({ productId, specifications = [], onChange }) => {
  const [form] = Form.useForm();
  const [specList, setSpecList] = useState([]);

  useEffect(() => {
    setSpecList(specifications || []);
    form.setFieldsValue({ specs: specifications || [] });
  }, [specifications, form]);

  const handleAddSpec = () => {
    const newSpec = { key: "", value: "" };
    const updated = [...specList, newSpec];
    setSpecList(updated);
    onChange && onChange(updated);
  };

  const handleRemoveSpec = (index) => {
    const updated = specList.filter((_, i) => i !== index);
    setSpecList(updated);
    onChange && onChange(updated);
  };

  const handleChange = (changedValues, allValues) => {
    const updated = allValues.specs || [];
    setSpecList(updated);
    onChange && onChange(updated);
  };

  return (
    <div style={{ padding: "16px", border: "1px solid #eee", borderRadius: 8, marginBottom: 24 }}>
      <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Thông số kỹ thuật</h3>
      <Form
        form={form}
        layout="vertical"
        initialValues={{ specs: specList }}
        onValuesChange={handleChange}
      >
        {specList.map((spec, index) => (
          <Space
            key={index}
            style={{ display: "flex", marginBottom: 8 }}
            align="start"
          >
            <Form.Item
              name={["specs", index, "key"]}
              rules={[{ required: true, message: "Nhập tên thông số" }]}
            >
              <Input placeholder="Tên thông số (VD: Màn hình)" />
            </Form.Item>
            <Form.Item
              name={["specs", index, "value"]}
              rules={[{ required: true, message: "Nhập giá trị" }]}
            >
              <Input placeholder="Giá trị (VD: AMOLED 6.5 inch)" />
            </Form.Item>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleRemoveSpec(index)}
            />
          </Space>
        ))}

        <Button type="dashed" onClick={handleAddSpec} icon={<PlusOutlined />}>
          Thêm thông số
        </Button>
      </Form>
    </div>
  );
};

export default ProductSpecificationEditor;
