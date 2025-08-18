import { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchUsersPaginateAndFilter,
  createUser,
  updateUserStatus,
  updateUserRole,
  clearError,
  fetchUserStatistics, // Added new import
} from "../../../../redux/slices/userSlice";

// Debounce utility with cancel
const debounce = (func, wait) => {
  let timeout;
  const debounced = (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
  debounced.cancel = () => clearTimeout(timeout);
  return debounced;
};

export default function useUserManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error, userStatistics } = useSelector((state) => state.users);
  
  // Ref để theo dõi request đang pending
  const pendingRequestRef = useRef(null);

  // State management
  const [activeTab, setActiveTab] = useState("Tất cả khách hàng");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [orderBy, setOrderBy] = useState("desc");
  const [statusFilter, setStatusFilter] = useState(null);
  const [rankFilter, setRankFilter] = useState(null);

  // Derived state
  const customers = useMemo(() => {
    return users?.data?.content || [];
  }, [users]);
  const totalPages = users?.data?.totalPages || 1;
  const totalElements = users?.data?.totalElements || 0;
  const statistics = useMemo(() => {
    return userStatistics?.data || {
      totalAccounts: 0,
      totalUsers: 0,
      totalKimCuongUsers: 0
    };
  }, [userStatistics]);

  // Filter options
  const statusOptions = [
    { value: null, label: "Tất cả trạng thái" },
    { value: "ACTIVE", label: "Hoạt động" },
    { value: "INACTIVE", label: "Không hoạt động" },
  ];

  const rankOptions = [
    { value: null, label: "Tất cả rank" },
    { value: "DONG", label: "Đồng" },
    { value: "BAC", label: "Bạc" },
    { value: "VANG", label: "Vàng" },
    { value: "KIMCUONG", label: "Kim Cương" },
  ];

  // Tabs configuration
  const tabs = useMemo(
    () => [
      { name: "Tất cả khách hàng", count: totalElements },
      {
        name: "Khách hàng VIP",
        count: statistics.totalKimCuongUsers || 0,
      },
    ],
    [totalElements, statistics]
  );

  // Fetch users function
  const fetchUsers = (params = {}) => {
    if (pendingRequestRef.current) {
      pendingRequestRef.current.abort();
    }

    setIsLoading(true);
    
    const {
      page = currentPage,
      size = itemsPerPage,
      sortBy: newSortBy = sortBy,
      orderBy: newOrderBy = orderBy,
      keyword = searchTerm,
      status = statusFilter,
      rank = rankFilter,
      tab = activeTab
    } = params;

    const filters = {
      page,
      size,
      sortBy: newSortBy,
      orderBy: newOrderBy,
      ...(keyword && { keyword }),
      ...(status && { status }),
      ...(tab === "Khách hàng VIP" 
        ? { rank: "KIMCUONG" } 
        : rank && { rank }
      ),
    };

    console.log('Fetching with filters:', filters);

    const requestPromise = dispatch(fetchUsersPaginateAndFilter(filters));
    pendingRequestRef.current = requestPromise;

    requestPromise
      .unwrap()
      .then(() => {
        setIsLoading(false);
        pendingRequestRef.current = null;
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setIsLoading(false);
        }
        pendingRequestRef.current = null;
      });

    return requestPromise;
  };

  // Fetch statistics function
  const fetchStatistics = () => {
    const requestPromise = dispatch(fetchUserStatistics());
    pendingRequestRef.current = requestPromise;

    requestPromise
      .unwrap()
      .then(() => {
        pendingRequestRef.current = null;
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Statistics fetch error:', err);
        }
        pendingRequestRef.current = null;
      });

    return requestPromise;
  };

  // Debounced search
  const debouncedFetchUsers = useMemo(
    () => debounce((searchValue) => {
      fetchUsers({ 
        keyword: searchValue, 
        page: 0
      });
    }, 500),
    [currentPage, itemsPerPage, sortBy, orderBy, statusFilter, rankFilter, activeTab]
  );

  // Handlers
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(0);
    
    debouncedFetchUsers.cancel();
    debouncedFetchUsers(value);
  };

  const handleTabChange = (tabName) => {
    debouncedFetchUsers.cancel();
    setActiveTab(tabName);
    setCurrentPage(0);
    
    if (tabName === "Khách hàng VIP") {
      setRankFilter(null);
    }
    
    fetchUsers({ 
      tab: tabName, 
      page: 0,
      rank: tabName === "Khách hàng VIP" ? "KIMCUONG" : rankFilter
    });
  };

  const handleRefresh = () => {
    debouncedFetchUsers.cancel();
    setCurrentPage(0);
    fetchUsers({ page: 0 });
    fetchStatistics(); // Refresh statistics as well
  };

  const handlePageChange = (page, newItemsPerPage) => {
    debouncedFetchUsers.cancel();
    setCurrentPage(page);
    
    if (newItemsPerPage && newItemsPerPage !== itemsPerPage) {
      setItemsPerPage(newItemsPerPage);
      fetchUsers({ page, size: newItemsPerPage });
    } else {
      fetchUsers({ page });
    }
  };

  const handleStatusFilterChange = (e) => {
    debouncedFetchUsers.cancel();
    const newStatus = e.target.value || null;
    setStatusFilter(newStatus);
    setCurrentPage(0);
    
    fetchUsers({ 
      status: newStatus, 
      page: 0 
    });
  };

  const handleRankFilterChange = (e) => {
    debouncedFetchUsers.cancel();
    const newRank = e.target.value || null;
    setRankFilter(newRank);
    setCurrentPage(0);
    
    if (activeTab === "Khách hàng VIP") {
      setActiveTab("Tất cả khách hàng");
    }
    
    fetchUsers({ 
      rank: newRank, 
      page: 0,
      tab: activeTab === "Khách hàng VIP" ? "Tất cả khách hàng" : activeTab
    });
  };

  const handleSortChange = (e) => {
    debouncedFetchUsers.cancel();
    const [newSortBy, newOrderBy] = e.target.value.split(":");
    setSortBy(newSortBy);
    setOrderBy(newOrderBy);
    setCurrentPage(0);
    
    fetchUsers({ 
      sortBy: newSortBy, 
      orderBy: newOrderBy, 
      page: 0 
    });
  };

  const handleCreateUser = () => {
    const userData = {
      username: prompt("Enter username:") || "newuser",
      email: prompt("Enter email:") || "newuser@example.com",
      status: "ACTIVE",
      roles: ["ROLE_USER"],
      rank: "DONG",
    };
    dispatch(createUser(userData)).then(() => {
      fetchStatistics(); // Update statistics after creating user
    });
  };

  const handleUpdateStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    dispatch(updateUserStatus({ userId, status: newStatus })).then(() => {
      fetchStatistics(); // Update statistics after status change
    });
  };

  const handleUpdateRole = (userId, currentRoles) => {
    const hasVipRole = currentRoles.includes("ROLE_VIP");
    const newRoleId = hasVipRole ? "ROLE_USER" : "ROLE_VIP";
    dispatch(updateUserRole({ userId, roleId: newRoleId })).then(() => {
      fetchStatistics(); // Update statistics after role change
    });
  };

  const handleEdit = (customerId) => {
    navigate(`/admin/users/${customerId}`);
  };

  const handleDelete = (userId) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      console.log(`Delete user with ID: ${userId}`);
      fetchStatistics(); // Update statistics after deletion
    }
  };

  // Effect để fetch dữ liệu lần đầu
  useEffect(() => {
    fetchUsers();
    fetchStatistics();
    
    return () => {
      if (pendingRequestRef.current) {
        pendingRequestRef.current.abort();
      }
      debouncedFetchUsers.cancel();
    };
  }, []);

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
    statistics, // Added statistics to return value
    handlers: {
      handleSearchChange,
      handleTabChange,
      handleRefresh,
      handleCreateUser,
      handleUpdateStatus,
      handleUpdateRole,
      handleEdit,
      handleDelete,
      handleFetchStatistics: fetchStatistics, // Added statistics fetch handler
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
      handleSortChange,
    },
  };
}