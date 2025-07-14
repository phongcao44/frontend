/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Select from "react-select";
import {
  fetchProvinces,
  fetchDistricts,
  fetchWards,
} from "../../../services/ghnService";

export default function AddressSelect({ value, onChange, disabled }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

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

  useEffect(() => {
    if (value?.provinceName) {
      const found = provinces.find((p) => p.label === value.provinceName);
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
  }, [value?.provinceName, provinces]);

  useEffect(() => {
    if (value?.districtName && districts.length > 0) {
      const found = districts.find((d) => d.label === value.districtName);
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
  }, [value?.districtName, districts]);

  const handleProvinceChange = (selected) => {
    onChange({
      provinceName: selected ? selected.label : "",
      districtName: "",
      wardName: "",
    });
  };

  const handleDistrictChange = (selected) => {
    onChange({
      ...value,
      districtName: selected ? selected.label : "",
      wardName: "",
    });
  };

  const handleWardChange = (selected) => {
    onChange({
      ...value,
      wardName: selected ? selected.label : "",
    });
  };

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
      backgroundColor: disabled ? "#f3f4f6" : "white",
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
    <div className="space-y-6">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Province/City*
        </label>
        <Select
          options={provinces}
          value={provinces.find((p) => p.label === value?.provinceName) || null}
          onChange={handleProvinceChange}
          placeholder="Select Province/City"
          styles={customStyles}
          isClearable
          isDisabled={disabled}
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          District*
        </label>
        <Select
          options={districts}
          value={districts.find((d) => d.label === value?.districtName) || null}
          onChange={handleDistrictChange}
          placeholder="Select District"
          isDisabled={!value?.provinceName || disabled}
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
          value={wards.find((w) => w.label === value?.wardName) || null}
          onChange={handleWardChange}
          placeholder="Select Ward"
          isDisabled={!value?.districtName || disabled}
          styles={customStyles}
          isClearable
        />
      </div>
    </div>
  );
}
