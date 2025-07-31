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
import { loadPaginatedOrders } from "../../../../redux/slices/orderSlice";
import { useParams } from "react-router-dom";

// Static list of all roles (replace with API fetch if needed)
const allRoles = [
  { id: "1", name: "ADMIN", description: "Administrator" },
  { id: "2", name: "MODERATOR", description: "Moderator" },
  { id: "3", name: "USER", description: "Regular User" },
];

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

// Validation schema for address
const addressValidationSchema = Yup.object({
  name: Yup.string().required("Vui lòng nhập tên"),
  street: Yup.string(),
  city: Yup.string(),
  country: Yup.string().required("Vui lòng nhập quốc gia"),
  zipCode: Yup.string(),
});

// Validation schema for profile
const profileValidationSchema = Yup.object({
  name: Yup.string().required("Vui lòng nhập tên"),
});

export default function useUserDetail() {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const {
    userDetail = {},
    loading: userLoading,
    error: reduxError,
  } = useSelector((state) => state.users);
  const {
    list: { content: orders, totalElements, totalPages },
    loading: orderLoading,
    error: orderError,
  } = useSelector((state) => state.order);

  // State for modals, tabs, and UI
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 5,
    sortBy: "createdAt",
    orderBy: "desc",
    status: "",
    keyword: "",
  });

  const [userInfo, setUserInfo] = useState(null);
  const [address, setAddress] = useState(null);
  const [userRoles, setUserRoles] = useState([]);

  // Fetch user details and orders on mount or when pagination/userId changes
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserDetail(userId));
      dispatch(
        loadPaginatedOrders({
          userId,
          page: pagination.page,
          limit: pagination.limit,
          sortBy: pagination.sortBy,
          orderBy: pagination.orderBy,
          status: pagination.status,
          keyword: pagination.keyword,
        })
      );
    }
  }, [dispatch, userId, pagination]);

  // Map API data to local state when userDetail changes
  useEffect(() => {
    if (userDetail && Object.keys(userDetail).length > 0) {
      const normalizedData = normalizeNull(userDetail);

      setUserInfo({
        id: normalizedData.userId || "",
        name: normalizedData.userName || "",
        email: normalizedData.userEmail || "",
        phone: normalizedData.phone || "",
        marketingConsent: normalizedData.marketingConsent ?? false,
        avatar: undefined,
        status: normalizedData.status || "INACTIVE",
        createdAt: normalizedData.createTime || "",
        updatedAt: normalizedData.updateTime || "",
        loyaltyPoints:
          normalizedData.address?.[0]?.user?.userPoint?.totalPoints || 0,
        memberTier: normalizedData.rank || "",
        totalOrders: totalElements || 0,
        totalSpent: orders.reduce((sum, order) => sum + (order.total || 0), 0),
      });

      setAddress({
        name: normalizedData.address?.[0]?.recipientName || undefined,
        country: normalizedData.address?.[0]?.province || undefined,
        street: normalizedData.address?.[0]?.fullAddress || undefined,
        city: normalizedData.address?.[0]?.district || undefined,
        zipCode: normalizedData.address?.[0]?.wardCode || undefined,
      });

      // Process roles properly - Create array with ALL roles and their granted status
      const processedRoles = allRoles.map((allRole) => {
        const userHasRole = Array.isArray(normalizedData.role)
          ? normalizedData.role.some(
              (userRole) =>
                String(userRole.id) === String(allRole.id) ||
                String(userRole.name) === String(allRole.name)
            )
          : false;

        return {
          id: String(allRole.id),
          name: allRole.name,
          description: allRole.description,
          granted: userHasRole,
        };
      });

      setUserRoles(processedRoles);
    }
  }, [userDetail, orders, totalElements]);

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

  // Handle pagination change
  const handlePaginationChange = useCallback((newPagination) => {
    setPagination((prev) => ({
      ...prev,
      ...newPagination,
    }));
  }, []);

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
        const previousRoles = [...userRoles]; // Store current roles for rollback
        const currentRole = userRoles.find(
          (r) => String(r.id) === String(roleId)
        );
        const isCurrentlyGranted = currentRole ? currentRole.granted : false;

        // Optimistically update UI
        const updatedRoles = userRoles.map((role) =>
          String(role.id) === String(roleId)
            ? { ...role, granted: !isCurrentlyGranted }
            : role
        );
        setUserRoles(updatedRoles);

        try {
          if (isCurrentlyGranted) {
            await dispatch(removeUserRole({ userId, roleId })).unwrap();
          } else {
            await dispatch(updateUserRole({ userId, roleId })).unwrap();
          }

          await dispatch(fetchUserDetail(userId)).unwrap();

          const roleData = allRoles.find(
            (r) => String(r.id) === String(roleId)
          ) || {
            name: "Unknown Role",
          };

          setSuccess(
            `Quyền ${roleData.name} đã được ${
              isCurrentlyGranted ? "xóa" : "cấp"
            }`
          );
        } catch (err) {
          console.error("Role toggle error details:", {
            message: err?.message,
            response: err?.response?.data,
            status: err?.response?.status,
          });
          // Revert optimistic update
          setUserRoles(previousRoles);

          let errorMessage = "Không thể thay đổi quyền";
          if (err?.response?.data?.message) {
            switch (err.response.data.message) {
              case "Cannot remove ROLE_ADMIN from any user":
                errorMessage = "Không thể xóa quyền quản trị (admin)";
                break;
              case "User must have at least one role":
                errorMessage = "Người dùng phải có ít nhất một quyền";
                break;
              default:
                errorMessage = err.response.data.message;
                break;
            }
          } else if (err?.message) {
            errorMessage = err.message;
          }

          setError(errorMessage);
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
          setError(err?.message || "Không thể cập nhật địa chỉ");
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
          setError(err?.message || "Không thể cập nhật thông tin liên hệ");
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
          setError(err?.message || "Không thể cập nhật thông tin cá nhân");
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
      toggleEditContact: () => setIsEditingContact((prev) => !prev),
      toggleEditProfile: () => setIsEditingProfile((prev) => !prev),
      setSelectedTab,
      setIsEditingAddress,
      setIsEditingProfile,
      clearError: () => setError(""),
      clearSuccess: () => setSuccess(""),
      isLoading,
      isEditingContact,
      isEditingProfile,
      profileValidationSchema,
      handlePaginationChange,
    }),
    [
      dispatch,
      userId,
      userRoles,
      isLoading,
      handlePaginationChange,
      isEditingContact,
      isEditingProfile,
    ]
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
      },
      isLoading: isLoading || userLoading || orderLoading,
      handlers: {
        toggleRoleModal: handlers.toggleRoleModal,
        handleStatusChange: handlers.handleStatusChange,
        toggleEditProfile: handlers.toggleEditProfile,
      },
      formatDate,
      formatCurrency,
      getStatusColor,
      getStatusIcon,
    }),
    [
      userInfo,
      isLoading,
      userLoading,
      orderLoading,
      handlers,
      formatDate,
      formatCurrency,
      getStatusColor,
      getStatusIcon,
    ]
  );

  return {
    showEmailModal,
    showRoleModal,
    showResetPasswordModal,
    selectedTab,
    isEditingAddress,
    isEditingContact,
    isEditingProfile,
    userInfo,
    allRoles,
    address,
    userRoles,
    orders,
    totalPages,
    totalItems: totalElements,
    itemsPerPage: pagination.limit,
    pagination,
    vouchers,
    error: error || reduxError || orderError,
    success,
    isLoading: isLoading || userLoading || orderLoading,
    handlers,
    formatDate,
    formatCurrency,
    getStatusColor,
    getStatusIcon,
    addressValidationSchema,
    profileValidationSchema,
    userProfileProps,
  };
}