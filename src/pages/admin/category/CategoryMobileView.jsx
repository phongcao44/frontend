import { Edit, Trash, Folder, FolderOpen } from "lucide-react";

const CategoryMobileView = ({ categories, onEdit, onDelete }) => {
  return (
    <div className="lg:hidden space-y-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
                <img
                  src={category.image}
                  alt={category.name || "Category Icon"}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {"—".repeat((category.level || 1) - 1)}{" "}
                  {category.name || "Unknown"}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                  Cấp {category.level || 1}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <Folder className="h-4 w-4 mr-2" />
                <span>Mô tả:</span>
              </div>
              <span className="text-sm text-gray-500 max-w-xs">
                {category.description || (
                  <span className="text-gray-400">Chưa có mô tả</span>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <FolderOpen className="h-4 w-4 mr-2" />
                <span>Danh mục cha:</span>
              </div>
              <span className="text-sm text-gray-500">
                {category.parentName || (
                  <span className="text-gray-400">—</span>
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
            <button
              className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              onClick={() => onEdit(category)}
            >
              <Edit className="h-4 w-4 inline mr-2" />
              Sửa
            </button>
            <button
              className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              onClick={() => onDelete(category)}
            >
              <Trash className="h-4 w-4 inline mr-2" />
              Xóa
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryMobileView;
