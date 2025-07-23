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
import { createColor } from "../../../redux/slices/colorSlice";
import { createSize } from "../../../redux/slices/sizeSlice";

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

  const handleSave = () => {
    if (!isEditMode) {
      const duplicate = variants?.some(
        (v) =>
          v.color?.id === variantForm.colorId &&
          v.size?.id === variantForm.sizeId
      );

      if (duplicate) {
        message.warning("Biến thể với màu & size này đã tồn tại!");
        return;
      }
    }
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
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          addonAfter="₫"
        />
      </div>

      <div>
        <Title level={5}>Số lượng tồn</Title>
        <InputNumber
          value={variantForm.stock}
          style={{ width: "100%" }}
          onChange={(value) => onChange("stock", value)}
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
          try {
            await dispatch(createColor({ name, hexCode })).unwrap();
            message.success("Đã thêm màu mới");
          } catch (err) {
            console.error(err);
            message.error("Thêm màu thất bại");
          }
          setColorModalVisible(false);
          setNewColor({ name: "", hexCode: "#000000" });
        }}
        onCancel={() => setColorModalVisible(false)}
      >
        <Input
          placeholder="Tên màu"
          value={newColor.name}
          onChange={(e) => setNewColor((c) => ({ ...c, name: e.target.value }))}
          style={{ marginBottom: 12 }}
        />
        <Input
          placeholder="Mã màu (ví dụ: #ff0000)"
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
          } catch (err) {
            console.error(err);
            message.error("Thêm kích thước thất bại");
          }
          setSizeModalVisible(false);
          setNewSize({ name: "", description: "" });
        }}
        onCancel={() => setSizeModalVisible(false)}
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
