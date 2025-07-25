/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { Form, Input, Button, Space, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const ProductSpecificationEditor = ({ form, specifications = [], onChange }) => {
  useEffect(() => {
    const normalizedSpecs = specifications.map((spec) => ({
      id: spec.id,
      key: spec.key || spec.name || spec.specKey,
      value: spec.value || spec.specValue,
    }));
    form.setFieldsValue({ specs: normalizedSpecs });
    onChange(normalizedSpecs);
  }, [specifications, form, onChange]);

  const checkForDuplicateKey = (specs, newKey, currentIndex) => {
    return specs.some(
      (spec, index) =>
        index !== currentIndex &&
        spec.key?.trim().toLowerCase() === newKey?.trim().toLowerCase() &&
        newKey !== ""
    );
  };

  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid #eee",
        borderRadius: 8,
        marginBottom: 24,
      }}
    >
      <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Thông số kỹ thuật</h3>

      <Form.List name="specs">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{ display: "flex", marginBottom: 8 }}
                align="baseline"
              >
                <Form.Item
                  {...restField}
                  name={[name, "key"]}
                  rules={[
                    { required: true, message: "Nhập tên thông số" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const specs = getFieldValue("specs") || [];
                        if (
                          checkForDuplicateKey(specs, value, name)
                        ) {
                          return Promise.reject(
                            new Error("Tên thông số đã tồn tại")
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input
                    placeholder="Tên thông số (VD: Màn hình)"
                    onChange={() => {
                      const updatedSpecs = form.getFieldValue("specs") || [];
                      onChange(updatedSpecs);
                    }}
                  />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "value"]}
                  rules={[{ required: true, message: "Nhập giá trị" }]}
                >
                  <Input
                    placeholder="Giá trị (VD: AMOLED 6.5 inch)"
                    onChange={() => {
                      const updatedSpecs = form.getFieldValue("specs") || [];
                      onChange(updatedSpecs);
                    }}
                  />
                </Form.Item>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={async () => {
                    remove(name);
                    await form.validateFields(["specs"]).catch(() => {});
                    const updatedSpecs = form.getFieldValue("specs") || [];
                    onChange(updatedSpecs);
                  }}
                />
              </Space>
            ))}

            <Button
              type="dashed"
              onClick={async () => {
                const currentSpecs = form.getFieldValue("specs") || [];
                const newSpec = { key: "", value: "" };

                add(newSpec);
                await form.validateFields(["specs"]).catch(() => {});
                const updatedSpecs = form.getFieldValue("specs") || [];
                onChange(updatedSpecs);
              }}
              icon={<PlusOutlined />}
            >
              Thêm thông số
            </Button>
          </>
        )}
      </Form.List>
    </div>
  );
};

export default ProductSpecificationEditor;