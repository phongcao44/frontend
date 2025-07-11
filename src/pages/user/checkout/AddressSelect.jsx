import { useEffect, useState } from "react";
import Select from "react-select";
import {
  fetchProvinces,
  fetchDistricts,
  fetchWards,
} from "../../../services/ghnService";

export default function AddressSelect({ onAddressChange, selectedCity }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  useEffect(() => {
    fetchProvinces()
      .then((data) =>
        setProvinces(
          (data || []).map((p) => ({
            value: p.ProvinceID,
            label: p.ProvinceName,
          }))
        )
      )
      .catch((err) => console.error("Failed to fetch provinces:", err));
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      fetchDistricts(selectedProvince.value)
        .then((data) =>
          setDistricts(
            (data || []).map((d) => ({
              value: d.DistrictID,
              label: d.DistrictName,
            }))
          )
        )
        .catch((err) => console.error("Failed to fetch districts:", err));
      setSelectedDistrict(null);
      setSelectedWard(null);
      setWards([]);
    } else {
      setDistricts([]);
      setSelectedDistrict(null);
      setWards([]);
      setSelectedWard(null);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchWards(selectedDistrict.value)
        .then((data) =>
          setWards(
            (data || []).map((w) => ({
              value: w.WardCode,
              label: w.WardName,
            }))
          )
        )
        .catch((err) => console.error("Failed to fetch wards:", err));
      setSelectedWard(null);
    } else {
      setWards([]);
      setSelectedWard(null);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (onAddressChange) {
      onAddressChange({
        province: selectedProvince ? selectedProvince.label : "",
        district: selectedDistrict ? selectedDistrict.label : "",
        ward: selectedWard ? selectedWard.label : "",
      });
    }
  }, [selectedProvince, selectedDistrict, selectedWard, onAddressChange]);

  useEffect(() => {
    if (selectedCity && provinces.length > 0) {
      const found = provinces.find((p) => p.label === selectedCity);
      if (found && found.value !== selectedProvince?.value) {
        setSelectedProvince(found);
      }
    }
  }, [selectedCity, provinces]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Province/City*
        </label>
        <Select
          options={provinces}
          value={selectedProvince}
          onChange={setSelectedProvince}
          placeholder="Select Province/City"
          isClearable
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          District*
        </label>
        <Select
          options={districts}
          value={selectedDistrict}
          onChange={setSelectedDistrict}
          placeholder="Select District"
          isDisabled={!selectedProvince}
          isClearable
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Ward*
        </label>
        <Select
          options={wards}
          value={selectedWard}
          onChange={setSelectedWard}
          placeholder="Select Ward"
          isDisabled={!selectedDistrict}
          isClearable
        />
      </div>
    </div>
  );
}
