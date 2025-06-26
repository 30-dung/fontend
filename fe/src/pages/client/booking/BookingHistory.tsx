// src/pages/client/booking/BookingHistory.tsx
import { useState, useEffect } from "react";
import api from "@/services/api";
import url from "@/services/url";
import ReviewFormModal from "@/components/reviews/ReviewFormModal";
import { Link, useNavigate } from 'react-router-dom';
import routes from '@/config/routes';
import { toast } from 'react-toastify';

// Import các icons cần thiết từ react-icons
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaInfoCircle, FaPhoneAlt } from 'react-icons/fa';
import { motion } from "framer-motion";


// Cập nhật interface Appointment để khớp với AppointmentResponse từ BE
interface Appointment {
    appointmentId: number;
    slug: string;
    storeId: number;
    storeName: string;
    serviceName: string[];
    employeeId: number;
    employeeName: string;
    storeServiceId: number;
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
    const [confirmId, setConfirmId] = useState<number | null>(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedAppointmentForReview, setSelectedAppointmentForReview] = useState<Appointment | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const navigate = useNavigate();

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

    const getStatusDisplay = (status: string) => {
        switch (status) {
            case "CONFIRMED":
                return { text: "Đã xác nhận", bgColor: "#e8f5e9", textColor: "#2e7d32", icon: <FaCheckCircle className="mr-1" /> }; // Màu xanh lá nhẹ
            case "PENDING":
                return { text: "Chờ xác nhận", bgColor: "#fff8e1", textColor: "#ff8f00", icon: <FaHourglassHalf className="mr-1" /> }; // Màu vàng cam nhẹ
            case "CANCELED":
                return { text: "Đã hủy", bgColor: "#ffebee", textColor: "#d32f2f", icon: <FaTimesCircle className="mr-1" /> }; // Màu đỏ nhẹ
            case "COMPLETED":
                return { text: "Đã hoàn thành", bgColor: "#e3f2fd", textColor: "#1976d2", icon: <FaCheckCircle className="mr-1" /> }; // Màu xanh dương nhẹ
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
                const serviceNamesArray = Array.isArray(item.storeService?.serviceName)
                    ? item.storeService.serviceName
                    : (item.storeService?.serviceName ? [item.storeService.serviceName] : []);

                let hasReviewed = false;
                try {
                    const hasReviewedResponse = await api.get(`${url.REVIEW.EXISTS_BY_APPOINTMENT_ID}?appointmentId=${item.appointmentId}`);
                    hasReviewed = hasReviewedResponse.data;
                } catch (reviewErr) {
                    console.warn(`Could not fetch review status for appointment ${item.appointmentId}:`, reviewErr);
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
            setCurrentPage(1);
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
                        ? { ...appt, status: "CANCELED" }
                        : appt
                )
            );
            toast.success("Hủy lịch hẹn thành công!");
        } catch (err: any) {
            console.error("Error canceling appointment:", err);
            toast.error(err.response?.data?.message || "Không thể hủy lịch hẹn.");
        } finally {
            setConfirmId(null);
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
    };

