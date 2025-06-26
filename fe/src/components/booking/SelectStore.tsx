import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaStar, FaClock, FaArrowLeft } from "react-icons/fa";
import api from "@/services/api";
import url from "@/services/url";

interface Store {
    storeId: number;
    storeName: string;
    storeImages: string;
    phoneNumber: string;
    cityProvince: string;
    district: string;
    openingTime?: string;
    closingTime?: string;
    description?: string;
    averageRating?: number;
}

interface CityWithCountDTO {
    cityProvince: string;
    count: number;
}

interface SelectStoreProps {
    salonId: string;
    phone: string;
    setStep: (step: number) => void;
}

export function SelectStore({ salonId, phone, setStep }: SelectStoreProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [stores, setStores] = useState<Store[]>([]);
    const [cities, setCities] = useState<CityWithCountDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showStoreList, setShowStoreList] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchCities = async () => {
            setLoading(true);
            try {
                const response = await api.get<CityWithCountDTO[]>(
                    url.STORE.CITIES
                );
                setCities(response.data);
                setError(null);
            } catch (err: any) {
                console.error("Error fetching cities:", err);
                setError(
                    err.response?.data?.message ||
                        "Không thể tải danh sách tỉnh/thành phố"
                );
            } finally {
                setLoading(false);
            }
        };
        fetchCities();
    }, []);

    useEffect(() => {
        const fetchStores = async () => {
            if (!searchTerm.trim()) {
                setStores([]);
                setShowStoreList(false);
                return;
            }
            setLoading(true);
            try {
                const cityProvince = searchTerm.trim();
                const response = await api.get<Store[]>(url.STORE.LOCATE, {
                    params: {
                        cityProvince,
                        district: "",
                    },
                });
                const filteredStores = response.data.filter(
                    (store) =>
                        store.cityProvince.toLowerCase() ===
                        cityProvince.toLowerCase()
                );
                setStores(filteredStores);
                setShowStoreList(true);
                setError(null);
            } catch (err: any) {
                console.error("Error fetching stores:", err);
                setError(err.response?.data?.message || "Không tìm thấy salon");
                setStores([]);
                setShowStoreList(true);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(() => fetchStores(), 300);
        return () => clearTimeout(timeout);
    }, [searchTerm]);

    const handleStoreSelect = (store: Store) => {
        localStorage.setItem("storeId", store.storeId.toString());
        localStorage.removeItem("selectedServices");
        localStorage.removeItem("appointmentId");
        setSearchParams({
            phone,
            salonId: store.storeId.toString(),
            step: "0",
        });
        setStep(0);
    };

    return (
        <div className="w-full min-h-screen bg-light-cream font-sans flex flex-col items-center"> {/* Thay from-blue-{#F3F4F6} thành bg-light-cream, thêm font-sans */}
            {/* Full-width Image Banner */}
            <div
                className="relative bg-cover bg-center w-full flex items-center justify-center overflow-hidden"
                style={{ backgroundImage: `url('https://anviethouse.vn/wp-content/uploads/2022/06/mau-thiet-ke-barber-shop-4.jpg')`, height: '350px' }}
            >
                <div className="absolute inset-0 bg-black opacity-40 flex items-center justify-center"></div>
                <h1 className="relative text-white text-4xl md:text-5xl font-bold z-10 text-center px-4 font-serif"> {/* Thêm font-serif */}
                    Tìm Salon Gần Bạn
                </h1>
            </div>

            {/* Main Content Container: Search and Store Listings */}
            <div className="container mx-auto max-w-5xl -mt-16 md:-mt-20 relative z-20 px-4 mb-8">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">

                    {/* Header với nút quay lại và tiêu đề */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => setStep(0)}
                            className="text-dark-brown hover:text-accent-gold transition duration-200 p-2 rounded-full hover:bg-soft-gray" 
                        >
                            <FaArrowLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-2xl md:text-3xl font-bold text-center text-dark-brown flex-grow font-serif"> {/* Thay text-[#15397F] thành text-dark-brown, thêm font-serif */}
                            Chọn salon
                        </h2>
                        <div className="w-7 h-7"></div>
                    </div>

                    {/* Thanh tìm kiếm */}
                    <div className="mb-6 flex items-center bg-soft-gray rounded-lg shadow-sm border border-soft-gray focus-within:ring-2 focus-within:ring-accent-gold focus-within:border-transparent transition duration-200"> 
                        <FaSearch className="text-medium-gray ml-3 text-lg" /> {/* Thay text-gray-400 thành text-medium-gray */}
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm salon theo tỉnh/thành phố hoặc tên..."
                            className="bg-transparent border-none focus:outline-none py-3 px-4 w-full text-dark-brown placeholder-medium-gray text-base" 
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="mr-3 text-medium-gray hover:text-dark-brown transition" 
                            >
                                ×
                            </button>
                        )}
                    </div>

                    {loading && (
                        <div className="text-center text-medium-gray py-6 text-lg"> {/* Thay text-gray-500 thành text-medium-gray */}
                            Đang tải...
                        </div>
                    )}

                    {error && !loading && (
                        <div className="text-red-600 font-bold text-center py-6 text-base">
                            {error}
                        </div>
                    )}

                    {/* Hiển thị danh sách tỉnh thành (cities) nếu searchTerm trống và không loading/error */}
                    {!showStoreList && !loading && (
                        <div className="bg-white rounded-xl shadow-md px-6 py-6 border border-soft-gray"> {/* Thêm border border-soft-gray */}
                            <div className="font-semibold mb-4 text-base text-dark-brown"> {/* Thay text-gray-800 thành text-dark-brown */}
                                Barbershop có mặt trên các tỉnh thành:
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {cities.length > 0 ? (
                                    cities.map((city) => (
                                        <button
                                            key={city.cityProvince}
                                            onClick={() =>
                                                setSearchTerm(city.cityProvince)
                                            }
                                            className="bg-black-soft hover:bg-dark-brown text-light-cream text-sm px-4 py-2 rounded-lg transition shadow-sm" /* Thay bg-[#15397F] hover:bg-[#1e4bb8] text-white thành màu theme */
                                        >
                                            {city.cityProvince}
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-medium-gray text-sm"> {/* Thay text-gray-500 thành text-medium-gray */}
                                        Không có tỉnh/thành phố nào.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Hiển thị danh sách salon (stores) nếu showStoreList là true và không loading/error */}
                    {showStoreList && !loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                            {stores.length > 0 ? (
                                stores.map((store) => (
                                    <div
                                        key={store.storeId}
                                        className="rounded-xl shadow-md overflow-hidden bg-white hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-soft-gray" /* Thay border-gray-200 thành border-soft-gray */
                                        onClick={() => handleStoreSelect(store)}
                                    >
                                        <div className="relative h-48 w-full">
                                            <img
                                                src={
                                                    `${url.BASE_IMAGES}${store.storeImages}` ||
                                                    "https://via.placeholder.com/400x200/e0e0e0/ffffff?text=Salon"
                                                }
                                                alt={store.storeName}
                                                className="absolute inset-0 w-full h-full object-cover object-center"
                                            />
                                        </div>
                                        <div className="p-4 flex flex-col justify-between h-full">
                                            <div>
                                                <h3 className="text-xl font-bold text-dark-brown mb-1 leading-tight font-serif"> {/* Thay text-[#15397F] thành text-dark-brown, thêm font-serif */}
                                                    {store.storeName}
                                                </h3>
                                                <p className="flex items-center text-medium-gray text-sm mb-1"> {/* Thay text-gray-700 thành text-medium-gray */}
                                                    <FaMapMarkerAlt className="mr-2 text-medium-gray" /> {/* Thay text-gray-500 thành text-medium-gray */}
                                                    {store.district}, {store.cityProvince}
                                                </p>
                                                {store.averageRating !== undefined ? (
                                                    <div className="flex items-center text-medium-gray text-sm mb-1"> {/* Thay text-gray-700 thành text-medium-gray */}
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar
                                                                key={i}
                                                                className={`mr-0.5 ${
                                                                    i < Math.round(store.averageRating || 0)
                                                                        ? 'text-accent-gold'
                                                                        : 'text-soft-gray'
                                                                } text-base`} /* Thay màu sao */
                                                            />
                                                        ))}
                                                        <span className="font-bold text-lg text-dark-brown ml-1"> {/* Thay text-gray-800 thành text-dark-brown */}
                                                            {store.averageRating.toFixed(1)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <p className="text-medium-gray text-sm mb-1">Chưa có đánh giá</p> 
                                                )}

                                                <p className="flex items-center text-medium-gray text-sm"> {/* Thay text-gray-700 thành text-medium-gray */}
                                                    <FaClock className="mr-2 text-medium-gray" /> {/* Thay text-gray-500 thành text-medium-gray */}
                                                    Giờ mở: {store.openingTime || "N/A"} - {store.closingTime || "N/A"}
                                                </p>
                                                {store.description && (
                                                    <p className="text-medium-gray text-xs mt-2 line-clamp-3"> {/* Thay text-gray-500 thành text-medium-gray */}
                                                        {store.description}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                className="mt-4 w-full bg-black-soft hover:bg-dark-brown text-light-cream font-semibold py-2 rounded-lg transition shadow-md text-base" /* Thay bg-[#15397F] hover:bg-[#1e4bb8] text-white thành màu theme */
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStoreSelect(store);
                                                }}
                                            >
                                                Đặt lịch ngay
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center text-medium-gray py-6 text-base"> {/* Thay text-gray-500 thành text-medium-gray */}
                                    Không tìm thấy salon nào.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}