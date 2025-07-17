import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Select from "react-select";
import {
  fetchProvinces,
  fetchDistricts,
  fetchWards,
} from "../../../services/ghnService";

export default function AddressBook() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      recipientName: "John Doe Hi",
      phone: "123-456-7890",
      fullAddress: "123 Main St",
      provinceName: "Hưng Yên",
      districtName: "Huyện Phù Cừ",
      wardName: "Xã Tống Phan",
      isDefault: true,
    },
    {
      id: 2,
      recipientName: "John Doe",
      phone: "098-765-4321",
      fullAddress: "456 Office Rd",
      provinceName: "Hưng Yên",
      districtName: "Huyện Phù Cừ",
      wardName: "Xã Minh Tiến",
      isDefault: false,
    },
  ]);
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
    saveInfo: false,
  });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Fetch provinces on component mount
  useEffect(() => {
    fetchProvinces()
      .then((data) => {
        const provinceOptions = (data || []).map((p) => ({
          value: p.ProvinceID,
          label: p.ProvinceName,
        }));
        setProvinces(provinceOptions);
      })
      .catch((err) => console.error("Failed to fetch provinces:", err));
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    if (formData.provinceName) {
      const found = provinces.find((p) => p.label === formData.provinceName);
      if (found) {
        fetchDistricts(found.value)
          .then((data) => {
            const districtOptions = (data || []).map((d) => ({
              value: d.DistrictID,
              label: d.DistrictName,
            }));
            setDistricts(districtOptions);
          })
          .catch((err) => console.error("Failed to fetch districts:", err));
      }
    } else {
      setDistricts([]);
    }
    setWards([]);
  }, [formData.provinceName, provinces]);

  // Fetch wards when district changes
  useEffect(() => {
    if (formData.districtName && districts.length > 0) {
      const found = districts.find((d) => d.label === formData.districtName);
      if (found) {
        fetchWards(found.value)
          .then((data) => {
            const wardOptions = (data || []).map((w) => ({
              value: w.WardCode,
              label: w.WardName,
            }));
            setWards(wardOptions);
          })
          .catch((err) => console.error("Failed to fetch wards:", err));
      }
    } else {
      setWards([]);
    }
  }, [formData.districtName, districts]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProvinceChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      provinceName: selected ? selected.label : "",
      districtName: "",
      wardName: "",
    }));
  };

  const handleDistrictChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      districtName: selected ? selected.label : "",
      wardName: "",
    }));
  };

  const handleWardChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      wardName: selected ? selected.label : "",
    }));
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

    const newAddress = {
      id: isEditing ? editingAddressId : Date.now(),
      recipientName: formData.recipientName,
      phone: formData.phone,
      fullAddress: formData.fullAddress,
      provinceName: formData.provinceName,
      districtName: formData.districtName,
      wardName: formData.wardName,
      isDefault: isEditing
        ? addresses.find((a) => a.id === editingAddressId).isDefault
        : false,
    };

    if (isEditing) {
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingAddressId ? newAddress : addr
        )
      );
      await Swal.fire("Success!", "Address updated successfully.", "success");
    } else {
      setAddresses([...addresses, newAddress]);
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
      saveInfo: false,
    });
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
      saveInfo: true,
    });
    setShowModal(true);
  };

  const defaultAddress = addresses[0];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "0.375rem",
      borderColor: "#d1d5db",
      minHeight: "2.75rem",
      paddingLeft: "0.75rem",
      paddingRight: "0.75rem",
      "&:hover": {
        borderColor: "#dc2626",
      },
      boxShadow: "none",
      backgroundColor: "white",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#6b7280",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 50,
    }),
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
      <h2 className="text-xl font-medium text-red-500 mb-8">Address Book</h2>

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
            <li key={address.id} className="border-b pb-4">
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
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Province/City*
                  </label>
                  <Select
                    options={provinces}
                    value={
                      provinces.find(
                        (p) => p.label === formData.provinceName
                      ) || null
                    }
                    onChange={handleProvinceChange}
                    placeholder="Select Province/City"
                    styles={customStyles}
                    isClearable
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    District*
                  </label>
                  <Select
                    options={districts}
                    value={
                      districts.find(
                        (d) => d.label === formData.districtName
                      ) || null
                    }
                    onChange={handleDistrictChange}
                    placeholder="Select District"
                    isDisabled={!formData.provinceName}
                    styles={customStyles}
                    isClearable
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Ward*
                  </label>
                  <Select
                    options={wards}
                    value={
                      wards.find((w) => w.label === formData.wardName) || null
                    }
                    onChange={handleWardChange}
                    placeholder="Select Ward"
                    isDisabled={!formData.districtName}
                    styles={customStyles}
                    isClearable
                  />
                </div>
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
