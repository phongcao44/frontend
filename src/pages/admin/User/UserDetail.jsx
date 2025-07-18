import { useState } from "react";
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
  Shield,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  RefreshCw,
  History,
  Award,
  Gift,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  Crown,
  Key,
  Activity,
  CreditCard,
  Star,
  Tag,
  Save,
  Trash2,
  Send,
} from "lucide-react";

const UserDetail = () => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [customerNote, setCustomerNote] = useState("230915DH75UYO4");
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [userInfo, setUserInfo] = useState({
    id: "usr_123456",
    name: "Phạm Dương Bảo My",
    email: "phamduongbaomy2004@gmail.com",
    phone: "0979190673",
    avatar: null,
    status: "Active",
    createdAt: "2024-01-15T08:30:00Z",
    updatedAt: "2024-12-15T14:20:00Z",
    lastLogin: "2024-12-15T09:15:00Z",
    isVerified: true,
    marketingConsent: false,
    loyaltyPoints: 1250,
    memberTier: "Gold",
    totalOrders: 12,
    totalSpent: 2500000,
    walletBalance: 150000,
  });

  const [address, setAddress] = useState({
    name: "Phạm Dương Bảo My",
    country: "Vietnam",
    street: "123 Nguyễn Văn Cừ, Quận 1",
    city: "TP. Hồ Chí Minh",
    zipCode: "70000",
  });

  const [userRoles, setUserRoles] = useState([
    {
      id: 1,
      name: "ROLE_USER",
      description: "Quyền người dùng cơ bản",
      granted: true,
    },
    {
      id: 2,
      name: "ROLE_PREMIUM",
      description: "Quyền thành viên cao cấp",
      granted: true,
    },
    {
      id: 3,
      name: "ROLE_MANAGER",
      description: "Quyền quản lý",
      granted: false,
    },
    {
      id: 4,
      name: "ROLE_ADMIN",
      description: "Quyền quản trị viên",
      granted: false,
    },
  ]);

  const [orders] = useState([
    { id: "ORD001", date: "2024-12-10", total: 350000, status: "Delivered" },
    { id: "ORD002", date: "2024-12-05", total: 280000, status: "Processing" },
    { id: "ORD003", date: "2024-11-28", total: 450000, status: "Delivered" },
  ]);

  const [loginHistory] = useState([
    {
      date: "2024-12-15 09:15",
      ip: "192.168.1.1",
      device: "Chrome on Windows",
    },
    { date: "2024-12-14 15:30", ip: "192.168.1.1", device: "Mobile Safari" },
    {
      date: "2024-12-13 08:45",
      ip: "192.168.1.1",
      device: "Chrome on Windows",
    },
  ]);

  const [vouchers] = useState([
    {
      id: "VOU001",
      code: "WELCOME20",
      discount: "20%",
      usedAt: "2024-12-10",
      status: "Used",
    },
    {
      id: "VOU002",
      code: "FREESHIP",
      discount: "Free Ship",
      usedAt: "2024-11-28",
      status: "Used",
    },
  ]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleStatusChange = (newStatus) => {
    setUserInfo({ ...userInfo, status: newStatus });
    setSuccess(`Trạng thái đã được thay đổi thành ${newStatus}`);
  };

  const handleRoleToggle = (roleId) => {
    setUserRoles((roles) =>
      roles.map((role) =>
        role.id === roleId ? { ...role, granted: !role.granted } : role
      )
    );
  };

  const handleContactSave = () => {
    if (!userInfo.email || !/\S+@\S+\.\S+/.test(userInfo.email)) {
      setError("Vui lòng nhập email hợp lệ");
      return;
    }
    if (!userInfo.phone || !/^\d{10}$/.test(userInfo.phone)) {
      setError("Vui lòng nhập số điện thoại hợp lệ (10 số)");
      return;
    }
    setError("");
    setSuccess("Thông tin liên hệ đã được cập nhật");
    setIsEditingContact(false);
  };

  const handleAddressSave = () => {
    if (!address.name || !address.country) {
      setError("Vui lòng nhập đầy đủ tên và quốc gia");
      return;
    }
    setError("");
    setSuccess("Địa chỉ đã được cập nhật");
    setIsEditingAddress(false);
  };

  const handleProfileSave = () => {
    if (!userInfo.name.trim()) {
      setError("Vui lòng nhập tên người dùng");
      return;
    }
    setError("");
    setSuccess("Thông tin cá nhân đã được cập nhật");
    setIsEditingProfile(false);
  };

  const sendEmailInvite = () => {
    setShowEmailModal(false);
    setSuccess("Email mời đã được gửi thành công");
  };

  const resetPassword = () => {
    setShowResetPasswordModal(false);
    setSuccess("Email reset mật khẩu đã được gửi");
  };

  const resendVerification = () => {
    setSuccess("Email xác thực đã được gửi lại");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Blocked":
        return "bg-red-100 text-red-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="h-4 w-4" />;
      case "Blocked":
        return <XCircle className="h-4 w-4" />;
      case "Inactive":
        return <Clock className="h-4 w-4" />;
      case "Pending":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Quản lý người dùng
              </h1>
              <p className="text-gray-600 mt-1">
                Thông tin chi tiết và quản lý tài khoản người dùng
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEmailModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Gửi email
              </button>
              <button
                onClick={() => setShowResetPasswordModal(true)}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2 transition-colors"
              >
                <Key className="h-4 w-4" />
                Reset mật khẩu
              </button>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 text-sm text-red-800 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6 text-sm text-green-800 flex items-center justify-between">
            <span>{success}</span>
            <button
              onClick={() => setSuccess("")}
              className="text-green-600 hover:text-green-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Section - User Profile */}
          <div className="lg:col-span-3 space-y-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {userInfo.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {userInfo.name}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                          userInfo.status
                        )}`}
                      >
                        {getStatusIcon(userInfo.status)}
                        {userInfo.status}
                      </span>
                      {userInfo.isVerified && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      ID: {userInfo.id}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>Tạo: {formatDate(userInfo.createdAt)}</span>
                      <span>Cập nhật: {formatDate(userInfo.updatedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setShowRoleModal(true)}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <Shield className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() =>
                    handleStatusChange(
                      userInfo.status === "Active" ? "Blocked" : "Active"
                    )
                  }
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors ${
                    userInfo.status === "Active"
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  {userInfo.status === "Active" ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <Unlock className="h-4 w-4" />
                  )}
                  {userInfo.status === "Active" ? "Khóa tài khoản" : "Mở khóa"}
                </button>
                <button
                  onClick={resendVerification}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-2 text-sm transition-colors"
                >
                  <Send className="h-4 w-4" />
                  Gửi lại xác thực
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ShoppingBag className="h-4 w-4" />
                    Tổng đơn hàng
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    {userInfo.totalOrders}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    Tổng chi tiêu
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(userInfo.totalSpent)}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CreditCard className="h-4 w-4" />
                    Số dư ví
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(userInfo.walletBalance)}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="h-4 w-4" />
                    Điểm thưởng
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    {userInfo.loyaltyPoints}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="border-b border-gray-200">
                <div className="flex">
                  {[
                    { id: "overview", label: "Tổng quan", icon: User },
                    { id: "orders", label: "Đơn hàng", icon: ShoppingBag },
                    { id: "loyalty", label: "Điểm thưởng", icon: Award },
                    { id: "vouchers", label: "Voucher", icon: Gift },
                    { id: "history", label: "Lịch sử", icon: History },
                    { id: "activity", label: "Hoạt động", icon: Activity },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                        selectedTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {selectedTab === "overview" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">
                          Thông tin cá nhân
                        </h4>
                        {isEditingProfile ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={userInfo.name}
                              onChange={(e) =>
                                setUserInfo({
                                  ...userInfo,
                                  name: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Tên đầy đủ"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => setIsEditingProfile(false)}
                                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                              >
                                Hủy
                              </button>
                              <button
                                onClick={handleProfileSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                Lưu
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-700">
                                {userInfo.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Crown className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-700">
                                Hạng thành viên: {userInfo.memberTier}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-700">
                                Đăng nhập cuối: {formatDate(userInfo.lastLogin)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">
                          Vai trò & Quyền hạn
                        </h4>
                        <div className="space-y-2">
                          {userRoles
                            .filter((role) => role.granted)
                            .map((role) => (
                              <div
                                key={role.id}
                                className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg"
                              >
                                <Shield className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">
                                  {role.name}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === "orders" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">
                        Đơn hàng gần đây
                      </h4>
                      <span className="text-sm text-gray-500">
                        {orders.length} đơn hàng
                      </span>
                    </div>
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                                #{order.id}
                              </p>
                              <p className="text-sm text-gray-500">
                                {order.date}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                {formatCurrency(order.total)}
                              </p>
                              <span
                                className={`inline-block px-2 py-1 text-xs rounded-full ${
                                  order.status === "Delivered"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTab === "loyalty" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg">
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5" />
                          <span className="font-medium">Điểm hiện tại</span>
                        </div>
                        <div className="text-2xl font-bold mt-2">
                          {userInfo.loyaltyPoints}
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
                        <div className="flex items-center gap-2">
                          <Crown className="h-5 w-5" />
                          <span className="font-medium">Hạng thành viên</span>
                        </div>
                        <div className="text-2xl font-bold mt-2">
                          {userInfo.memberTier}
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg">
                        <div className="flex items-center gap-2">
                          <Gift className="h-5 w-5" />
                          <span className="font-medium">Voucher đã dùng</span>
                        </div>
                        <div className="text-2xl font-bold mt-2">
                          {vouchers.length}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === "vouchers" && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">
                      Voucher đã sử dụng
                    </h4>
                    <div className="space-y-3">
                      {vouchers.map((voucher) => (
                        <div
                          key={voucher.id}
                          className="p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                                {voucher.code}
                              </p>
                              <p className="text-sm text-gray-500">
                                Sử dụng: {voucher.usedAt}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-green-600">
                                {voucher.discount}
                              </p>
                              <span className="text-xs text-gray-500">
                                {voucher.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTab === "history" && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">
                      Lịch sử đăng nhập
                    </h4>
                    <div className="space-y-3">
                      {loginHistory.map((login, index) => (
                        <div
                          key={index}
                          className="p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                                {login.date}
                              </p>
                              <p className="text-sm text-gray-500">
                                {login.device}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">
                                {login.ip}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTab === "activity" && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">
                      Nhật ký hoạt động
                    </h4>
                    <div className="text-center py-12">
                      <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Không có hoạt động nào được ghi nhận
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Thông tin liên hệ
                </h3>
                <button
                  onClick={() => setIsEditingContact(!isEditingContact)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <Edit className="h-4 w-4" />
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
                      value={userInfo.email}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={userInfo.phone}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={userInfo.marketingConsent}
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          marketingConsent: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">
                      Đồng ý nhận email quảng cáo
                    </span>
                  </label>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setIsEditingContact(false)}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleContactSave}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {userInfo.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {userInfo.marketingConsent
                          ? "Đồng ý nhận email quảng cáo"
                          : "Không đồng ý nhận email quảng cáo"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <p className="text-sm font-medium text-gray-900">
                      {userInfo.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Address */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Địa chỉ mặc định
                </h3>
                <button
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <Edit className="h-4 w-4" />
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tên"
                  />
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) =>
                      setAddress({ ...address, street: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Địa chỉ"
                  />
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Thành phố"
                  />
                  <input
                    type="text"
                    value={address.country}
                    onChange={(e) =>
                      setAddress({ ...address, country: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Quốc gia"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditingAddress(false)}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleAddressSave}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium text-gray-900">{address.name}</p>
                    <p>{address.street}</p>
                    <p>{address.city}</p>
                    <p>{address.country}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thao tác nhanh
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowRoleModal(true)}
                  className="w-full px-4 py-2 text-left border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-3"
                >
                  <Shield className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">Quản lý quyền</span>
                </button>
                <button
                  onClick={() => handleStatusChange("Pending")}
                  className="w-full px-4 py-2 text-left border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-3"
                >
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">Đặt trạng thái Pending</span>
                </button>
                <button
                  onClick={resendVerification}
                  className="w-full px-4 py-2 text-left border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-3"
                >
                  <UserCheck className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">Gửi lại email xác thực</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Gửi email</h3>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Người nhận
                  </label>
                  <input
                    type="email"
                    value={userInfo.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tiêu đề email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Nhập nội dung email"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={sendEmailInvite}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Gửi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showRoleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Quản lý quyền hạn</h3>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                {userRoles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{role.name}</p>
                      <p className="text-sm text-gray-500">
                        {role.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRoleToggle(role.id)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        role.granted
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {role.granted ? "Đã cấp" : "Chưa cấp"}
                    </button>
                  </div>
                ))}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowRoleModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() => {
                      setShowRoleModal(false);
                      setSuccess("Quyền hạn đã được cập nhật");
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showResetPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Reset mật khẩu</h3>
                <button
                  onClick={() => setShowResetPasswordModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="h-5 w-5" />
                    <p className="text-sm font-medium">
                      Xác nhận reset mật khẩu
                    </p>
                  </div>
                  <p className="text-sm text-yellow-700 mt-2">
                    Hệ thống sẽ gửi email reset mật khẩu đến địa chỉ:{" "}
                    <strong>{userInfo.email}</strong>
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowResetPasswordModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={resetPassword}
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Xác nhận
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
