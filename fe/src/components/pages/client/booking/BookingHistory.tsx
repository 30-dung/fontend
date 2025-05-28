import { useState, useEffect } from 'react';
import api from "../../../../services/api";
import url from "../../../../services/url";

interface Appointment {
    appointmentId: number;
    storeName: string;
    serviceName: string;
    employeeName: string;
    startTime: string;
    endTime: string;
    status: string;
    totalAmount: number;
}

export function BookingHistory() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get(url.APPOINTMENT.GET_ALL);
                setAppointments(response.data);
                setLoading(false);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Không thể tải lịch sử đặt lịch');
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <div className="text-center py-4">Đang tải...</div>;
    if (error) return <div className="text-center text-red-500 py-4">{error}</div>;

    return (
        <div className="w-full max-w-md mx-auto bg-gray-100 min-h-screen font-sans p-4">
            <h2 className="text-2xl font-bold text-center text-[#15397F] mb-4">Lịch sử đặt lịch</h2>
            {appointments.length === 0 ? (
                <p className="text-center text-gray-500">Chưa có lịch đặt nào</p>
            ) : (
                <div className="space-y-4">
                    {appointments.map((appointment) => (
                        <div key={appointment.appointmentId} className="bg-white rounded-lg shadow-md p-4">
                            <p className="text-sm text-gray-600">Mã đặt lịch: <strong>#{appointment.appointmentId}</strong></p>
                            <p className="text-sm text-gray-600">Cửa hàng: <strong>{appointment.storeName}</strong></p>
                            <p className="text-sm text-gray-600">Dịch vụ: <strong>{appointment.serviceName}</strong></p>
                            <p className="text-sm text-gray-600">Stylist: <strong>{appointment.employeeName}</strong></p>
                            <p className="text-sm text-gray-600">Thời gian: <strong>{new Date(appointment.startTime).toLocaleString('vi-VN')}</strong></p>
                            <p className="text-sm text-gray-600">Trạng thái: <strong>{appointment.status}</strong></p>
                            <p className="text-sm text-gray-600">Tổng tiền: <strong>{appointment.totalAmount.toLocaleString()} VND</strong></p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}