/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import AddressSelect from "./AddressSelect";

const AddressSection = ({
  formData,
  setFormData,
  handleAddressChange,
  setError,
}) => {
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  const savedAddresses = [
    {
      id: 1,
      firstName: "John Doe",
      streetAddress: "123 Main St",
      apartment: "Apt 4B",
      townCity: "Hanoi",
      phoneNumber: "0123456789",
      isDefault: true,
    },
    {
      id: 2,
      firstName: "Jane Smith",
      streetAddress: "456 Oak Ave",
      apartment: "",
      townCity: "Ho Chi Minh City",
      phoneNumber: "0987654321",
      isDefault: false,
    },
  ];

  useEffect(() => {
    try {
      if (selectedAddressId && useSavedAddress) {
        const selectedAddress = savedAddresses.find(
          (addr) => addr.id === parseInt(selectedAddressId)
        );
        if (selectedAddress) {
          setFormData({
            firstName: selectedAddress.firstName,
            streetAddress: selectedAddress.streetAddress,
            apartment: selectedAddress.apartment,
            townCity: selectedAddress.townCity,
            phoneNumber: selectedAddress.phoneNumber,
            saveInfo: formData.saveInfo,
          });
        } else {
          setError("Selected address not found.");
        }
      }
    } catch (err) {
      console.error("Error in address selection:", err);
      setError("An error occurred while selecting the address.");
    }
  }, [selectedAddressId, useSavedAddress, setFormData, setError]);

  const handleInputChange = (e) => {
    try {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    } catch (err) {
      console.error("Error in input change:", err);
      setError("An error occurred while updating the address.");
    }
  };

  const handleSelectAddress = (address) => {
    try {
      setSelectedAddressId(address.id);
      setUseSavedAddress(true);
      setFormData({
        recipientName: "string",
        phone: "string",
        fullAddress: "string",
        province: "string",
        district: "string",
        ward: "string",
      });
      setShowAddressModal(false);
      setIsAddingNewAddress(false);
    } catch (err) {
      console.error("Error selecting address:", err);
      setError("An error occurred while selecting the address.");
    }
  };

  const handleNewAddress = () => {
    try {
      setSelectedAddressId("");
      setUseSavedAddress(false);
      setFormData({
        recipientName: "string",
        phone: "string",
        fullAddress: "string",
        province: "string",
        district: "string",
        ward: "string",
        saveInfo: true,
      });
      setIsAddingNewAddress(true);
    } catch (err) {
      console.error("Error initiating new address:", err);
      setError("An error occurred while starting new address entry.");
    }
  };

  const handleSaveNewAddress = () => {
    try {
      if (
        !formData.firstName ||
        !formData.streetAddress ||
        !formData.townCity ||
        !formData.phoneNumber
      ) {
        setError("Please fill in all required address fields.");
        return;
      }
      setUseSavedAddress(true);
      setSelectedAddressId(Date.now().toString());
      setShowAddressModal(false);
      setIsAddingNewAddress(false);
    } catch (err) {
      console.error("Error saving new address:", err);
      setError("An error occurred while saving the new address.");
    }
  };

  const getSelectedAddress = () => {
    if (selectedAddressId) {
      return savedAddresses.find(
        (addr) => addr.id === parseInt(selectedAddressId)
      );
    }
    return null;
  };

  const selectedAddress = getSelectedAddress();

  return (
    <>
      {/* Saved Address Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Saved Address
        </label>
        <div className="flex items-center justify-between">
          {selectedAddress ? (
            <div className="border border-gray-300 rounded-md p-3 w-full">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  {selectedAddress.firstName}
                </span>
                <span className="text-gray-500">|</span>
                <span className="text-gray-600">
                  {selectedAddress.phoneNumber}
                </span>
                {selectedAddress.isDefault && (
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded">
                    Default
                  </span>
                )}
              </div>
              <p className="text-gray-700 text-sm">
                {selectedAddress.streetAddress}
                {selectedAddress.apartment && `, ${selectedAddress.apartment}`}
              </p>
              <p className="text-gray-700 text-sm">
                {selectedAddress.townCity}
              </p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-md p-3 w-full text-center">
              <p className="text-gray-600">No address selected</p>
            </div>
          )}
          <button
            onClick={() => setShowAddressModal(true)}
            className="ml-4 text-red-600 hover:text-red-700 text-sm font-medium"
          >
            {selectedAddress ? "Change" : "Select Address"}
          </button>
        </div>
      </div>

      {/* Address Fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          First Name*
        </label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName || ""}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          disabled={useSavedAddress}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number*
        </label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber || ""}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md"
          disabled={useSavedAddress}
        />
      </div>

      <AddressSelect
        onAddressChange={handleAddressChange}
        disabled={useSavedAddress}
        selectedCity={formData.townCity || ""}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Street Address*
        </label>
        <input
          type="text"
          name="streetAddress"
          value={formData.streetAddress || ""}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md"
          disabled={useSavedAddress}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="saveInfo"
          checked={formData.saveInfo || false}
          onChange={handleInputChange}
          className="h-4 w-4 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">
          Save this information for faster check-out next time
        </label>
      </div>

      {/* Address Selection Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {isAddingNewAddress ? "Add New Address" : "Select Address"}
                </h3>
                <button
                  onClick={() => {
                    setShowAddressModal(false);
                    setIsAddingNewAddress(false);
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

              {!isAddingNewAddress ? (
                <div className="space-y-4">
                  {savedAddresses.map((address) => (
                    <div
                      key={address.id}
                      onClick={() => handleSelectAddress(address)}
                      className={`p-4 border rounded-md cursor-pointer transition-all ${
                        selectedAddressId === address.id
                          ? "border-red-600 bg-red-50"
                          : "border-gray-300 hover:border-red-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900">
                              {address.firstName}
                            </span>
                            <span className="text-gray-500">|</span>
                            <span className="text-gray-600 text-sm">
                              {address.phoneNumber}
                            </span>
                            {address.isDefault && (
                              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 text-sm">
                            {address.streetAddress}
                            {address.apartment && `, ${address.apartment}`}
                          </p>
                          <p className="text-gray-700 text-sm">
                            {address.townCity}
                          </p>
                        </div>
                        {selectedAddressId === address.id && (
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
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handleNewAddress}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-md text-center hover:border-red-600 hover:bg-red-50 transition-colors"
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
                      First Name*
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Town/City*
                    </label>
                    <AddressSelect
                      onAddressChange={handleAddressChange}
                      selectedCity={formData.townCity || ""}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address*
                    </label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={formData.streetAddress || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apartment, floor, etc. (optional)
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="saveInfo"
                      checked={formData.saveInfo || false}
                      onChange={handleInputChange}
                      className="h-4 w-4 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Save this information for faster check-out next time
                    </label>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSaveNewAddress}
                      className="flex-1 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      disabled={
                        !formData.firstName ||
                        !formData.streetAddress ||
                        !formData.townCity ||
                        !formData.phoneNumber
                      }
                    >
                      Save Address
                    </button>
                    <button
                      onClick={() => setIsAddingNewAddress(false)}
                      className="flex-1 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
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
