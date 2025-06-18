// import { useState, useEffect } from "react";
// import api from "../../../services/api";
// import url from "../../../services/url";

// interface Appointment {
//     appointmentId: number;
//     slug: string;
//     storeName: string;
//     serviceName: string[];
//     employeeName: string;
//     startTime: string;
//     endTime: string;
//     status: string;
//     totalAmount: number;
//     createdAt: string; // Thêm trường createdAt
// }

// export function BookingHistory() {
//     const [appointments, setAppointments] = useState<Appointment[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     const getUserEmail = async () => {
//         try {
//             const response = await api.get(url.USER.PROFILE);
//             return response.data.email;
//         } catch (err) {
//             throw new Error("Không thể lấy thông tin người dùng");
//         }
//     };

//     const fetchHistory = async () => {
//         try {
//             const email = await getUserEmail();
//             const response = await api.get(
//                 url.APPOINTMENT.GET_BY_USER.replace("{email}", email)
//             );
//             console.log("API response:", response.data);

//             const appointmentMap = new Map<number, Appointment>();
//             response.data.forEach((item: any) => {
//                 const appointmentId = item.appointmentId;
//                 if (appointmentMap.has(appointmentId)) {
//                     const existing = appointmentMap.get(appointmentId)!;
//                     existing.serviceName.push(
//                         item.storeService?.serviceName || "Unknown Service"
//                     );
//                 } else {
//                     appointmentMap.set(appointmentId, {
//                         appointmentId: item.appointmentId,
//                         slug: item.slug || "APPT-UNKNOWN",
//                         storeName:
//                             item.storeService?.storeName || "Unknown Store",
//                         serviceName: [
//                             item.storeService?.serviceName || "Unknown Service",
//                         ],
//                         employeeName:
//                             item.employee?.fullName || "Unknown Employee",
//                         startTime: item.startTime,
//                         endTime: item.endTime,
//                         status: item.status,
//                         totalAmount: item.invoice?.totalAmount || 0,
//                         createdAt: item.createdAt || new Date().toISOString(), // Thêm createdAt, fallback nếu BE không trả về
//                     });
//                 }
//             });

//             // Sắp xếp appointments theo createdAt giảm dần
//             const sortedAppointments = Array.from(appointmentMap.values()).sort(
//                 (a, b) =>
//                     new Date(b.createdAt).getTime() -
//                     new Date(a.createdAt).getTime()
//             );
//             console.log("Sorted Appointments:", sortedAppointments);
//             setAppointments(sortedAppointments);
//             setLoading(false);
//         } catch (err: any) {
//             setError(
//                 err.response?.data?.message || "Không thể tải lịch sử đặt lịch"
//             );
//             setLoading(false);
//         }
//     };

//     const cancelAppointment = async (appointmentId: number) => {
//         if (!window.confirm("Bạn có chắc muốn hủy lịch hẹn này?")) return;

//         try {
//             await api.patch(
//                 url.APPOINTMENT.CANCEL.replace("{id}", appointmentId.toString())
//             );
//             setAppointments((prev) =>
//                 prev.map((appt) =>
//                     appt.appointmentId === appointmentId
//                         ? { ...appt, status: "CANCELLED" }
//                         : appt
//                 )
//             );
//             alert("Hủy lịch hẹn thành công");
//         } catch (err: any) {
//             setError(err.response?.data?.message || "Không thể hủy lịch hẹn");
//         }
//     };

//     useEffect(() => {
//         fetchHistory();
//     }, []);

//     if (loading) return <div className="text-center py-4">Đang tải...</div>;
//     if (error)
//         return <div className="text-center text-red-500 py-4">{error}</div>;

