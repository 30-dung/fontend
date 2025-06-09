import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../../services/api";
import url from "../../../services/url";
import routes from "../../../config/routes";

interface Store {
  storeId: number;
  storeImages: string;
  storeName: string;
  phoneNumber: string;
  cityProvince: string;
  district: string;
  openingTime: string;
  closingTime: string;
  description: string;
  averageRating: number;
  createdAt: string;
}

interface CityWithCount {
  cityProvince: string;
  storeCount: number;
}

export const LocationPage = () => {
  const [city, setCity] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [stores, setStores] = useState<Store[]>([]);
  const [error, setError] = useState<string>("");
  const [cities, setCities] = useState<CityWithCount[]>([]);
  const [districts, setDistricts] = useState<CityWithCount[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await api.get<CityWithCount[]>(url.STORE.CITIES);
        console.log("Fetched cities data:", response.data);
        if (response.data && Array.isArray(response.data)) {
          setCities(response.data);
        } else {
          console.warn("No valid cities data:", response.data);
          setCities([]);
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
        setError("Failed to load cities. Check backend or network.");
        setCities([]);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    if (city) {
      const fetchDistricts = async () => {
        try {
          const response = await api.get<CityWithCount[]>(url.STORE.DISTRICTS, {
            params: { cityProvince: city },
          });
          console.log("Fetched districts data:", response.data);
          if (response.data && Array.isArray(response.data)) {
            setDistricts(response.data);
          } else {
            console.warn("No valid districts data:", response.data);
            setDistricts([]);
          }
          setDistrict("");
        } catch (err) {
          console.error("Error fetching districts:", err);
          setError("Failed to load districts. Check backend or network.");
          setDistricts([]);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setDistrict("");
    }
  }, [city]);

  useEffect(() => {
    const fetchStores = async () => {
      if (!city) {
        setStores([]);
        setError("");
        return;
      }

      try {
        const response = await api.get<Store[]>(url.STORE.LOCATE, {
          params: { city, district },
        });
        console.log("Fetched stores data:", response.data);
        setStores(response.data || []);
        setError("");
      } catch (err) {
        console.error("Error fetching stores:", err);
        let errorMessage = "Error fetching stores";
        if (axios.isAxiosError(err)) {
          errorMessage = err.response?.data?.message || err.message;
        }
        setError(errorMessage);
        setStores([]);
      }
    };
    fetchStores();
  }, [city, district]);

  return (
    <div className="container mx-auto p-5 max-w-3xl">
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-2 pl-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="">Tỉnh/Thành phố</option>
            {cities.length > 0 ? (
              cities.map((cityOption) => (
                <option key={cityOption.cityProvince} value={cityOption.cityProvince}>
                  {cityOption.cityProvince} ({cityOption.storeCount})
                </option>
              ))
            ) : (
              <option value="" disabled>
                {error || "No cities available"}
              </option>
            )}
          </select>
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            ▼
          </span>
        </div>
        <div className="relative flex-1">
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full p-2 pl-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            disabled={!city}
          >
            <option value="">Quận/Huyện</option>
            {districts.length > 0 ? (
              districts.map((districtOption) => (
                <option key={districtOption.cityProvince} value={districtOption.cityProvince}>
                  {districtOption.cityProvince} ({districtOption.storeCount})
                </option>
              ))
            ) : (
              <option value="" disabled>
                {city ? "No districts available" : "Select a city first"}
              </option>
            )}
          </select>
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            ▼
          </span>
        </div>
      </div>
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      <div className="space-y-4">
        {stores.map((store) => (
          <div
            key={store.storeId}
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg shadow-sm"
          >
            <img
              src={store.storeImages || "https://via.placeholder.com/150"}
              alt={store.storeName}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <p className="text-lg font-semibold">{store.storeName}</p>
              <p className="text-gray-600">
                {`${store.district}, ${store.cityProvince}`}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">
                HOTLINE
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">
                CHỈ ĐƯỜNG
              </button>
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => navigate(`${routes.booking}?salonId=${store.storeId}`)}
              >
                ĐẶT LỊCH CĂT →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};