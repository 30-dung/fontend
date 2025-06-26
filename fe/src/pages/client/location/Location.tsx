// src/pages/client/location/Location.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "@/services/api";
import url from "@/services/url";
import routes from "@/config/routes";
import StarRating from "@/components/reviews/StarRating";
import Select from 'react-select';
import { motion } from "framer-motion";
import { FaPhoneAlt } from "react-icons/fa";

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
                    setDistrict("");
                    setSelectedDistrictOption(null);
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
            setSelectedDistrictOption(null);
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

    const cityOptions: SelectOption[] = cities.map(c => ({
        value: c.cityProvince,
        label: `${c.cityProvince} (${c.storeCount})`
    }));

    const districtOptions: SelectOption[] = districts.map(d => ({
        value: d.cityProvince,
        label: `${d.cityProvince} (${d.storeCount})`
    }));

    const maxItemsBeforeScroll = 5;
    const estimatedItemHeight = 200;
    const dynamicMaxHeight = stores.length > maxItemsBeforeScroll
        ? `${maxItemsBeforeScroll * estimatedItemHeight}px`
        : 'none';

    // Styles tùy chỉnh cho react-select - Đã chỉnh sửa để đồng bộ với theme
    const customSelectStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            padding: '8px 16px',
            paddingLeft: '20px',
            paddingRight: '30px',
            border: state.isFocused ? '2px solid var(--accent-gold)' : '1px solid var(--soft-gray)', // Đổi màu border focus và mặc định
            borderRadius: '0.5rem',
            boxShadow: state.isFocused ? '0 0 0 4px rgba(var(--accent-gold-rgb), 0.3)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // Đổi màu shadow focus
            '&:hover': {
                borderColor: 'var(--accent-gold)', // Đổi màu border hover
                boxShadow: '0 0 0 4px rgba(var(--accent-gold-rgb), 0.2)' // Đổi màu shadow hover
            },
            backgroundColor: 'white',
            fontWeight: '600',
            fontSize: '1.125rem',
            cursor: 'pointer',
        }),
        valueContainer: (provided: any) => ({
            ...provided,
            padding: 0,
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: 'var(--dark-brown)', // Đổi màu chữ
        }),
        indicatorSeparator: () => ({ display: 'none' }),
        dropdownIndicator: (provided: any) => ({
            ...provided,
            padding: '0 8px',
            color: 'var(--medium-gray)', // Đổi màu indicator
            transform: provided.transform,
            '&:hover': {
                color: 'var(--dark-brown)', // Đổi màu hover indicator
            },
        }),
        menu: (provided: any) => ({
            ...provided,
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            marginTop: '0.5rem',
            overflow: 'hidden',
        }),
        menuList: (provided: any) => ({
            ...provided,
            padding: 0,
            maxHeight: `${5 * 50}px`,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
                width: '8px',
            },
            '&::-webkit-scrollbar-track': {
                background: 'var(--soft-gray)', // Đổi màu scrollbar track
                borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
                background: 'var(--medium-gray)', // Đổi màu scrollbar thumb
                borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
                background: 'var(--dark-brown)', // Đổi màu scrollbar thumb hover
            },
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            padding: '12px 20px',
            backgroundColor: state.isSelected
                ? 'var(--soft-gray)' // Màu khi được chọn
                : state.isFocused
                    ? 'var(--light-cream)' // Màu khi hover
                    : 'white',
            color: 'var(--dark-brown)', // Đổi màu chữ option
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: state.isSelected ? '600' : 'normal',
            '&:active': {
                backgroundColor: 'var(--soft-gray)', // Màu khi click
            },
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: 'var(--medium-gray)', // Đổi màu placeholder
        }),
    };


    return (
        <div className="bg-light-cream font-sans"> {/* Thay bg-gray-100 thành bg-light-cream */}
            {/* Full-width Image Banner */}
            <div
                className="relative bg-cover bg-center h-80 flex items-center justify-center overflow-hidden w-full"
                style={{ backgroundImage: `url('https://static.booksy.com/static/live/covers/barbers.jpg')` }}
            >
                <div className="absolute inset-0 bg-black opacity-40 backdrop-filter backdrop-blur-sm"></div>
                <h1 className="relative text-white text-4xl md:text-5xl font-bold z-10 text-center px-4 font-serif"> {/* Thêm font-serif */}
                    Tìm salon phù hợp với bạn
                </h1>
            </div>

            {/* Main Content Container: Search and Store Listings combined into one frame */}
            <div className="container mx-auto max-w-4xl -mt-20 relative z-20 px-4 min-h-[calc(100vh-320px)] flex flex-col overflow-y-auto scroll-smooth custom-scrollbar-main">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-24 flex-grow">

                    {/* Search Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-dark-brown mb-6 text-center font-serif"> {/* Thay text-blue-900 thành text-dark-brown, thêm font-serif */}
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
                                    isClearable={false}
                                    isSearchable={true}
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
                                    isDisabled={!city}
                                />
                            </div>
                        </div>
                        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
                    </div>

                    {/* Store Listings with conditional scrolling */}
                    <div className="pt-6 border-t border-soft-gray mt-6"> {/* Thay border-gray-100 thành border-soft-gray */}
                        {stores.length === 0 && city && !error ? (
                            <div className="text-center text-medium-gray py-8"> {/* Thay text-gray-500 thành text-medium-gray */}
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
                                        className="flex flex-col md:flex-row items-start gap-6 p-4 border-b border-soft-gray last:border-b-0" /* Thay border-gray-100 thành border-soft-gray */
                                    >
                                        <img
                                            src={
                                                `${url.BASE_IMAGES}${store.storeImages}` ||
                                                "https://via.placeholder.com/150"
                                            }
                                            alt={store.storeName}
                                            className="w-32 h-32 object-cover rounded-md flex-shrink-0"
                                        />
                                        <div className="flex-1 w-full">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                                                <p className="text-xl font-bold text-dark-brown leading-tight font-serif"> {/* Thay text-blue-900 thành text-dark-brown, thêm font-serif */}
                                                    {store.storeName}
                                                </p>
                                                {store.averageRating !== undefined && (
                                                    <div className="flex items-center flex-shrink-0 mt-1 md:mt-0">
                                                        <StarRating initialRating={Math.round(store.averageRating)} readOnly starSize={20} />
                                                        <span className="text-accent-gold font-semibold ml-1 text-base"> {/* Thay text-yellow-500 thành text-accent-gold */}
                                                            ({store.averageRating.toFixed(1)})
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-medium-gray text-lg mt-1"> {/* Thay text-gray-700 thành text-medium-gray */}
                                                {store.district}, {store.cityProvince}
                                            </p>
                                            <p className="text-medium-gray text-base mt-1 line-clamp-3"> {/* Thay text-gray-600 thành text-medium-gray */}
                                                {store.description}
                                            </p>
                                            <div className="flex flex-wrap gap-3 mt-4">
                                                <button
                                                    className="flex items-center gap-2 px-4 py-2 border border-accent-gold rounded-lg text-accent-gold font-semibold hover:bg-accent-gold hover:text-light-cream transition text-base" /* Đổi màu nút HOTLINE */
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
                                                    className="flex items-center gap-2 px-4 py-2 bg-black-soft text-light-cream rounded-lg font-semibold hover:bg-dark-brown transition text-base" /* Đổi màu nút "ĐẶT LỊCH CẮT" */
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
                                                    className="flex items-center gap-2 px-4 py-2 bg-dark-brown text-light-cream rounded-lg font-semibold hover:bg-black-soft transition text-base" /* Đổi màu nút "Xem đánh giá" */
                                                    onClick={() => navigate(routes.store_reviews.replace(':storeId', store.storeId.toString()))}
                                                >
                                                    Xem đánh giá
                                                </button>
                                            </div>
                                            <p className="text-medium-gray text-sm mt-2"> {/* Thay text-gray-500 thành text-medium-gray */}
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
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="fixed bottom-6 right-6 z-50"
            >
                <Link
                    to={routes.booking}
                    className="flex items-center bg-black-soft text-light-cream font-bold py-3 px-7 rounded-full shadow-xl hover:bg-dark-brown transition-all duration-300" /* Đổi màu sắc nút CTA */
                >
                    <FaPhoneAlt className="mr-2" />
                    Đặt lịch ngay
                </Link>
            </motion.div>
        </div>
    );
};