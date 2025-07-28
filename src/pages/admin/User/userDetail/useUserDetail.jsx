import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle, Clock } from "lucide-react";
import * as Yup from "yup";
import {
  fetchUserDetail,
  updateUserStatus,
  updateUserRole,
  removeUserRole,
  updateUserDetailThunk,
} from "../../../../redux/slices/userSlice";
import { useParams } from "react-router-dom";

const normalizeNull = (data) => {
  if (data === null) return undefined;
  if (Array.isArray(data)) {
    return data.map(normalizeNull);
  }
  if (typeof data === "object" && data !== null) {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, normalizeNull(value)])
    );
  }
  return data;
};

// Validation schemas for Formik
const contactValidationSchema = Yup.object({
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Số điện thoại phải có 10 số")
    .required("Vui lòng nhập số điện thoại"),
  marketingConsent: Yup.boolean(),
});

const addressValidationSchema = Yup.object({
  name: Yup.string().required("Vui lòng nhập tên"),
  street: Yup.string(),
  city: Yup.string(),
  country: Yup.string().required("Vui lòng nhập quốc gia"),
  zipCode: Yup.string(),
});

const profileValidationSchema = Yup.object({
  name: Yup.string().required("Vui lòng nhập tên người dùng"),
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
});

export default function useUserDetail() {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const {
    userDetail = {}, // Fallback to empty object
    loading,
    error: reduxError,
  } = useSelector((state) => {
    return state.users;
  });

  // State for modals, tabs, and UI
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // User data state
  const [userInfo, setUserInfo] = useState(null);
  const [address, setAddress] = useState(null);
  const [userRoles, setUserRoles] = useState([]);

  // Static data (replace with API fetch if needed)
  const orders = useMemo(
    () =>
      normalizeNull([
        {
          id: "ORD001",
          date: "2024-12-10",
          total: 350000,
          status: "Delivered",
        },
        {
          id: "ORD002",
          date: "2024-12-05",
          total: 280000,
          status: "Processing",
        },
        {
          id: "ORD003",
          date: "2024-11-28",
          total: 450000,
          status: "Delivered",
        },
      ]),
    []
  );

  const vouchers = useMemo(
    () =>
      normalizeNull([
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
      ]),
    []
  );

  // Fetch user details on mount
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserDetail(userId));
    }
  }, [dispatch, userId]);

  // Map API data to local state when userDetail changes
  useEffect(() => {
    if (userDetail && Object.keys(userDetail).length > 0) {
      const normalizedData = normalizeNull(userDetail);
      setUserInfo({
        id: normalizedData.userId || "",
        name: normalizedData.userName || "",
        email: normalizedData.userEmail || "",
        avatar: undefined,
        status: normalizedData.status || "INACTIVE",
        createdAt: normalizedData.createTime || "",
        updatedAt: normalizedData.updateTime || "",
        loyaltyPoints:
          normalizedData.address?.[0]?.user?.userPoint?.totalPoints || 0,
        memberTier: normalizedData.rank || "",
        totalOrders: 0,
        totalSpent: 0,
      });

      setAddress({
        name: normalizedData.address?.[0]?.recipientName || undefined,
        country: normalizedData.address?.[0]?.province || undefined,
        street: normalizedData.address?.[0]?.fullAddress || undefined,
        city: normalizedData.address?.[0]?.district || undefined,
        zipCode: normalizedData.address?.[0]?.wardCode || undefined,
      });

      const apiRoles = Array.isArray(normalizedData.role)
        ? normalizedData.role.map((role) => ({
            id: role.id || "",
            name: role.name || "",
            description: role.description || "",
            granted: true, // Assuming roles from API are granted
          }))
        : [];
      setUserRoles(apiRoles);
    }
  }, [userDetail]);

  const allRoles = useMemo(
    () => [
      {
        id: 1,
        name: "ROLE_ADMIN",
        description: "Quản trị viên toàn hệ thống",
      },
      {
        id: 2,
        name: "ROLE_MODERATOR",
        description: "Quản lý nội dung và sản phẩm",
      },
      {
        id: 3,
        name: "ROLE_USER",
        description: "Khách hàng thông thường",
      },
    ],
    []
  );

  // Format date utility
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Format currency utility
  const formatCurrency = useCallback((amount) => {
    if (amount === undefined || amount === null) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }, []);

  // Get status color
  const getStatusColor = useCallback((status) => {
    switch (status || "INACTIVE") {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, []);

  // Get status icon component
  const getStatusIcon = useCallback((status) => {
    const icons = {
      ACTIVE: CheckCircle,
      INACTIVE: Clock,
    };
    return icons[status || "INACTIVE"] || Clock;
  }, []);

  // Memoized handlers
  const handlers = useMemo(
    () => ({
      handleStatusChange: async (newStatus) => {
        setIsLoading(true);
        try {
          await dispatch(
            updateUserStatus({ userId, status: newStatus })
          ).unwrap();
          await dispatch(fetchUserDetail(userId)).unwrap();
          setUserInfo((prev) => normalizeNull({ ...prev, status: newStatus }));
          setSuccess(`Trạng thái đã được thay đổi thành ${newStatus}`);
        } catch (err) {
          const errorMessage =
            typeof err === "string"
              ? err
              : err?.message || "Không thể thay đổi trạng thái";
          setError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      },

      handleRoleToggle: async (roleId) => {
        setIsLoading(true);
        try {
          const role = userRoles.find((r) => r.id === roleId);
          if (role?.granted) {
            await dispatch(removeUserRole({ userId, roleId })).unwrap();
          } else {
            await dispatch(updateUserRole({ userId, roleId })).unwrap();
          }
          setUserRoles((roles) =>
            normalizeNull(
              roles.map((r) =>
                r.id === roleId ? { ...r, granted: !r.granted } : r
              )
            )
          );
          setSuccess(
            `Quyền ${role?.name || "Unknown"} đã được ${
              role?.granted ? "xóa" : "cấp"
            }`
          );
        } catch (err) {
          setError(err || "Không thể thay đổi quyền");
        } finally {
          setIsLoading(false);
        }
      },

      handleContactSave: async (values) => {
        setIsLoading(true);
        try {
          await dispatch(updateUserDetailThunk({ userId, ...values })).unwrap();
          setUserInfo((prev) => normalizeNull({ ...prev, ...values }));
          setSuccess("Thông tin liên hệ đã được cập nhật");
          setIsEditingContact(false);
        } catch (err) {
          setError(err || "Không thể cập nhật thông tin liên hệ");
        } finally {
          setIsLoading(false);
        }
      },

      handleAddressSave: async (values) => {
        setIsLoading(true);
        try {
          await dispatch(
            updateUserDetailThunk({ userId, address: values })
          ).unwrap();
          setAddress(normalizeNull(values));
          setSuccess("Địa chỉ đã được cập nhật");
          setIsEditingAddress(false);
        } catch (err) {
          setError(err || "Không thể cập nhật địa chỉ");
        } finally {
          setIsLoading(false);
        }
      },

      handleProfileSave: async (values) => {
        setIsLoading(true);
        try {
          await dispatch(updateUserDetailThunk({ userId, ...values })).unwrap();
          setUserInfo((prev) => normalizeNull({ ...prev, ...values }));
          setSuccess("Thông tin cá nhân đã được cập nhật");
          setIsEditingProfile(false);
        } catch (err) {
          setError(err || "Không thể cập nhật thông tin cá nhân");
        } finally {
          setIsLoading(false);
        }
      },

      resetPassword: () => {
        setShowResetPasswordModal(false);
        setSuccess("Email reset mật khẩu đã được gửi");
      },

      toggleEmailModal: () => setShowEmailModal((prev) => !prev),
      toggleRoleModal: () => setShowRoleModal((prev) => !prev),
      toggleResetPasswordModal: () =>
        setShowResetPasswordModal((prev) => !prev),
      setSelectedTab,
      setIsEditingContact,
      setIsEditingAddress,
      setIsEditingProfile,
      clearError: () => setError(""),
      clearSuccess: () => setSuccess(""),
    }),
    [dispatch, userId, userRoles]
  );

  // Memoized props for UserProfileCard
  const userProfileProps = useMemo(
    () => ({
      userInfo: {
        id: userInfo?.id,
        name: userInfo?.name,
        email: userInfo?.email,
        status: userInfo?.status,
        createdAt: userInfo?.createdAt,
        updatedAt: userInfo?.updatedAt,
        totalOrders: userInfo?.totalOrders,
        totalSpent: userInfo?.totalSpent,
        loyaltyPoints: userInfo?.loyaltyPoints,
        isVerified: userInfo?.isVerified,
      },
      isLoading: isLoading || loading,
      handlers: {
        setIsEditingProfile,
        toggleRoleModal: handlers.toggleRoleModal,
        handleStatusChange: handlers.handleStatusChange,
        handleProfileSave: handlers.handleProfileSave,
      },
      formatDate,
      formatCurrency,
      getStatusColor,
      getStatusIcon,
      profileValidationSchema,
    }),
    [
      userInfo?.id,
      userInfo?.name,
      userInfo?.email,
      userInfo?.status,
      userInfo?.createdAt,
      userInfo?.updatedAt,
      userInfo?.totalOrders,
      userInfo?.totalSpent,
      userInfo?.loyaltyPoints,
      userInfo?.isVerified,
      isLoading,
      loading,
      handlers,
      formatDate,
      formatCurrency,
      getStatusColor,
      getStatusIcon,
      profileValidationSchema,
    ]
  );

  return {
    showEmailModal,
    showRoleModal,
    showResetPasswordModal,
    selectedTab,
    isEditingContact,
    isEditingAddress,
    isEditingProfile,
    userInfo,
    allRoles,
    address,
    userRoles,
    orders,
    vouchers,
    error: error || reduxError,
    success,
    isLoading: isLoading || loading,
    handlers,
    formatDate,
    formatCurrency,
    getStatusColor,
    getStatusIcon,
    contactValidationSchema,
    addressValidationSchema,
    profileValidationSchema,
    userProfileProps,
  };
}