// src/services/ghnService.js
import axios from "axios";

const GHN_API = "https://online-gateway.ghn.vn/shiip/public-api";
const GHN_TOKEN = "30910b33-5888-11f0-8145-ea15d65c9236"; // hoặc hardcode tạm để test

export const fetchProvinces = async () => {
  const res = await axios.get(`${GHN_API}/master-data/province`, {
    headers: {
      Token: GHN_TOKEN,
    },
  });
  return res.data.data;
};

export const fetchDistricts = async (provinceId) => {
  const res = await axios.get(`${GHN_API}/master-data/district`, {
    headers: {
      Token: GHN_TOKEN,
    },
    params: {
      province_id: provinceId,
    },
  });
  return res.data.data;
};

export const fetchWards = async (districtId) => {
  const res = await axios.get(`${GHN_API}/master-data/ward`, {
    headers: {
      Token: GHN_TOKEN,
    },
    params: {
      district_id: districtId,
    },
  });
  return res.data.data;
};
