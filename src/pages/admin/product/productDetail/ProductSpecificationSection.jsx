/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Card, Checkbox, Input, Button, Space, Divider } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const ProductSpecificationSection = ({ onChange, defaultSpecifications = [] }) => {
  const [enabled, setEnabled] = useState(defaultSpecifications.length > 0);
  const [specifications, setSpecifications] = useState(defaultSpecifications);

  useEffect(() => {
    if (enabled) {
      onChange(specifications);
    } else {
      onChange([]);
    }
  }, [enabled, specifications]);

  const handleAdd = () => {
    setSpecifications([...specifications, { name: "", value: "" }]);
  };

  const handleRemove = (index) => {
    const updated = specifications.filter((_, i) => i !== index);
    setSpecifications(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  return (
    <Card title="Thông số kỹ thuật" className="mb-4">
      <Checkbox
        checked={enabled}
        onChange={(e) => setEnabled(e.target.checked)}
        className="mb-4"
      >
        Sản phẩm này có thông số kỹ thuật. Ví dụ: chất liệu, , xuất xứ...
      </Checkbox>

      {enabled && (
        <>
          <Divider className="my-2" />
          {specifications.map((spec, index) => (
            <Space
              key={index}
              style={{ display: "flex", marginBottom: 8 }}
              align="start"
            >
              <Input
                placeholder="Tên thông số"
                value={spec.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
              <Input
                placeholder="Giá trị"
                value={spec.value}
                onChange={(e) => handleChange(index, "value", e.target.value)}
              />
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleRemove(index)}
              />
            </Space>
          ))}
          <Button type="dashed" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm thông số
          </Button>
        </>
      )}
    </Card>
  );
};

export default ProductSpecificationSection;
