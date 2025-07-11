// import { useEffect, useState } from "react";
// import { X, Trash2 } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import {
//   createFlashSaleItem,
//   removeFlashSaleItem,
//   fetchFlashSaleItems,
// } from "../../../redux/slices/flashSaleSlice";

// export default function FlashSaleItemManagement({ onBack }) {
//   const dispatch = useDispatch();
//   const { id } = useParams();

//   const { flashSaleItems, flashSales } = useSelector(
//     (state) => ({
//       flashSaleItems: state.flashSale.flashSaleItems,
//       flashSales: state.flashSale.flashSales,
//     })
//   );

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchFlashSaleItems(id));
//     }
//   }, [id, dispatch]);

//   const selectedFlashSale = flashSales.find(
//     (fs) => fs.id === parseInt(id)
//   ) || { name: "Không rõ", description: "" };

//   const [form, setForm] = useState({
//     product_id: "",
//     variant_id: "",
//     discount_type: "PERCENTAGE",
//     discounted_price: "",
//     quantity_limit: "",
//   });

//   const safe = (v, fallback = "") =>
//     v !== undefined && v !== null && v !== "" ? v : fallback;

//   const getCurrentItems = () =>
//     flashSaleItems.filter((i) => i.flash_sale_id === parseInt(id));

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!form.product_id || !form.variant_id) return;

//     dispatch(
//       createFlashSaleItem({
//         ...form,
//         flash_sale_id: parseInt(id),
//       })
//     );

//     setForm({
//       product_id: "",
//       variant_id: "",
//       discount_type: "PERCENTAGE",
//       discounted_price: "",
//       quantity_limit: "",
//     });
//   };

//   const handleDelete = (itemId) => dispatch(removeFlashSaleItem(itemId));

//   const formatVND = (price) =>
//     new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(price);

//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-white">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold">
//             Sản phẩm Flash Sale: {safe(selectedFlashSale.name)}
//           </h1>
//           <p className="text-gray-600">{safe(selectedFlashSale.description)}</p>
//         </div>
//         <button
//           onClick={onBack}
//           className="flex items-center gap-2 text-gray-600 hover:text-black"
//         >
//           <X size={20} /> Quay lại
//         </button>
//       </div>

//       <div className="bg-gray-50 rounded-lg p-4 mb-6">
//         <h3 className="text-lg font-semibold mb-4">Thêm sản phẩm</h3>
//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
//         >
//           <div>
//             <label className="block text-sm font-medium mb-2">Sản phẩm</label>
//             <select
//               value={form.product_id}
//               onChange={(e) =>
//                 setForm({ ...form, product_id: e.target.value, variant_id: "" })
//               }
//               required
//               className="w-full border rounded px-3 py-2"
//             >
//               <option value="">Chọn sản phẩm</option>
//               {products.map((p) => (
//                 <option key={p.id} value={p.id}>
//                   {safe(p.name, `ID ${p.id}`)}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">Biến thể</label>
//             <select
//               value={form.variant_id}
//               onChange={(e) => setForm({ ...form, variant_id: e.target.value })}
//               required
//               disabled={!form.product_id}
//               className="w-full border rounded px-3 py-2"
//             >
//               <option value="">Chọn biến thể</option>
//               {availableVariants(form.product_id).map((v) => (
//                 <option key={v.id} value={v.id}>
//                   {safe(v.name, `ID ${v.id}`)}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">Loại giảm</label>
//             <select
//               value={form.discount_type}
//               onChange={(e) =>
//                 setForm({ ...form, discount_type: e.target.value })
//               }
//               className="w-full border rounded px-3 py-2"
//             >
//               <option value="PERCENTAGE">Phần trăm</option>
//               <option value="AMOUNT">Số tiền</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">
//               Giá sau giảm
//             </label>
//             <input
//               type="number"
//               value={safe(form.discounted_price)}
//               onChange={(e) =>
//                 setForm({ ...form, discounted_price: e.target.value })
//               }
//               required
//               min="0"
//               step="1000"
//               className="w-full border rounded px-3 py-2"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">
//               Giới hạn SL
//             </label>
//             <input
//               type="number"
//               value={safe(form.quantity_limit)}
//               onChange={(e) =>
//                 setForm({ ...form, quantity_limit: e.target.value })
//               }
//               required
//               min="1"
//               className="w-full border rounded px-3 py-2"
//             />
//           </div>

//           <div className="flex items-end">
//             <button
//               type="submit"
//               className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//             >
//               Thêm
//             </button>
//           </div>
//         </form>
//       </div>

//       <div className="bg-white rounded shadow overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium">
//                 Sản phẩm
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium">
//                 Biến thể
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium">
//                 Giá gốc
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium">
//                 Giá Flash Sale
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium">
//                 Số lượng
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium">
//                 Đã bán
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium">Xoá</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {getCurrentItems().map((item) => {
//               const variant = variants.find(
//                 (v) => v.id === parseInt(item.variant_id)
//               );
//               const original = safe(variant?.price, 0);
//               return (
//                 <tr key={item.id}>
//                   <td className="px-6 py-4">
//                     {getProductName(item.product_id)}
//                   </td>
//                   <td className="px-6 py-4">
//                     {getVariantName(item.variant_id)}
//                   </td>
//                   <td className="px-6 py-4">{formatVND(original)}</td>
//                   <td className="px-6 py-4 text-red-600">
//                     {formatVND(item.discounted_price)}
//                   </td>
//                   <td className="px-6 py-4">{item.quantity_limit}</td>
//                   <td className="px-6 py-4">{item.sold_quantity || 0}</td>
//                   <td className="px-6 py-4">
//                     <button
//                       onClick={() => handleDelete(item.id)}
//                       className="text-red-600 hover:text-red-800"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import React from "react";

function VoucherManagement() {
  return <div>VoucherManagement</div>;
}

export default VoucherManagement;
