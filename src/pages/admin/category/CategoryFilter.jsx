import { Search } from "lucide-react";

const CategoryFilter = ({ typeFilter, setTypeFilter, setSearchValue, loading, setCurrentPage }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(0);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="all">Tất cả cấp độ</option>
            <option value="1">Cấp 1</option>
            <option value="2">Cấp 2</option>
            <option value="3">Cấp 3</option>
          </select>
        </div>
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mô tả danh mục..."
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80 transition-all duration-200"
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;