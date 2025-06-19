import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import url from "@/services/url";
import routes from "@/config/routes";
import { FaCheckCircle, FaClock, FaTimesCircle, FaMapMarkerAlt, FaCut, FaUser, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa"; // Import các icon cần thiết

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

    if (loading) return <div className="text-center py-8 text-lg font-medium text-gray-700">Đang tải thông tin xác nhận...</div>;
    if (error) return <div className="text-center text-red-600 py-8 text-lg font-medium">{error}</div>;

    const firstAppointment = appointments.length > 0 ? appointments[0] : null;

    return (
        <div className="w-full bg-gray-50 font-sans p-6 md:p-8 flex flex-col items-center min-h-screen"> 
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-lg">
                <div className="text-center mb-6">
                    <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-3 animate-bounce-in" />
                    <h2 className="text-3xl font-bold text-[#15397F] mb-2">
                        Xác nhận đặt lịch thành công!
                    </h2>
                    <p className="text-center text-gray-600 text-base">
                        Cảm ơn bạn đã tin tưởng 30 SHINE. Dưới đây là thông tin chi tiết cuộc hẹn của bạn.
                    </p>
                </div>

                {firstAppointment ? (
                    <div className="space-y-4 text-gray-700">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="flex items-center text-gray-500 font-medium"><FaCalendarAlt className="mr-2 text-[#15397F]" />Mã đặt lịch:</span>
                            <span className="font-semibold text-lg text-[#15397F]">{firstAppointment.slug}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="flex items-center text-gray-500 font-medium"><FaMapMarkerAlt className="mr-2 text-[#15397F]" />Cửa hàng:</span>
                            <span className="font-semibold text-gray-800 text-right">{firstAppointment.storeService?.storeName || "N/A"}</span>
                        </div>
                        {/* Đã sửa phần hiển thị dịch vụ để song song và bỏ dấu chấm */}
                        <div className="py-2 border-b border-gray-100">
                            <div className="flex items-start justify-between"> {/* Sử dụng items-start để căn trên nếu nội dung dài */}
                                <span className="flex items-center text-gray-500 font-medium"><FaCut className="mr-2 text-[#15397F]" />Dịch vụ:</span>
                                <div className="flex flex-col items-end text-gray-800"> {/* Dùng flex-col và items-end để các dịch vụ xếp chồng và căn phải */}
                                    {appointments.map((app, idx) => (
                                        <span key={idx} className="font-semibold text-sm">
                                            {app.storeService?.serviceName || "N/A"}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="flex items-center text-gray-500 font-medium"><FaUser className="mr-2 text-[#15397F]" />Stylist:</span>
                            <span className="font-semibold text-gray-800 text-right">{firstAppointment.employee?.fullName || "N/A"}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="flex items-center text-gray-500 font-medium"><FaClock className="mr-2 text-[#15397F]" />Thời gian:</span>
                            <span className="font-semibold text-gray-800 text-right">
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
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="flex items-center text-gray-500 font-medium">Trạng thái:</span>
                            <span className={`font-bold flex items-center text-right ${firstAppointment.status === "CONFIRMED" ? "text-green-600" : firstAppointment.status === "PENDING" ? "text-yellow-600" : "text-red-600"}`}>
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
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <span className="flex items-center text-xl font-bold text-[#15397F]"><FaMoneyBillWave className="mr-2" />Tổng tiền:</span>
                            <span className="font-bold text-2xl text-green-700 text-right">
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
                    <div className="text-center text-gray-600 py-4 text-base">
                        Không có thông tin cuộc hẹn để hiển thị.
                    </div>
                )}

                <button
                    className="w-full mt-8 bg-[#15397F] hover:bg-[#1e4bb8] text-white rounded-lg py-3 font-semibold text-lg transition shadow-md"
                    onClick={() => navigate(routes.bookingHistorey)}
                >
                    Xem lịch sử đặt lịch
                </button>
            </div>
        </div>
    );
}