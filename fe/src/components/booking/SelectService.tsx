import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Service } from "../../pages/client/booking/BookingForm";
import api from "@/services/api";
import url from "@/services/url";
import { FaSearch, FaClock, FaArrowLeft, FaStar } from "react-icons/fa";
import StarRating from "@/components/reviews/StarRating";

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
    averageRating: number;
    totalReviews: number;
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
    const selectedServiceIdFromLS = JSON.parse(
        localStorage.getItem("selectedServiceId") || "null"
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
                const response = await api.get<StoreService[]>(
                    `${url.STORE_SERVICE.GET_BY_STORE}/${storeId}`
                );
                const mappedServices: StoreService[] = response.data.map((s: any) => ({
                    ...s,
                    averageRating: s.averageRating || 0,
                    totalReviews: s.totalReviews || 0,
                }));
                setServices(mappedServices);
                setError(null);

                if (selectedServiceIdFromLS !== null) {
                    const savedService = mappedServices.find(
                        (s: StoreService) => s.storeServiceId === selectedServiceIdFromLS
                    );
                    if (savedService) {
                        setSelectedServicesState([savedService]);
                        setSelectedServices([
                            {
                                storeServiceId: savedService.storeServiceId,
                                service: {
                                    serviceName: savedService.service.serviceName,
                                    durationMinutes: savedService.service.durationMinutes,
                                },
                                price: savedService.price,
                            },
                        ]);
                    }
                } else {
                    setSelectedServicesState([]);
                    setSelectedServices([]);
                }

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
    }, [storeId, setSelectedServices, selectedServiceIdFromLS]);

    const handleSelectService = (service: StoreService) => {
        const isAlreadySelected = selectedServicesState.some(
            (s) => s.storeServiceId === service.storeServiceId
        );

        if (isAlreadySelected) {
            setSelectedServicesState([]);
        } else {
            setSelectedServicesState([service]);
        }
    };

    const handleConfirm = () => {
        if (selectedServicesState.length === 0) {
            setError("Vui lòng chọn một dịch vụ");
            return;
        }
        localStorage.setItem(
            "selectedServiceId",
            JSON.stringify(selectedServicesState[0].storeServiceId)
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
        <div className="w-full min-h-screen bg-light-cream font-sans flex flex-col items-center">
            {/* Banner ảnh lớn */}
            <div
                className="relative bg-cover bg-center w-full flex items-center justify-center overflow-hidden object-cover "
               style={{ backgroundImage: `url('https://t3.ftcdn.net/jpg/06/70/53/74/360_F_670537427_n4UsFhTyJyRLAuuukM1Z9LTEbtZp0KWi.jpg')`, height: '350px' }}
            >
                <div className="absolute inset-0 bg-black opacity-40 flex items-center justify-center"></div>
                <h1 className="relative text-white text-4xl md:text-5xl font-bold z-10 text-center px-4 font-serif">
                    Chọn Dịch Vụ
                </h1>
            </div>

            {/* Khung trắng lớn chứa toàn bộ nội dung chính */}
            <div className="container mx-auto max-w-5xl -mt-16 md:-mt-20 relative z-20 px-4 mb-8 flex flex-col lg:flex-row gap-6">
                {/* Cột chính: Danh sách dịch vụ */}
                <div className="lg:w-2/3 bg-white rounded-2xl shadow-xl p-6 md:p-8 flex-grow">

                    {/* Header với nút quay lại và tiêu đề "Chọn dịch vụ" */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => setStep(0)}
                            className="text-dark-brown hover:text-accent-gold transition duration-200 p-2 rounded-full hover:bg-soft-gray"
                        >
                            <FaArrowLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-2xl md:text-3xl font-bold text-center text-dark-brown flex-grow font-serif">
                            Dịch vụ có sẵn
                        </h2>
                        <div className="w-7 h-7"></div>
                    </div>

                    {/* Thanh tìm kiếm */}
                    <div className="relative mb-6 flex items-center bg-soft-gray rounded-lg shadow-sm border border-soft-gray focus-within:ring-2 focus-within:ring-accent-gold focus-within:border-transparent transition duration-200">
                        <FaSearch className="text-medium-gray ml-3 text-lg" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm dịch vụ..."
                            className="bg-transparent border-none focus:outline-none py-3 px-4 w-full text-dark-brown placeholder-medium-gray text-base"
                        />
                        {searchTerm && (
                            <button
                                className="mr-3 text-medium-gray hover:text-dark-brown transition"
                                onClick={() => setSearchTerm("")}
                                aria-label="Clear search"
                            >
                                &times;
                            </button>
                        )}
                    </div>

                    {loading && (
                        <div className="text-center text-medium-gray py-6 text-lg">
                            Đang tải danh sách dịch vụ...
                        </div>
                    )}
                    {error && (
                        <div className="text-center text-red-600 py-6 text-base">
                            {error}
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6"> {/* Đã chỉnh: lg:grid-cols-2 và xl:grid-cols-2 */}
                            {filteredServices.length > 0 ? (
                                filteredServices.map((service) => (
                                    <div
                                        key={service.storeServiceId}
                                        className={`bg-white rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer
                                            ${selectedServicesState.some(s => s.storeServiceId === service.storeServiceId) ? 'border-2 border-dark-brown' : 'border border-soft-gray'}
                                            hover:shadow-lg transition transform hover:scale-105 duration-300`}
                                        onClick={() => handleSelectService(service)}
                                    >
                                        <img
                                            className="w-full h-36 object-cover rounded-t-lg"
                                            src={
                                                service.service.serviceImg
                                                    ? (service.service.serviceImg.startsWith('http')
                                                        ? service.service.serviceImg
                                                        : `${url.BASE_IMAGES}${service.service.serviceImg}`)
                                                    : "https://via.placeholder.com/300x150?text=Service+Image"
                                            }
                                            alt={service.service.serviceName}
                                        />
                                        <div className="p-3 flex flex-col flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="text-base font-semibold text-dark-brown flex-1 pr-1 leading-tight font-serif">
                                                    {service.service.serviceName}
                                                </p>
                                                <div className="flex items-center text-xs text-medium-gray pl-1">
                                                    <FaClock className="h-3 w-3 mr-1 text-medium-gray" />
                                                    {service.service.durationMinutes}p
                                                </div>
                                            </div>

                                            {service.service.description && (
                                                <p className="text-xs text-medium-gray mb-2 line-clamp-2 leading-snug">
                                                    {service.service.description}
                                                </p>
                                            )}

                                            <div className="flex items-center text-sm mb-2">
                                                {service.totalReviews > 0 ? (
                                                    <>
                                                        <StarRating initialRating={service.averageRating} readOnly starSize={14} />
                                                        <span className="ml-1 text-medium-gray">({service.totalReviews})</span>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-medium-gray">Chưa có đánh giá</span>
                                                )}
                                            </div>

                                            <div className="mt-auto pt-2 border-t border-soft-gray">
                                                <span className="text-sm font-bold text-dark-brown block mb-1">
                                                    Giá tiêu chuẩn
                                                </span>
                                                <span className="text-lg font-bold text-accent-gold block mb-3">
                                                    {service.price.toLocaleString("vi-VN")} VND
                                                </span>
                                                <button
                                                    className={`w-full text-light-cream font-semibold text-sm px-3 py-1.5 rounded-lg transition duration-200 ease-in-out ${
                                                        selectedServicesState.some(
                                                            (s) =>
                                                                s.storeServiceId ===
                                                                service.storeServiceId
                                                        )
                                                            ? "bg-dark-brown hover:bg-black-soft"
                                                            : "bg-black-soft hover:bg-dark-brown"
                                                    }`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSelectService(service);
                                                    }}
                                                >
                                                    {selectedServicesState.some(
                                                        (s) =>
                                                            s.storeServiceId ===
                                                            service.storeServiceId
                                                    )
                                                        ? "Đã chọn"
                                                        : "Chọn dịch vụ"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center text-medium-gray py-8 text-base">
                                    Không tìm thấy dịch vụ nào.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar Tóm tắt đơn hàng và nút Tiếp tục */}
                <div className="lg:w-1/3 bg-white px-6 py-8 rounded-xl shadow-xl h-fit sticky top-20">
                    <h3 className="text-xl font-bold text-dark-brown mb-5 font-serif">Tóm tắt dịch vụ</h3>
                    <div className="space-y-4">
                        {selectedServicesState.length > 0 ? (
                            <div className="text-sm text-medium-gray">
                                <p className="font-semibold mb-1">Dịch vụ đã chọn:</p>
                                <ul className="list-none list-inside ml-2 space-y-0.5">
                                    {selectedServicesState.map(service => (
                                        <li key={service.storeServiceId}>
                                            {service.service.serviceName} ({service.service.durationMinutes} phút) - {service.price.toLocaleString()} VND
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="text-medium-gray text-sm">Chưa có dịch vụ nào được chọn.</p>
                        )}
                        
                        <div className="text-lg font-bold text-dark-brown flex justify-between pt-4 border-t border-soft-gray">
                            <span>Tổng thanh toán:</span>
                            <span className="text-xl font-bold text-accent-gold">
                                {selectedServicesState.length > 0
                                    ? selectedServicesState[0].price.toLocaleString("vi-VN")
                                    : "0"}{" "}
                                VND
                            </span>
                        </div>
                    </div>

                    {/* Nút Tiếp tục */}
                    <div className="mt-8">
                        <button
                            className={`w-full py-3 rounded-lg text-light-cream font-semibold text-base uppercase tracking-wide transition duration-200 shadow-md ${
                                selectedServicesState.length === 0
                                    ? "bg-soft-gray cursor-not-allowed text-medium-gray"
                                    : "bg-black-soft hover:bg-dark-brown"
                            }`}
                            onClick={handleConfirm}
                            disabled={selectedServicesState.length === 0}
                        >
                            Tiếp tục
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}