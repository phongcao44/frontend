import { Layout, Button, Table, Input, Select, Space, Typography } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadMergedProducts } from "../../redux/slices/productSlice";

const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const ProductManagement = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state.products.mergedProducts);

  useEffect(() => {
    if (!allProducts || allProducts.length === 0) {
      dispatch(loadMergedProducts({ page: 0, limit: 100 }));
    }
  }, [dispatch, allProducts]);

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <div
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
            }}
          >
            📷
          </div>
          <div>
            <div>{text}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {record.variants} biến thể
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Khả dụng",
      dataIndex: "available",
      key: "available",
      align: "center",
    },
    {
      title: "Tồn",
      dataIndex: "stock",
      key: "stock",
      align: "center",
    },
    {
      title: "Đặt",
      dataIndex: "ordered",
      key: "ordered",
      align: "center",
    },
    {
      title: "Chờ nhập",
      dataIndex: "pending",
      key: "pending",
      align: "center",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      align: "center",
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "brand",
      key: "brand",
      align: "center",
    },
  ];

  const data = allProducts?.map((product) => {
    const totalStock =
      product.variants?.reduce((sum, v) => sum + (v.stock_quantity || 0), 0) ||
      0;

    return {
      key: product.id,
      name: product.name,
      variants: product.variants?.length || 0,
      available: product.status === "IN_STOCK" ? totalStock : 0,
      stock: totalStock,
      type: product.category_id || "Không rõ",
      brand: product.brand || "Không rõ",
    };
  });

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Header
        style={{
          backgroundColor: "#fff",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Title level={3} style={{ margin: 0, color: "#333" }}>
          Danh sách sản phẩm
        </Title>
        <Space>
          <Select
            defaultValue="import"
            style={{ width: 150 }}
            suffixIcon={<DownOutlined />}
          >
            <Option value="import">Nhập dữ liệu</Option>
          </Select>
          <Select
            defaultValue="export"
            style={{ width: 150 }}
            suffixIcon={<DownOutlined />}
          >
            <Option value="export">Xuất dữ liệu</Option>
          </Select>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ backgroundColor: "#4096ff" }}
            onClick={() => navigate("/admin/products/add")}
          >
            Tạo combo
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ backgroundColor: "#722ed1" }}
            onClick={() => navigate("/admin/products/add")}
          >
            Tạo sản phẩm
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: "24px" }}>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "16px 24px" }}>
            <Space style={{ marginBottom: "16px" }}>
              <Button
                icon={<FilterOutlined />}
                style={{ display: "flex", alignItems: "center" }}
              >
                Thêm điều kiện lọc
              </Button>
              <Input
                placeholder="Tìm kiếm"
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
              />
            </Space>

            <Table
              columns={columns}
              dataSource={data}
              pagination={{
                total: data.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} mục`,
              }}
              scroll={{ x: 1000 }}
              onRow={(record) => ({
                onClick: () => navigate(`/admin/products/${record.key}`),
                style: { cursor: "pointer" },
              })}
            />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ProductManagement;
