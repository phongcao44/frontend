import { useEffect, useState } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import { getBanners, removeBanner } from "../../redux/slices/bannerSlice";
import { useDispatch, useSelector } from "react-redux";
import BannerFormModal from "./BannerForm";

const BannerManagement = () => {
  const dispatch = useDispatch();
  const { banners } = useSelector((state) => state.banner);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa banner này?")) {
      dispatch(removeBanner(id));
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setOpen(true);
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setOpen(true);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(banners.map((banner) => banner.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const filteredBanners = banners.filter(
    (banner) =>
      banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (banner.publicId || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-medium text-gray-900">
              Quản lý banner
            </h1>
            <p className="text-sm text-gray-500">Danh sách banner</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={16} />
            Thêm mới
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4 border-b">
            <div className="flex gap-4">
              <div className="relative">
                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white">
                  <option>Điều kiện lọc</option>
                </select>
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Nhập từ khóa tìm kiếm"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="bg-gray-100 border border-gray-300 rounded-md px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-200">
                <Search size={16} />
                Tìm kiếm
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 p-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedItems.length === banners.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">
                    Ảnh
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">
                    ID
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">
                    Tiêu đề
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">
                    Vị trí
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">
                    Thời gian
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">
                    Trạng thái
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBanners.map((banner) => (
                  <tr
                    key={banner.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedItems.includes(banner.id)}
                        onChange={() => handleSelectItem(banner.id)}
                      />
                    </td>
                    <td className="p-4">
                      <img
                        src={banner.bannerUrl}
                        alt={banner.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="p-4 text-sm text-gray-900">{banner.id}</td>
                    <td className="p-4 text-sm">{banner.title}</td>
                    <td className="p-4 text-sm">{banner.position}</td>
                    <td className="p-4 text-sm text-gray-600">
                      <div>
                        <div>Bắt đầu: {formatDate(banner.startAt)}</div>
                        <div>Kết thúc: {formatDate(banner.endAt)}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            banner.status ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></div>
                        <span className="text-sm text-gray-700">
                          {banner.status ? "Hiển thị" : "Ẩn"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(banner.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(banner.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
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
        </div>

        {/* Form Modal */}
        <BannerFormModal
          open={open}
          onClose={() => setOpen(false)}
          id={editingId} 
        />
      </div>
    </div>
  );
};

export default BannerManagement;
