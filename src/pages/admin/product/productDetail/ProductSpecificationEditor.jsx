/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { Form, Input, Button, Space, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const ProductSpecificationEditor = ({ form, specifications = [], onChange }) => {
  useEffect(() => {
    const normalizedSpecs = specifications.map((spec) => ({
      id: spec.id,
      key: spec.key || spec.name || spec.specKey || "",
      value: spec.value || spec.specValue || "",
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

  const validateKey = (_, value) => {
    if (!value || !value.trim()) {
      return Promise.reject(new Error("Tên thông số không được để trống"));
    }
    if (value.trim().length < 2 || value.trim().length > 50) {
      return Promise.reject(new Error("Tên thông số phải từ 2 đến 50 ký tự"));
    }
    const validKeyPattern = /^[a-zA-Z0-9\s\-\&\/\(\)\.\u00C0-\u1EF9]*$/;
    if (!validKeyPattern.test(value.trim())) {
      return Promise.reject(
        new Error(
          "Tên thông số chỉ được chứa chữ, số, khoảng trắng, hoặc các ký tự -, &, /, (, ), ."
        )
      );
    }
    const hasHTML = /<[a-z][\s\S]*>/i.test(value);
    if (hasHTML) {
      return Promise.reject(new Error("Tên thông số không được chứa thẻ HTML"));
    }
    const specs = form.getFieldValue("specs") || [];
    const currentIndex = _.field.split(".")[1];
    if (checkForDuplicateKey(specs, value, Number(currentIndex))) {
      return Promise.reject(new Error("Tên thông số đã tồn tại"));
    }
    return Promise.resolve();
  };

  const validateValue = (_, value) => {
    if (!value || !value.trim()) {
      return Promise.reject(new Error("Giá trị không được để trống"));
    }
    if (value.trim().length < 2 || value.trim().length > 500) {
      return Promise.reject(new Error("Giá trị phải từ 2 đến 500 ký tự"));
    }
    const validValuePattern = /^[a-zA-Z0-9\s\-\&\/\(\)\.\%\:\,\u00C0-\u1EF9]*$/;
    if (!validValuePattern.test(value.trim())) {
      return Promise.reject(
        new Error(
          "Giá trị chỉ được chứa chữ, số, khoảng trắng, hoặc các ký tự -, &, /, (, ), ., %, :, ,"
        )
      );
    }
    const hasHTML = /<[a-z][\s\S]*>/i.test(value);
    if (hasHTML) {
      return Promise.reject(new Error("Giá trị không được chứa thẻ HTML"));
    }
    return Promise.resolve();
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
                  rules={[{ validator: validateKey }]}
                >
                  <Input
                    placeholder="Tên thông số (VD: Màn hình)"
                    onChange={async () => {
                      try {
                        await form.validateFields([["specs", name, "key"]]);
                        const updatedSpecs = form.getFieldValue("specs") || [];
                        onChange(updatedSpecs);
                      } catch (error) {
                        // Skip onChange if validation fails
                      }
                    }}
                  />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "value"]}
                  rules={[{ validator: validateValue }]}
                >
                  <Input
                    placeholder="Giá trị (VD: AMOLED 6.5 inch)"
                    onChange={async () => {
                      try {
                        await form.validateFields([["specs", name, "value"]]);
                        const updatedSpecs = form.getFieldValue("specs") || [];
                        onChange(updatedSpecs);
                      } catch (error) {
                        // Skip onChange if validation fails
                      }
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