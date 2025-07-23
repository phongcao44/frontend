import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadCategoryTree } from "../../../redux/slices/categorySlice";

const MegaMenu = () => {
  const dispatch = useDispatch();
  const { categoryTree } = useSelector((state) => state.category);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    dispatch(loadCategoryTree());
  }, [dispatch]);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle mouse enter with delay
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  // Toggle for mobile
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Mega Menu Trigger Button */}
      <button
        className={`
          flex items-center gap-2 px-4 py-2 font-medium text-gray-700 
          hover:text-blue-600 hover:bg-gray-50 rounded-md transition-all duration-200
          ${isOpen ? 'text-blue-600 bg-gray-50' : ''}
        `}
        onMouseEnter={!isMobile ? handleMouseEnter : undefined}
        onMouseLeave={!isMobile ? handleMouseLeave : undefined}
        onClick={isMobile ? toggleMenu : undefined}
      >
        {isMobile ? (
          isOpen ? <FaTimes className="text-sm" /> : <FaBars className="text-sm" />
        ) : (
          <>
            <span>Danh mục sản phẩm</span>
            <FaChevronDown 
              className={`text-xs transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`} 
            />
          </>
        )}
      </button>

      {/* Mega Menu Dropdown */}
      <div
        className={`
          absolute top-full left-0 w-screen max-w-6xl bg-white shadow-2xl border border-gray-100 
          rounded-lg mt-2 transition-all duration-300 ease-out z-50
          ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}
          ${isMobile ? 'relative w-full max-w-full shadow-lg' : ''}
        `}
        onMouseEnter={!isMobile ? handleMouseEnter : undefined}
        onMouseLeave={!isMobile ? handleMouseLeave : undefined}
      >
        {/* Mobile Header */}
        {isMobile && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Danh mục sản phẩm</h3>
            <button 
              onClick={toggleMenu}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>
        )}

        {/* Menu Content */}
        <div className={`
          grid gap-8 p-8
          ${isMobile 
            ? 'grid-cols-1 max-h-96 overflow-y-auto' 
            : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
          }
        `}>
          {categoryTree && categoryTree.length > 0 ? (
            categoryTree.map((parentCategory) => (
              <div key={parentCategory.id} className="group">
                {/* Parent Category Header */}
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide border-b-2 border-blue-500 pb-2 group-hover:text-blue-600 transition-colors">
                    {parentCategory.name}
                  </h3>
                </div>

                {/* Sub Categories */}
                <div className="space-y-3">
                  {parentCategory.children && parentCategory.children.length > 0 ? (
                    parentCategory.children.map((subCategory) => (
                      <div key={subCategory.id} className="space-y-2">
                        {/* Sub Category */}
                        <div className="group/sub">
                          <a
                            href="#"
                            className="block text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors duration-200 group-hover/sub:pl-2"
                          >
                            {subCategory.name}
                          </a>

                          {/* Grand Children (Level 3) */}
                          {subCategory.children && subCategory.children.length > 0 && (
                            <div className="ml-3 space-y-1 mt-2">
                              {subCategory.children.slice(0, 5).map((grandChild) => (
                                <a
                                  key={grandChild.id}
                                  href="#"
                                  className="block text-gray-500 hover:text-blue-500 text-xs transition-colors duration-200 hover:pl-2"
                                >
                                  {grandChild.name}
                                </a>
                              ))}
                              {subCategory.children.length > 5 && (
                                <a
                                  href="#"
                                  className="block text-blue-500 text-xs font-medium hover:text-blue-600 transition-colors duration-200"
                                >
                                  + {subCategory.children.length - 5} mục khác
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm italic">
                      Chưa có danh mục con
                    </p>
                  )}

                  {/* View All Link */}
                  {parentCategory.children && parentCategory.children.length > 0 && (
                    <div className="pt-2 mt-4 border-t border-gray-100">
                      <a
                        href="#"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
                      >
                        Xem tất cả {parentCategory.name.toLowerCase()}
                        <FaChevronDown className="ml-1 text-xs rotate-[-90deg]" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Đang tải danh mục...</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer (Desktop only) */}
        {!isMobile && categoryTree && categoryTree.length > 0 && (
          <div className="bg-gray-50 px-8 py-4 rounded-b-lg border-t border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Tổng cộng {categoryTree.length} danh mục chính
              </p>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
              >
                Xem tất cả danh mục →
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={toggleMenu}
        />
      )}
    </div>
  );
};

export default MegaMenu;