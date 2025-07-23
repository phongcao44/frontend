/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchUsersPaginateAndFilter,
  createUser,
  updateUserStatus,
  updateUserRole,
  clearError,
} from "../../../../redux/slices/userSlice";

// Debounce utility
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

// Custom hook for user management logic
export default function useUserManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error } = useSelector((state) => state.users);

  // State management
  const [activeTab, setActiveTab] = useState("Tất cả khách hàng");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [orderBy, setOrderBy] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("");
  const [rankFilter, setRankFilter] = useState("");

  // Derived state
  const customers = useMemo(() => users?.content || [], [users]);
  const totalPages = users?.totalPages || 1;
  const totalElements = users?.totalElements || 0;

  // Filter options
  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "ACTIVE", label: "Hoạt động" },
    { value: "INACTIVE", label: "Không hoạt động" },
  ];

  const rankOptions = [
    { value: "", label: "Tất cả rank" },
    { value: "BAC", label: "Bạc" },
    { value: "DONG", label: "Đồng" },
    { value: "VANG", label: "Vàng" },
    { value: "KIMCUONG", label: "Kim Cương" },
  ];

  // Tabs configuration
  const tabs = useMemo(
    () => [
      { name: "Tất cả khách hàng", count: totalElements },
      {
        name: "Khách hàng VIP",
        count: customers.filter((c) => c.roles.some((role) => role === "ROLE_VIP")).length || 0,
      },
    ],
    [totalElements, customers]
  );

  // Fetch users with filters
  const fetchUsers = useCallback(() => {
    setIsLoading(true);
    dispatch(
      fetchUsersPaginateAndFilter({
        page: currentPage,
        size: itemsPerPage,
        sortBy,
        orderBy,
        keyword: searchTerm,
        status: statusFilter || (activeTab === "Khách hàng VIP" ? "ROLE_VIP" : ""),
        rank: rankFilter,
      })
    ).finally(() => setTimeout(() => setIsLoading(false), 500));
  }, [dispatch, currentPage, itemsPerPage, sortBy, orderBy, searchTerm, statusFilter, rankFilter, activeTab]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      fetchUsers();
    }, 500),
    [fetchUsers]
  );

  // Handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setIsLoading(true);
    setCurrentPage(0);
    debouncedSearch(e.target.value);
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setCurrentPage(0);
    setStatusFilter(tabName === "Tất cả khách hàng" ? "" : "ROLE_VIP");
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  const handlePageChange = (page, newItemsPerPage) => {
    setCurrentPage(page);
    if (newItemsPerPage !== itemsPerPage) {
      setItemsPerPage(newItemsPerPage);
    }
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(0);
    if (e.target.value) setActiveTab("Tất cả khách hàng");
  };

  const handleRankFilterChange = (e) => {
    setRankFilter(e.target.value);
    setCurrentPage(0);
    if (e.target.value) setActiveTab("Tất cả khách hàng");
  };

  const handleCreateUser = () => {
    const userData = {
      username: prompt("Enter username:") || "newuser",
      email: prompt("Enter email:") || "newuser@example.com",
      status: "ACTIVE",
      roles: ["ROLE_USER"],
      rank: "BRONZE",
    };
    dispatch(createUser(userData));
  };

  const handleUpdateStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    dispatch(updateUserStatus({ userId, status: newStatus }));
  };

  const handleUpdateRole = (userId, currentRoles) => {
    const newRole = currentRoles.includes("ROLE_VIP") ? "ROLE_USER" : "ROLE_VIP";
    dispatch(updateUserRole({ userId, roleId: newRole }));
  };

  const handleEdit = (customerId) => {
    navigate(`/admin/users/${customerId}`);
  };

  const handleDelete = (userId) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      console.log(`Delete user with ID: ${userId}`);
    }
  };

  // Effect for fetching users
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Effect for clearing errors
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  return {
    activeTab,
    searchTerm,
    isLoading: isLoading || loading,
    customers,
    totalElements,
    totalPages,
    currentPage,
    itemsPerPage,
    statusFilter,
    rankFilter,
    tabs,
    error,
    handlers: {
      handleSearchChange,
      handleTabChange,
      handleRefresh,
      handleCreateUser,
      handleUpdateStatus,
      handleUpdateRole,
      handleEdit,
      handleDelete,
    },
    pagination: {
      currentPage,
      totalItems: totalElements,
      itemsPerPage,
      onPageChange: handlePageChange,
    },
    filters: {
      statusOptions,
      rankOptions,
      handleStatusFilterChange,
      handleRankFilterChange,
      handleSortChange: (e) => {
        const [newSortBy, newOrderBy] = e.target.value.split(":");
        setSortBy(newSortBy);
        setOrderBy(newOrderBy);
        setCurrentPage(0);
      },
    },
  };
}