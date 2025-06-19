import { useState, useEffect, useRef } from "react"; // Import useRef
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    FaStore,
    FaCut,
    FaUser,
    FaCalendarAlt,
    FaChevronRight,
    FaChevronDown,
    FaChevronUp,
    FaArrowLeft,
    // FaStar, // Không cần import FaStar nếu không dùng rating
} from "react-icons/fa";
import { SelectStore } from "./SelectStore";
import { SelectService } from "./SelectService";
import url from "../../../services/url";
import api from "../../../services/api";
import routes from "../../../config/routes";

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

    // --- Các state mới cho slideshow stylist ---
    const [currentStylistPage, setCurrentStylistPage] = useState(0);
    const stylistsPerPage = 3; // 3 item trên một hàng
    const carouselRef = useRef<HTMLDivElement>(null); // Ref cho container của các stylist
    // --- Hết state mới ---

    // Reset storeId and load store when entering the page
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

    // Clear localStorage when leaving the page
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

    // Check login and fetch user profile
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

    // Load stylists
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
                // Hàm xáo trộn mảng (Fisher-Yates shuffle)
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

                // Ánh xạ dữ liệu stylist và xáo trộn
                let mappedStylists = response.data.map((stylist: any) => ({
                    employeeId: stylist.employeeId,
                    fullName: stylist.fullName,
                    email: stylist.email,
                    phoneNumber: stylist.phoneNumber,
                    avatarUrl: stylist.avatarUrl,
                }));
                setStylists(shuffleArray(mappedStylists)); // Sắp xếp ngẫu nhiên ngay khi fetch
            } catch (err: any) {
                console.error("Không thể tải danh sách stylist:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStylists();
    }, [selectedStore, selectedServices]);

    // Load time slots
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

    // Load service details
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
        // Reset về trang đầu tiên khi mở lại danh sách stylist
        setCurrentStylistPage(0); // Reset page to 0 on open
    };

    // Hàm để xử lý chuyển trang stylist
    const handleNextStylistPage = () => {
        setCurrentStylistPage((prevPage) =>
            Math.min(prevPage + 1, Math.ceil(stylists.length / stylistsPerPage) - 1)
        );
    };

    const handlePrevStylistPage = () => {
        setCurrentStylistPage((prevPage) => Math.max(prevPage - 1, 0));
    };

    // Tính toán các stylist để hiển thị trên trang hiện tại
    // Không cần slice ở đây vì chúng ta sẽ dịch chuyển toàn bộ container
    // const visibleStylists = stylists.slice(startIndex, startIndex + stylistsPerPage);

    const showNavigationButtons = stylists.length > stylistsPerPage; // Chỉ hiển thị nút khi stylist nhiều hơn số item trên 1 trang

    return (
        <div className="w-full max-w-full mx-auto bg-gray-100 min-h-screen flex flex-col font-sans">
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
                            <span className="text-white text-4xl md:text-5xl font-bold tracking-tight text-shadow-lg">
                                Đặt lịch giữ chỗ
                            </span>
                        </div>
                    </div>

                    {/* Container chính cho form và sidebar */}
                    <div className="relative z-10 -mt-16 md:-mt-20 max-w-5xl mx-auto w-[calc(100%-2rem)] flex flex-col lg:flex-row gap-6">
                        {/* Phần form chính (cột trái) */}
                        <div className="lg:w-2/3 bg-white px-6 py-8 rounded-xl shadow-xl flex-grow">
                            <div className="space-y-4">
                                {/* Chọn Salon */}
                                <div className="bg-white rounded-lg p-4 shadow-md">
                                    <div className="flex items-center mb-3">
                                        <div className="w-6 h-6 rounded-full bg-[#15397F] text-white flex items-center justify-center mr-2 text-sm font-semibold shadow-md">
                                            1
                                        </div>
                                        <div className="font-semibold text-lg text-[#15397F]">
                                            Chọn salon
                                        </div>
                                    </div>
                                    <div
                                        className={`flex items-center bg-gray-50 h-11 rounded-lg px-3 ${
                                            errorStore
                                                ? "border-2 border-red-600"
                                                : ""
                                        } cursor-pointer hover:bg-gray-100 transition duration-200 shadow-sm`}
                                        onClick={() => handleStepChange(1)}
                                    >
                                        <FaStore className="mr-3 w-4 h-4 text-[#15397F]" />
                                        <span className="text-sm text-gray-700 truncate w-full font-medium">
                                            {selectedStore
                                                ? selectedStore.storeName
                                                : "Chọn salon"}
                                        </span>
                                        <FaChevronRight className="w-3 h-3 ml-2 text-gray-400" />
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
                                        <div className="w-6 h-6 rounded-full bg-[#15397F] text-white flex items-center justify-center mr-2 text-sm font-semibold shadow-md">
                                            2
                                        </div>
                                        <div className="font-semibold text-lg text-[#15397F]">
                                            Chọn dịch vụ
                                        </div>
                                    </div>
                                    <div
                                        className={`flex items-center bg-gray-50 h-11 rounded-lg px-3 ${
                                            errorService
                                                ? "border-2 border-red-600"
                                                : ""
                                        } cursor-pointer hover:bg-gray-100 transition duration-200 shadow-sm`}
                                        onClick={handleServiceClick}
                                    >
                                        <FaCut className="mr-3 w-4 h-4 text-[#15397F]" />
                                        <span className="text-sm text-gray-700 truncate w-full font-medium">
                                            Đã chọn {selectedServices.length} dịch vụ
                                        </span>
                                        <FaChevronRight className="w-3 h-3 ml-2 text-gray-400" />
                                    </div>
                                    {errorService && (
                                        <div className="text-red-600 font-bold text-xs mt-1">
                                            {errorService}
                                        </div>
                                    )}
                                    {selectedServices.length > 0 && (
                                        <div className="mt-3 text-sm text-green-600 font-medium space-y-0.5">
                                            {selectedServices.map((service) => (
                                                <div key={service.storeServiceId}>
                                                    {service.service.serviceName}
                                                </div>
                                            ))}
                                            <div className="mt-1 font-bold text-gray-800">
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
                                        <div className="w-6 h-6 rounded-full bg-[#15397F] text-white flex items-center justify-center mr-2 text-sm font-semibold shadow-md">
                                            3
                                        </div>
                                        <div className="font-semibold text-lg text-[#15397F]">
                                            Chọn ngày, giờ & stylist
                                        </div>
                                    </div>

                                    {/* Stylist Selection with Carousel */}
                                    <div className="mb-4 relative">
                                        <div
                                            className="flex items-center bg-gray-50 h-11 rounded-lg px-3 shadow-sm cursor-pointer hover:bg-gray-100 transition duration-200"
                                            onClick={handleStylistClick}
                                        >
                                            <FaUser className="mr-3 w-4 h-4 text-[#15397F]" />
                                            <span className="text-sm text-gray-700 flex-1 font-medium">
                                                {selectedStylist
                                                    ? selectedStylist.fullName
                                                    : "Chọn stylist"}
                                            </span>
                                            {stylistOpen ? (
                                                <FaChevronUp className="w-3 h-3 text-gray-400" />
                                            ) : (
                                                <FaChevronDown className="w-3 h-3 text-gray-400" />
                                            )}
                                        </div>
                                        {stylistOpen && (
                                            <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg py-3">
                                                {stylists.length === 0 ? (
                                                    <div className="text-center text-gray-500 py-3 text-sm">
                                                        Không có stylist nào để hiển thị
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="relative flex items-center justify-center">
                                                            {/* Nút Previous */}
                                                            {showNavigationButtons && ( // Chỉ hiển thị nút khi cần thiết
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handlePrevStylistPage(); }}
                                                                    disabled={currentStylistPage === 0}
                                                                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full z-20 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                                >
                                                                    <FaArrowLeft className="w-4 h-4 text-gray-700" />
                                                                </button>
                                                            )}

                                                            {/* Danh sách stylist với hiệu ứng cuộn mượt */}
                                                            <div className="overflow-hidden w-full px-10"> {/* Container để ẩn các stylist không hiển thị */}
                                                                <div
                                                                    ref={carouselRef}
                                                                    className="flex transition-transform duration-500 ease-in-out" // Hiệu ứng chuyển động
                                                                    style={{ transform: `translateX(-${currentStylistPage * (100 / stylistsPerPage)}%)` }} // Dịch chuyển
                                                                >
                                                                    {stylists.map((stylist) => ( // Render TẤT CẢ stylist
                                                                        <div
                                                                            key={stylist.employeeId}
                                                                            className={`flex-shrink-0 relative flex flex-col rounded-lg overflow-hidden transition-all transform hover:scale-105 cursor-pointer mx-2 ${ // mx-2 để tạo khoảng cách giữa các item
                                                                                selectedStylist?.employeeId === stylist.employeeId
                                                                                    ? "ring-2 ring-[#15397F] shadow-lg"
                                                                                    : "shadow-md"
                                                                            }`}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setSelectedStylist(stylist);
                                                                                setStylistOpen(false);
                                                                            }}
                                                                            style={{
                                                                                width: `calc(${100 / stylistsPerPage}% - 16px)`, // Tính toán width để 3 item hiển thị, trừ đi gap
                                                                                aspectRatio: '3/4', // Tỷ lệ hình chữ nhật đứng (rộng/cao)
                                                                                minHeight: '160px', // Đảm bảo kích thước tối thiểu
                                                                            }}
                                                                        >
                                                                            {/* Ảnh stylist - nằm phủ kín thẻ */}
                                                                            <div className="absolute inset-0 w-full h-full">
                                                                                {stylist.avatarUrl ? (
                                                                                    <img
                                                                                        src={stylist.avatarUrl}
                                                                                        alt={stylist.fullName}
                                                                                        className="w-full h-full object-cover object-center" // object-center để căn giữa ảnh
                                                                                    />
                                                                                ) : (
                                                                                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                                                                                        <FaUser className="text-6xl" />
                                                                                    </div>
                                                                                )}
                                                                            </div>

                                                                            {/* Overlay và tên stylist */}
                                                                            <div className="absolute bottom-0 left-0 right-0 z-10 px-2 py-1 bg-gradient-to-t from-black via-black/70 to-transparent flex items-start text-white">
                                                                                <span className="font-bold text-base text-left w-full truncate">
                                                                                    {stylist.fullName}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Nút Next */}
                                                            {showNavigationButtons && ( // Chỉ hiển thị nút khi cần thiết
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleNextStylistPage(); }}
                                                                    disabled={currentStylistPage >= Math.ceil(stylists.length / stylistsPerPage) - 1}
                                                                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full z-20 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                                >
                                                                    <FaChevronRight className="w-4 h-4 text-gray-700" />
                                                                </button>
                                                            )}
                                                        </div>
                                                        {showNavigationButtons && ( // Chỉ hiển thị chỉ số trang khi có nút điều hướng
                                                            <div className="text-center text-xs text-gray-500 mt-2">
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
                                            className={`flex items-center bg-gray-50 h-11 rounded-lg px-3 shadow-sm ${
                                                errorDate
                                                    ? "border-2 border-red-600"
                                                    : ""
                                            } cursor-pointer hover:bg-gray-100 transition duration-200`}
                                        >
                                            <FaCalendarAlt className="mr-3 w-4 h-4 text-[#15397F]" />
                                            <input
                                                type="date"
                                                value={selectedDate}
                                                onChange={(e) => {
                                                    setErrorDate(null);
                                                    setSelectedDate(e.target.value);
                                                }}
                                                className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-700 font-medium"
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
                                            <div className="text-center text-gray-500 py-3 font-medium text-sm">
                                                Đang tải khung giờ...
                                            </div>
                                        )}
                                        {!loading &&
                                            (!selectedStylist || !selectedDate) && (
                                                <div className="text-center text-gray-500 py-3 font-medium text-sm">
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
                                                                        ? "bg-gray-200 cursor-not-allowed text-gray-400"
                                                                        : selectedSlot?.startTime ===
                                                                            slot.startTime
                                                                          ? "bg-[#15397F] text-white shadow-md"
                                                                          : "bg-white text-gray-800 shadow-sm hover:bg-gray-100"
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
                                                <div className="text-center text-gray-500 py-3 font-medium text-sm">
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
                                    className={`w-full py-3 rounded-lg text-white font-semibold text-lg uppercase tracking-wide transition duration-200 shadow-md ${
                                        isButtonEnabled
                                            ? "bg-[#15397F] hover:bg-[#1e4bb8] hover:shadow-lg"
                                            : "bg-gray-400 cursor-not-allowed"
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
                            <h3 className="text-xl font-bold text-[#15397F] mb-5">Tóm tắt lịch hẹn</h3>
                            <div className="space-y-4">
                                {selectedStore && (
                                    <div className="text-sm text-gray-700">
                                        <p className="font-semibold mb-1">Salon đã chọn:</p>
                                        <p className="ml-2">{selectedStore.storeName}</p>
                                    </div>
                                )}
                                {selectedServices.length > 0 && (
                                    <div className="text-sm text-gray-700">
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
                                    <div className="text-sm text-gray-700">
                                        <p className="font-semibold mb-1">Stylist:</p>
                                        <p className="ml-2">{selectedStylist.fullName}</p>
                                    </div>
                                )}
                                {selectedDate && (
                                    <div className="text-sm text-gray-700">
                                        <p className="font-semibold mb-1">Ngày hẹn:</p>
                                        <p className="ml-2">{new Date(selectedDate).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                )}
                                {selectedSlot && (
                                    <div className="text-sm text-gray-700">
                                        <p className="font-semibold mb-1">Thời gian:</p>
                                        <p className="ml-2">
                                            {new Date(selectedSlot.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }).replace(':', 'H')} -
                                            {new Date(selectedSlot.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }).replace(':', 'H')}
                                        </p>
                                    </div>
                                )}
                                <div className="text-lg font-bold text-[#15397F] flex justify-between pt-4 border-t border-gray-200">
                                    <span>Tổng cộng:</span>
                                    <span className="text-green-700">
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
        </div>
    );
}