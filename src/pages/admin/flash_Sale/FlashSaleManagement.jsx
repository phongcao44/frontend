import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Tag,
  Package,
  Eye,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  fetchFlashSales,
  removeFlashSale,
} from "../../../redux/slices/flashSaleSlice";
import FlashSaleForm from "./FlashSaleForm";
import FlashSaleItemManagement from "./FlashSaleItemManagement";

export default function FlashSaleManagement() {
  const dispatch = useDispatch();
  const [currentView, setCurrentView] = useState("list");
  const [selectedFlashSale, setSelectedFlashSale] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const { flashSales } = useSelector((state) => state.flashSale);

  useEffect(() => {
    dispatch(fetchFlashSales());
  }, [dispatch]);

  const openCreateForm = () => {
    setSelectedFlashSale(null);
    setIsFormModalOpen(true);
  };

  const openEditForm = (flashSale) => {
    setSelectedFlashSale(flashSale);
    setIsFormModalOpen(true);
  };

  const openItemsView = (flashSale) => {
    setSelectedFlashSale(flashSale);
    setCurrentView("items");
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Hành động này sẽ không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeFlashSale(id)).then(() => {
          Swal.fire("Đã xóa!", "Flash Sale đã được xóa.", "success");
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Đã hủy", "Flash Sale vẫn còn nguyên.", "info");
      }
    });
  };

  const formatDateTime = (dateTime) =>
    new Date(dateTime).toLocaleString("vi-VN");

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded-full text-xs font-medium";
    return status === "ACTIVE"
      ? `${base} bg-green-100 text-green-800`
      : `${base} bg-gray-100 text-gray-800`;
  };

  if (currentView === "items") {
    return (
      <FlashSaleItemManagement
        selectedFlashSale={selectedFlashSale}
        onBack={() => setCurrentView("list")}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Flash Sale</h1>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={20} />
          Tạo Flash Sale
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tên Flash Sale
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Thời gian
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Sản phẩm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {flashSales.map((sale) => (
              <tr key={sale.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Tag className="h-5 w-5 text-orange-500 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {sale.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {sale.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      {formatDateTime(sale.startTime)}
                    </div>
                    <div className="flex items-center mt-1">
                      <Clock size={16} className="mr-1" />
                      {formatDateTime(sale.endTime)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge(sale.status)}>
                    {sale.status === "ACTIVE" ? "Kích hoạt" : "Tạm dừng"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Package size={16} className="mr-1" />
                    <span className="text-sm text-gray-900">0 sản phẩm</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(sale.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openItemsView(sale)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Xem sản phẩm"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => openEditForm(sale)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Chỉnh sửa"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(sale.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <FlashSaleForm
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        flashSale={selectedFlashSale}
      />
    </div>
  );
}
