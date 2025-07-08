import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Card,
  Typography,
  message,
  Tag,
  Row,
  Col,
  Avatar,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  loadFlatCategoryList,
  createCategory,
  removeParentCategory,
  removeSubCategory,
  editParentCategory,
  editSubCategory,
} from "../../redux/slices/categorySlice";

const { Title } = Typography;
const { Search } = Input;
const { TextArea } = Input;
const { Option } = Select;

const CategoryManagement = () => {
  const dispatch = useDispatch();

  const { flatCategoryList, loadingFlatList, errorFlatList, loading } =
    useSelector((state) => state.category);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();
  const [searchValue, setSearchValue] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    dispatch(loadFlatCategoryList());
  }, [dispatch]);

  useEffect(() => {
    let filtered = flattenCategories(flatCategoryList);

    if (searchValue) {
      filtered = filtered.filter(
        (cat) =>
          cat.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
          (cat.description &&
            cat.description.toLowerCase().includes(searchValue.toLowerCase()))
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(
        (cat) => (cat.level || 1) === parseInt(typeFilter)
      );
    }

    setFilteredCategories(filtered);
  }, [flatCategoryList, searchValue, typeFilter]);

  if (loadingFlatList) return <div>Loading...</div>;
  if (errorFlatList) return <div>Error: {errorFlatList}</div>;

  const getDefaultIcon = (level) => {
    const icons = {
      1: "📁",
      2: "📂",
      3: "📄",
    };
    return icons[level] || "📁";
  };

  const flattenCategories = (categories) => {
    return categories.map((category) => ({
      ...category,
      level: category.level || 1,
      icon: getDefaultIcon(category.level || 1),
      parentName: category.parentId
        ? categories.find((c) => c.id === category.parentId)?.name || "—"
        : "—",
    }));
  };

  const getParentOptions = (level, editingCategoryId) => {
    const parentLevel = level - 1;
    return flatCategoryList
      .filter(
        (category) =>
          (category.level || 1) === parentLevel &&
          category.id !== editingCategoryId
      )
      .map((category) => ({
        id: category.id,
        name: category.name,
        level: category.level || 1,
      }));
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setModalMode("add");
    setIsModalVisible(true);
    form.resetFields();
    form.setFieldsValue({
      level: 1,
      icon: getDefaultIcon(1),
      name: "",
      description: "",
      parentId: undefined,
    });
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setModalMode("edit");
    setIsModalVisible(true);
    form.setFieldsValue({
      name: category.name || "",
      description: category.description || "",
      parentId: category.parentId || undefined,
      level: category.level || 1,
      icon: getDefaultIcon(category.level || 1),
    });
  };

  const handleDelete = async (category) => {
    try {
      if ((category.level || 1) === 1) {
        await dispatch(removeParentCategory(category.id)).unwrap();
      } else {
        await dispatch(removeSubCategory(category.id)).unwrap();
      }
      message.success("Xóa danh mục thành công!");
    } catch (err) {
      message.error(`Xóa danh mục thất bại: ${err.message || err}`);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const apiData = {
        name: values.name.trim(),
        description: values.description ? values.description.trim() : "",
        parentId: values.level > 1 ? values.parentId || null : null,
      };

      if (modalMode === "add") {
        await dispatch(createCategory(apiData)).unwrap();
        message.success("Thêm danh mục thành công!");
      } else {
        const updatedData = {
          name: values.name.trim(),
          description: values.description ? values.description.trim() : "",
          parentId: values.level > 1 ? values.parentId || null : null,
        };

        if (values.level === 1) {
          await dispatch(
            editParentCategory({ id: editingCategory.id, updatedData })
          ).unwrap();
        } else {
          await dispatch(
            editSubCategory({ id: editingCategory.id, updatedData })
          ).unwrap();
        }
        message.success("Cập nhật danh mục thành công!");
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingCategory(null);
    } catch (err) {
      message.error(`Thao tác thất bại: ${err.message || err}`);
    }
  };

  const handleLevelChange = (level) => {
    form.setFieldsValue({
      parentId: undefined,
      level: level,
      icon: getDefaultIcon(level),
    });
  };

  const columns = [
    {
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      width: 80,
      render: (icon) => (
        <Avatar
          size={40}
          style={{
            backgroundColor: "#f5f5f5",
            color: "#666",
            fontSize: "18px",
          }}
        >
          {icon || <FolderOutlined />}
        </Avatar>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4, cursor: "pointer" }}>
            {"—".repeat((record.level || 1) - 1)} {name || "Unknown"}
          </div>
          <Tag color="blue" size="small">
            Cấp {record.level || 1}
          </Tag>
        </div>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (description) => (
        <div style={{ maxWidth: 200 }}>
          {description || <span style={{ color: "#ccc" }}>Chưa có mô tả</span>}
        </div>
      ),
    },
    {
      title: "Parent",
      dataIndex: "parentName",
      key: "parentName",
      render: (parentName) => (
        <div>{parentName || <span style={{ color: "#ccc" }}>—</span>}</div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            size="small"
            onClick={() => {
              Modal.confirm({
                title: "Xóa danh mục",
                content: "Bạn có chắc muốn xóa danh mục này?",
                onOk: () => handleDelete(record),
                okText: "Xóa",
                cancelText: "Hủy",
                okButtonProps: { danger: true },
              });
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <Card>
          <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
            <Col>
              <Title level={3} style={{ margin: 0 }}>
                Product Categories
              </Title>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                disabled={loading}
              >
                Add New
              </Button>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} md={8}>
              <Search
                placeholder="Keyword"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                style={{ width: "100%" }}
                disabled={loading}
              />
            </Col>
            <Col xs={24} md={4}>
              <Select
                value={typeFilter}
                style={{ width: "100%" }}
                onChange={setTypeFilter}
                disabled={loading}
              >
                <Option value="all">All</Option>
                <Option value="1">Cấp 1</Option>
                <Option value="2">Cấp 2</Option>
                <Option value="3">Cấp 3</Option>
              </Select>
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={filteredCategories}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
            scroll={{ x: 1000 }}
            loading={loadingFlatList}
          />
        </Card>

        <Modal
          title={modalMode === "add" ? "Thêm danh mục mới" : "Sửa danh mục"}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
            setEditingCategory(null);
          }}
          footer={null}
          width={600}
          destroyOnHidden
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              level: 1,
              icon: getDefaultIcon(1),
              name: "",
              description: "",
              parentId: undefined,
            }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="icon"
                  label="Icon"
                  rules={[{ required: true, message: "Vui lòng nhập icon!" }]}
                >
                  <Input
                    placeholder="📁"
                    style={{ fontSize: "16px", textAlign: "center" }}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item
                  name="name"
                  label="Tên danh mục"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên danh mục!" },
                    {
                      min: 2,
                      message: "Tên danh mục phải có ít nhất 2 ký tự!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập tên danh mục" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="description" label="Mô tả">
              <TextArea placeholder="Nhập mô tả cho danh mục" rows={3} />
            </Form.Item>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="level"
                  label="Cấp độ"
                  rules={[{ required: true, message: "Vui lòng chọn cấp độ!" }]}
                >
                  <Select onChange={handleLevelChange}>
                    <Option value={1}>Cấp 1 - Danh mục chính</Option>
                    <Option value={2}>Cấp 2 - Danh mục phụ</Option>
                    <Option value={3}>Cấp 3 - Danh mục con</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.level !== currentValues.level
              }
            >
              {({ getFieldValue }) => {
                const currentLevel = getFieldValue("level");
                return currentLevel > 1 ? (
                  <Form.Item
                    name="parentId"
                    label="Danh mục cha"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn danh mục cha!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Chọn danh mục cha"
                      showSearch
                      optionFilterProp="children"
                    >
                      {getParentOptions(currentLevel, editingCategory?.id).map(
                        (option) => (
                          <Option key={option.id} value={option.id}>
                            {"—".repeat((option.level || 1) - 1)} {option.name}
                          </Option>
                        )
                      )}
                    </Select>
                  </Form.Item>
                ) : null;
              }}
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
              <Space>
                <Button
                  onClick={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                    setEditingCategory(null);
                  }}
                  disabled={loading}
                >
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {modalMode === "add" ? "Thêm mới" : "Cập nhật"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default CategoryManagement;
