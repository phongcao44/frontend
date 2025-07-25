import { Folder, FolderOpen, FileText } from "lucide-react";

const CategoryStats = ({ totalCategories, level1Count, level2Count, level3Count }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Folder className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">
              Tổng danh mục
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {totalCategories}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-3 bg-green-100 rounded-lg">
            <Folder className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">
              Danh mục cấp 1
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {level1Count}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-3 bg-orange-100 rounded-lg">
            <FolderOpen className="h-6 w-6 text-orange-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">
              Danh mục cấp 2
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {level2Count}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-3 bg-purple-100 rounded-lg">
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">
              Danh mục cấp 3
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {level3Count}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryStats;