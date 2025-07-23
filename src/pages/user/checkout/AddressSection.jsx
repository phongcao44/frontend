/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createAddress,
  editAddress,
  getAddresses,
  removeAddress,
} from "../../../redux/slices/addressSlice";
import AddressSelect from "./AddressSelect";
import Swal from "sweetalert2";
import { MapPin, Edit, Trash2 } from "lucide-react";

const AddressSection = ({ formData, setFormData, setError }) => {
  const dispatch = useDispatch();

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const {
    addresses,
    loading,
    error: reduxError,
  } = useSelector((state) => state.address);

  useEffect(() => {
    dispatch(getAddresses())
      .unwrap()
      .then((fetchedAddresses) => {
        if (fetchedAddresses && fetchedAddresses.length > 0) {
          const firstAddress = fetchedAddresses[0];
          setSelectedAddressId(firstAddress.addressId.toString());
          setUseSavedAddress(true);
          setFormData({
            addressId: firstAddress.addressId.toString(),
            recipientName: firstAddress.recipientName || "",
            phone: firstAddress.phone || "",
            fullAddress: firstAddress.fullAddress || "",
            province: firstAddress.provinceName || "",
            district: firstAddress.districtName || "",
            ward: firstAddress.wardName || "",
            useSavedAddress: true,
          });
        }
      })
      .catch((err) => {
        console.error("Failed to fetch addresses:", err);
        setError("Unable to load addresses. Please try again.");
      });
  }, [dispatch, setError, setFormData]);

  useEffect(() => {
    if (reduxError) {
      setError(reduxError);
    }
  }, [reduxError, setError]);

  useEffect(() => {
    if (selectedAddressId && useSavedAddress) {
      const selectedAddress = addresses.find(
        (addr) => addr.addressId === parseInt(selectedAddressId)
      );
      if (selectedAddress) {
        setFormData({
          addressId: selectedAddress.addressId.toString(),
          recipientName: selectedAddress.recipientName || "",
          phone: selectedAddress.phone || "",
          fullAddress: selectedAddress.fullAddress || "",
          province: selectedAddress.provinceName || "",
          district: selectedAddress.districtName || "",
          ward: selectedAddress.wardName || "",
          useSavedAddress: true,
        });
      } else {
        setError("Selected address not found.");
        setUseSavedAddress(false);
        setFormData((prev) => ({
          ...prev,
          addressId: "",
          useSavedAddress: false,
        }));
      }
    }
  }, [selectedAddressId, useSavedAddress, addresses, setFormData, setError]);

  const handleAddAddress = async (payload) => {
    try {
      console.log(payload);
      const result = await dispatch(createAddress(payload)).unwrap();
      await dispatch(getAddresses());
      await Swal.fire({
        title: "Đã thêm địa chỉ!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      return result;
    } catch (err) {
      console.error(err);
      Swal.fire("Thêm thất bại!", "", "error");
      throw err;
    }
  };

  const handleEditAddress = async (id, payload) => {
    const result = await Swal.fire({
      title: "Bạn muốn lưu thay đổi?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Lưu",
      denyButtonText: `Không lưu`,
    });

    if (result.isConfirmed) {
      try {
        await dispatch(editAddress({ id, payload })).unwrap();
        await dispatch(getAddresses());
        Swal.fire("Đã lưu!", "", "success");
        setIsEditingAddress(false);
        setEditingAddressId(null);
        setShowAddressModal(false);
        setUseSavedAddress(true);
        setSelectedAddressId(id.toString());
        setFormData({
          addressId: id.toString(),
          recipientName: payload.recipientName,
          phone: payload.phone,
          fullAddress: payload.fullAddress,
          province: payload.province,
          district: payload.district,
          ward: payload.ward,
          useSavedAddress: true,
        });
      } catch (err) {
        console.error(err);
        Swal.fire("Sửa thất bại!", "", "error");
      }
    } else if (result.isDenied) {
      Swal.fire("Chưa lưu thay đổi", "", "info");
    }
  };

  const handleDeleteAddress = async (id) => {
    const confirm = await Swal.fire({
      title: "Bạn chắc chắn xoá?",
      text: "Dữ liệu sẽ không thể khôi phục!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý xoá!",
      cancelButtonText: "Huỷ",
    });

    if (confirm.isConfirmed) {
      try {
        await dispatch(removeAddress(id)).unwrap();
        await dispatch(getAddresses());
        Swal.fire("Đã xoá!", "Địa chỉ đã bị xoá.", "success");
        if (selectedAddressId === id.toString()) {
          handleClearSelection();
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Xoá thất bại!", "", "error");
      }
    }
  };

  const handleInputChange = (e) => {
    try {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } catch (err) {
      console.error("Error in input change:", err);
      setError("An error occurred while updating the address.");
    }
  };

  const handleSelectAddress = (address) => {
    try {
      setSelectedAddressId(address.addressId.toString());
      setUseSavedAddress(true);
      setFormData({
        addressId: address.addressId.toString(),
        recipientName: address.recipientName || "",
        phone: address.phone || "",
        fullAddress: address.fullAddress || "",
        province: address.provinceName || "",
        district: address.districtName || "",
        ward: address.wardName || "",
        useSavedAddress: true,
      });
      setShowAddressModal(false);
      setIsAddingNewAddress(false);
      setIsEditingAddress(false);
    } catch (err) {
      console.error("Error selecting address:", err);
      setError("An error occurred while selecting the address.");
    }
  };

  const handleClearSelection = () => {
    try {
      setSelectedAddressId("");
      setUseSavedAddress(false);
      setFormData({
        addressId: "",
        recipientName: "",
        phone: "",
        fullAddress: "",
        province: "",
        district: "",
        ward: "",
        useSavedAddress: false,
      });
      setIsEditingAddress(false);
      setEditingAddressId(null);
      setShowAddressModal(false);
    } catch (err) {
      console.error("Error clearing address selection:", err);
      setError("An error occurred while clearing the address selection.");
    }
  };

  const handleNewAddress = () => {
    try {
      setSelectedAddressId("");
      setUseSavedAddress(false);
      setFormData({
        addressId: "",
        recipientName: "",
        phone: "",
        fullAddress: "",
        province: "",
        district: "",
        ward: "",
        useSavedAddress: false,
      });
      setIsAddingNewAddress(true);
      setIsEditingAddress(false);
      setShowAddressModal(true);
    } catch (err) {
      console.error("Error initiating new address:", err);
      setError("An error occurred while starting new address entry.");
    }
  };

  const handleStartEditAddress = (address) => {
    try {
      setEditingAddressId(address.addressId);
      setIsAddingNewAddress(false);
      setIsEditingAddress(true);
      setUseSavedAddress(false);
      setFormData({
        addressId: address.addressId.toString(),
        recipientName: address.recipientName || "",
        phone: address.phone || "",
        fullAddress: address.fullAddress || "",
        province: address.provinceName || "",
        district: address.districtName || "",
        ward: address.wardName || "",
        useSavedAddress: false,
      });
      setShowAddressModal(true);
    } catch (err) {
      console.error("Error initiating address edit:", err);
      setError("An error occurred while starting address edit.");
    }
  };

  const handleStartEditMainForm = () => {
    try {
      setIsEditingAddress(true);
      setEditingAddressId(selectedAddressId);
      setUseSavedAddress(false);
      setFormData((prev) => ({
        ...prev,
        useSavedAddress: false,
      }));
    } catch (err) {
      console.error("Error initiating main form edit:", err);
      setError("An error occurred while starting address edit.");
    }
  };

  const handleSaveAddress = async () => {
    try {
      if (
        !formData.recipientName ||
        !formData.phone ||
        !formData.fullAddress ||
        !formData.province ||
        !formData.district ||
        !formData.ward
      ) {
        setError("Please fill in all required address fields.");
        return;
      }

      const payload = {
        recipientName: formData.recipientName,
        phone: formData.phone,
        fullAddress: formData.fullAddress,
        province: formData.province,
        district: formData.district,
        ward: formData.ward,
      };

      if (isEditingAddress) {
        await handleEditAddress(editingAddressId, payload);
      } else {
        const result = await handleAddAddress(payload);
        setUseSavedAddress(true);
        setSelectedAddressId(result?.addressId?.toString());
        setFormData({
          addressId: result?.addressId?.toString(),
          recipientName: payload.recipientName,
          phone: payload.phone,
          fullAddress: payload.fullAddress,
          province: payload.province,
          district: payload.district,
          ward: payload.ward,
          useSavedAddress: true,
        });
        setShowAddressModal(false);
        setIsAddingNewAddress(false);
        setIsEditingAddress(false);
      }
    } catch (err) {
      console.error("Error saving address:", err);
      setError("An error occurred while saving the address.");
    }
  };

  const getSelectedAddress = () => {
    if (selectedAddressId) {
      return addresses.find(
        (addr) => addr.addressId === parseInt(selectedAddressId)
      );
    }
    return null;
  };

  const selectedAddress = getSelectedAddress();

  return (
    <>
      {loading && (
        <div className="text-gray-600 mb-4">Loading addresses...</div>
      )}
      {reduxError && <div className="text-red-600 mb-4">{reduxError}</div>}
      {/* Saved Address Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Saved Address
        </label>
        <div className="mb-4">
          {selectedAddress ? (
            <div className="border border-gray-300 rounded-md p-3 w-full relative">
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="text-gray-400 hover:text-orange-600 p-1"
                >
                  <MapPin className="h-4 w-4" />
                </button>
                <button
                  onClick={handleStartEditMainForm}
                  className="text-gray-400 hover:text-blue-600 p-1"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  {selectedAddress.recipientName || "N/A"}
                </span>
                <span className="text-gray-500">|</span>
                <span className="text-gray-600">
                  {selectedAddress.phone || "N/A"}
                </span>
                {selectedAddress.isDefault && (
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded">
                    Default
                  </span>
                )}
              </div>
              <p className="text-gray-700 text-sm">
                {selectedAddress.fullAddress || "N/A"}
              </p>
              <p className="text-gray-700 text-sm">
                {selectedAddress.wardName || "N/A"},{" "}
                {selectedAddress.districtName || "N/A"},{" "}
                {selectedAddress.provinceName || "N/A"}
              </p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-md p-3 w-full text-center">
              <p className="text-gray-600">No address selected</p>
              <div className="mt-3">
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                >
                  Select Address
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Address Fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recipient Name*
        </label>
        <input
          type="text"
          name="recipientName"
          value={formData.recipientName || ""}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          disabled={useSavedAddress && !isEditingAddress && !isAddingNewAddress}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number*
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone || ""}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md"
          disabled={useSavedAddress && !isEditingAddress && !isAddingNewAddress}
        />
      </div>

      <AddressSelect
        value={{
          provinceName: formData.province,
          districtName: formData.district,
          wardName: formData.ward,
        }}
        onChange={(address) =>
          setFormData((prev) => ({
            ...prev,
            province: address.provinceName,
            district: address.districtName,
            ward: address.wardName,
          }))
        }
        disabled={useSavedAddress && !isEditingAddress && !isAddingNewAddress}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Address*
        </label>
        <input
          type="text"
          name="fullAddress"
          value={formData.fullAddress || ""}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md"
          disabled={useSavedAddress && !isEditingAddress && !isAddingNewAddress}
        />
      </div>

      {(isEditingAddress || isAddingNewAddress) && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleSaveAddress}
            className="flex-1 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
            disabled={
              !formData.recipientName ||
              !formData.phone ||
              !formData.fullAddress ||
              !formData.province ||
              !formData.district ||
              !formData.ward
            }
          >
            {isEditingAddress ? "Update Address" : "Save Address"}
          </button>
          <button
            onClick={() => {
              setIsEditingAddress(false);
              setIsAddingNewAddress(false);
              setEditingAddressId(null);
              if (selectedAddress) {
                setUseSavedAddress(true);
                setFormData({
                  addressId: selectedAddress.addressId.toString(),
                  recipientName: selectedAddress.recipientName || "",
                  phone: selectedAddress.phone || "",
                  fullAddress: selectedAddress.fullAddress || "",
                  province: selectedAddress.provinceName || "",
                  district: selectedAddress.districtName || "",
                  ward: selectedAddress.wardName || "",
                  useSavedAddress: true,
                });
              } else {
                handleClearSelection();
              }
            }}
            className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Address Selection Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {isAddingNewAddress
                    ? "Add New Address"
                    : isEditingAddress
                    ? "Edit Address"
                    : "Select Address"}
                </h3>
                <button
                  onClick={() => {
                    setShowAddressModal(false);
                    setIsAddingNewAddress(false);
                    setIsEditingAddress(false);
                    setEditingAddressId(null);
                    if (selectedAddress) {
                      setUseSavedAddress(true);
                      setFormData({
                        addressId: selectedAddress.addressId.toString(),
                        recipientName: selectedAddress.recipientName || "",
                        phone: selectedAddress.phone || "",
                        fullAddress: selectedAddress.fullAddress || "",
                        province: selectedAddress.provinceName || "",
                        district: selectedAddress.districtName || "",
                        ward: selectedAddress.wardName || "",
                        useSavedAddress: true,
                      });
                    } else {
                      handleClearSelection();
                    }
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

              {!isAddingNewAddress && !isEditingAddress ? (
                <div className="space-y-4">
                  {addresses && addresses.length > 0 ? (
                    addresses.map((address, index) => (
                      <div
                        key={address.addressId || index}
                        className={`border rounded-md p-3 relative transition-all ${
                          selectedAddressId === address.addressId.toString()
                            ? "border-red-600 bg-red-50"
                            : "border-gray-300 hover:border-red-300"
                        }`}
                      >
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button
                            onClick={() => handleStartEditAddress(address)}
                            className="text-gray-400 hover:text-blue-600 p-1"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteAddress(address.addressId)
                            }
                            className="text-gray-400 hover:text-red-600 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-start gap-3">
                          {selectedAddressId ===
                            address.addressId.toString() && (
                            <svg
                              className="w-5 h-5 text-red-600 mt-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() =>
                              address.addressId && handleSelectAddress(address)
                            }
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-gray-900">
                                {address.recipientName || "N/A"}
                              </span>
                              <span className="text-gray-500">|</span>
                              <span className="text-gray-600 text-sm">
                                {address.phone || "N/A"}
                              </span>
                              {address.isDefault && (
                                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 text-sm">
                              {address.fullAddress || "N/A"}
                            </p>
                            <p className="text-gray-700 text-sm">
                              {address.wardName || "N/A"},{" "}
                              {address.districtName || "N/A"},{" "}
                              {address.provinceName || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-sm">
                      No saved addresses available.
                    </p>
                  )}
                  <button
                    onClick={handleNewAddress}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-md text-center hover:border-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <svg
                      className="mx-auto h-6 w-6 text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span className="text-gray-600 font-medium">
                      Add New Address
                    </span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient Name*
                    </label>
                    <input
                      type="text"
                      name="recipientName"
                      value={formData.recipientName || ""}
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
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md"
                    />
                  </div>

                  <AddressSelect
                    value={{
                      provinceName: formData.province,
                      districtName: formData.district,
                      wardName: formData.ward,
                    }}
                    onChange={(address) =>
                      setFormData((prev) => ({
                        ...prev,
                        province: address.provinceName,
                        district: address.districtName,
                        ward: address.wardName,
                      }))
                    }
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Address*
                    </label>
                    <input
                      type="text"
                      name="fullAddress"
                      value={formData.fullAddress || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSaveAddress}
                      className="flex-1 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                      disabled={
                        !formData.recipientName ||
                        !formData.phone ||
                        !formData.fullAddress ||
                        !formData.province ||
                        !formData.district ||
                        !formData.ward
                      }
                    >
                      {isEditingAddress ? "Update Address" : "Save Address"}
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingNewAddress(false);
                        setIsEditingAddress(false);
                        setEditingAddressId(null);
                        if (selectedAddress) {
                          setUseSavedAddress(true);
                          setFormData({
                            addressId: selectedAddress.addressId.toString(),
                            recipientName: selectedAddress.recipientName || "",
                            phone: selectedAddress.phone || "",
                            fullAddress: selectedAddress.fullAddress || "",
                            province: selectedAddress.provinceName || "",
                            district: selectedAddress.districtName || "",
                            ward: selectedAddress.wardName || "",
                            useSavedAddress: true,
                          });
                        } else {
                          handleClearSelection();
                        }
                        setShowAddressModal(false);
                      }}
                      className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddressSection;
