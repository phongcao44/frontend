import { RefreshCw, Download, Plus } from "lucide-react";
import { handleDownloadExcel } from "../../../services/handleDownloadExcel";

const CategoryHeader = ({ onRefresh, onAdd, loadingFlatList, loading }) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý danh mục
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Theo dõi và quản lý tất cả danh mục sản phẩm
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onRefresh}
              className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
              disabled={loadingFlatList}
            >
              <RefreshCw
                className={`h-5 w-5 ${loadingFlatList ? "animate-spin" : ""}`}
              />
            </button>
            <button
              onClick={handleDownloadExcel}
              className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onAdd}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center space-x-2 shadow-md transition-all duration-200 transform hover:scale-105"
              disabled={loading}
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Thêm danh mục</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryHeader;