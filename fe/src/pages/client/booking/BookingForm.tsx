import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
    FaStore,
    FaCut,
    FaUser,
    FaCalendarAlt,
    FaChevronRight,
    FaChevronDown,
    FaChevronUp,
    FaArrowLeft,
    FaPhoneAlt,
    FaStar,
} from "react-icons/fa";
import { SelectStore } from "@/components/booking/SelectStore";
import { SelectService } from "@/components/booking/SelectService";
import url from "@/services/url";
import api from "@/services/api";
import routes from "@/config/routes";
import { motion } from "framer-motion";
import StarRating from "@/components/reviews/StarRating";

interface Store {
    storeId: number;
    storeName: string;
}

export interface Service {
    storeServiceId: number;
    service: {
        serviceName: string;
        durationMinutes: number;
    };
    price: number;
}

interface Employee {
    employeeId: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    avatarUrl?: string;
    averageRating: number;
    totalReviews: number;
}

interface WorkingTimeSlot {
    timeSlotId: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}

interface StoreService {
    serviceId: number;
    storeServiceId: number;
    service: {
        serviceName: string;
        description: string;
        durationMinutes: number;
        serviceImg: string;
    };
    price: number;
    averageRating: number;
    totalReviews: number;
}

export default function BookingForm() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [step, setStep] = useState<number>(0);
    const [phone, setPhone] = useState<string>("");
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [errorStore, setErrorStore] = useState<string | null>(null);
    const [errorService, setErrorService] = useState<string | null>(null);
    const [errorDate, setErrorDate] = useState<string | null>(null);
    const [stylists, setStylists] = useState<Employee[]>([]);
    const [selectedStylist, setSelectedStylist] = useState<Employee | null>(
        null
    );
    const [stylistOpen, setStylistOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );
    const [availableSlots, setAvailableSlots] = useState<WorkingTimeSlot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<WorkingTimeSlot | null>(
        null
    );
    const [servicesDetails, setServicesDetails] = useState<StoreService[]>([]);
    const [loading, setLoading] = useState(false);

    const [currentStylistPage, setCurrentStylistPage] = useState(0);
    const stylistsPerPage = 3;
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const salonId = searchParams.get("salonId");
        if (!salonId) {
            localStorage.removeItem("storeId");
            setSelectedStore(null);
        }

        const isFullySelected =
            localStorage.getItem("isFullySelected") === "true";
        const storeId = salonId || "0";

        if (storeId !== "0") {
            setLoading(true);
            api.get(`${url.STORE.GET_BY_ID}/${storeId}`)
                .then((res) => {
                    setSelectedStore(res.data);
                    localStorage.setItem("storeId", storeId);
                    setErrorStore(null);
                })
                .catch((err) => {
                    setErrorStore(
                        "Không thể tải thông tin salon: " +
                            (err.response?.data?.message || err.message)
                    );
                    localStorage.removeItem("storeId");
                    setSelectedStore(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else if (!isFullySelected) {
            setSelectedStore(null);
            setSelectedServices([]);
            setSelectedStylist(null);
            setSelectedDate(new Date().toISOString().split("T")[0]);
            setAvailableSlots([]);
            setStylists([]);
            setSelectedSlot(null);
            setServicesDetails([]);
            localStorage.removeItem("selectedServices");
            localStorage.removeItem("isFullySelected");
        }
    }, [searchParams]);

    useEffect(() => {
        return () => {
            const navigationEntries = window.performance.getEntriesByType(
                "navigation"
            ) as PerformanceNavigationTiming[];
            if (
                navigationEntries.length > 0 &&
                !navigationEntries[0].type.includes("reload")
            ) {
                localStorage.removeItem("selectedServices");
                localStorage.removeItem("storeId");
                localStorage.removeItem("isFullySelected");
            }
        };
    }, []);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                if (!localStorage.getItem("access_token")) {
                    setErrorStore("Vui lòng đăng nhập để tiếp tục");
                    navigate(routes.login);
                    return;
                }
                const response = await api.get(url.USER.PROFILE);
                const userPhone = response.data.phoneNumber;
                setPhone(userPhone);
                setSearchParams({
                    phone: userPhone,
                    salonId: localStorage.getItem("storeId") || "0",
                    step: step.toString(),
                });
            } catch (err: any) {
                if (err.response?.status === 401) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("user_role");
                    setErrorStore(
                        "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
                    );
                    navigate(routes.login);
                } else {
                    setErrorStore(
                        "Không thể tải thông tin người dùng: " + err.message
                    );
                }
            }
        };
        fetchUserProfile();
    }, [navigate, setSearchParams, step]);

    useEffect(() => {
        const fetchStylists = async () => {
            const storeId = localStorage.getItem("storeId") || "0";
            if (
                !storeId ||
                storeId === "0" ||
                !selectedStore ||
                selectedServices.length === 0
            ) {
                setStylists([]);
                return;
            }
            setLoading(true);
            try {
                const response = await api.get(
                    `${url.EMPLOYEE.BY_STORE}/${storeId}`
                );
                const shuffleArray = (array: any[]) => {
                    let currentIndex = array.length, randomIndex;
                    while (currentIndex !== 0) {
                        randomIndex = Math.floor(Math.random() * currentIndex);
                        currentIndex--;
                        [array[currentIndex], array[randomIndex]] = [
                            array[randomIndex], array[currentIndex]];
                    }
                    return array;
                };

                let mappedStylists = response.data.map((stylist: any) => ({
                    employeeId: stylist.employeeId,
                    fullName: stylist.fullName,
                    email: stylist.email,
                    phoneNumber: stylist.phoneNumber,
                    avatarUrl: stylist.avatarUrl,
                    averageRating: stylist.averageRating || 0,
                    totalReviews: stylist.totalReviews || 0,
                }));
                setStylists(shuffleArray(mappedStylists));
            } catch (err: any) {
                console.error("Không thể tải danh sách stylist:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStylists();
    }, [selectedStore, selectedServices]);

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (
                !selectedStore ||
                selectedServices.length === 0 ||
                !selectedStylist ||
                !selectedDate
            ) {
                setAvailableSlots([]);
                return;
            }
            setLoading(true);
            try {
                const response = await api.get(url.SLOT.WORKING_TIME_SLOTS, {
                    params: {
                        employeeId: selectedStylist.employeeId,
                        date: selectedDate,
                    },
                });
                setAvailableSlots(response.data);
                if (response.data.length === 0) {
                    setErrorDate(
                        "Không có khung giờ trống cho stylist này vào ngày đã chọn"
                    );
                } else {
                    setErrorDate(null);
                }
            } catch (err: any) {
                setErrorDate(
                    err.response?.data?.message ||
                        "Không thể tải khung giờ trống"
                );
            } finally {
                setLoading(false);
            }
        };
        fetchAvailableSlots();
    }, [selectedStore, selectedServices, selectedStylist, selectedDate]);

    useEffect(() => {
        const fetchServicesDetails = async () => {
            const storeId = localStorage.getItem("storeId") || "0";
            if (!storeId || storeId === "0") return;
            try {
                const response = await api.get(
                    `${url.STORE_SERVICE.GET_BY_STORE}/${storeId}`
                );
                const services = response.data.filter((s: StoreService) =>
                    selectedServices
                        .map((s) => s.storeServiceId)
                        .includes(s.storeServiceId)
                );
                setServicesDetails(services);
                if (services.length === 0 && selectedServices.length > 0) {
                    setErrorService("Không tìm thấy chi tiết dịch vụ đã chọn");
                }
            } catch (err: any) {
                setErrorService(
                    err.response?.data?.message ||
                        "Không thể tải chi tiết dịch vụ"
                );
            }
        };
        fetchServicesDetails();
    }, [selectedServices]);

    const handleStepChange = (newStep: number) => {
        setStep(newStep);
        setSearchParams({
            phone,
            salonId: localStorage.getItem("storeId") || "0",
            step: newStep.toString(),
        });
    };

    const handleConfirm = async () => {
        if (
            !selectedStylist ||
            !selectedSlot ||
            servicesDetails.length === 0 ||
            !phone
        ) {
            setErrorService(
                "Vui lòng chọn stylist, thời gian, dịch vụ và cung cấp số điện thoại"
            );
            return;
        }

        let currentStartTime = new Date(selectedSlot.startTime);
        const appointments = servicesDetails.map((service, index) => {
            const duration = service.service.durationMinutes;
            const startTime = formatDateTimeWithoutOffset(currentStartTime);
            const endTime = formatDateTimeWithoutOffset(
                new Date(currentStartTime.getTime() + duration * 60000)
            );
            currentStartTime = new Date(endTime);
            const appointment = {
                storeServiceId: service.storeServiceId,
                timeSlotId: selectedSlot.timeSlotId,
                startTime,
                endTime,
                phoneNumber: phone,
                notes: "Khách hàng ưu tiên nhanh",
            };
            console.log(`Appointment ${index}:`, appointment);
            return appointment;
        });

        try {
            const response = await api.post(
                url.APPOINTMENT.CREATE,
                appointments
            );
            console.log("Created appointments:", response.data);
            const appointmentIds = Array.isArray(response.data)
                ? response.data.map((a: any) => a.appointmentId)
                : [response.data.appointmentId];
            localStorage.setItem("appointmentId", appointmentIds[0].toString());
            localStorage.setItem("isFullySelected", "true");
            navigate(routes.bookingConfirmation, {
                state: { appointments: response.data },
            });
        } catch (err: any) {
            console.error("Booking error:", err.response?.data || err.message);
            setErrorService(
                err.response?.data?.message || "Không thể tạo cuộc hẹn"
            );
        }
    };

    const formatDateTimeWithoutOffset = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    const currentTime = new Date().getTime();

    const isButtonEnabled =
        selectedStore &&
        selectedServices.length > 0 &&
        selectedStylist &&
        selectedDate &&
        selectedSlot &&
        phone;

    const handleServiceClick = () => {
        if (!selectedStore) {
            setErrorStore("Vui lòng chọn salon trước");
            return;
        }
        setErrorStore(null);
        setErrorService(null);
        handleStepChange(2);
    };

    const handleStylistClick = () => {
        if (!selectedStore) {
            setErrorStore("Vui lòng chọn salon trước");
            return;
        }
        if (selectedServices.length === 0) {
            setErrorService("Vui lòng chọn dịch vụ trước");
            return;
        }
        setErrorStore(null);
        setErrorService(null);
        setStylistOpen(!stylistOpen);
        setCurrentStylistPage(0);
    };

    const handleNextStylistPage = () => {
        setCurrentStylistPage((prevPage) =>
            Math.min(prevPage + 1, Math.ceil(stylists.length / stylistsPerPage) - 1)
        );
    };

    const handlePrevStylistPage = () => {
        setCurrentStylistPage((prevPage) => Math.max(prevPage - 1, 0));
    };

    const showNavigationButtons = stylists.length > stylistsPerPage;

    return (
        <div className="w-full max-w-full mx-auto bg-light-cream min-h-screen flex flex-col font-sans"> {/* Thay from-blue-{#F3F4F6} thành bg-light-cream */}
            {step === 0 && (
                <>
                    {/* Banner ảnh lớn và tiêu đề */}
                    <div
                        className="relative w-full overflow-hidden"
                        style={{ height: '350px' }}
                    >
                        <img
                            src="https://img.lovepik.com/photo/60237/1945.jpg_wh860.jpg"
                            alt="Đặt lịch giữ chỗ"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                            <span className="text-white text-4xl md:text-5xl font-bold tracking-tight text-shadow-lg font-serif"> {/* Thêm font-serif */}
                                Đặt lịch giữ chỗ
                            </span>
                        </div>
                    </div>

                    {/* Container chính cho form và sidebar */}
                    <div className="relative z-10 -mt-16 md:-mt-20 max-w-5xl mx-auto w-[calc(100%-2rem)] flex flex-col lg:flex-row gap-6">
                        {/* Phần form chính (cột trái) */}
                        <div className="lg:w-2/3 bg-white px-6 py-8 rounded-xl shadow-xl flex-grow mb-24">
                            <div className="space-y-4">
                                {/* Chọn Salon */}
                                <div className="bg-white rounded-lg p-4 shadow-md">
                                    <div className="flex items-center mb-3">
                                        <div className="w-6 h-6 rounded-full bg-black-soft text-light-cream flex items-center justify-center mr-2 text-sm font-semibold shadow-md"> {/* Đổi bg-[#15397F] text-white thành bg-black-soft text-light-cream */}
                                            1
                                        </div>
                                        <div className="font-semibold text-lg text-dark-brown font-serif"> {/* Đổi text-[#15397F] thành text-dark-brown, thêm font-serif */}
                                            Chọn salon
                                        </div>
                                    </div>
                                    <div
                                        className={`flex items-center bg-soft-gray h-11 rounded-lg px-3 ${ /* Đổi bg-gray-50 thành bg-soft-gray */
                                            errorStore
                                                ? "border-2 border-red-600"
                                                : ""
                                        } cursor-pointer  hover:text-light-cream transition duration-200 shadow-sm`} /* Đổi hover:bg-gray-100 thành  hover:text-light-cream */
                                        onClick={() => handleStepChange(1)}
                                    >
                                        <FaStore className="mr-3 w-4 h-4 text-dark-brown" /> {/* Đổi text-[#15397F] thành text-dark-brown */}
                                        <span className="text-sm text-dark-brown truncate w-full font-medium"> {/* Đổi text-gray-700 thành text-dark-brown */}
                                            {selectedStore
                                                ? selectedStore.storeName
                                                : "Chọn salon"}
                                        </span>
                                        <FaChevronRight className="w-3 h-3 ml-2 text-medium-gray" /> 
                                    </div>
                                    {errorStore && (
                                        <div className="text-red-600 font-bold text-xs mt-1">
                                            {errorStore}
                                        </div>
                                    )}
                                </div>

                                {/* Chọn dịch vụ */}
                                <div className="bg-white rounded-lg p-4 shadow-md">
                                    <div className="flex items-center mb-3">
                                        <div className="w-6 h-6 rounded-full bg-black-soft text-light-cream flex items-center justify-center mr-2 text-sm font-semibold shadow-md"> {/* Đổi bg-[#15397F] text-white thành bg-black-soft text-light-cream */}
                                            2
                                        </div>
                                        <div className="font-semibold text-lg text-dark-brown font-serif"> {/* Đổi text-[#15397F] thành text-dark-brown, thêm font-serif */}
                                            Chọn dịch vụ
                                        </div>
                                    </div>
                                    <div
                                        className={`flex items-center bg-soft-gray h-11 rounded-lg px-3 ${ /* Đổi bg-gray-50 thành bg-soft-gray */
                                            errorService
                                                ? "border-2 border-red-600"
                                                : ""
                                        } cursor-pointer  hover:text-light-cream transition duration-200 shadow-sm`} /* Đổi hover:bg-gray-100 thành  hover:text-light-cream */
                                        onClick={handleServiceClick}
                                    >
                                        <FaCut className="mr-3 w-4 h-4 text-dark-brown" /> {/* Đổi text-[#15397F] thành text-dark-brown */}
                                        <span className="text-sm text-dark-brown truncate w-full font-medium"> {/* Đổi text-gray-700 thành text-dark-brown */}
                                            Đã chọn {selectedServices.length} dịch vụ
                                        </span>
                                        <FaChevronRight className="w-3 h-3 ml-2 text-medium-gray" /> 
                                    </div>
                                    {errorService && (
                                        <div className="text-red-600 font-bold text-xs mt-1">
                                            {errorService}
                                        </div>
                                    )}
                                    {selectedServices.length > 0 && (
                                        <div className="mt-3 text-sm text-accent-gold font-medium space-y-0.5"> {/* Đổi text-green-600 thành text-accent-gold */}
                                            {selectedServices.map((service) => (
                                                <div key={service.storeServiceId}>
                                                    {service.service.serviceName}
                                                </div>
                                            ))}
                                            <div className="mt-1 font-bold text-dark-brown"> {/* Đổi text-gray-800 thành text-dark-brown */}
                                                Tổng số tiền:{" "}
                                                {selectedServices
                                                    .reduce(
                                                        (sum, s) => sum + s.price,
                                                        0
                                                    )
                                                    .toLocaleString()}{" "}
                                                VND
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Chọn stylist, ngày và thời gian */}
                                <div className="bg-white rounded-lg p-4 shadow-md">
                                    <div className="flex items-center mb-3">
                                        <div className="w-6 h-6 rounded-full bg-black-soft text-light-cream flex items-center justify-center mr-2 text-sm font-semibold shadow-md"> {/* Đổi bg-[#15397F] text-white thành bg-black-soft text-light-cream */}
                                            3
                                        </div>
                                        <div className="font-semibold text-lg text-dark-brown font-serif"> {/* Đổi text-[#15397F] thành text-dark-brown, thêm font-serif */}
                                            Chọn ngày, giờ & stylist
                                        </div>
                                    </div>

                                    {/* Stylist Selection with Carousel */}
                                    <div className="mb-4 relative">
                                        <div
                                            className="flex items-center bg-soft-gray h-11 rounded-lg px-3 shadow-sm cursor-pointer  hover:text-light-cream transition duration-200" /* Đổi bg-gray-50 thành bg-soft-gray, hover:bg-gray-100 thành  hover:text-light-cream */
                                            onClick={handleStylistClick}
                                        >
                                            <FaUser className="mr-3 w-4 h-4 text-dark-brown" /> {/* Đổi text-[#15397F] thành text-dark-brown */}
                                            <span className="text-sm text-dark-brown flex-1 font-medium"> {/* Đổi text-gray-700 thành text-dark-brown */}
                                                {selectedStylist
                                                    ? selectedStylist.fullName
                                                    : "Chọn stylist"}
                                            </span>
                                            {stylistOpen ? (
                                                <FaChevronUp className="w-3 h-3 text-medium-gray" /> 
                                            ) : (
                                                <FaChevronDown className="w-3 h-3 text-medium-gray" /> 
                                            )}
                                        </div>
                                        {stylistOpen && (
                                            <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg py-3">
                                                {stylists.length === 0 ? (
                                                    <div className="text-center text-medium-gray py-3 text-sm"> {/* Đổi text-gray-500 thành text-medium-gray */}
                                                        Không có stylist nào để hiển thị
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="relative flex items-center justify-center">
                                                            {/* Nút Previous */}
                                                            {showNavigationButtons && (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handlePrevStylistPage(); }}
                                                                    disabled={currentStylistPage === 0}
                                                                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-soft-gray  p-2 rounded-full z-20 disabled:opacity-50 disabled:cursor-not-allowed transition" /* Đổi màu nút */
                                                                >
                                                                    <FaArrowLeft className="w-4 h-4 text-dark-brown" /> {/* Đổi text-gray-700 thành text-dark-brown */}
                                                                </button>
                                                            )}

                                                            {/* Danh sách stylist với hiệu ứng cuộn mượt */}
                                                            <div className="overflow-hidden w-full px-10">
                                                                <div
                                                                    ref={carouselRef}
                                                                    className="flex transition-transform duration-500 ease-in-out"
                                                                    style={{ transform: `translateX(-${currentStylistPage * (100 / stylistsPerPage)}%)` }}
                                                                >
                                                                    {stylists.map((stylist) => (
                                                                        <div
                                                                            key={stylist.employeeId}
                                                                            className={`flex-shrink-0 relative flex flex-col rounded-lg overflow-hidden transition-all transform hover:scale-105 cursor-pointer mx-2 ${
                                                                                selectedStylist?.employeeId === stylist.employeeId
                                                                                    ? "ring-2 ring-accent-gold shadow-lg" /* Đổi ring-[#15397F] thành ring-accent-gold */
                                                                                    : "shadow-md"
                                                                            }`}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setSelectedStylist(stylist);
                                                                                setStylistOpen(false);
                                                                            }}
                                                                            style={{
                                                                                width: `calc(${100 / stylistsPerPage}% - 16px)`,
                                                                                aspectRatio: '3/4',
                                                                                minHeight: '160px',
                                                                            }}
                                                                        >
                                                                            {/* Ảnh stylist - nằm phủ kín thẻ */}
                                                                            <div className="absolute inset-0 w-full h-full">
                                                                                {stylist.avatarUrl ? (
                                                                                    <img
                                                                                        src={`${url.BASE_IMAGES}${stylist.avatarUrl}`}
                                                                                        alt={stylist.fullName}
                                                                                        className="w-full h-full object-cover object-center"
                                                                                    />
                                                                                ) : (
                                                                                    <div className="w-full h-full flex items-center justify-center bg-soft-gray text-medium-gray"> {/* Đổi bg-gray-300 text-gray-500 thành bg-soft-gray text-medium-gray */}
                                                                                        <FaUser className="text-6xl" />
                                                                                    </div>
                                                                                )}
                                                                            </div>

                                                                            {/* Overlay, tên stylist, và Rating */}
                                                                            <div className="absolute bottom-0 left-0 right-0 z-10 px-2 py-1 bg-gradient-to-t from-black-soft via-black-soft/70 to-transparent flex flex-col items-start text-light-cream"> {/* Đổi from-black via-black/70 thành from-black-soft via-black-soft/70, text-white thành text-light-cream */}
                                                                                <span className="font-bold text-base text-left w-full truncate">
                                                                                    {stylist.fullName}
                                                                                </span>
                                                                                {/* Hiển thị số sao đánh giá */}
                                                                                {stylist.totalReviews > 0 ? (
                                                                                    <div className="flex items-center text-xs mt-1">
                                                                                        <StarRating initialRating={stylist.averageRating} readOnly starSize={10} />
                                                                                        <span className="ml-1 text-light-cream/80">({stylist.totalReviews})</span> {/* Đổi text-white/80 thành text-light-cream/80 */}
                                                                                    </div>
                                                                                ) : (
                                                                                    <span className="text-xs text-medium-gray mt-1">Chưa có đánh giá</span> 
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Nút Next */}
                                                            {showNavigationButtons && (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleNextStylistPage(); }}
                                                                    disabled={currentStylistPage >= Math.ceil(stylists.length / stylistsPerPage) - 1}
                                                                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-soft-gray  p-2 rounded-full z-20 disabled:opacity-50 disabled:cursor-not-allowed transition" /* Đổi màu nút */
                                                                >
                                                                    <FaChevronRight className="w-4 h-4 text-dark-brown" /> {/* Đổi text-gray-700 thành text-dark-brown */}
                                                                </button>
                                                            )}
                                                        </div>
                                                        {showNavigationButtons && (
                                                            <div className="text-center text-xs text-medium-gray mt-2"> {/* Đổi text-gray-500 thành text-medium-gray */}
                                                                Trang {currentStylistPage + 1} / {Math.ceil(stylists.length / stylistsPerPage)}
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Chọn Ngày */}
                                    <div className="mb-4">
                                        <div
                                            className={`flex items-center bg-soft-gray h-11 rounded-lg px-3 shadow-sm ${ /* Đổi bg-gray-50 thành bg-soft-gray */
                                                errorDate
                                                    ? "border-2 border-red-600"
                                                    : ""
                                            } cursor-pointer  hover:text-light-cream transition duration-200`} /* Đổi hover:bg-gray-100 thành  hover:text-light-cream */
                                        >
                                            <FaCalendarAlt className="mr-3 w-4 h-4 text-dark-brown" /> {/* Đổi text-[#15397F] thành text-dark-brown */}
                                            <input
                                                type="date"
                                                value={selectedDate}
                                                onChange={(e) => {
                                                    setErrorDate(null);
                                                    setSelectedDate(e.target.value);
                                                }}
                                                className="w-full bg-transparent border-none focus:outline-none text-sm text-dark-brown font-medium" /* Đổi text-gray-700 thành text-dark-brown */
                                                min={
                                                    new Date()
                                                        .toISOString()
                                                        .split("T")[0]
                                                }
                                            />
                                        </div>
                                        {errorDate && (
                                            <div className="text-red-600 font-bold text-xs mt-1">
                                                {errorDate}
                                            </div>
                                        )}
                                    </div>

                                    {/* Chọn Khung Giờ */}
                                    <div className="mb-4">
                                        {loading && (
                                            <div className="text-center text-medium-gray py-3 font-medium text-sm"> {/* Đổi text-gray-500 thành text-medium-gray */}
                                                Đang tải khung giờ...
                                            </div>
                                        )}
                                        {!loading &&
                                            (!selectedStylist || !selectedDate) && (
                                                <div className="text-center text-medium-gray py-3 font-medium text-sm"> {/* Đổi text-gray-500 thành text-medium-gray */}
                                                    Vui lòng chọn stylist và ngày để xem
                                                    khung giờ
                                                </div>
                                            )}
                                        {!loading &&
                                            selectedStylist &&
                                            selectedDate &&
                                            availableSlots.length > 0 && (
                                                <div className="grid grid-cols-4 gap-1.5">
                                                    {availableSlots.map((slot) => {
                                                        const slotStartTime = new Date(
                                                            slot.startTime
                                                        ).getTime();
                                                        const isPast =
                                                            slotStartTime < currentTime;
                                                        const isBooked =
                                                                !slot.isAvailable;
                                                        const isDisabled =
                                                            isPast || isBooked;
                                                        const slotLabel = new Date(
                                                            slot.startTime
                                                        )
                                                            .toLocaleTimeString(
                                                                "vi-VN",
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )
                                                            .replace(":", "H");
                                                        return (
                                                            <button
                                                                key={`${slot.timeSlotId}-${slot.startTime}`}
                                                                className={`py-1.5 px-2 rounded-md text-xs font-semibold transition duration-200 shadow-sm ${
                                                                    isDisabled
                                                                        ? "bg-soft-gray cursor-not-allowed text-medium-gray" /* Đổi màu disabled */
                                                                        : selectedSlot?.startTime ===
                                                                            slot.startTime
                                                                          ? "bg-dark-brown text-light-cream shadow-md" /* Đổi màu selected */
                                                                          : "bg-white text-dark-brown shadow-sm hover:bg-soft-gray" /* Đổi màu default và hover */
                                                                }`}
                                                                onClick={() =>
                                                                    !isDisabled &&
                                                                    setSelectedSlot(
                                                                        slot
                                                                    )
                                                                }
                                                                disabled={isDisabled}
                                                            >
                                                                {slotLabel}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        {!loading &&
                                            selectedStylist &&
                                            selectedDate &&
                                            availableSlots.length === 0 && (
                                                <div className="text-center text-medium-gray py-3 font-medium text-sm"> {/* Đổi text-gray-500 thành text-medium-gray */}
                                                    Không có khung giờ trống cho stylist
                                                    này vào ngày đã chọn
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>

                            {/* Nút xác nhận - Đặt nó bên trong phần form để cuộn theo */}
                            <div className="mt-8 p-4 bg-white rounded-b-xl shadow-lg -mx-6 -mb-8">
                                <button
                                    className={`w-full py-3 rounded-lg text-light-cream font-semibold text-lg uppercase tracking-wide transition duration-200 shadow-md ${ /* Đổi text-white */
                                        isButtonEnabled
                                            ? "bg-black-soft hover:bg-dark-brown hover:shadow-lg" /* Đổi bg-[#15397F] hover:bg-[#1e4bb8] */
                                            : "bg-soft-gray cursor-not-allowed text-medium-gray" /* Đổi bg-gray-400, thêm text */
                                    }`}
                                    onClick={handleConfirm}
                                    disabled={!isButtonEnabled}
                                >
                                    Chốt giờ cắt
                                </button>
                            </div>
                        </div>

                        {/* Sidebar Tóm tắt đơn hàng (cột phải) */}
                        <div className="lg:w-1/3 bg-white px-6 py-8 rounded-xl shadow-xl h-fit sticky top-20">
                            <h3 className="text-xl font-bold text-dark-brown mb-5 font-serif">Tóm tắt lịch hẹn</h3> {/* Đổi text-[#15397F] thành text-dark-brown, thêm font-serif */}
                            <div className="space-y-4">
                                {selectedStore && (
                                    <div className="text-sm text-medium-gray"> {/* Đổi text-gray-700 thành text-medium-gray */}
                                        <p className="font-semibold mb-1">Salon đã chọn:</p>
                                        <p className="ml-2">{selectedStore.storeName}</p>
                                    </div>
                                )}
                                {selectedServices.length > 0 && (
                                    <div className="text-sm text-medium-gray"> {/* Đổi text-gray-700 thành text-medium-gray */}
                                        <p className="font-semibold mb-1">Dịch vụ đã chọn:</p>
                                        <ul className="list-none list-inside ml-2 space-y-0.5">
                                            {selectedServices.map(service => (
                                                <li key={service.storeServiceId}>
                                                    {service.service.serviceName} ({service.service.durationMinutes} phút) - {service.price.toLocaleString()} VND
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {selectedStylist && (
                                    <div className="text-sm text-medium-gray"> {/* Đổi text-gray-700 thành text-medium-gray */}
                                        <p className="font-semibold mb-1">Stylist:</p>
                                        <p className="ml-2">{selectedStylist.fullName}</p>
                                    </div>
                                )}
                                {selectedDate && (
                                    <div className="text-sm text-medium-gray"> {/* Đổi text-gray-700 thành text-medium-gray */}
                                        <p className="font-semibold mb-1">Ngày hẹn:</p>
                                        <p className="ml-2">{new Date(selectedDate).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                )}
                                {selectedSlot && (
                                    <div className="text-sm text-medium-gray"> {/* Đổi text-gray-700 thành text-medium-gray */}
                                        <p className="font-semibold mb-1">Thời gian:</p>
                                        <p className="ml-2">
                                            {new Date(selectedSlot.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }).replace(':', 'H')} -
                                            {new Date(selectedSlot.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }).replace(':', 'H')}
                                        </p>
                                    </div>
                                )}
                                <div className="text-lg font-bold text-dark-brown flex justify-between pt-4 border-t border-soft-gray"> {/* Đổi text-[#15397F] thành text-dark-brown, border-gray-200 thành border-soft-gray */}
                                    <span>Tổng cộng:</span>
                                    <span className="text-accent-gold"> {/* Đổi text-green-700 thành text-accent-gold */}
                                        {selectedServices
                                            .reduce((sum, s) => sum + s.price, 0)
                                            .toLocaleString()}{" "}
                                        VND
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {step === 1 && (
                <SelectStore
                    salonId={localStorage.getItem("storeId") || "0"}
                    phone={phone}
                    setStep={setStep}
                />
            )}

            {step === 2 && (
                <SelectService
                    salonId={localStorage.getItem("storeId") || "0"}
                    phone={phone}
                    setSelectedServices={setSelectedServices}
                    setStep={setStep}
                />
            )}

             {/* Nút CTA cố định - GIỮ NGUYÊN HOẶC XÓA TÙY Ý BẠN (đã có trong Home.tsx, nếu muốn dùng 1 cái duy nhất thì nên để trong Layout.tsx) */}
            {/* Nếu bạn muốn nút này ở đây, hãy chỉnh màu sắc cho nó */}
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
}