// src/pages/client/booking/BookingHistory.tsx
import { useState, useEffect } from "react";
import api from "../../../services/api";
import url from "../../../services/url";
import ReviewFormModal from "../../../components/ReviewFormModal";
import { useNavigate } from 'react-router-dom';
import routes from '../../../config/routes';

// Import các icons cần thiết từ react-icons
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';


// Cập nhật interface Appointment để khớp với AppointmentResponse từ BE
interface Appointment {
    appointmentId: number;
    slug: string;
    storeId: number; // Từ AppointmentResponse.StoreServiceDetail
    storeName: string;
    serviceName: string[]; // Từ AppointmentResponse.StoreServiceDetail
    employeeId: number; // Từ AppointmentResponse.EmployeeDetail
    employeeName: string;
    storeServiceId: number; // Từ AppointmentResponse.StoreServiceDetail
    startTime: string;
    endTime: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    hasReviewed?: boolean;
}

export function BookingHistory() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [confirmId, setConfirmId] = useState<number | null>(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedAppointmentForReview, setSelectedAppointmentForReview] = useState<Appointment | null>(null);

    const navigate = useNavigate();

    // Helper function to format date and time
    const formatDateTime = (isoString: string) => {
        return new Date(isoString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    // Helper function to get status display with icon
    const getStatusDisplay = (status: string) => {
        switch (status) {
            case "CONFIRMED":
                return { text: "Đã xác nhận", bgColor: "#e0f7fa", textColor: "#00796b", icon: <FaCheckCircle className="mr-1" /> };
            case "PENDING":
                return { text: "Chờ xác nhận", bgColor: "#fff3cd", textColor: "#b26a00", icon: <FaHourglassHalf className="mr-1" /> };
            case "CANCELED": // Changed from CANCELLED to CANCELED to match updated status
                return { text: "Đã hủy", bgColor: "#fdecea", textColor: "#c62828", icon: <FaTimesCircle className="mr-1" /> };
            case "COMPLETED":
                return { text: "Đã hoàn thành", bgColor: "#d4edda", textColor: "#155724", icon: <FaCheckCircle className="mr-1" /> };
            default:
                return { text: status, bgColor: "#f3f4f6", textColor: "#374151", icon: <FaInfoCircle className="mr-1" /> };
        }
    };

    const getUserEmail = async () => {
        try {
            const response = await api.get(url.USER.PROFILE);
            return response.data.email;
        } catch (err) {
            throw new Error("Không thể lấy thông tin người dùng.");
        }
    };

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const userEmail = await getUserEmail();
            const response = await api.get(
                url.APPOINTMENT.GET_BY_USER.replace("{email}", userEmail)
            );

            const processedAppointments: Appointment[] = [];
            for (const item of response.data) {
                // Ensure serviceName is always an array of strings
                const serviceNamesArray = Array.isArray(item.storeService?.serviceName)
                    ? item.storeService.serviceName
                    : (item.storeService?.serviceName ? [item.storeService.serviceName] : []);

                // Fetch review status
                let hasReviewed = false;
                try {
                    const hasReviewedResponse = await api.get(`${url.REVIEW.EXISTS_BY_APPOINTMENT_ID}?appointmentId=${item.appointmentId}`);
                    hasReviewed = hasReviewedResponse.data;
                } catch (reviewErr) {
                    console.warn(`Could not fetch review status for appointment ${item.appointmentId}:`, reviewErr);
                    // Continue even if review status can't be fetched
                }

                processedAppointments.push({
                    appointmentId: item.appointmentId,
                    slug: item.slug,
                    storeId: item.storeService?.storeId || 0,
                    storeName: item.storeService?.storeName || "Unknown Store",
                    serviceName: serviceNamesArray,
                    employeeId: item.employee?.employeeId || 0,
                    employeeName: item.employee?.fullName || "Unknown Employee",
                    storeServiceId: item.storeService?.storeServiceId || 0,
                    startTime: item.startTime,
                    endTime: item.endTime,
                    status: item.status,
                    totalAmount: item.invoice?.totalAmount || 0,
                    createdAt: item.createdAt,
                    hasReviewed: hasReviewed,
                });
            }

            const sortedAppointments = processedAppointments.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            );
            setAppointments(sortedAppointments);
            setLoading(false);
        } catch (err: any) {
            console.error("Error fetching appointment history:", err);
            setError(
                err.response?.data?.message || "Không thể tải lịch sử đặt lịch."
            );
            setLoading(false);
        }
    };

    const handleCancelClick = (appointmentId: number) => {
        setConfirmId(appointmentId);
    };

    const handleConfirmCancel = async () => {
        if (confirmId === null) return;
        try {
            await api.patch(
                url.APPOINTMENT.CANCEL.replace("{id}", confirmId.toString())
            );
            setAppointments((prev) =>
                prev.map((appt) =>
                    appt.appointmentId === confirmId
                        ? { ...appt, status: "CANCELED" } // Ensure status is 'CANCELED' not 'CANCELLED' if BE sends 'CANCELED'
                        : appt
                )
            );
            setToast("Hủy lịch hẹn thành công!");
        } catch (err: any) {
            console.error("Error canceling appointment:", err);
            setError(err.response?.data?.message || "Không thể hủy lịch hẹn.");
        } finally {
            setConfirmId(null);
            setTimeout(() => setToast(null), 3000);
        }
    };

    const handleCancelModal = () => setConfirmId(null);

    const handleOpenReviewModal = (appointment: Appointment) => {
        setSelectedAppointmentForReview(appointment);
        setIsReviewModalOpen(true);
    };

    const handleCloseReviewModal = () => {
        setIsReviewModalOpen(false);
        setSelectedAppointmentForReview(null);
        // Đã bỏ fetchHistory() ở đây để tránh refresh toàn trang
        // fetchHistory(); // Xóa hoặc comment dòng này
    };

    const handleReviewSubmitted = (success: boolean) => {
        if (success) {
           
            // Cập nhật trạng thái hasReviewed trực tiếp trong state
            if (selectedAppointmentForReview) {
                setAppointments(prevAppointments =>
                    prevAppointments.map(appt =>
                        appt.appointmentId === selectedAppointmentForReview.appointmentId
                            ? { ...appt, hasReviewed: true }
                            : appt
                    )
                );
            }
        } else {
            // setToast("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.");
        }
        handleCloseReviewModal(); // Đóng modal, không gây refresh toàn trang nữa
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <div>
            {/* Banner đầu trang giống Location.tsx */}
            <div
                className="relative bg-cover bg-center h-64 md:h-80 flex items-center justify-center overflow-hidden w-full"
                style={{ backgroundImage: `url('https://static.booksy.com/static/live/covers/barbers.jpg')` }}
            >
                <div className="absolute inset-0 bg-black opacity-40 backdrop-filter backdrop-blur-sm"></div>
                <h1 className="relative text-white text-4xl md:text-5xl font-bold z-10 text-center px-4">
                    Lịch sử đặt lịch của bạn
                </h1>
            </div>

            {/* Toast notification */}
            {toast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50 animate-fade-in">
                    {toast}
                </div>
            )}
            {/* Modal xác nhận hủy */}
            {confirmId !== null && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs text-center">
                        <p className="mb-6 text-base text-gray-800 font-semibold">
                            Bạn có chắc muốn hủy lịch hẹn này?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-semibold transition"
                                onClick={handleCancelModal}
                            >
                                Không
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold transition"
                                onClick={handleConfirmCancel}
                            >
                                Hủy lịch
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal đánh giá */}
            {isReviewModalOpen && selectedAppointmentForReview && (
                <ReviewFormModal
                    isOpen={isReviewModalOpen}
                    onClose={handleCloseReviewModal}
                    appointment={selectedAppointmentForReview}
                    onReviewSubmitted={handleReviewSubmitted}
                />
            )}

            <div className="container mx-auto max-w-5xl -mt-20 relative z-10 px-4 mb-12">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                    <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
                        Chi tiết lịch sử đặt lịch
                    </h2>
                    {loading ? (
                        <div className="text-center text-gray-500 py-8">Đang tải lịch sử đặt lịch...</div>
                    ) : error ? (
                        <div className="text-center text-red-500 py-8">{error}</div>
                    ) : appointments.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            Chưa có lịch đặt nào
                        </div>
                    ) : (
                        <div className="overflow-x-auto custom-scrollbar-table">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                                <thead className="bg-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Mã lịch</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Cửa hàng</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Dịch vụ</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Stylist</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Thời gian</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Tổng tiền</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((appointment) => {
                                        const status = getStatusDisplay(appointment.status);
                                        return (
                                            <tr key={appointment.appointmentId} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-150">
                                                <td className="py-3 px-4 text-sm text-gray-800 font-medium">{appointment.slug}</td>
                                                <td className="py-3 px-4 text-sm text-gray-700">{appointment.storeName}</td>
                                                <td className="py-3 px-4 text-sm text-gray-700">
                                                    {/* Loại bỏ dấu chấm và hiển thị trên một dòng */}
                                                    {appointment.serviceName && appointment.serviceName.length > 0 ? (
                                                        appointment.serviceName.join(', ') // Hoặc ' • ' nếu bạn thích dấu chấm giữa các dịch vụ
                                                    ) : (
                                                        'Không rõ'
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-700">{appointment.employeeName}</td>
                                                <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">
                                                    {formatDateTime(appointment.startTime)}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-700 font-medium whitespace-nowrap">
                                                    {appointment.totalAmount > 0
                                                        ? `${appointment.totalAmount.toLocaleString()} VND`
                                                        : "Chưa xác định"}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span
                                                        className="text-xs px-2 py-1 rounded-full font-semibold flex items-center justify-center whitespace-nowrap" // Đảm bảo trên 1 dòng
                                                        style={{
                                                            background: status.bgColor,
                                                            color: status.textColor,
                                                        }}
                                                    >
                                                        {status.icon} {status.text}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-sm">
                                                    <div className="flex flex-col space-y-2">
                                                        {(appointment.status === "PENDING" ||
                                                            appointment.status === "CONFIRMED") && (
                                                            <button
                                                                onClick={() => handleCancelClick(appointment.appointmentId)}
                                                                className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600 transition min-w-[80px]"
                                                            >
                                                                Hủy lịch
                                                            </button>
                                                        )}
                                                        {appointment.status === "COMPLETED" && !appointment.hasReviewed && (
                                                            <button
                                                                onClick={() => handleOpenReviewModal(appointment)}
                                                                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition min-w-[80px]"
                                                            >
                                                                Đánh giá
                                                            </button>
                                                        )}
                                                        {appointment.status === "COMPLETED" && appointment.hasReviewed && (
                                                            <button
                                                                onClick={() => navigate(routes.store_reviews.replace(':storeId', appointment.storeId.toString()))}
                                                                className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-700 transition min-w-[80px]"
                                                            >
                                                                Xem đánh giá
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}