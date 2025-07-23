import { Clock, CheckCircle, Truck, Package, XCircle, RotateCcw } from "lucide-react";

const OrderStatusIcon = ({ status, className = "h-4 w-4" }) => {
  switch (status) {
    case "PENDING":
      return <Clock className={className} />;
    case "CONFIRMED":
      return <CheckCircle className={className} />;
    case "SHIPPED":
      return <Truck className={className} />;
    case "DELIVERED":
      return <Package className={className} />;
    case "CANCELLED":
      return <XCircle className={className} />;
    case "RETURNED":
      return <RotateCcw className={className} />;
    default:
      return <Clock className={className} />;
  }
};

export default OrderStatusIcon;
