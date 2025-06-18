import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    FaStore,
    FaCut,
    FaUser,
    FaCalendarAlt,
    FaChevronRight,
    FaChevronDown,
    FaChevronUp,
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
    storeServiceId: number;
    service: {
        serviceName: string;
        durationMinutes: number;
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

    // Reset storeId and load store when entering the page
    useEffect(() => {
        // Prioritize salonId from query parameters
        const salonId = searchParams.get("salonId");
        // Clear localStorage storeId unless salonId is provided
        if (!salonId) {
            localStorage.removeItem("storeId");
            setSelectedStore(null);
        }

        const isFullySelected =
            localStorage.getItem("isFullySelected") === "true";
        const storeId = salonId || "0"; // Only use salonId from query params

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
            // Reset all data if no storeId and not fully selected
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
                const mappedStylists = response.data.map((stylist: any) => ({
                    employeeId: stylist.employeeId,
                    fullName: stylist.fullName,
                    email: stylist.email,
                    phoneNumber: stylist.phoneNumber,
                    avatarUrl: stylist.avatarUrl,
                }));
                setStylists(mappedStylists);
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
    };

    return (
        <div className="w-full max-w-full md:max-w-5xl mx-auto bg-gray-100 min-h-screen flex flex-col font-sans">
            {step === 0 && (
                <div className="flex justify-center items-center py-4 px-4 shadow-sm bg-white">
                    <span className="text-xl font-semibold text-[#15397F] tracking-tight">
                        Đặt lịch giữ chỗ
                    </span>
                </div>
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

            <div className="bg-white px-6">
                {step === 0 && (
                    <div className="space-y-6">
                        {/* Chọn Salon */}
                        <div>
                            <div className="flex items-center mb-4">
                                <div className="w-6 h-6 rounded-full bg-[#15397F] text-white flex items-center justify-center mr-2 shadow-md">
                                    1
                                </div>
                                <div className="font-semibold text-lg text-[#15397F]">
                                    Chọn salon
                                </div>
                            </div>
                            <div
                                className={`flex items-center bg-gray-50 h-12 rounded-lg px-4 ${
                                    errorStore
                                        ? "border-2 border-red-600"
                                        : "border border-gray-200"
                                } cursor-pointer hover:bg-gray-100 transition duration-200 shadow-sm`}
                                onClick={() => handleStepChange(1)}
                            >
                                <FaStore className="mr-3 w-5 h-5 text-[#15397F]" />
                                <span className="text-sm text-gray-600 truncate w-full font-medium">
                                    {selectedStore
                                        ? selectedStore.storeName
                                        : "Chọn salon"}
                                </span>
                                <FaChevronRight className="w-4 h-4 ml-2 text-gray-400" />
                            </div>
                            {errorStore && (
                                <div className="text-red-600 font-bold text-sm mt-1">
                                    {errorStore}
                                </div>
                            )}
                        </div>

                        {/* Chọn dịch vụ */}
                        <div>
                            <div className="flex items-center mb-4">
                                <div className="w-6 h-6 rounded-full bg-[#15397F] text-white flex items-center justify-center mr-2 shadow-md">
                                    2
                                </div>
                                <div className="font-semibold text-lg text-[#15397F]">
                                    Chọn dịch vụ
                                </div>
                            </div>
                            <div
                                className={`flex items-center bg-gray-50 h-12 rounded-lg px-4 ${
                                    errorService
                                        ? "border-2 border-red-600"
                                        : "border border-gray-200"
                                } cursor-pointer hover:bg-gray-100 transition duration-200 shadow-sm`}
                                onClick={handleServiceClick}
                            >
                                <FaCut className="mr-3 w-5 h-5 text-[#15397F]" />
                                <span className="text-sm text-gray-600 truncate w-full font-medium">
                                    Đã chọn {selectedServices.length} dịch vụ
                                </span>
                                <FaChevronRight className="w-4 h-4 ml-2 text-gray-400" />
                            </div>
                            {errorService && (
                                <div className="text-red-600 font-bold text-sm mt-1">
                                    {errorService}
                                </div>
                            )}
                            {selectedServices.length > 0 && (
                                <div className="mt-3 text-sm text-green-600 font-medium">
                                    {selectedServices.map((service) => (
                                        <div key={service.storeServiceId}>
                                            {service.service.serviceName}
                                        </div>
                                    ))}
                                    <div className="mt-1">
                                        Tổng số tiền cần thanh toán:{" "}
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
                        <div>
                            <div className="flex items-center mb-4">
                                <div className="w-6 h-6 rounded-full bg-[#15397F] text-white flex items-center justify-center mr-2 shadow-md">
                                    3
                                </div>
                                <div className="font-semibold text-lg text-[#15397F]">
                                    Chọn ngày, giờ & stylist
                                </div>
                            </div>

                            {/* Stylist Dropdown */}
                            <div className="mb-6 relative">
                                <div
                                    className="flex items-center bg-gray-50 h-12 rounded-lg px-4 border border-gray-200 cursor-pointer hover:bg-gray-100 transition duration-200 shadow-sm"
                                    onClick={handleStylistClick}
                                >
                                    <FaUser className="mr-3 w-5 h-5 text-[#15397F]" />
                                    <span className="text-sm text-gray-600 flex-1 font-medium">
                                        {selectedStylist
                                            ? selectedStylist.fullName
                                            : "Chọn stylist"}
                                    </span>
                                    {stylistOpen ? (
                                        <FaChevronUp className="w-4 h-4 text-gray-400" />
                                    ) : (
                                        <FaChevronDown className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                                {stylistOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {stylists.length === 0 ? (
                                            <div className="text-center text-gray-500 py-4">
                                                Không có stylist nào để hiển thị
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-3 gap-2 p-3">
                                                {stylists.map((stylist) => (
                                                    <div
                                                        key={stylist.employeeId}
                                                        className="flex flex-col items-center cursor-pointer p-2 hover:bg-gray-100 rounded-lg"
                                                        onClick={() => {
                                                            setSelectedStylist(
                                                                stylist
                                                            );
                                                            setStylistOpen(
                                                                false
                                                            );
                                                        }}
                                                    >
                                                        <div className="w-20 h-24 bg-gray-300 rounded-lg overflow-hidden mb-2">
                                                            {stylist.avatarUrl ? (
                                                                <img
                                                                    src={
                                                                        stylist.avatarUrl
                                                                    }
                                                                    alt={
                                                                        stylist.fullName
                                                                    }
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <FaUser className="text-gray-600 text-2xl" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-sm font-medium text-gray-800 text-center">
                                                            {stylist.fullName}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Chọn Ngày */}
                            <div className="mb-6">
                                <div
                                    className={`flex items-center bg-gray-50 h-12 rounded-lg px-4 border ${
                                        errorDate
                                            ? "border-2 border-red-600"
                                            : "border-gray-200"
                                    } cursor-pointer hover:bg-gray-100 transition duration-200 shadow-sm`}
                                >
                                    <FaCalendarAlt className="mr-3 w-5 h-5 text-[#15397F]" />
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => {
                                            setErrorDate(null);
                                            setSelectedDate(e.target.value);
                                        }}
                                        className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-600 font-medium"
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                    />
                                </div>
                                {errorDate && (
                                    <div className="text-red-600 font-bold text-sm mt-1">
                                        {errorDate}
                                    </div>
                                )}
                            </div>

                            {/* Chọn Khung Giờ */}
                            <div className="mb-6">
                                {loading && (
                                    <div className="text-center text-gray-500 py-4 font-medium">
                                        Đang tải khung giờ...
                                    </div>
                                )}
                                {!loading &&
                                    (!selectedStylist || !selectedDate) && (
                                        <div className="text-center text-gray-500 py-4 font-medium">
                                            Vui lòng chọn stylist và ngày để xem
                                            khung giờ
                                        </div>
                                    )}
                                {!loading &&
                                    selectedStylist &&
                                    selectedDate &&
                                    availableSlots.length > 0 && (
                                        <div className="grid grid-cols-4 gap-2">
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
                                                        className={`py-2 px-2 border rounded-lg text-sm font-semibold transition duration-200 shadow-sm ${
                                                            isDisabled
                                                                ? "bg-gray-200 cursor-not-allowed text-gray-400"
                                                                : selectedSlot?.startTime ===
                                                                    slot.startTime
                                                                  ? "bg-[#15397F] text-white shadow-md"
                                                                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100 hover:shadow-md"
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
                                        <div className="text-center text-gray-500 py-4 font-medium">
                                            Không có khung giờ trống cho stylist
                                            này vào ngày đã chọn
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                )}

                {step === 0 && (
                    <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200 shadow-lg">
                        <button
                            className={`w-full py-3 rounded-lg text-white font-semibold text-lg uppercase tracking-wide transition duration-200 shadow-md ${
                                isButtonEnabled
                                    ? "bg-[#15397F] hover:bg-[1e4bb8] hover:shadow-lg"
                                    : "bg-shine-primary cursor-not-allowed"
                            }`}
                            onClick={handleConfirm}
                            disabled={!isButtonEnabled}
                        >
                            Chốt giờ cắt
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
