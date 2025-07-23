import { Divider, Typography } from "antd";
import { TruckOutlined, ReloadOutlined } from "@ant-design/icons";
const { Text } = Typography;

const DeliveryInfo = () => {
  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <TruckOutlined className="text-xl mr-3" />
        <div>
          <Text strong>Miễn phí giao hàng</Text>
          <br />
          <Text className="text-xs text-gray-600">
            Nhập mã bưu điện để kiểm tra khả năng giao hàng
          </Text>
        </div>
      </div>
      <Divider className="my-3" />
      <div className="flex items-center">
        <ReloadOutlined className="text-xl mr-3" />
        <div>
          <Text strong>Đổi trả miễn phí</Text>
          <br />
          <Text className="text-xs text-gray-600">
            Đổi trả miễn phí trong 30 ngày. Xem chi tiết
          </Text>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;
