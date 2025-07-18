import { useState, useEffect } from "react";

export default function EditProfileForm() {
  const [formData, setFormData] = useState({
    username: localStorage.getItem("username") || "Md Rimel",
    email: "rimel1111@gmail.com",
    address: "Kingston, 5236, United State",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    localStorage.setItem("username", formData.username);
  }, [formData.username]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    const updatedFormData = {
      ...formData,
      username: formData.username.toLowerCase(),
    };
    console.log("Saving changes:", updatedFormData);
    localStorage.setItem("username", updatedFormData.username);
    alert("Changes saved successfully!");
  };

  const handleCancel = () => {
    setFormData({
      username: "Md Rimel",
      email: "rimel1111@gmail.com",
      address: "Kingston, 5236, United State",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    localStorage.setItem("username", "Md Rimel");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-xl font-medium text-red-500 mb-8">
        Edit Your Profile
      </h2>

      <div className="space-y-6">
        {/* Username Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        {/* Email and Address */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Password Changes */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">
            Password Changes
          </h3>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              value={formData.currentPassword}
              onChange={(e) =>
                handleInputChange("currentPassword", e.target.value)
              }
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500"
            />
            <input
              type="password"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            onClick={handleCancel}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
