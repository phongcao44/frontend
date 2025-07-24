/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Typography,
  Divider,
  Select,
  InputNumber,
  Input,
  Button,
  Row,
  Col,
  Space,
  Popconfirm,
  Modal,
  message,
} from "antd";
import { useDispatch } from "react-redux";
import { createColor } from "../../../../redux/slices/colorSlice";
import { createSize } from "../../../../redux/slices/sizeSlice";

const { Title } = Typography;
const { Option } = Select;

export default function VariantFormPanel({
  variantForm,
  colors,
  sizes,
  isEditMode,
  onChange,
  onCancel,
  onSave,
  onDelete,
  variants,
}) {
  const dispatch = useDispatch();

  const [colorModalVisible, setColorModalVisible] = useState(false);
  const [sizeModalVisible, setSizeModalVisible] = useState(false);

  const [newColor, setNewColor] = useState({ name: "", hexCode: "#000000" });
  const [newSize, setNewSize] = useState({ name: "", description: "" });

  const isValidHexColor = (hex) => /^#[0-9A-F]{6}$/i.test(hex);

  const validateVariant = () => {
    // Check if both colorId and sizeId are null
    if (!variantForm.colorId && !variantForm.sizeId) {
      message.warning("Vui lòng chọn ít nhất một màu sắc hoặc kích thước!");
      return false;
    }

    // Check for duplicate variant
    const duplicate = variants?.some(
      (v) =>
        v.colorId === variantForm.colorId &&
        v.sizeId === variantForm.sizeId &&
        // In edit mode, ignore the current variant if id exists
        (isEditMode ? v.id !== variantForm.id : true)
    );

    if (duplicate) {
      message.warning("Biến thể với màu và kích thước này đã tồn tại!");
      return false;
    }

    // Validate price
    if (variantForm.price === null || variantForm.price === undefined) {
      message.warning("Vui lòng nhập giá bán!");
      return false;
    }
    if (isNaN(variantForm.price) || variantForm.price <= 0) {
      message.warning("Giá bán phải là số dương lớn hơn 0!");
      return false;
    }
    if (variantForm.price > 1000000000) {
      message.warning("Giá bán không được vượt quá 1 tỷ đồng!");
      return false;
    }

    // Validate stock
    if (variantForm.stock === null || variantForm.stock === undefined) {
      message.warning("Vui lòng nhập số lượng tồn!");
      return false;
    }
    if (isNaN(variantForm.stock) || variantForm.stock < 0) {
      message.warning("Số lượng tồn phải là số không âm!");
      return false;
    }
    if (!Number.isInteger(variantForm.stock)) {
      message.warning("Số lượng tồn phải là số nguyên!");
      return false;
    }
    if (variantForm.stock > 1000000) {
      message.warning("Số lượng tồn không được vượt quá 1 triệu!");
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateVariant()) return;
    onSave();
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div>
        <Title level={5}>
          {isEditMode ? "Thông tin biến thể" : "Thêm biến thể mới"}
        </Title>
        <Divider style={{ borderColor: "#d9d9d9", margin: "12px 0" }} />
      </div>

      <div>
        <Title level={5}>Màu sắc</Title>
        <Select
          value={variantForm.colorId}
          onChange={(value) => onChange("colorId", value)}
          style={{ width: "100%" }}
          placeholder="Chọn màu"
          allowClear
        >
          {colors.map((c) => (
            <Option key={c.id} value={c.id}>
              {c.name}
            </Option>
          ))}
        </Select>
        {!isEditMode && (
          <Button
            type="link"
            onClick={() => setColorModalVisible(true)}
            style={{ marginTop: 8 }}
          >
            + Thêm màu mới
          </Button>
        )}
      </div>

      <div>
        <Title level={5}>Kích thước</Title>
        <Select
          value={variantForm.sizeId}
          onChange={(value) => onChange("sizeId", value)}
          style={{ width: "100%" }}
          placeholder="Chọn size"
          allowClear
        >
          {sizes.map((s) => (
            <Option key={s.id} value={s.id}>
              {s.sizeName}
            </Option>
          ))}
        </Select>
        {!isEditMode && (
          <Button
            type="link"
            onClick={() => setSizeModalVisible(true)}
            style={{ marginTop: 8 }}
          >
            + Thêm kích thước mới
          </Button>
        )}
      </div>

      <div>
        <Title level={5}>Giá bán</Title>
        <InputNumber
          value={variantForm.price}
          style={{ width: "100%" }}
          onChange={(value) => onChange("price", value)}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          addonAfter="₫"
          min={0}
          step={1000}
        />
      </div>

      <div>
        <Title level={5}>Số lượng tồn</Title>
        <InputNumber
          value={variantForm.stock}
          style={{ width: "100%" }}
          onChange={(value) => onChange("stock", value)}
          min={0}
          step={1}
          precision={0} // Ensure integer input
        />
      </div>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={isEditMode ? 8 : 12}>
          <Button block onClick={onCancel}>
            Hủy
          </Button>
        </Col>

        <Col span={isEditMode ? 8 : 12}>
          <Button type="primary" block onClick={handleSave}>
            {isEditMode ? "Lưu" : "Thêm mới"}
          </Button>
        </Col>

        {isEditMode && (
          <Col span={8}>
            <Popconfirm
              title="Bạn có chắc chắn xóa biến thể này?"
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={onDelete}
            >
              <Button danger block>
                Xóa
              </Button>
            </Popconfirm>
          </Col>
        )}
      </Row>

      <Modal
        title="Thêm màu mới"
        open={colorModalVisible}
        onOk={async () => {
          const name = newColor.name?.trim() || `Auto ${newColor.hexCode}`;
          const hexCode = newColor.hexCode;
          if (!isValidHexColor(hexCode)) {
            message.warning("Mã màu phải là định dạng hex hợp lệ (ví dụ: #FF0000)");
            return;
          }
          try {
            await dispatch(createColor({ name, hexCode })).unwrap();
            message.success("Đã thêm màu mới");
            setColorModalVisible(false);
            setNewColor({ name: "", hexCode: "#000000" });
          } catch (err) {
            message.error(`Thêm màu thất bại: ${err.message || "Không xác định"}`);
          }
        }}
        onCancel={() => {
          setColorModalVisible(false);
          setNewColor({ name: "", hexCode: "#000000" });
        }}
      >
        <Input
          placeholder="Tên màu"
          value={newColor.name}
          onChange={(e) => setNewColor((c) => ({ ...c, name: e.target.value }))}
          style={{ marginBottom: 12 }}
        />
        <Input
          placeholder="Mã màu (ví dụ: #FF0000)"
          value={newColor.hexCode}
          onChange={(e) =>
            setNewColor((c) => ({ ...c, hexCode: e.target.value }))
          }
          style={{ marginBottom: 12 }}
        />
        <Input
          type="color"
          value={newColor.hexCode}
          onChange={(e) =>
            setNewColor((c) => ({ ...c, hexCode: e.target.value }))
          }
        />
      </Modal>

      <Modal
        title="Thêm kích thước mới"
        open={sizeModalVisible}
        onOk={async () => {
          if (!newSize.name.trim()) {
            message.warning("Vui lòng nhập tên kích thước");
            return;
          }
          try {
            await dispatch(
              createSize({
                sizeName: newSize.name,
                description: newSize.description,
              })
            ).unwrap();
            message.success("Đã thêm kích thước mới");
            setSizeModalVisible(false);
            setNewSize({ name: "", description: "" });
          } catch (err) {
            message.error(`Thêm kích thước thất bại: ${err.message || "Không xác định"}`);
          }
        }}
        onCancel={() => {
          setSizeModalVisible(false);
          setNewSize({ name: "", description: "" });
        }}
      >
        <Input
          placeholder="Tên kích thước"
          value={newSize.name}
          onChange={(e) => setNewSize((s) => ({ ...s, name: e.target.value }))}
          style={{ marginBottom: 12 }}
        />
        <Input
          placeholder="Mô tả"
          value={newSize.description}
          onChange={(e) =>
            setNewSize((s) => ({ ...s, description: e.target.value }))
          }
        />
      </Modal>
    </Space>
  );
}