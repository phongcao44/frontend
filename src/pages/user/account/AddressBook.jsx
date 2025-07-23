import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  getAddresses,
  createAddress,
  editAddress,
  removeAddress,
} from "../../../redux/slices/addressSlice";

export default function AddressBook() {
  const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector((state) => state.address);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [formData, setFormData] = useState({
    recipientName: "",
    phone: "",
    fullAddress: "",
    provinceName: "",
    districtName: "",
    wardName: "",
  });

  // Fetch addresses on component mount
  useEffect(() => {
    dispatch(getAddresses());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditAddress = (address) => {
    setIsEditing(true);
    setIsAddingNew(false);
    setEditingAddressId(address.addressId);
    setFormData({
      recipientName: address.recipientName,
      phone: address.phone,
      fullAddress: address.fullAddress,
      provinceName: address.provinceName,
      districtName: address.districtName,
      wardName: address.wardName,
    });
    setShowModal(true);
  };

  const handleDeleteAddress = async (id) => {
    try {
      await dispatch(removeAddress(id)).unwrap();
      await Swal.fire("Success!", "Address deleted successfully.", "success");
      setShowModal(false);
      setIsEditing(false);
      setIsAddingNew(false);
    } catch (error) {
      await Swal.fire("Error!", "Failed to delete address.", "error");
    }
  };

  const handleSaveAddress = async () => {
    if (
      !formData.recipientName ||
      !formData.phone ||
      !formData.fullAddress ||
      !formData.provinceName ||
      !formData.districtName ||
      !formData.wardName
    ) {
      await Swal.fire("Error!", "Please fill in all required fields.", "error");
      return;
    }

    const addressData = {
      recipientName: formData.recipientName,
      phone: formData.phone,
      fullAddress: formData.fullAddress,
      provinceName: formData.provinceName,
      districtName: formData.districtName,
      wardName: formData.wardName,
    };

    try {
      if (isEditing) {
        await dispatch(
          editAddress({ id: editingAddressId, payload: addressData })
        ).unwrap();
        await Swal.fire("Success!", "Address updated successfully.", "success");
      } else {
        await dispatch(createAddress(addressData)).unwrap();
        await Swal.fire("Success!", "Address added successfully.", "success");
      }
      setShowModal(false);
      setIsEditing(false);
      setIsAddingNew(false);
      setFormData({
        recipientName: "",
        phone: "",
        fullAddress: "",
        provinceName: "",
        districtName: "",
        wardName: "",
      });
    } catch (error) {
      await Swal.fire(
        "Error!",
        `Failed to ${isEditing ? "update" : "add"} address.`,
        "error"
      );
    }
  };

  const handleNewAddress = () => {
    setIsAddingNew(true);
    setIsEditing(false);
    setFormData({
      recipientName: "",
      phone: "",
      fullAddress: "",
      provinceName: "",
      districtName: "",
      wardName: "",
    });
    setShowModal(true);
  };

  const defaultAddress = addresses.find((addr) => addr.isDefault) || addresses[0];

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mx-auto">
      <h2 className="text-xl font-medium text-red-500 mb-8">Address Book</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Default Address Display */}
      {defaultAddress ? (
        <div className="border border-gray-300 rounded-md p-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">
              {defaultAddress.recipientName}
            </span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-600">{defaultAddress.phone}</span>
            {defaultAddress.isDefault && (
              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded">
                Default
              </span>
            )}
          </div>
          <p className="text-gray-700 text-sm">{defaultAddress.fullAddress}</p>
          <p className="text-gray-700 text-sm">
            {defaultAddress.wardName}, {defaultAddress.districtName},{" "}
            {defaultAddress.provinceName}
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => handleEditAddress(defaultAddress)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Edit
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 mb-6 text-center">
          <p className="text-gray-600">No address available</p>
        </div>
      )}

      {/* Address List or Empty State */}
      {addresses.length === 0 ? (
        <p className="text-gray-600 mb-6">No addresses saved.</p>
      ) : (
        <ul className="space-y-4 mb-6">
          {addresses.map((address) => (
            <li key={address.addressId} className="border-b pb-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {address.recipientName}
                  </h3>
                  <p className="text-sm text-gray-600">{address.fullAddress}</p>
                  <p className="text-sm text-gray-600">
                    {address.wardName}, {address.districtName},{" "}
                    {address.provinceName}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="text-blue-500 hover:text-blue-600 text-sm"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handleNewAddress}
        className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Add New Address
      </button>

      {/* Modal for Adding/Editing Address */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {isAddingNew ? "Add New Address" : "Edit Address"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setIsEditing(false);
                  setIsAddingNew(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Name*
                </label>
                <input
                  type="text"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number*
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Province/City*
                </label>
                <input
                  type="text"
                  name="provinceName"
                  value={formData.provinceName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District*
                </label>
                <input
                  type="text"
                  name="districtName"
                  value={formData.districtName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ward*
                </label>
                <input
                  type="text"
                  name="wardName"
                  value={formData.wardName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Address*
                </label>
                <input
                  type="text"
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveAddress}
                  className="flex-1 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  disabled={
                    !formData.recipientName ||
                    !formData.phone ||
                    !formData.fullAddress ||
                    !formData.provinceName ||
                    !formData.districtName ||
                    !formData.wardName
                  }
                >
                  {isEditing ? "Update Address" : "Save Address"}
                </button>
                {isEditing && (
                  <button
                    onClick={() => handleDeleteAddress(editingAddressId)}
                    className="flex-1 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                    setIsAddingNew(false);
                  }}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}