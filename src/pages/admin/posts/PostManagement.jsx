import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminPosts, deletePost } from "../../../redux/slices/postSlice";
import { Edit, Eye, Trash2 } from "lucide-react";
import ViewPostModal from "./ViewPostModal";
import Pagination from "./Pagination";
import Swal from "sweetalert2";
import { POST_CATEGORIES } from "../../../constants/postCategories";

export default function PostManagement() {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [locationFilter, setLocationFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);

  const [filteredPosts, setFilteredPosts] = useState([]);

  const [selectedPost, setSelectedPost] = useState(null);
  const [mode, setMode] = useState("view");

  const [showViewModal, setShowViewModal] = useState(false);

  // State để theo dõi bài viết mới được thêm
  const [newlyAddedPostId, setNewlyAddedPostId] = useState(null);

  useEffect(() => {
    dispatch(getAdminPosts());
  }, [dispatch]);

  useEffect(() => {
    let result = [...posts];

    if (searchTerm) {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter !== "all") {
      result = result.filter((post) => post.location === locationFilter);
    }

    // Sắp xếp với ưu tiên bài viết mới được thêm
    result.sort((a, b) => {
      // Nếu có bài viết mới được thêm, ưu tiên nó lên đầu
      if (newlyAddedPostId) {
        if (a.id === newlyAddedPostId) return -1;
        if (b.id === newlyAddedPostId) return 1;
      }
      
      // Sắp xếp theo ngày tạo
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredPosts(result);
    
    // Reset về trang đầu khi có bài viết mới hoặc khi filter thay đổi
    if (newlyAddedPostId || searchTerm || locationFilter !== "all") {
      setCurrentPage(1);
    }
  }, [posts, searchTerm, sortOrder, locationFilter, newlyAddedPostId]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handleAddNew = () => {
    setSelectedPost(null);
    setMode("add");
    setShowViewModal(true);
  };

  const handleViewPost = (post) => {
    setSelectedPost(post);
    setMode("view");
    setShowViewModal(true);
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setMode("edit");
    setShowViewModal(true);
  };

  const handleDeletePost = (id) => {
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
        dispatch(deletePost(id)).then(() => {
          Swal.fire("Đã xóa!", "Bài viết đã được xóa.", "success");
          // Reset newlyAddedPostId nếu bài viết vừa được thêm bị xóa
          if (newlyAddedPostId === id) {
            setNewlyAddedPostId(null);
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Đã hủy", "Bài viết vẫn còn nguyên.", "info");
      }
    });
  };

  // Hàm để xử lý khi modal đóng và có bài viết mới được thêm
  const handleModalClose = (newPostId = null) => {
    setShowViewModal(false);
    if (newPostId) {
      setNewlyAddedPostId(newPostId);
      // Tự động reset highlight sau 3 giây
      setTimeout(() => {
        setNewlyAddedPostId(null);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Bài viết</h1>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded whitespace-nowrap flex items-center"
          >
            <i className="fas fa-plus mr-2"></i>
            Thêm bài viết mới
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter, Search, Sort */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
            </div>
          </div>

          <div>
            <select
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
            </select>
          </div>

          <div>
            <select
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="all">Tất cả Địa điểm</option>
              {POST_CATEGORIES.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">
              Danh sách bài viết
            </h2>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Hiển thị:</span>
              <select
                className="border border-gray-300 rounded-lg text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                value={postsPerPage}
                onChange={(e) => setPostsPerPage(Number(e.target.value))}
              >
                {[5, 10, 20, 50].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Địa điểm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cập nhật
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tác giả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPosts.map((post) => (
                  <tr 
                    key={post.id} 
                    className={`hover:bg-gray-50 transition-colors duration-200 ${
                      newlyAddedPostId === post.id ? 'bg-green-50 border-l-4 border-green-400' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="h-16 w-20 overflow-hidden rounded-md">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover object-top"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {post.title}
                        {newlyAddedPostId === post.id && (
                          <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            Mới
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">{post.description}</td>
                    <td className="px-6 py-4">{post.location}</td>
                    <td className="px-6 py-4">{formatDate(post.createdAt)}</td>
                    <td className="px-6 py-4">{formatDate(post.updatedAt)}</td>
                    <td className="px-6 py-4">{post.authorName}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewPost(post)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Xem"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditPost(post)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
            indexOfFirstItem={indexOfFirstPost}
            indexOfLastItem={indexOfLastPost}
            totalItems={filteredPosts.length}
          />
        </div>
      </main>

      <ViewPostModal
        show={showViewModal}
        onClose={handleModalClose}
        post={selectedPost}
        mode={mode}
        setMode={setMode}
        formatDate={formatDate}
      />
    </div>
  );
}