    const handleReviewSubmitted = (success: boolean) => {
        if (success) {
            if (selectedAppointmentForReview) {
                setAppointments(prevAppointments =>
                    prevAppointments.map(appt =>
                        appt.appointmentId === selectedAppointmentForReview.appointmentId
                            ? { ...appt, hasReviewed: true }
                            : appt
                    )
                );
                toast.success("Đánh giá của bạn đã được gửi thành công!");
            }
        } else {
            toast.error("Có lỗi xảy ra khi gửi đánh giá.");
        }
        handleCloseReviewModal();
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = appointments.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(appointments.length / itemsPerPage);

    const paginate = (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="min-h-screen bg-light-cream font-sans"> {/* Thay from-blue-{#F3F4F6} thành bg-light-cream */}
            {/* Banner đầu trang giống Location.tsx */}
            <div
                className="relative bg-cover bg-center h-64 md:h-80 flex items-center justify-center overflow-hidden w-full"
                style={{ backgroundImage: `url('https://static.booksy.com/static/live/covers/barbers.jpg')` }}
            >
                <div className="absolute inset-0 bg-black opacity-40 backdrop-filter backdrop-blur-sm"></div>
                <h1 className="relative text-white text-4xl md:text-5xl font-bold z-10 text-center px-4 font-serif"> {/* Thêm font-serif */}
                    Lịch sử đặt lịch của bạn
                </h1>
            </div>

            {/* Modal xác nhận hủy */}
            {confirmId !== null && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs text-center">
                        <p className="mb-6 text-base text-dark-brown font-semibold"> {/* Thay text-gray-800 thành text-dark-brown */}
                            Bạn có chắc muốn hủy lịch hẹn này?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-4 py-2 bg-soft-gray text-dark-brown rounded-lg hover:bg-medium-gray hover:text-light-cream font-semibold transition" /* Đổi màu nút */
                                onClick={handleCancelModal}
                            >
                                Không
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition" /* Giữ màu đỏ cho hủy nhưng đồng bộ hover */
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
                    <h2 className="text-3xl font-bold text-dark-brown text-center mb-8 font-serif"> {/* Thay text-blue-900 thành text-dark-brown, thêm font-serif */}
                        Chi tiết lịch sử đặt lịch
                    </h2>
                    {loading ? (
                        <div className="text-center text-medium-gray py-8">Đang tải lịch sử đặt lịch...</div>
                    ) : error ? (
                        <div className="text-center text-red-600 py-8">{error}</div>
                    ) : appointments.length === 0 ? (
                        <div className="text-center text-medium-gray py-8">
                            Chưa có lịch đặt nào
                        </div>
                    ) : (
                        <div className="overflow-x-auto custom-scrollbar-table">
                            <table className="min-w-full bg-white border border-soft-gray rounded-lg shadow-sm"> {/* Thay border-gray-200 thành border-soft-gray */}
                                <thead className="bg-soft-gray border-b border-soft-gray"> {/* Thay bg-gray-100 border-gray-200 thành bg-soft-gray border-soft-gray */}
                                    <tr>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-dark-brown">Mã lịch</th> {/* Thay text-gray-700 thành text-dark-brown */}
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-dark-brown">Cửa hàng</th> {/* Thay text-gray-700 thành text-dark-brown */}
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-dark-brown">Dịch vụ</th> {/* Thay text-gray-700 thành text-dark-brown */}
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-dark-brown">Stylist</th> {/* Thay text-gray-700 thành text-dark-brown */}
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-dark-brown">Thời gian</th> {/* Thay text-gray-700 thành text-dark-brown */}
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-dark-brown">Tổng tiền</th> {/* Thay text-gray-700 thành text-dark-brown */}
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-dark-brown">Trạng thái</th> {/* Thay text-gray-700 thành text-dark-brown */}
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-dark-brown">Hành động</th> {/* Thay text-gray-700 thành text-dark-brown */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((appointment) => {
                                        const status = getStatusDisplay(appointment.status);
                                        return (
                                            <tr key={appointment.appointmentId} className="border-b border-soft-gray last:border-b-0  transition-colors duration-150"> {/* Thay border-gray-100 hover:bg-gray-50 thành border-soft-gray hover:bg-soft-gray */}
                                                <td className="py-3 px-4 text-sm text-dark-brown font-medium">{appointment.slug}</td> {/* Thay text-gray-800 thành text-dark-brown */}
                                                <td className="py-3 px-4 text-sm text-medium-gray">{appointment.storeName}</td> {/* Thay text-gray-700 thành text-medium-gray */}
                                                <td className="py-3 px-4 text-sm text-medium-gray"> {/* Thay text-gray-700 thành text-medium-gray */}
                                                    {appointment.serviceName && appointment.serviceName.length > 0 ? (
                                                        appointment.serviceName.join(', ')
                                                    ) : (
                                                        'Không rõ'
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-medium-gray">{appointment.employeeName}</td> {/* Thay text-gray-700 thành text-medium-gray */}
                                                <td className="py-3 px-4 text-sm text-medium-gray whitespace-nowrap"> {/* Thay text-gray-700 thành text-medium-gray */}
                                                    {formatDateTime(appointment.startTime)}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-dark-brown font-medium whitespace-nowrap"> {/* Thay text-gray-700 thành text-dark-brown */}
                                                    {appointment.totalAmount > 0
                                                        ? `${appointment.totalAmount.toLocaleString()} VND`
                                                        : "Chưa xác định"}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span
                                                        className="text-xs px-2 py-1 rounded-full font-semibold flex items-center justify-center whitespace-nowrap"
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
                                                                className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-700 transition min-w-[80px]" /* Giữ màu đỏ cho hủy nhưng đồng bộ hover */
                                                                onClick={() => handleCancelClick(appointment.appointmentId)}
                                                            >
                                                                Hủy lịch
                                                            </button>
                                                        )}
                                                        {appointment.status === "COMPLETED" && !appointment.hasReviewed && (
                                                            <button
                                                                onClick={() => handleOpenReviewModal(appointment)}
                                                                className="bg-accent-gold text-light-cream px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-accent-terracotta transition min-w-[80px]" /* Đổi màu nút đánh giá */
                                                            >
                                                                Đánh giá
                                                            </button>
                                                        )}
                                                        {appointment.status === "COMPLETED" && appointment.hasReviewed && (
                                                            <button
                                                                onClick={() => navigate(routes.store_reviews.replace(':storeId', appointment.storeId.toString()))}
                                                                className="bg-black-soft text-light-cream px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-dark-brown transition min-w-[80px]" /* Đổi màu nút xem đánh giá */
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

                            {/* --- Phần phân trang --- */}
                            {totalPages > 1 && (
                                <nav className="flex justify-center mt-8">
                                    <ul className="flex items-center space-x-2">
                                        <li>
                                            <button
                                                onClick={() => paginate(currentPage - 1)}
                                                className={`px-4 py-2 border rounded-lg ${currentPage === 1 ? 'bg-soft-gray text-medium-gray cursor-not-allowed' : 'bg-white text-dark-brown hover:bg-soft-gray hover:text-dark-brown'}`} /* Đổi màu nút phân trang */
                                                disabled={currentPage === 1}
                                            >
                                                Trước
                                            </button>
                                        </li>
                                        {pageNumbers.map(number => (
                                            <li key={number}>
                                                <button
                                                    onClick={() => paginate(number)}
                                                    className={`px-4 py-2 border rounded-lg ${currentPage === number ? 'bg-black-soft text-light-cream' : 'bg-white text-dark-brown hover:bg-soft-gray hover:text-dark-brown'}`} /* Đổi màu nút phân trang */
                                                >
                                                    {number}
                                                </button>
                                            </li>
                                        ))}
                                        <li>
                                            <button
                                                onClick={() => paginate(currentPage + 1)}
                                                className={`px-4 py-2 border rounded-lg ${currentPage === totalPages ? 'bg-soft-gray text-medium-gray cursor-not-allowed' : 'bg-white text-dark-brown hover:bg-soft-gray hover:text-dark-brown'}`} /* Đổi màu nút phân trang */
                                                disabled={currentPage === totalPages}
                                            >
                                                Sau
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                          
                        </div>
                    ) }
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
}