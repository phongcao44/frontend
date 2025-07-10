import React, { useState } from "react";
import {
  Edit,
  X,
  Mail,
  Phone,
  MapPin,
  User,
  ShoppingBag,
  DollarSign,
  Calendar,
  Plus,
} from "lucide-react";

const UserDetail = () => {
  // State management
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("orders");
  const [customerNote, setCustomerNote] = useState("230915DH75UYO4");
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    email: "phamduongbaomy2004@gmail.com",
    phone: "0979190673",
    marketingConsent: false,
  });
  const [address, setAddress] = useState({
    name: "Phạm Dương Bảo My",
    country: "Vietnam",
    street: "123 Nguyễn Văn Cừ, Quận 1",
    city: "TP. Hồ Chí Minh",
  });
  const [tags, setTags] = useState(["Shopee", "VIP Customer"]);
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState("");

  // Handlers
  const handleContactSave = () => {
    if (!contactInfo.email || !/\S+@\S+\.\S+/.test(contactInfo.email)) {
      setError("Vui lòng nhập email hợp lệ");
      return;
    }
    if (!contactInfo.phone || !/^\d{10}$/.test(contactInfo.phone)) {
      setError("Vui lòng nhập số điện thoại hợp lệ (10 số)");
      return;
    }
    setError("");
    setIsEditingContact(false);
  };

  const handleAddressSave = () => {
    if (!address.name || !address.country) {
      setError("Vui lòng nhập đầy đủ tên và quốc gia");
      return;
    }
    setError("");
    setIsEditingAddress(false);
  };

  const sendEmailInvite = () => {
    setShowEmailModal(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddTag();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <User className="w-7 h-7" />
              Thông tin khách hàng
            </h1>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
                <X className="w-4 h-4" />
                {error}
                <button onClick={() => setError("")} className="ml-auto">
                  <X className="w-4 h-4 hover:text-red-900" />
                </button>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Section - Customer Info */}
              <div className="flex-1">
                <div className="flex items-start gap-6 mb-8">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      BM
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      PHẠM DƯƠNG BẢO MY
                    </h2>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-500">
                        Mã khách hàng:
                      </span>
                      <input
                        type="text"
                        value={customerNote}
                        onChange={(e) => setCustomerNote(e.target.value)}
                        className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập mã khách hàng"
                      />
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Khách hàng thân thiết
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <Calendar className="w-8 h-8 text-blue-600" />
                      <span className="text-xs text-blue-600 font-medium">
                        RECENT
                      </span>
                    </div>
                    <p className="text-sm text-blue-700 font-medium">
                      Đơn hàng gần nhất
                    </p>
                    <p className="text-2xl font-bold text-blue-800">---</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <ShoppingBag className="w-8 h-8 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">
                        ORDERS
                      </span>
                    </div>
                    <p className="text-sm text-green-700 font-medium">
                      Tổng đơn hàng
                    </p>
                    <p className="text-2xl font-bold text-green-800">0</p>
                    <p className="text-xs text-green-600">0 ₫</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign className="w-8 h-8 text-purple-600" />
                      <span className="text-xs text-purple-600 font-medium">
                        SPENT
                      </span>
                    </div>
                    <p className="text-sm text-purple-700 font-medium">
                      Tổng chi tiêu
                    </p>
                    <p className="text-2xl font-bold text-purple-800">0 ₫</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign className="w-8 h-8 text-orange-600" />
                      <span className="text-xs text-orange-600 font-medium">
                        BALANCE
                      </span>
                    </div>
                    <p className="text-sm text-orange-700 font-medium">
                      Số dư ví
                    </p>
                    <p className="text-2xl font-bold text-orange-800">0 ₫</p>
                  </div>
                </div>
              </div>

              {/* Right Section - Contact Info */}
              <div className="lg:w-96">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-blue-600" />
                      Thông tin liên hệ
                    </h3>
                    <button
                      onClick={() => setIsEditingContact(!isEditingContact)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  </div>

                  {isEditingContact ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={contactInfo.email}
                          onChange={(e) =>
                            setContactInfo({
                              ...contactInfo,
                              email: e.target.value,
                            })
                          }
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          value={contactInfo.phone}
                          onChange={(e) =>
                            setContactInfo({
                              ...contactInfo,
                              phone: e.target.value,
                            })
                          }
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Số điện thoại"
                        />
                      </div>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={contactInfo.marketingConsent}
                          onChange={(e) =>
                            setContactInfo({
                              ...contactInfo,
                              marketingConsent: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          Đồng ý nhận email quảng cáo
                        </span>
                      </label>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => setIsEditingContact(false)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={handleContactSave}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Lưu
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-blue-700 font-medium">
                            {contactInfo.email}
                          </p>
                          <p className="text-xs text-blue-600">
                            {contactInfo.marketingConsent
                              ? "Đồng ý nhận email quảng cáo"
                              : "Không đồng ý nhận email quảng cáo"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <Phone className="w-5 h-5 text-green-600" />
                        <p className="text-green-700 font-medium">
                          {contactInfo.phone}
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-xs text-yellow-700">
                          ⚠️ Chưa có tài khoản
                        </p>
                        <button
                          onClick={() => setShowEmailModal(true)}
                          className="text-sm text-yellow-700 hover:text-yellow-800 font-medium mt-1 flex items-center gap-1"
                        >
                          <Mail className="w-4 h-4" /> Gửi email mời tạo tài
                          khoản
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        Địa chỉ mặc định
                      </h4>
                      <button
                        onClick={() => setIsEditingAddress(!isEditingAddress)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                    {isEditingAddress ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={address.name}
                          onChange={(e) =>
                            setAddress({ ...address, name: e.target.value })
                          }
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Tên"
                        />
                        <input
                          type="text"
                          value={address.street}
                          onChange={(e) =>
                            setAddress({ ...address, street: e.target.value })
                          }
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Địa chỉ"
                        />
                        <input
                          type="text"
                          value={address.city}
                          onChange={(e) =>
                            setAddress({ ...address, city: e.target.value })
                          }
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Thành phố"
                        />
                        <input
                          type="text"
                          value={address.country}
                          onChange={(e) =>
                            setAddress({ ...address, country: e.target.value })
                          }
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Quốc gia"
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={() => setIsEditingAddress(false)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Hủy
                          </button>
                          <button
                            onClick={handleAddressSave}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Lưu
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-700 space-y-1">
                          <p className="font-medium">{address.name}</p>
                          <p>{address.street}</p>
                          <p>{address.city}</p>
                          <p>{address.country}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex flex-wrap gap-6 mb-6 items-center">
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setSelectedTab("orders")}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      selectedTab === "orders"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Đơn hàng
                  </button>
                  <button
                    onClick={() => setSelectedTab("debt")}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      selectedTab === "debt"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Nợ phải thu
                  </button>
                </div>
                <div className="ml-auto">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Xem tất cả →
                  </button>
                </div>
              </div>

              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-500 text-lg">Đang tải dữ liệu...</p>
                <p className="text-gray-400 text-sm mt-2">
                  Vui lòng chờ trong giây lát
                </p>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Nhãn khách hàng
                </h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Quản lý
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag, index) => (
                  <div
                    key={tag}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                      index === 0
                        ? "bg-blue-100 text-blue-700"
                        : index === 1
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-red-100 rounded-full p-1 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Thêm nhãn mới..."
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Thêm
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    Gửi email mời tạo tài khoản
                  </h3>
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mb-6">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg mb-4">
                    <Mail className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Email sẽ được gửi tới:
                      </p>
                      <p className="text-blue-700">{contactInfo.email}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Khách hàng sẽ nhận được email với hướng dẫn tạo tài khoản và
                    có thể đăng nhập để theo dõi đơn hàng.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={sendEmailInvite}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Gửi email
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
