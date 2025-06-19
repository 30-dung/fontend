import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Service } from "./BookingForm";
import api from "../../../services/api";
import url from "../../../services/url";
import { FaSearch, FaClock, FaArrowLeft } from "react-icons/fa"; // Import icons

interface StoreService {
    storeServiceId: number;
    service: {
        serviceId: number;
        serviceName: string;
        description: string;
        durationMinutes: number;
        serviceImg: string;
    };
    price: number;
}

interface SelectServiceProps {
    salonId: string;
    phone: string;
    setSelectedServices: React.Dispatch<React.SetStateAction<Service[]>>;
    setStep: (step: number) => void;
}

export function SelectService({
    salonId,
    phone,
    setSelectedServices,
    setStep,
}: SelectServiceProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const storeId = localStorage.getItem("storeId") || salonId;
    const selectedServicesIds = JSON.parse(
        localStorage.getItem("selectedServices") || "[]"
    );
    const [services, setServices] = useState<StoreService[]>([]);
    const [selectedServicesState, setSelectedServicesState] = useState<
        StoreService[]
    >([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        const fetchServices = async () => {
            if (!storeId || storeId === "0") {
                setError("Vui lòng chọn salon trước");
                return;
            }
            setLoading(true);
            try {
                const response = await api.get(
                    `${url.STORE_SERVICE.GET_BY_STORE}/${storeId}`
                );
                setServices(response.data);
                setError(null);

                const savedServices = response.data.filter((s: StoreService) =>
                    selectedServicesIds.includes(s.storeServiceId)
                );
                setSelectedServicesState(savedServices);
                setSelectedServices(
                    savedServices.map((s: StoreService) => ({
                        storeServiceId: s.storeServiceId,
                        service: {
                            serviceName: s.service.serviceName,
                            durationMinutes: s.service.durationMinutes,
                        },
                        price: s.price,
                    }))
                );
            } catch (err: any) {
                setError(
                    err.response?.data?.message ||
                        "Không thể tải danh sách dịch vụ"
                );
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [storeId, setSelectedServices]);

    const handleSelectService = (service: StoreService) => {
        setSelectedServicesState((prev) =>
            prev.find((s) => s.storeServiceId === service.storeServiceId)
                ? prev.filter(
                      (s) => s.storeServiceId !== service.storeServiceId
                  )
                : [...prev, service]
        );
    };

    const handleConfirm = () => {
        if (selectedServicesState.length === 0) {
            setError("Vui lòng chọn ít nhất một dịch vụ");
            return;
        }
        localStorage.setItem(
            "selectedServices",
            JSON.stringify(selectedServicesState.map((s) => s.storeServiceId))
        );
        setSelectedServices(
            selectedServicesState.map((s: StoreService) => ({
                storeServiceId: s.storeServiceId,
                service: {
                    serviceName: s.service.serviceName,
                    durationMinutes: s.service.durationMinutes,
                },
                price: s.price,
            }))
        );
        setSearchParams({
            phone,
            salonId: storeId,
            step: "0",
        });
        setStep(0);
    };

    const filteredServices = services.filter((service) =>
        service.service.serviceName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full min-h-screen bg-gray-100 font-sans flex flex-col items-center">
            {/* Banner ảnh lớn */}
            <div
                className="relative bg-cover bg-center w-full flex items-center justify-center overflow-hidden object-cover "
               style={{ backgroundImage: `url('https://t3.ftcdn.net/jpg/06/70/53/74/360_F_670537427_n4UsFhTyJyRLAuuukM1Z9LTEbtZp0KWi.jpg')`, height: '350px' }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"></div>
                <h1 className="relative text-white text-4xl md:text-5xl font-bold z-10 text-center px-4">
                    Chọn Dịch Vụ
                </h1>
            </div>

            {/* Khung trắng lớn chứa toàn bộ nội dung chính (bao gồm cả phần tổng thanh toán) */}
            {/* Đã loại bỏ `pb-[FIXED_FOOTER_HEIGHT_PX]px` vì footer giờ là sticky, không fixed toàn màn hình */}
            <div className="container mx-auto max-w-5xl -mt-16 md:-mt-20 relative z-20 px-4 mb-8">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">

                    {/* Header với nút quay lại và tiêu đề "Chọn dịch vụ" */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => setStep(0)} // Adjust step based on your BookingForm logic
                            className="text-[#15397F] hover:text-[#1e4bb8] transition duration-200 p-2 rounded-full hover:bg-gray-200"
                        >
                            <FaArrowLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#15397F] flex-grow">
                            Dịch vụ có sẵn
                        </h2>
                        <div className="w-7 h-7"></div> {/* Placeholder to center the title */}
                    </div>

                    {/* Thanh tìm kiếm */}
                    <div className="relative mb-6 flex items-center bg-gray-50 rounded-lg shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-[#15397F] focus-within:border-transparent transition duration-200">
                        <FaSearch className="text-gray-400 ml-3 text-lg" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm dịch vụ..."
                            className="bg-transparent border-none focus:outline-none py-3 px-4 w-full text-gray-700 placeholder-gray-500 text-base"
                        />
                        {searchTerm && (
                            <button
                                className="mr-3 text-gray-500 hover:text-gray-700 text-xl font-bold transition"
                                onClick={() => setSearchTerm("")}
                                aria-label="Clear search"
                            >
                                &times;
                            </button>
                        )}
                    </div>

                    {loading && (
                        <div className="text-center text-gray-500 py-6 text-lg">
                            Đang tải danh sách dịch vụ...
                        </div>
                    )}
                    {error && (
                        <div className="text-center text-red-600 py-6 text-base">
                            {error}
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredServices.length > 0 ? (
                                filteredServices.map((service) => (
                                    <div
                                        key={service.storeServiceId}
                                        className={`bg-white rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer
                                            ${selectedServicesState.find((s) => s.storeServiceId === service.storeServiceId) ? 'border-2 border-[#15397F]' : 'border border-gray-200'}
                                            hover:shadow-lg transition transform hover:scale-105 duration-300`}
                                        onClick={() => handleSelectService(service)}
                                    >
                                        <img
                                            className="w-full h-36 object-cover rounded-t-lg"
                                            src={
                                                service.service.serviceImg ||
                                                "https://via.placeholder.com/300x150?text=Service+Image"
                                            }
                                            alt={service.service.serviceName}
                                        />
                                        <div className="p-3 flex flex-col flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="text-base font-semibold text-gray-800 flex-1 pr-1 leading-tight">
                                                    {service.service.serviceName}
                                                </p>
                                                <div className="flex items-center text-xs text-gray-600 pl-1">
                                                    <FaClock className="h-3 w-3 mr-1 text-gray-500" />
                                                    {service.service.durationMinutes}p
                                                </div>
                                            </div>
                                            
                                            {service.service.description && (
                                                <p className="text-xs text-gray-600 mb-2 line-clamp-2 leading-snug">
                                                    {service.service.description}
                                                </p>
                                            )}

                                            <div className="mt-auto pt-2 border-t border-gray-100">
                                                <span className="text-sm font-bold text-gray-900 block mb-1">
                                                    Giá tiêu chuẩn
                                                </span>
                                                <span className="text-lg font-bold text-[#15397F] block mb-3">
                                                    {service.price.toLocaleString("vi-VN")} VND
                                                </span>
                                                <button
                                                    className={`w-full text-white font-semibold text-sm px-3 py-1.5 rounded-lg transition duration-200 ease-in-out ${
                                                        selectedServicesState.find(
                                                            (s) =>
                                                                s.storeServiceId ===
                                                                service.storeServiceId
                                                        )
                                                            ? "bg-blue-800 hover:bg-blue-900"
                                                            : "bg-[#15397F] hover:bg-[#1e4bb8]"
                                                    }`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSelectService(service);
                                                    }}
                                                >
                                                    {selectedServicesState.find(
                                                        (s) =>
                                                            s.storeServiceId ===
                                                            service.storeServiceId
                                                    )
                                                        ? "Đã chọn"
                                                        : "Thêm dịch vụ"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center text-gray-500 py-8 text-base">
                                    Không tìm thấy dịch vụ nào.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Phần Tổng thanh toán và Tiếp tục - sử dụng sticky position */}
                    <div className="sticky bottom-0 z-40 mt-8 p-6 bg-white border border-gray-200 rounded-xl shadow">
                        <p className="text-base text-gray-700 font-semibold mb-2">
                            Đã chọn {selectedServicesState.length} dịch vụ
                        </p>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xl font-bold text-[#15397F]">
                                Tổng thanh toán
                            </span>
                            <span className="text-xl font-bold text-green-700">
                                {selectedServicesState
                                    .reduce((sum, s) => sum + s.price, 0)
                                    .toLocaleString("vi-VN")}{" "}
                                VND
                            </span>
                        </div>
                        <button
                            className={`w-full mt-2 text-white font-semibold text-base px-4 py-3 rounded-lg transition duration-200 ease-in-out ${
                                selectedServicesState.length === 0
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-[#15397F] hover:bg-[#1e4bb8]"
                            }`}
                            onClick={handleConfirm}
                            disabled={selectedServicesState.length === 0}
                        >
                            Tiếp tục
                        </button>
                    </div>
                </div> {/* Kết thúc khung trắng lớn */}
            </div>
        </div>
    );
}