//     return (
//         // <div className="w-full max-w-md mx-auto bg-gray-100 min-h-screen font-sans p-4">
//         //     <h2 className="text-2xl font-bold text-center text-[#15397F] mb-4">Lịch sử đặt lịch</h2>
//         //     {appointments.length === 0 ? (
//         //         <p className="text-center text-gray-500">Chưa có lịch đặt nào</p>
//         //     ) : (
//         //         <div className="space-y-4">
//         //             {appointments.map((appointment) => (
//         //                 <div key={appointment.appointmentId} className="bg-white rounded-lg shadow-md p-4">
//         //                     <p className="text-sm text-gray-600">
//         //                         Mã đặt lịch: <strong>{appointment.slug}</strong>
//         //                     </p>
//         //                     <p className="text-sm text-gray-600">
//         //                         Cửa hàng: <strong>{appointment.storeName}</strong>
//         //                     </p>
//         //                     <p className="text-sm text-gray-600">
//         //                         Dịch vụ: <strong>{appointment.serviceName.join(', ')}</strong>
//         //                     </p>
//         //                     <p className="text-sm text-gray-600">
//         //                         Stylist: <strong>{appointment.employeeName}</strong>
//         //                     </p>
//         //                     <p className="text-sm text-gray-600">
//         //                         Thời gian:{' '}
//         //                         <strong>{new Date(appointment.startTime).toLocaleString('vi-VN')}</strong>
//         //                     </p>
//         //                     <p className="text-sm text-gray-600">
//         //                         Trạng thái: <strong>{appointment.status}</strong>
//         //                     </p>
//         //                     <p className="text-sm text-gray-600">
//         //                         Tổng tiền:{' '}
//         //                         <strong>
//         //                             {appointment.totalAmount > 0
//         //                                 ? `${appointment.totalAmount.toLocaleString()} VND`
//         //                                 : 'Chưa xác định'}
//         //                         </strong>
//         //                     </p>
//         //                     <p className="text-sm text-gray-600">
//         //                         Đặt lúc:{' '}
//         //                         <strong>{new Date(appointment.createdAt).toLocaleString('vi-VN')}</strong>
//         //                     </p>
//         //                     {(appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') && (
//         //                         <button
//         //                             onClick={() => cancelAppointment(appointment.appointmentId)}
//         //                             className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
//         //                         >
//         //                             Hủy lịch
//         //                         </button>
//         //                     )}
//         //                 </div>
//         //             ))}
//         //         </div>
//         //     )}
//         // </div>

//         <div className="w-full max-w-xl mx-auto bg-white min-h-screen font-sans p-6">
//             <h2 className="text-3xl font-bold text-center text-[#15397F] mb-6">
//                 Lịch sử đặt lịch
//             </h2>
//             {appointments.length === 0 ? (
//                 <p className="text-center text-gray-500">
//                     Chưa có lịch đặt nào
//                 </p>
//             ) : (
//                 <div className="space-y-6">
//                     {appointments.map((appointment) => (
//                         <div
//                             key={appointment.appointmentId}
//                             className="bg-gray-50 border border-gray-200 rounded-xl shadow p-5 transition hover:shadow-lg"
//                         >
//                             <div className="flex flex-wrap gap-4 justify-between items-center mb-2">
//                                 <div className="text-sm text-gray-500">
//                                     <span className="font-semibold text-[#15397F]">
//                                         Mã:
//                                     </span>{" "}
//                                     {appointment.slug}
//                                 </div>
//                                 <div
//                                     className="text-xs px-2 py-1 rounded font-semibold"
//                                     style={{
//                                         background:
//                                             appointment.status === "CONFIRMED"
//                                                 ? "#e0f7fa"
//                                                 : appointment.status ===
//                                                     "PENDING"
//                                                   ? "#fff3cd"
//                                                   : appointment.status ===
//                                                       "CANCELLED"
//                                                     ? "#fdecea"
//                                                     : "#f3f4f6",
//                                         color:
//                                             appointment.status === "CONFIRMED"
//                                                 ? "#00796b"
//                                                 : appointment.status ===
//                                                     "PENDING"
//                                                   ? "#b26a00"
//                                                   : appointment.status ===
//                                                       "CANCELLED"
//                                                     ? "#c62828"
//                                                     : "#374151",
//                                     }}
//                                 >
//                                     {appointment.status === "CONFIRMED"
//                                         ? "✅ Đã xác nhận"
//                                         : appointment.status === "PENDING"
//                                           ? "⏳ Chờ xác nhận"
//                                           : appointment.status === "CANCELLED"
//                                             ? "❌ Đã hủy"
//                                             : appointment.status}
//                                 </div>
//                             </div>
//                             <div className="mb-2 text-sm text-gray-600">
//                                 <span className="font-semibold">Cửa hàng:</span>{" "}
//                                 {appointment.storeName}
//                             </div>
//                             <div className="mb-2 text-sm text-gray-600">
//                                 <span className="font-semibold">Dịch vụ:</span>
//                                 <ul className="list-disc list-inside ml-4 mt-1">
//                                     {appointment.serviceName.map(
//                                         (name, idx) => (
//                                             <li key={idx}>{name}</li>
//                                         )
//                                     )}
//                                 </ul>
//                             </div>
//                             <div className="mb-2 text-sm text-gray-600">
//                                 <span className="font-semibold">Stylist:</span>{" "}
//                                 {appointment.employeeName}
//                             </div>
//                             <div className="mb-2 text-sm text-gray-600">
//                                 <span className="font-semibold">
//                                     Thời gian:
//                                 </span>{" "}
//                                 {new Date(appointment.startTime).toLocaleString(
//                                     "vi-VN"
//                                 )}
//                             </div>
//                             <div className="mb-2 text-sm text-gray-600">
//                                 <span className="font-semibold">
//                                     Tổng tiền:
//                                 </span>{" "}
//                                 {appointment.totalAmount > 0
//                                     ? `${appointment.totalAmount.toLocaleString()} VND`
//                                     : "Chưa xác định"}
//                             </div>
//                             <div className="mb-2 text-sm text-gray-600">
//                                 <span className="font-semibold">Đặt lúc:</span>{" "}
//                                 {new Date(appointment.createdAt).toLocaleString(
//                                     "vi-VN"
//                                 )}
//                             </div>
//                             {(appointment.status === "PENDING" ||
//                                 appointment.status === "CONFIRMED") && (
//                                 <button
//                                     onClick={() =>
//                                         cancelAppointment(
//                                             appointment.appointmentId
//                                         )
//                                     }
//                                     className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm font-semibold transition"
//                                 >
//                                     Hủy lịch
//                                 </button>
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

