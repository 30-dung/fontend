import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/services/api";
import url from "@/services/url";
import routes from "@/config/routes";
import { FaCheckCircle, FaClock, FaTimesCircle, FaMapMarkerAlt, FaCut, FaUser, FaCalendarAlt, FaMoneyBillWave, FaPhoneAlt } from "react-icons/fa";
import { motion } from "framer-motion";

interface Appointment {
    appointmentId: number;
    slug: string;
    startTime: string;
    endTime: string;
    status: string;
    storeService: {
        storeName: string;
        serviceName: string;
    };
    employee: { fullName: string };
    invoice: { totalAmount: number };
}

export function BookingConfirmation() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointment = async () => {
            const appointmentId = localStorage.getItem("appointmentId");
            if (!appointmentId) {
                setError("Không tìm thấy thông tin đặt lịch");
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(
                    `${url.APPOINTMENT.GET_BY_ID}/${appointmentId}`
                );
                if (Array.isArray(response.data)) {
                    setAppointments(response.data);
                } else if (response.data) {
                    setAppointments([response.data]);
                } else {
                    setError("Không tìm thấy thông tin cuộc hẹn");
                }
                setLoading(false);
            } catch (err: any) {
                console.error("API error:", err);
                setError(
                    err.response?.data?.message ||
                        "Không thể tải thông tin đặt lịch"
                );
                setLoading(false);
            }
        };
        fetchAppointment();
    }, []);

    if (loading) return <div className="text-center py-8 text-lg font-medium text-medium-gray">Đang tải thông tin xác nhận...</div>; {/* Thay text-gray-700 thành text-medium-gray */}
    if (error) return <div className="text-center text-red-600 py-8 text-lg font-medium">{error}</div>;

    const firstAppointment = appointments.length > 0 ? appointments[0] : null;

    return (
        <div className="w-full bg-light-cream font-sans p-6 md:p-8 flex flex-col items-center min-h-screen"> {/* Thay from-blue-{#F3F4F6} thành bg-light-cream */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-lg">
                <div className="text-center mb-6">
                    <FaCheckCircle className="text-accent-gold text-6xl mx-auto mb-3 animate-bounce-in" /> {/* Thay text-green-500 thành text-accent-gold */}
                    <h2 className="text-3xl font-bold text-dark-brown mb-2 font-serif"> {/* Thay text-[#15397F] thành text-dark-brown, thêm font-serif */}
                        Xác nhận đặt lịch thành công!
                    </h2>
                    <p className="text-center text-medium-gray text-base"> {/* Thay text-gray-600 thành text-medium-gray */}
                        Cảm ơn bạn đã tin tưởng Four Shine. Dưới đây là thông tin chi tiết cuộc hẹn của bạn.
                    </p>
                </div>

                {firstAppointment ? (
                    <div className="space-y-4 text-medium-gray"> {/* Thay text-gray-700 thành text-medium-gray */}
                        <div className="flex items-center justify-between py-2 border-b border-soft-gray"> {/* Thay border-gray-100 thành border-soft-gray */}
                            <span className="flex items-center text-medium-gray font-medium"><FaCalendarAlt className="mr-2 text-dark-brown" />Mã đặt lịch:</span> {/* Thay text-gray-500 thành text-medium-gray, text-[#15397F] thành text-dark-brown */}
                            <span className="font-semibold text-lg text-dark-brown">{firstAppointment.slug}</span> {/* Thay text-[#15397F] thành text-dark-brown */}
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-soft-gray"> {/* Thay border-gray-100 thành border-soft-gray */}
                            <span className="flex items-center text-medium-gray font-medium"><FaMapMarkerAlt className="mr-2 text-dark-brown" />Cửa hàng:</span> {/* Thay text-gray-500 thành text-medium-gray, text-[#15397F] thành text-dark-brown */}
                            <span className="font-semibold text-dark-brown text-right">{firstAppointment.storeService?.storeName || "N/A"}</span> {/* Thay text-gray-800 thành text-dark-brown */}
                        </div>
                        <div className="py-2 border-b border-soft-gray"> {/* Thay border-gray-100 thành border-soft-gray */}
                            <div className="flex items-start justify-between">
                                <span className="flex items-center text-medium-gray font-medium"><FaCut className="mr-2 text-dark-brown" />Dịch vụ:</span> {/* Thay text-gray-500 thành text-medium-gray, text-[#15397F] thành text-dark-brown */}
                                <div className="flex flex-col items-end text-dark-brown"> {/* Thay text-gray-800 thành text-dark-brown */}
                                    {appointments.map((app, idx) => (
                                        <span key={idx} className="font-semibold text-sm">
                                            {app.storeService?.serviceName || "N/A"}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-soft-gray"> {/* Thay border-gray-100 thành border-soft-gray */}
                            <span className="flex items-center text-medium-gray font-medium"><FaUser className="mr-2 text-dark-brown" />Stylist:</span> {/* Thay text-gray-500 thành text-medium-gray, text-[#15397F] thành text-dark-brown */}
                            <span className="font-semibold text-dark-brown text-right">{firstAppointment.employee?.fullName || "N/A"}</span> {/* Thay text-gray-800 thành text-dark-brown */}
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-soft-gray"> {/* Thay border-gray-100 thành border-soft-gray */}
                            <span className="flex items-center text-medium-gray font-medium"><FaClock className="mr-2 text-dark-brown" />Thời gian:</span> {/* Thay text-gray-500 thành text-medium-gray, text-[#15397F] thành text-dark-brown */}
                            <span className="font-semibold text-dark-brown text-right"> {/* Thay text-gray-800 thành text-dark-brown */}
                                {new Date(firstAppointment.startTime).toLocaleString(
                                    "vi-VN",
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    }
                                )}
                                {" - "}
                                {new Date(firstAppointment.endTime).toLocaleString(
                                    "vi-VN",
                                    { hour: "2-digit", minute: "2-digit" }
                                )}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-soft-gray"> {/* Thay border-gray-100 thành border-soft-gray */}
                            <span className="flex items-center text-medium-gray font-medium">Trạng thái:</span> {/* Thay text-gray-500 thành text-medium-gray */}
                            <span className={`font-bold flex items-center text-right ${firstAppointment.status === "CONFIRMED" ? "text-accent-gold" : firstAppointment.status === "PENDING" ? "text-yellow-600" : "text-red-600"}`}> {/* Đổi text-green-600 thành text-accent-gold */}
                                {firstAppointment.status === "CONFIRMED" ? (
                                    <FaCheckCircle className="mr-2" />
                                ) : firstAppointment.status === "PENDING" ? (
                                    <FaClock className="mr-2" />
                                ) : (
                                    <FaTimesCircle className="mr-2" />
                                )}
                                {firstAppointment.status === "CONFIRMED"
                                    ? "Đã xác nhận"
                                    : firstAppointment.status === "PENDING"
                                      ? "Chờ xác nhận"
                                      : firstAppointment.status || "N/A"}
                            </span>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-soft-gray"> {/* Thay border-gray-200 thành border-soft-gray */}
                            <span className="flex items-center text-xl font-bold text-dark-brown"><FaMoneyBillWave className="mr-2" />Tổng tiền:</span> {/* Thay text-[#15397F] thành text-dark-brown */}
                            <span className="font-bold text-2xl text-accent-gold text-right"> {/* Thay text-green-700 thành text-accent-gold */}
                                {appointments
                                    .reduce(
                                        (sum, app) =>
                                            sum + (app.invoice?.totalAmount || 0),
                                        0
                                    )
                                    .toLocaleString("vi-VN")}{" "}
                                VND
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-medium-gray py-4 text-base"> {/* Thay text-gray-600 thành text-medium-gray */}
                        Không có thông tin cuộc hẹn để hiển thị.
                    </div>
                )}

                <button
                    className="w-full mt-8 bg-black-soft hover:bg-dark-brown text-light-cream rounded-lg py-3 font-semibold text-lg transition shadow-md" /* Thay bg-[#15397F] hover:bg-[#1e4bb8] text-white thành các màu theme */
                    onClick={() => navigate(routes.bookingHistorey)}
                >
                    Xem lịch sử đặt lịch
                </button>
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