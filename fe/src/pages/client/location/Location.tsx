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
                const response = await api.get<CityWithCount[]>(
                    url.STORE.CITIES
                );
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
                    const response = await api.get<CityWithCount[]>(
                        url.STORE.DISTRICTS,
                        {
                            params: { cityProvince: city },
                        }
                    );
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
                    setError(
                        "Failed to load districts. Check backend or network."
                    );
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
        // <div className="container mx-auto p-5 max-w-3xl">
        //   <div className="flex gap-4 mb-6">
        //     <div className="relative flex-1">
        //       <select
        //         value={city}
        //         onChange={(e) => setCity(e.target.value)}
        //         className="w-full p-2 pl-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
        //       >
        //         <option value="">Tỉnh/Thành phố</option>
        //         {cities.length > 0 ? (
        //           cities.map((cityOption) => (
        //             <option key={cityOption.cityProvince} value={cityOption.cityProvince}>
        //               {cityOption.cityProvince} ({cityOption.storeCount})
        //             </option>
        //           ))
        //         ) : (
        //           <option value="" disabled>
        //             {error || "No cities available"}
        //           </option>
        //         )}
        //       </select>
        //       <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        //         ▼
        //       </span>
        //     </div>
        //     <div className="relative flex-1">
        //       <select
        //         value={district}
        //         onChange={(e) => setDistrict(e.target.value)}
        //         className="w-full p-2 pl-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
        //         disabled={!city}
        //       >
        //         <option value="">Quận/Huyện</option>
        //         {districts.length > 0 ? (
        //           districts.map((districtOption) => (
        //             <option key={districtOption.cityProvince} value={districtOption.cityProvince}>
        //               {districtOption.cityProvince} ({districtOption.storeCount})
        //             </option>
        //           ))
        //         ) : (
        //           <option value="" disabled>
        //             {city ? "No districts available" : "Select a city first"}
        //           </option>
        //         )}
        //       </select>
        //       <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        //         ▼
        //       </span>
        //     </div>
        //   </div>
        //   {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
        //   <div className="space-y-4">
        //     {stores.map((store) => (
        //       <div
        //         key={store.storeId}
        //         className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg shadow-sm"
        //       >
        //         <img
        //           src={store.storeImages || "https://via.placeholder.com/150"}
        //           alt={store.storeName}
        //           className="w-24 h-24 object-cover rounded"
        //         />
        //         <div className="flex-1">
        //           <p className="text-lg font-semibold">{store.storeName}</p>
        //           <p className="text-gray-600">
        //             {`${store.district}, ${store.cityProvince}`}
        //           </p>
        //         </div>
        //         <div className="flex gap-2">
        //           <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">
        //             HOTLINE
        //           </button>
        //           <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">
        //             CHỈ ĐƯỜNG
        //           </button>
        //           <button
        //             className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        //             onClick={() => navigate(`${routes.booking}?salonId=${store.storeId}`)}
        //           >
        //             ĐẶT LỊCH CĂT →
        //           </button>
        //         </div>
        //       </div>
        //     ))}
        //   </div>
        // </div>

        <div className="container mx-auto p-5 max-w-4xl">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
                    Tìm kiếm salon gần bạn
                </h2>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="relative flex-1">
                        <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-gray-50 font-medium"
                        >
                            <option value="">Tỉnh/Thành phố</option>
                            {cities.length > 0 ? (
                                cities.map((cityOption) => (
                                    <option
                                        key={cityOption.cityProvince}
                                        value={cityOption.cityProvince}
                                    >
                                        {cityOption.cityProvince} (
                                        {cityOption.storeCount})
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>
                                    {error || "No cities available"}
                                </option>
                            )}
                        </select>
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                            ▼
                        </span>
                    </div>
                    <div className="relative flex-1">
                        <select
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-gray-50 font-medium"
                            disabled={!city}
                        >
                            <option value="">Quận/Huyện</option>
                            {districts.length > 0 ? (
                                districts.map((districtOption) => (
                                    <option
                                        key={districtOption.cityProvince}
                                        value={districtOption.cityProvince}
                                    >
                                        {districtOption.cityProvince} (
                                        {districtOption.storeCount})
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>
                                    {city
                                        ? "No districts available"
                                        : "Chọn tỉnh/thành trước"}
                                </option>
                            )}
                        </select>
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                            ▼
                        </span>
                    </div>
                </div>
                {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
            </div>

            <div className="space-y-6">
                {stores.length === 0 && city && (
                    <div className="text-center text-gray-500 py-8 bg-white rounded-xl shadow">
                        Không tìm thấy salon phù hợp.
                    </div>
                )}
                {stores.map((store) => (
                    <div
                        key={store.storeId}
                        className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition"
                    >
                        <img
                            src={
                                store.storeImages ||
                                "https://via.placeholder.com/150"
                            }
                            alt={store.storeName}
                            className="w-32 h-32 object-cover rounded-xl border border-gray-200"
                        />
                        <div className="flex-1 w-full">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <p className="text-xl font-bold text-blue-900">
                                    {store.storeName}
                                </p>
                                {store.averageRating !== undefined && (
                                    <span className="text-yellow-500 font-semibold flex items-center gap-1">
                                        ★ {store.averageRating.toFixed(1)}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600 mt-1">
                                {store.district}, {store.cityProvince}
                            </p>
                            <p className="text-gray-500 text-sm mt-1">
                                {store.description}
                            </p>
                            <div className="flex flex-wrap gap-3 mt-3">
                                <button
                                    className="flex items-center gap-2 px-4 py-2 border border-blue-200 rounded-lg text-blue-700 font-semibold hover:bg-blue-50 transition"
                                    onClick={() =>
                                        window.open(
                                            `tel:${store.phoneNumber}`,
                                            "_self"
                                        )
                                    }
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm12-12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                                    </svg>
                                    HOTLINE
                                </button>
                                <button
                                    className="flex items-center gap-2 px-4 py-2 border border-green-200 rounded-lg text-green-700 font-semibold hover:bg-green-50 transition"
                                    onClick={() =>
                                        window.open(
                                            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                store.storeName +
                                                    " " +
                                                    store.district +
                                                    " " +
                                                    store.cityProvince
                                            )}`,
                                            "_blank"
                                        )
                                    }
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"></path>
                                    </svg>
                                    CHỈ ĐƯỜNG
                                </button>
                                <button
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
                                    onClick={() =>
                                        navigate(
                                            `${routes.booking}?salonId=${store.storeId}`
                                        )
                                    }
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M9 5l7 7-7 7"></path>
                                    </svg>
                                    ĐẶT LỊCH CẮT
                                </button>
                            </div>
                            <div className="text-xs text-gray-400 mt-2">
                                Giờ mở cửa: {store.openingTime || "N/A"} -{" "}
                                {store.closingTime || "N/A"}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