import { useState, useEffect } from "react";
import api from "../../../services/api";
import url from "../../../services/url";

interface Appointment {
    appointmentId: number;
    slug: string;
    storeName: string;
    serviceName: string[];
    employeeName: string;
    startTime: string;
    endTime: string;
    status: string;
    totalAmount: number;
    createdAt: string;
}

export function BookingHistory() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null); // Thêm state toast
    const [confirmId, setConfirmId] = useState<number | null>(null);
    const getUserEmail = async () => {
        try {
            const response = await api.get(url.USER.PROFILE);
            return response.data.email;
        } catch (err) {
            throw new Error("Không thể lấy thông tin người dùng");
        }
    };

    const fetchHistory = async () => {
        try {
            const email = await getUserEmail();
            const response = await api.get(
                url.APPOINTMENT.GET_BY_USER.replace("{email}", email)
            );
            const appointmentMap = new Map<number, Appointment>();
            response.data.forEach((item: any) => {
                const appointmentId = item.appointmentId;
                if (appointmentMap.has(appointmentId)) {
                    const existing = appointmentMap.get(appointmentId)!;
                    existing.serviceName.push(
                        item.storeService?.serviceName || "Unknown Service"
                    );
                } else {
                    appointmentMap.set(appointmentId, {
                        appointmentId: item.appointmentId,
                        slug: item.slug || "APPT-UNKNOWN",
                        storeName:
                            item.storeService?.storeName || "Unknown Store",
                        serviceName: [
                            item.storeService?.serviceName || "Unknown Service",
                        ],
                        employeeName:
                            item.employee?.fullName || "Unknown Employee",
                        startTime: item.startTime,
                        endTime: item.endTime,
                        status: item.status,
                        totalAmount: item.invoice?.totalAmount || 0,
                        createdAt: item.createdAt || new Date().toISOString(),
                    });
                }
            });
            const sortedAppointments = Array.from(appointmentMap.values()).sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            );
            setAppointments(sortedAppointments);
            setLoading(false);
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Không thể tải lịch sử đặt lịch"
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
                        ? { ...appt, status: "CANCELLED" }
                        : appt
                )
            );
            setToast("Hủy lịch hẹn thành công!");
        } catch (err: any) {
            setError(err.response?.data?.message || "Không thể hủy lịch hẹn");
        } finally {
            setConfirmId(null);
            setTimeout(() => setToast(null), 1000);
        }
    };

    const handleCancelModal = () => setConfirmId(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    if (loading) return <div className="text-center py-4">Đang tải...</div>;
    if (error)
        return <div className="text-center text-red-500 py-4">{error}</div>;

    return (
        <div className="w-full max-w-xl mx-auto bg-white min-h-screen font-sans p-6">
            {/* Toast notification */}
            {toast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-shine-primary text-white px-6 py-3 rounded shadow-lg z-50 animate-fade-in">
                    {toast}
                </div>
            )}
            {/* Modal xác nhận */}
            {confirmId !== null && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs text-center">
                        <p className="mb-6 text-base text-gray-800 font-semibold">
                            Bạn có chắc muốn hủy lịch hẹn này?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 font-semibold"
                                onClick={handleCancelModal}
                            >
                                Không
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-semibold"
                                onClick={handleConfirmCancel}
                            >
                                Hủy lịch
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <h2 className="text-3xl font-bold text-center text-[#15397F] mb-6">
                Lịch sử đặt lịch
            </h2>
            {appointments.length === 0 ? (
                <p className="text-center text-gray-500">
                    Chưa có lịch đặt nào
                </p>
            ) : (
                <div className="space-y-6">
                    {appointments.map((appointment) => (
                        <div
                            key={appointment.appointmentId}
                            className="bg-gray-50 border border-gray-200 rounded-xl shadow p-5 transition hover:shadow-lg"
                        >
                            <div className="flex flex-wrap gap-4 justify-between items-center mb-2">
                                <div className="text-sm text-gray-500">
                                    <span className="font-semibold text-[#15397F]">
                                        Mã:
                                    </span>{" "}
                                    {appointment.slug}
                                </div>
                                <div
                                    className="text-xs px-2 py-1 rounded font-semibold"
                                    style={{
                                        background:
                                            appointment.status === "CONFIRMED"
                                                ? "#e0f7fa"
                                                : appointment.status ===
                                                    "PENDING"
                                                  ? "#fff3cd"
                                                  : appointment.status ===
                                                      "CANCELLED"
                                                    ? "#fdecea"
                                                    : "#f3f4f6",
                                        color:
                                            appointment.status === "CONFIRMED"
                                                ? "#00796b"
                                                : appointment.status ===
                                                    "PENDING"
                                                  ? "#b26a00"
                                                  : appointment.status ===
                                                      "CANCELLED"
                                                    ? "#c62828"
                                                    : "#374151",
                                    }}
                                >
                                    {appointment.status === "CONFIRMED"
                                        ? "✅ Đã xác nhận"
                                        : appointment.status === "PENDING"
                                          ? "⏳ Chờ xác nhận"
                                          : appointment.status === "CANCELLED"
                                            ? "❌ Đã hủy"
                                            : appointment.status}
                                </div>
                            </div>
                            <div className="mb-2 text-sm text-gray-600">
                                <span className="font-semibold">Cửa hàng:</span>{" "}
                                {appointment.storeName}
                            </div>
                            <div className="mb-2 text-sm text-gray-600">
                                <span className="font-semibold">Dịch vụ:</span>
                                <ul className="list-disc list-inside ml-4 mt-1">
                                    {appointment.serviceName.map(
                                        (name, idx) => (
                                            <li key={idx}>{name}</li>
                                        )
                                    )}
                                </ul>
                            </div>
                            <div className="mb-2 text-sm text-gray-600">
                                <span className="font-semibold">Stylist:</span>{" "}
                                {appointment.employeeName}
                            </div>
                            <div className="mb-2 text-sm text-gray-600">
                                <span className="font-semibold">
                                    Thời gian:
                                </span>{" "}
                                {new Date(appointment.startTime).toLocaleString(
                                    "vi-VN"
                                )}
                            </div>
                            <div className="mb-2 text-sm text-gray-600">
                                <span className="font-semibold">
                                    Tổng tiền:
                                </span>{" "}
                                {appointment.totalAmount > 0
                                    ? `${appointment.totalAmount.toLocaleString()} VND`
                                    : "Chưa xác định"}
                            </div>
                            <div className="mb-2 text-sm text-gray-600">
                                <span className="font-semibold">Đặt lúc:</span>{" "}
                                {new Date(appointment.createdAt).toLocaleString(
                                    "vi-VN"
                                )}
                            </div>
                            {(appointment.status === "PENDING" ||
                                appointment.status === "CONFIRMED") && (
                                <button
                                    onClick={() =>
                                        handleCancelClick(
                                            appointment.appointmentId
                                        )
                                    }
                                    className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm font-semibold transition"
                                >
                                    Hủy lịch
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
