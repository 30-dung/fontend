// src/pages/client/location/Location.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../../services/api";
import url from "../../../services/url";
import routes from "../../../config/routes";
import StarRating from "@/components/StarRating";
// Import thư viện react-select
import Select from 'react-select';

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

// Định nghĩa kiểu dữ liệu cho option của react-select
interface SelectOption {
    value: string;
    label: string;
}

export const LocationPage = () => {
    const [city, setCity] = useState<string>("");
    const [district, setDistrict] = useState<string>("");
    const [stores, setStores] = useState<Store[]>([]);
    const [error, setError] = useState<string>("");
    const [cities, setCities] = useState<CityWithCount[]>([]);
    const [districts, setDistricts] = useState<CityWithCount[]>([]);
    const navigate = useNavigate();

    // State để lưu trữ option được chọn của react-select (cho hiển thị)
    const [selectedCityOption, setSelectedCityOption] = useState<SelectOption | null>(null);
    const [selectedDistrictOption, setSelectedDistrictOption] = useState<SelectOption | null>(null);

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
                    setDistrict(""); // Reset district when city changes
                    setSelectedDistrictOption(null); // Reset selected district option
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
            setSelectedDistrictOption(null); // Clear selected district if no city
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

    // Chuyển đổi dữ liệu cities sang format của react-select
    const cityOptions: SelectOption[] = cities.map(c => ({
        value: c.cityProvince,
        label: `${c.cityProvince} (${c.storeCount})`
    }));

    // Chuyển đổi dữ liệu districts sang format của react-select
    const districtOptions: SelectOption[] = districts.map(d => ({
        value: d.cityProvince,
        label: `${d.cityProvince} (${d.storeCount})`
    }));

    // Calculate max-height for scrolling based on store count
    const maxItemsBeforeScroll = 5;
    const estimatedItemHeight = 200; // px
    const dynamicMaxHeight = stores.length > maxItemsBeforeScroll
        ? `${maxItemsBeforeScroll * estimatedItemHeight}px`
        : 'none';

    // Styles tùy chỉnh cho react-select
    const customSelectStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            padding: '8px 16px', // p-4 ~ 16px
            paddingLeft: '20px', // pl-5 ~ 20px
            paddingRight: '30px', // Đã giảm từ 48px xuống 30px
            border: state.isFocused ? '2px solid #2563EB' : '1px solid #D1D5DB', // border-blue-500 khi focus
            borderRadius: '0.5rem', // rounded-lg
            boxShadow: state.isFocused ? '0 0 0 4px rgba(96, 165, 250, 0.3)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // focus:ring-2 focus:ring-blue-300, shadow-sm
            '&:hover': {
                borderColor: '#60A5FA', // hover:border-blue-400
                boxShadow: '0 0 0 4px rgba(147, 197, 253, 0.2)' // hover:ring-blue-100
            },
            backgroundColor: 'white',
            fontWeight: '600', // font-semibold
            fontSize: '1.125rem', // text-lg
            cursor: 'pointer',
        }),
        valueContainer: (provided: any) => ({
            ...provided,
            padding: 0,
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: '#1F2937', // text-gray-800
        }),
        indicatorSeparator: () => ({ display: 'none' }), // Ẩn đường phân cách giữa mũi tên và text
        dropdownIndicator: (provided: any) => ({
            ...provided,
            padding: '0 8px', // Giảm padding mặc định của indicator để nó sát hơn vào text
            color: '#6B7280', // text-gray-500
            transform: provided.transform, // Giữ chuyển động quay của mũi tên mặc định
            '&:hover': {
                color: '#6B7280', // Giữ nguyên màu khi hover
            },
        }),
        menu: (provided: any) => ({
            ...provided,
            backgroundColor: 'white',
            borderRadius: '0.5rem', // rounded-lg
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // Thêm shadow cho menu
            marginTop: '0.5rem', // Khoảng cách giữa select box và menu xổ xuống
            overflow: 'hidden', // Quan trọng để bo góc và ẩn nội dung tràn
        }),
        menuList: (provided: any) => ({
            ...provided,
            padding: 0, // Bỏ padding mặc định của menuList
            maxHeight: `${5 * 50}px`, // Giới hạn 5 items, mỗi item ước tính 50px chiều cao (có thể điều chỉnh)
            overflowY: 'auto', // Bật cuộn cho danh sách options
            '&::-webkit-scrollbar': { // Tùy chỉnh thanh cuộn cho WebKit
                width: '8px',
            },
            '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
                background: '#bbb',
                borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
                background: '#999',
            },
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            padding: '12px 20px', // py-3 px-4 ~ 12px 16px, tăng thêm px
            backgroundColor: state.isSelected
                ? '#DBEAFE' // Màu xanh nhạt khi được chọn (blue-100)
                : state.isFocused
                    ? '#EFF6FF' // Màu xanh rất nhạt khi hover (blue-50)
                    : 'white',
            color: '#1F2937', // text-gray-800
            cursor: 'pointer',
            fontSize: '1rem', // text-base
            fontWeight: state.isSelected ? '600' : 'normal', // In đậm khi được chọn
            '&:active': {
                backgroundColor: '#BFDBFE', // Màu xanh nhạt hơn một chút khi click (blue-200)
            },
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: '#6B7280', // text-gray-500
        }),
    };


    return (
        <div>
            {/* Full-width Image Banner */}
            <div
                className="relative bg-cover bg-center h-80 flex items-center justify-center overflow-hidden w-full"
                style={{ backgroundImage: `url('https://static.booksy.com/static/live/covers/barbers.jpg')` }}
            >
                <div className="absolute inset-0 bg-black opacity-40 backdrop-filter backdrop-blur-sm"></div>
                <h1 className="relative text-white text-4xl md:text-5xl font-bold z-10 text-center px-4">
                    Tìm salon phù hợp với bạn
                </h1>
            </div>

            {/* Main Content Container: Search and Store Listings combined into one frame */}
            <div className="container mx-auto max-w-4xl -mt-20 relative z-20 px-4 min-h-[calc(100vh-320px)] flex flex-col overflow-y-auto scroll-smooth custom-scrollbar-main">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-24 flex-grow">

                    {/* Search Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6 text-center">
                            Tìm kiếm salon gần bạn
                        </h2>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Select
                                    value={selectedCityOption}
                                    onChange={(option) => {
                                        setSelectedCityOption(option);
                                        setCity(option ? option.value : "");
                                    }}
                                    options={cityOptions}
                                    placeholder="Tỉnh/Thành phố"
                                    isClearable={false} // Không cho phép xóa lựa chọn
                                    isSearchable={true} // Cho phép tìm kiếm
                                    styles={customSelectStyles}
                                />
                            </div>
                            <div className="flex-1">
                                <Select
                                    value={selectedDistrictOption}
                                    onChange={(option) => {
                                        setSelectedDistrictOption(option);
                                        setDistrict(option ? option.value : "");
                                    }}
                                    options={districtOptions}
                                    placeholder="Quận/Huyện"
                                    isClearable={false}
                                    isSearchable={true}
                                    styles={customSelectStyles}
                                    isDisabled={!city} // Vô hiệu hóa nếu chưa chọn thành phố
                                />
                            </div>
                        </div>
                        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
                    </div>

                    {/* Store Listings with conditional scrolling */}
                    <div className="pt-6 border-t border-gray-100 mt-6">
                        {stores.length === 0 && city && !error ? (
                            <div className="text-center text-gray-500 py-8">
                                Không tìm thấy salon phù hợp.
                            </div>
                        ) : (
                            <div
                                className={`space-y-6 pr-2 custom-scrollbar ${stores.length > maxItemsBeforeScroll ? 'overflow-y-auto' : ''}`}
                                style={{ maxHeight: dynamicMaxHeight }}
                            >
                                {stores.map((store) => (
                                    <div
                                        key={store.storeId}
                                        className="flex flex-col md:flex-row items-start gap-6 p-4 border-b border-gray-100 last:border-b-0"
                                    >
                                        <img
                                            src={
                                                store.storeImages ||
                                                "https://via.placeholder.com/150"
                                            }
                                            alt={store.storeName}
                                            className="w-32 h-32 object-cover rounded-md flex-shrink-0"
                                        />
                                        <div className="flex-1 w-full">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                                                <p className="text-xl font-bold text-blue-900 leading-tight">
                                                    {store.storeName}
                                                </p>
                                                {store.averageRating !== undefined && (
                                                    <div className="flex items-center flex-shrink-0 mt-1 md:mt-0">
                                                        <StarRating initialRating={Math.round(store.averageRating)} readOnly starSize={20} />
                                                        <span className="text-yellow-500 font-semibold ml-1 text-base">
                                                            ({store.averageRating.toFixed(1)})
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-gray-700 text-lg mt-1">
                                                {store.district}, {store.cityProvince}
                                            </p>
                                            <p className="text-gray-600 text-base mt-1 line-clamp-3">
                                                {store.description}
                                            </p>
                                            <div className="flex flex-wrap gap-3 mt-4">
                                                <button
                                                    className="flex items-center gap-2 px-4 py-2 border border-blue-200 rounded-lg text-blue-700 font-semibold hover:bg-blue-50 transition text-base"
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
                                                    // Đã thay đổi màu sắc nút "ĐẶT LỊCH CẮT"
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-base"
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
                                                <button
                                                    // Đã thay đổi màu sắc nút "Xem đánh giá"
                                                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition text-base"
                                                    onClick={() => navigate(routes.store_reviews.replace(':storeId', store.storeId.toString()))}
                                                >
                                                    Xem đánh giá
                                                </button>
                                            </div>
                                            <p className="text-gray-500 text-sm mt-2">
                                                Giờ mở cửa: {store.openingTime || "N/A"} -{" "}
                                                {store.closingTime || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};