/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const [perPage, setPerPage] = useState(itemsPerPage);
  const [jumpToPage, setJumpToPage] = useState("");
  const [screenSize, setScreenSize] = useState("mobile");

  const totalPages = Math.ceil(totalItems / perPage);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setScreenSize("desktop");
      } else if (width >= 768) {
        setScreenSize("tablet");
      } else {
        setScreenSize("mobile");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      onPageChange(page, perPage);
      setJumpToPage("");
    }
  };

  // Handle items per page change
  const handlePerPageChange = (event) => {
    const newPerPage = parseInt(event.target.value);
    setPerPage(newPerPage);
    onPageChange(0, newPerPage);
  };

  const handleJumpToPage = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setJumpToPage(value);
    }
  };

  const handleJumpSubmit = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      const page = parseInt(jumpToPage) - 1;
      if (!isNaN(page) && page >= 0 && page < totalPages) {
        handlePageChange(page);
      }
      setJumpToPage("");
    }
  };

  // Generate page numbers for display based on screen size
  const renderPageNumbers = () => {
    const pages = [];
    let maxPageButtons;

    switch (screenSize) {
      case "mobile":
        maxPageButtons = 3;
        break;
      case "tablet":
        maxPageButtons = 5;
        break;
      case "desktop":
        maxPageButtons = 5;
        break;
      default:
        maxPageButtons = 3;
    }

    if (totalPages <= maxPageButtons) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            aria-label={`Page ${i + 1}`}
            aria-current={currentPage === i ? "page" : undefined}
            className={`min-w-[32px] h-8 px-2 text-xs sm:min-w-[40px] sm:h-10 sm:px-3 sm:text-sm rounded-md font-medium transition-colors ${
              currentPage === i
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            {i + 1}
          </button>
        );
      }
    } else {
      pages.push(
        <button
          key={0}
          onClick={() => handlePageChange(0)}
          aria-label="Page 1"
          aria-current={currentPage === 0 ? "page" : undefined}
          className={`min-w-[32px] h-8 px-2 text-xs sm:min-w-[40px] sm:h-10 sm:px-3 sm:text-sm rounded-md font-medium transition-colors ${
            currentPage === 0
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
          }`}
        >
          1
        </button>
      );

      if (currentPage > Math.floor(maxPageButtons / 2)) {
        pages.push(
          <span
            key="start-ellipsis"
            className="px-1 sm:px-2 text-gray-500 text-xs sm:text-sm"
          >
            ...
          </span>
        );
      }

      let startPage, endPage;
      const sidePages = Math.floor((maxPageButtons - 2) / 2);

      if (currentPage <= sidePages) {
        startPage = 1;
        endPage = Math.min(maxPageButtons - 2, totalPages - 2);
      } else if (currentPage >= totalPages - sidePages - 1) {
        startPage = totalPages - maxPageButtons + 1;
        endPage = totalPages - 2;
      } else {
        startPage = currentPage - sidePages;
        endPage = currentPage + sidePages;
      }

      // Render middle pages
      for (let i = startPage; i <= endPage; i++) {
        if (i > 0 && i < totalPages - 1) {
          pages.push(
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              aria-label={`Page ${i + 1}`}
              aria-current={currentPage === i ? "page" : undefined}
              className={`min-w-[32px] h-8 px-2 text-xs sm:min-w-[40px] sm:h-10 sm:px-3 sm:text-sm rounded-md font-medium transition-colors ${
                currentPage === i
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              {i + 1}
            </button>
          );
        }
      }

      // Show ellipsis if current page is not close to the end
      if (currentPage < totalPages - Math.floor(maxPageButtons / 2) - 1) {
        pages.push(
          <span
            key="end-ellipsis"
            className="px-1 sm:px-2 text-gray-500 text-xs sm:text-sm"
          >
            ...
          </span>
        );
      }

      // Always show the last page
      if (totalPages > 1) {
        pages.push(
          <button
            key={totalPages - 1}
            onClick={() => handlePageChange(totalPages - 1)}
            aria-label={`Page ${totalPages}`}
            aria-current={currentPage === totalPages - 1 ? "page" : undefined}
            className={`min-w-[32px] h-8 px-2 text-xs sm:min-w-[40px] sm:h-10 sm:px-3 sm:text-sm rounded-md font-medium transition-colors ${
              currentPage === totalPages - 1
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            {totalPages}
          </button>
        );
      }
    }

    return pages;
  };

  // // Don't render if there's only one page or less
  // if (totalPages <= 1) {
  //   return null;
  // }

  return (
    <div className="w-full">
      {/* Mobile Layout (< 768px) */}
      <div className="block md:hidden">
        <div className="w-full px-2 py-3">
          <div className="flex flex-col space-y-3">
            {/* Items per page selector - Mobile */}
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm text-gray-700 whitespace-nowrap">
                Số mục/trang:
              </span>
              <select
                value={perPage}
                onChange={handlePerPageChange}
                className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Items per page"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Page info - Mobile */}
            <div className="text-center text-sm text-gray-600">
              Trang {currentPage + 1} / {totalPages}
            </div>

            {/* Pagination controls - Mobile */}
            <div className="w-full flex items-center justify-center">
              <div className="flex items-center space-x-1 max-w-full">
                {/* Previous button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  aria-label="Previous page"
                  className={`flex-shrink-0 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium transition-colors ${
                    currentPage === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  ‹
                </button>

                {/* Page numbers - Mobile */}
                <div
                  className="flex items-center space-x-1 overflow-x-auto scrollbar-hide px-2"
                  style={{ maxWidth: "calc(100vw - 140px)" }}
                >
                  {renderPageNumbers()}
                </div>

                {/* Next button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  aria-label="Next page"
                  className={`flex-shrink-0 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium transition-colors ${
                    currentPage === totalPages - 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  ›
                </button>
              </div>
            </div>

            {/* Jump to page - Mobile */}
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm text-gray-700">Đi tới:</span>
              <input
                type="text"
                value={jumpToPage}
                onChange={handleJumpToPage}
                onKeyPress={handleJumpSubmit}
                placeholder={`${currentPage + 1}`}
                className="w-12 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                aria-label="Jump to page"
              />
              <button
                onClick={handleJumpSubmit}
                disabled={
                  !jumpToPage ||
                  isNaN(parseInt(jumpToPage)) ||
                  parseInt(jumpToPage) < 1 ||
                  parseInt(jumpToPage) > totalPages
                }
                className="px-2 py-1 border border-gray-300 rounded-md text-sm font-medium transition-colors bg-white text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                aria-label="Go to specified page"
              >
                Đi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tablet Layout (768px - 1023px) */}
      <div className="hidden md:block lg:hidden">
        <div className="w-full px-4 py-3">
          <div className="flex flex-col space-y-4">
            {/* Top row - Items per page and info */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-2 flex-shrink-0">
                <span className="text-sm text-gray-700">Số mục mỗi trang:</span>
                <select
                  value={perPage}
                  onChange={handlePerPageChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Items per page"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <span className="text-sm text-gray-700">Đi tới:</span>
                <input
                  type="text"
                  value={jumpToPage}
                  onChange={handleJumpToPage}
                  onKeyPress={handleJumpSubmit}
                  placeholder={`${currentPage + 1}`}
                  className="w-14 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  aria-label="Jump to page"
                />
                <button
                  onClick={handleJumpSubmit}
                  disabled={
                    !jumpToPage ||
                    isNaN(parseInt(jumpToPage)) ||
                    parseInt(jumpToPage) < 1 ||
                    parseInt(jumpToPage) > totalPages
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors bg-white text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  aria-label="Go to specified page"
                >
                  Đi
                </button>
              </div>
            </div>

            {/* Bottom row - Pagination controls */}
            <div className="w-full flex items-center justify-center">
              <div className="flex items-center space-x-2 max-w-full">
                {/* Previous button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  aria-label="Previous page"
                  className={`flex-shrink-0 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Trước
                </button>

                {/* Page numbers */}
                <div
                  className="flex items-center space-x-1 overflow-x-auto scrollbar-hide px-2"
                  style={{ maxWidth: "calc(100vw - 200px)" }}
                >
                  {renderPageNumbers()}
                </div>

                {/* Next button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  aria-label="Next page"
                  className={`flex-shrink-0 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === totalPages - 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout (>= 1024px) */}
      <div className="hidden lg:block">
        <div className="w-full px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Items per page selector */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <span className="text-sm text-gray-700 whitespace-nowrap">
                Số mục mỗi trang:
              </span>
              <select
                value={perPage}
                onChange={handlePerPageChange}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Items per page"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Previous button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                aria-label="Previous page"
                className={`px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Trước
              </button>

              {/* Page numbers */}
              <div className="flex items-center space-x-2">
                {renderPageNumbers()}
              </div>

              {/* Next button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                aria-label="Next page"
                className={`px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === totalPages - 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Sau
              </button>
            </div>

            {/* Jump to page input */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <span className="text-sm text-gray-700 whitespace-nowrap">
                Đi tới trang:
              </span>
              <input
                type="text"
                value={jumpToPage}
                onChange={handleJumpToPage}
                onKeyPress={handleJumpSubmit}
                placeholder={`${currentPage + 1}`}
                className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                aria-label="Jump to page"
              />
              <button
                onClick={handleJumpSubmit}
                disabled={
                  !jumpToPage ||
                  isNaN(parseInt(jumpToPage)) ||
                  parseInt(jumpToPage) < 1 ||
                  parseInt(jumpToPage) > totalPages
                }
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors bg-white text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                aria-label="Go to specified page"
              >
                Đi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
