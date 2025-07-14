/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductReviews } from "../../../redux/slices/reviewSlice";

// eslint-disable-next-line no-unused-vars
const StarRating = ({ value, disabled, className }) => {
  const stars = Array(5)
    .fill(0)
    .map((_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${
          index < Math.round(value)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        } ${className}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));

  return <div className="flex">{stars}</div>;
};

const ProductReviews = ({ productId }) => {
  const dispatch = useDispatch();
  const {
    reviews,
    loading: reviewLoading,
    error: reviewError,
  } = useSelector((state) => state.review);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filterRating, setFilterRating] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductReviews(productId));
    }
  }, [dispatch, productId]);

  const calculateRatingStats = () => {
    if (!reviews || reviews.length === 0) return {};

    const totalReviews = reviews.length;
    const avgRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

    const ratingCounts = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    reviews.forEach((review) => {
      ratingCounts[review.rating] = (ratingCounts[review.rating] || 0) + 1;
    });

    return {
      totalReviews,
      avgRating: avgRating.toFixed(1),
      ratingCounts,
    };
  };

  const getFilteredAndSortedReviews = () => {
    let filteredReviews = [...(reviews || [])];

    if (filterRating !== "all") {
      filteredReviews = filteredReviews.filter(
        (review) => review.rating === parseInt(filterRating)
      );
    }

    switch (sortBy) {
      case "newest":
        filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "oldest":
        filteredReviews.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "highest":
        filteredReviews.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        filteredReviews.sort((a, b) => a.rating - b.rating);
        break;
      default:
        break;
    }

    return filteredReviews;
  };

  const getCurrentPageReviews = () => {
    const filteredReviews = getFilteredAndSortedReviews();
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredReviews.slice(startIndex, endIndex);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAvatarText = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  if (reviewLoading)
    return <div className="text-center text-gray-600">Loading reviews...</div>;
  if (reviewError)
    return <div className="text-center text-red-500">Error: {reviewError}</div>;

  const stats = calculateRatingStats();
  const filteredReviews = getFilteredAndSortedReviews();
  const currentPageReviews = getCurrentPageReviews();

  return (
    <div className="mt-12">
      <div className="flex items-center mb-7">
        <div className="w-5 h-10 bg-red-500 rounded mr-4"></div>
        <span className="text-red-500 text-base font-semibold">
          Đánh giá sản phẩm
        </span>
      </div>

      {reviews?.length > 0 ? (
        <div className="bg-white p-6 rounded-lg ">
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">
                  {stats.avgRating}
                </div>
                <StarRating
                  value={parseFloat(stats.avgRating)}
                  className="mb-2 justify-center"
                />
                <span className="text-gray-600">
                  {stats.totalReviews} đánh giá
                </span>
              </div>
              <div className="col-span-2 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center">
                    <span className="w-12 text-sm">{star} sao</span>
                    <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{
                          width: `${
                            stats.totalReviews > 0
                              ? (stats.ratingCounts[star] /
                                  stats.totalReviews) *
                                100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="w-12 text-right text-sm">
                      {stats.ratingCounts[star] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Lọc theo:</span>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="w-36 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
              >
                <option value="all">Tất cả</option>
                <option value="5">5 sao</option>
                <option value="4">4 sao</option>
                <option value="3">3 sao</option>
                <option value="2">2 sao</option>
                <option value="1">1 sao</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-36 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="highest">Điểm cao nhất</option>
                <option value="lowest">Điểm thấp nhất</option>
              </select>
            </div>

            <span className="text-gray-600 text-sm">
              Hiển thị {filteredReviews.length} đánh giá
            </span>
          </div>

          {currentPageReviews.length > 0 ? (
            <div className="space-y-6">
              {currentPageReviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-100 pb-6 last:border-b-0"
                >
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {getAvatarText(review.user)}
                    </div>

                    {/* Nội dung đánh giá */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-semibold">
                          {review.userName || "Người dùng ẩn danh"}
                        </span>
                        {review.verified && (
                          <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded">
                            Đã mua hàng
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <StarRating value={review.rating} className="text-sm" />
                        <span className="text-gray-500 text-sm">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>

                      <p className="text-gray-800 mb-3 leading-relaxed">
                        {review.comment}
                      </p>

                      {/* Hình ảnh đánh giá (nếu có) */}
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mb-3">
                          {review.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Review ${index + 1}`}
                              className="w-20 h-20 object-cover rounded border border-gray-200"
                            />
                          ))}
                        </div>
                      )}

                      {/* Phản hồi từ shop (nếu có) */}
                      {review.shopReply && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                              S
                            </div>
                            <span className="text-blue-600 font-semibold">
                              Phản hồi từ Shop
                            </span>
                          </div>
                          <p className="text-gray-700">{review.shopReply}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="my-8 text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              <p className="mt-2 text-gray-600">
                Không có đánh giá phù hợp với bộ lọc
              </p>
            </div>
          )}

          {filteredReviews.length > pageSize && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Trước
              </button>
              {Array.from(
                { length: Math.ceil(filteredReviews.length / pageSize) },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      prev + 1,
                      Math.ceil(filteredReviews.length / pageSize)
                    )
                  )
                }
                disabled={
                  currentPage === Math.ceil(filteredReviews.length / pageSize)
                }
                className={`px-3 py-1 rounded-md ${
                  currentPage === Math.ceil(filteredReviews.length / pageSize)
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Sau
              </button>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="p-1 border border-gray-300 rounded-md"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
              <span className="text-sm text-gray-600">
                {`${(currentPage - 1) * pageSize + 1}-${Math.min(
                  currentPage * pageSize,
                  filteredReviews.length
                )} của ${filteredReviews.length} đánh giá`}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-lg text-center shadow-sm">
          <svg
            className="w-16 h-16 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          <p className="mt-2 text-gray-600">
            Chưa có đánh giá cho sản phẩm này
          </p>
          <p className="text-gray-600">
            Hãy là người đầu tiên đánh giá sản phẩm này!
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
