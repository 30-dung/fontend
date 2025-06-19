import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaStar, FaClock, FaArrowLeft } from "react-icons/fa"; // Import các icon cần thiết
import api from "@/services/api";
import url from "@/services/url";

interface Store {
    storeId: number;
    storeName: string;
    storeImages: string; // URL ảnh của cửa hàng
    phoneNumber: string;
    cityProvince: string;
    district: string;
    openingTime?: string;
    closingTime?: string;
    description?: string;
    averageRating?: number; // Giữ lại cho dữ liệu, sẽ hiển thị nếu có
    // ratingCount?: number;   // Bỏ trường này vì không có trong Store.java
}

interface CityWithCountDTO {
    cityProvince: string;
    count: number; // Trường này tương ứng với storeCount từ backend (CityWithCountDTO.java)
}

interface SelectStoreProps {
    salonId: string; // Đây là prop nhận từ BookingForm, có thể chưa dùng đến trong SelectStore
    phone: string;   // Đây là prop nhận từ BookingForm, có thể chưa dùng đến trong SelectStore
    setStep: (step: number) => void; // Hàm để quay lại BookingForm chính
}

export function SelectStore({ salonId, phone, setStep }: SelectStoreProps) {
    const [searchParams, setSearchParams] = useSearchParams(); // searchParams có thể không dùng trực tiếp nhưng giữ nguyên vì có thể liên quan đến logic cha
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [stores, setStores] = useState<Store[]>([]);
    const [cities, setCities] = useState<CityWithCountDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showStoreList, setShowStoreList] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    // Logic fetch cities (giữ nguyên)
    useEffect(() => {
        const fetchCities = async () => {
            setLoading(true);
            try {
                const response = await api.get<CityWithCountDTO[]>(
                    url.STORE.CITIES
                );
                // console.log("Fetched cities data:", response.data); 
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

    // Logic fetch stores dựa trên searchTerm (giữ nguyên)
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
                        district: "", // Logic cũ: Luôn để trống district khi tìm theo tỉnh/thành phố
                    },
                });
                // console.log("Fetched stores data:", response.data);
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

    // Logic xử lý chọn cửa hàng (giữ nguyên logic gốc của bạn)
    const handleStoreSelect = (store: Store) => {
        localStorage.setItem("storeId", store.storeId.toString());
        localStorage.removeItem("selectedServices"); 
        localStorage.removeItem("appointmentId"); 
        setSearchParams({ // Cập nhật search params (logic gốc)
            phone, // phone từ props
            salonId: store.storeId.toString(),
            step: "0", 
        });
        setStep(0); // Chuyển về step 0 của BookingForm
    };

    return (
        <div className="w-full min-h-screen bg-gray-100 font-sans flex flex-col items-center">
            {/* Full-width Image Banner */}
            <div
                className="relative bg-cover bg-center w-full flex items-center justify-center overflow-hidden"
                style={{ backgroundImage: `url('https://anviethouse.vn/wp-content/uploads/2022/06/mau-thiet-ke-barber-shop-4.jpg')`, height: '350px' }} // Chiều cao 280px và dùng ảnh bạn gửi
            >
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"></div>
                <h1 className="relative text-white text-4xl md:text-5xl font-bold z-10 text-center px-4">
                    Tìm Salon Gần Bạn
                </h1>
            </div>

            {/* Main Content Container: Search and Store Listings */}
            <div className="container mx-auto max-w-5xl -mt-16 md:-mt-20 relative z-20 px-4 mb-8"> {/* Container chính cho nội dung form */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">

                    {/* Header với nút quay lại và tiêu đề */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => setStep(0)} // Quay lại step 0 (BookingForm chính)
                            className="text-[#15397F] hover:text-[#1e4bb8] transition duration-200 p-2 rounded-full hover:bg-gray-200"
                        >
                            <FaArrowLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#15397F] flex-grow">
                            Chọn salon
                        </h2>
                        <div className="w-7 h-7"></div> {/* Placeholder để căn giữa */}
                    </div>

                    {/* Thanh tìm kiếm */}
                    <div className="mb-6 flex items-center bg-gray-50 rounded-lg shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-[#15397F] focus-within:border-transparent transition duration-200">
                        <FaSearch className="text-gray-400 ml-3 text-lg" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm salon theo tỉnh/thành phố hoặc tên..."
                            className="bg-transparent border-none focus:outline-none py-3 px-4 w-full text-gray-700 placeholder-gray-500 text-base"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="mr-3 text-gray-500 hover:text-gray-700 transition"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    {loading && (
                        <div className="text-center text-gray-500 py-6 text-lg">
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
                        <div className="bg-white rounded-xl shadow-md px-6 py-6">
                            <div className="font-semibold mb-4 text-base text-gray-800">
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
                                            className="bg-[#15397F] hover:bg-[#1e4bb8] text-white text-sm px-4 py-2 rounded-lg transition shadow-sm"
                                        >
                                            {city.cityProvince} 
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-gray-500 text-sm">
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
                                        className="rounded-xl shadow-md overflow-hidden bg-white hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200"
                                        // Logic giữ nguyên: onClick của thẻ gọi handleStoreSelect
                                        onClick={() => handleStoreSelect(store)}
                                    >
                                        <div className="relative h-48 w-full"> {/* Chiều cao ảnh cố định */}
                                            <img
                                                src={
                                                    store.storeImages ||
                                                    "https://via.placeholder.com/400x200/e0e0e0/ffffff?text=Salon"
                                                }
                                                alt={store.storeName}
                                                className="absolute inset-0 w-full h-full object-cover object-center"
                                            />
                                        </div>
                                        <div className="p-4 flex flex-col justify-between h-full">
                                            <div>
                                                <h3 className="text-xl font-bold text-[#15397F] mb-1 leading-tight">
                                                    {store.storeName}
                                                </h3>
                                                <p className="flex items-center text-gray-700 text-sm mb-1">
                                                    <FaMapMarkerAlt className="mr-2 text-gray-500" />
                                                    {store.district}, {store.cityProvince}
                                                </p>
                                                {/* Hiển thị 5 ngôi sao cố định, tô màu dựa trên averageRating */}
                                                {store.averageRating !== undefined ? (
                                                    <div className="flex items-center text-gray-700 text-sm mb-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar 
                                                                key={i} 
                                                                className={`mr-0.5 ${
                                                                    i < Math.round(store.averageRating || 0) 
                                                                        ? 'text-yellow-500' 
                                                                        : 'text-gray-300' // Sao xám nếu không đạt đủ điểm
                                                                } text-base`} // Kích thước sao
                                                            />
                                                        ))}
                                                        <span className="font-bold text-lg text-gray-800 ml-1">
                                                            {store.averageRating.toFixed(1)}
                                                        </span>
                                                        {/* Bỏ phần ratingCount vì không có trong Store.java */}
                                                        {/* {store.ratingCount !== undefined && <span className="ml-1 text-base text-gray-600">({store.ratingCount} đánh giá)</span>} */}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 text-sm mb-1">Chưa có đánh giá</p>
                                                )}

                                                <p className="flex items-center text-gray-700 text-sm">
                                                    <FaClock className="mr-2 text-gray-500" />
                                                    Giờ mở: {store.openingTime || "N/A"} - {store.closingTime || "N/A"}
                                                </p>
                                                {store.description && (
                                                    <p className="text-gray-500 text-xs mt-2 line-clamp-3">
                                                        {store.description}
                                                    </p>
                                                )}
                                            </div>
                                            {/* Nút Đặt lịch ngay */}
                                            <button
                                                className="mt-4 w-full bg-[#15397F] hover:bg-[#1e4bb8] text-white font-semibold py-2 rounded-lg transition shadow-md text-base"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Ngăn sự kiện click lan ra thẻ cha
                                                    handleStoreSelect(store); 
                                                }}
                                            >
                                                Đặt lịch ngay
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center text-gray-500 py-6 text-base">
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