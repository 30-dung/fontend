import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import url from "../../../services/url";
import routes from "../../../config/routes";

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
            console.log("appointmentId:", appointmentId);
            if (!appointmentId) {
                setError("Không tìm thấy thông tin đặt lịch");
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(
                    `${url.APPOINTMENT.GET_BY_ID}/${appointmentId}`
                );
                console.log("API response:", response.data);
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

    if (loading) return <div className="text-center py-4">Đang tải...</div>;
    if (error)
        return <div className="text-center text-red-500 py-4">{error}</div>;

    return (
        // <div className="w-full max-w-md  mx-auto bg-gray-100 min-h-screen font-sans p-4">
        //     <h2 className="text-2xl font-bold text-center text-[#15397F] mb-4">
        //         Xác nhận đặt lịch
        //     </h2>
        //     {appointments.length > 0 ? (
        //         <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        //             <p className="text-sm text-gray-600">
        //                 Mã đặt lịch: <strong>{appointments[0].slug}</strong>
        //             </p>
        //             <p className="text-sm text-gray-600">
        //                 Cửa hàng:{" "}
        //                 <strong>
        //                     {appointments[0].storeService?.storeName || "N/A"}
        //                 </strong>
        //             </p>
        //             <p className="text-sm text-gray-600">
        //                 Dịch vụ:{" "}
        //                 <strong>
        //                     {appointments.map((app, index) => (
        //                         <span key={index}>
        //                             {app.storeService?.serviceName || "N/A"}
        //                             {index < appointments.length - 1
        //                                 ? ", "
        //                                 : ""}
        //                         </span>
        //                     ))}
        //                 </strong>
        //             </p>
        //             <p className="text-sm text-gray-600">
        //                 Stylist:{" "}
        //                 <strong>
        //                     {appointments[0].employee?.fullName || "N/A"}
        //                 </strong>
        //             </p>
        //             <p className="text-sm text-gray-600">
        //                 Thời gian:{" "}
        //                 <strong>
        //                     {new Date(appointments[0].startTime).toLocaleString(
        //                         "vi-VN"
        //                     )}{" "}
        //                     -{" "}
        //                     {new Date(appointments[0].endTime).toLocaleString(
        //                         "vi-VN",
        //                         {
        //                             hour: "2-digit",
        //                             minute: "2-digit",
        //                         }
        //                     )}
        //                 </strong>
        //             </p>
        //             <p className="text-sm text-gray-600">
        //                 Trạng thái:{" "}
        //                 <strong>{appointments[0].status || "N/A"}</strong>
        //             </p>
        //             <p className="text-sm text-gray-600">
        //                 Tổng tiền:{" "}
        //                 <strong>
        //                     {appointments
        //                         .reduce(
        //                             (sum, app) =>
        //                                 sum + (app.invoice?.totalAmount || 0),
        //                             0
        //                         )
        //                         .toLocaleString()}{" "}
        //                     VND
        //                 </strong>
        //             </p>
        //         </div>
        //     ) : (
        //         <div className="text-center text-gray-600 py-4">
        //             Không có thông tin cuộc hẹn để hiển thị.
        //         </div>
        //     )}
        //     <button
        //         className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg py-2"
        //         onClick={() => navigate(routes.bookingHistorey)}
        //     >
        //         Xem lịch sử đặt lịch
        //     </button>
        // </div>

        <div className="w-full  md:max-w-xl  mx-auto bg-white min-h-screen font-sans p-6 flex flex-col justify-center">
            <div className="mb-6 ">
                <h2 className="text-2xl font-bold text-center text-[#15397F] mb-2">
                    Xác nhận đặt lịch
                </h2>
                <p className="text-center text-gray-500 text-sm">
                    Cảm ơn bạn đã đặt lịch! Dưới đây là thông tin chi tiết cuộc
                    hẹn của bạn.
                </p>
            </div>
            {appointments.length > 0 ? (
                <div className="bg-gray-50 rounded-xl shadow p-5 mb-6 border border-gray-200">
                    <div className="mb-3 flex justify-between">
                        <span className="text-gray-500">Mã đặt lịch:</span>
                        <span className="font-semibold text-[#15397F]">
                            {appointments[0].slug}
                        </span>
                    </div>
                    <div className="mb-3 flex justify-between">
                        <span className="text-gray-500">Cửa hàng:</span>
                        <span className="font-semibold">
                            {appointments[0].storeService?.storeName || "N/A"}
                        </span>
                    </div>
                    <div className="mb-3">
                        <span className="text-gray-500">Dịch vụ:</span>
                        <ul className="list-disc list-inside ml-4 mt-1">
                            {appointments.map((app, idx) => (
                                <li key={idx} className="font-semibold">
                                    {app.storeService?.serviceName || "N/A"}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mb-3 flex justify-between">
                        <span className="text-gray-500">Stylist:</span>
                        <span className="font-semibold">
                            {appointments[0].employee?.fullName || "N/A"}
                        </span>
                    </div>
                    <div className="mb-3 flex justify-between">
                        <span className="text-gray-500">Thời gian:</span>
                        <span className="font-semibold">
                            {new Date(appointments[0].startTime).toLocaleString(
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
                            {new Date(appointments[0].endTime).toLocaleString(
                                "vi-VN",
                                { hour: "2-digit", minute: "2-digit" }
                            )}
                        </span>
                    </div>
                    <div className="mb-3 flex justify-between">
                        <span className="text-gray-500">Trạng thái:</span>
                        <span className="font-semibold">
                            {appointments[0].status === "CONFIRMED"
                                ? "✅ Đã xác nhận"
                                : appointments[0].status === "PENDING"
                                  ? "⏳ Chờ xác nhận"
                                  : appointments[0].status || "N/A"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Tổng tiền:</span>
                        <span className="font-semibold text-green-600">
                            {appointments
                                .reduce(
                                    (sum, app) =>
                                        sum + (app.invoice?.totalAmount || 0),
                                    0
                                )
                                .toLocaleString()}{" "}
                            VND
                        </span>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-600 py-4">
                    Không có thông tin cuộc hẹn để hiển thị.
                </div>
            )}
            <button
                className="w-full  bg-[#15397F] hover:bg-[#1e4bb8] text-white rounded-lg py-2 font-semibold transition"
                onClick={() => navigate(routes.bookingHistorey)}
            >
                Xem lịch sử đặt lịch
            </button>
        </div>
    );
}
