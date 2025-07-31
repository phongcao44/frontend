/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Tag, Edit3, Check, X, Package, DollarSign, Hash } from "lucide-react";

const VariantPreview = ({
  variants = [
    { color: "Red", size: "M" },
    { color: "Blue", size: "L" },
    { color: "Green", size: "S" },
    { color: "Black", size: "XL" }
  ],
  getAttributeDisplayName = (key) => key === 'color' ? 'Màu sắc' : key === 'size' ? 'Kích thước' : key,
  colors = [
    { name: "Red", id: 1 },
    { name: "Blue", id: 2 },
    { name: "Green", id: 3 },
    { name: "Black", id: 4 }
  ],
  sizes = [
    { sizeName: "S", id: 1 },
    { sizeName: "M", id: 2 },
    { sizeName: "L", id: 3 },
    { sizeName: "XL", id: 4 }
  ],
  onChange = () => {},
}) => {
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [checkAll, setCheckAll] = useState(true);
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [priceInput, setPriceInput] = useState('');
  const [quantityInput, setQuantityInput] = useState('');
  const [variantsData, setVariantsData] = useState([]);
  const [draftVariantsData, setDraftVariantsData] = useState([]);

  const colorMap = Object.fromEntries(colors.map((c) => [c.name, c.id]));
  const sizeMap = Object.fromEntries(sizes.map((s) => [s.sizeName, s.id]));

  useEffect(() => {
    setSelectedVariants(variants.map((_, idx) => idx));
    setCheckAll(true);

    setVariantsData((prev) =>
      variants.map((v) => {
        const exist = prev.find(
          (item) => item.color === v.color && item.size === v.size
        );
        return exist || { ...v, price: 0, quantity: 0 };
      })
    );
  }, [variants]);

  const handleSelectVariant = (index) => {
    const newSelected = selectedVariants.includes(index)
      ? selectedVariants.filter((i) => i !== index)
      : [...selectedVariants, index];

    setSelectedVariants(newSelected);
    setCheckAll(newSelected.length === variants.length);
  };

  const handleCheckAll = (e) => {
    const checked = e.target.checked;
    setCheckAll(checked);
    setSelectedVariants(checked ? variants.map((_, idx) => idx) : []);
  };

  const openPriceModal = () => {
    setDraftVariantsData([...variantsData]);
    setPriceModalVisible(true);
  };

  const applyPriceToAll = () => {
    if (!priceInput) return;
    const price = parseFloat(priceInput);
    const updated = draftVariantsData.map((v, idx) =>
      selectedVariants.includes(idx) ? { ...v, price } : v
    );
    setDraftVariantsData(updated);
  };

  const applyQuantityToAll = () => {
    if (!quantityInput) return;
    const quantity = parseInt(quantityInput);
    const updated = draftVariantsData.map((v, idx) =>
      selectedVariants.includes(idx) ? { ...v, quantity } : v
    );
    setDraftVariantsData(updated);
  };

  const handleConfirm = () => {
    setVariantsData(draftVariantsData);

    const output = selectedVariants.map((index) => {
      const v = draftVariantsData[index];
      return {
        productId: 0,
        colorId: colorMap[v.color] || 0,
        sizeId: sizeMap[v.size] || 0,
        stockQuantity: v.quantity,
        priceOverride: v.price,
      };
    });

    if (typeof onChange === "function") {
      onChange(output);
    }
    setPriceModalVisible(false);
  };

  const getColorBg = (color) => {
    const colorMap = {
      'Red': 'bg-red-500',
      'Blue': 'bg-blue-500',
      'Green': 'bg-green-500',
      'Black': 'bg-gray-800',
      'Yellow': 'bg-yellow-500',
      'Purple': 'bg-purple-500',
      'Pink': 'bg-pink-500',
      'Orange': 'bg-orange-500'
    };
    return colorMap[color] || 'bg-gray-400';
  };

  return (
    <div className="mt-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full text-white font-semibold shadow-lg">
                {selectedVariants.length}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Biến thể sản phẩm</h3>
                <p className="text-sm text-gray-500">{selectedVariants.length} biến thể đã chọn</p>
              </div>
            </div>
            
            <div className="h-8 w-px bg-gray-200"></div>
            
            <button
              onClick={openPriceModal}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Edit3 size={16} />
              <span className="font-medium">Chỉnh sửa biến thể</span>
            </button>
          </div>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={checkAll}
              onChange={handleCheckAll}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm font-medium text-gray-700">Chọn tất cả</span>
          </label>
        </div>
      </div>

      {/* Variants List */}
      <div className="p-6 space-y-3">
        {variants.map((variant, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-lg border transition-all duration-200 ${
              selectedVariants.includes(idx)
                ? 'border-blue-200 bg-blue-50/50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedVariants.includes(idx)}
                      onChange={() => handleSelectVariant(idx)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </label>
                  
                  <div className="flex items-center space-x-3">
                    {Object.entries(variant).map(([key, val]) => (
                      <div key={key} className="flex items-center space-x-2">
                        {key === 'color' ? (
                          <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
                            <div className={`w-4 h-4 rounded-full ${getColorBg(val)} border-2 border-white shadow-sm`}></div>
                            <span className="text-sm font-medium text-gray-700">{val}</span>
                          </div>
                        ) : (
                          <div className="bg-gray-100 rounded-full px-3 py-1">
                            <span className="text-sm font-medium text-gray-700">
                              {getAttributeDisplayName(key)}: {val}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    <Package size={14} />
                    <span className="text-sm font-medium">Không chịu thuế</span>
                  </div>
                  <div className="flex items-center space-x-1 text-lg font-semibold text-gray-900">
                    <DollarSign size={18} className="text-green-600" />
                    <span>
                      {variantsData[idx]
                        ? Number(variantsData[idx].price || 0).toLocaleString()
                        : 0}
                    </span>
                    <span className="text-sm text-gray-500">VNĐ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {priceModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Chỉnh sửa giá và số lượng</h2>
                <button
                  onClick={() => setPriceModalVisible(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Bulk Actions */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Áp dụng hàng loạt</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Giá cho tất cả biến thể</label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Nhập giá..."
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={applyPriceToAll}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                      >
                        Áp dụng
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Số lượng cho tất cả biến thể</label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Nhập số lượng..."
                        value={quantityInput}
                        onChange={(e) => setQuantityInput(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={applyQuantityToAll}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                      >
                        Áp dụng
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Individual Variants */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa từng biến thể</h3>
                {selectedVariants.map((index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      {Object.entries(draftVariantsData[index] || {})
                        .filter(([k]) => k !== "price" && k !== "quantity")
                        .map(([key, val]) => (
                          <div key={key} className="flex items-center space-x-2">
                            {key === 'color' ? (
                              <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
                                <div className={`w-4 h-4 rounded-full ${getColorBg(val)} border-2 border-white shadow-sm`}></div>
                                <span className="text-sm font-medium text-gray-700">{val}</span>
                              </div>
                            ) : (
                              <div className="bg-gray-100 rounded-full px-3 py-1">
                                <span className="text-sm font-medium text-gray-700">{val}</span>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          <DollarSign size={16} className="inline mr-1" />
                          Giá (VNĐ)
                        </label>
                        <input
                          type="number"
                          value={draftVariantsData[index]?.price || ''}
                          onChange={(e) => {
                            const copy = [...draftVariantsData];
                            copy[index].price = parseFloat(e.target.value) || 0;
                            setDraftVariantsData(copy);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          <Hash size={16} className="inline mr-1" />
                          Số lượng
                        </label>
                        <input
                          type="number"
                          value={draftVariantsData[index]?.quantity || ''}
                          onChange={(e) => {
                            const copy = [...draftVariantsData];
                            copy[index].quantity = parseInt(e.target.value) || 0;
                            setDraftVariantsData(copy);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
              <button
                onClick={() => setPriceModalVisible(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirm}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              >
                <Check size={16} />
                <span>Cập nhật</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VariantPreview;