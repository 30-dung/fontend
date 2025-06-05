import { useState, useEffect } from 'react';
import api from '../../../../services/api';
import url from '../../../../services/url';

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
    createdAt: string; // Thêm trường createdAt
}

export function BookingHistory() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getUserEmail = async () => {
        try {
            const response = await api.get(url.USER.PROFILE);
            return response.data.email;
        } catch (err) {
            throw new Error('Không thể lấy thông tin người dùng');
        }
    };

    const fetchHistory = async () => {
        try {
            const email = await getUserEmail();
            const response = await api.get(url.APPOINTMENT.GET_BY_USER.replace('{email}', email));
            console.log('API response:', response.data);

            const appointmentMap = new Map<number, Appointment>();
            response.data.forEach((item: any) => {
                const appointmentId = item.appointmentId;
                if (appointmentMap.has(appointmentId)) {
                    const existing = appointmentMap.get(appointmentId)!;
                    existing.serviceName.push(item.storeService?.serviceName || 'Unknown Service');
                } else {
                    appointmentMap.set(appointmentId, {
                        appointmentId: item.appointmentId,
                        slug: item.slug || 'APPT-UNKNOWN',
                        storeName: item.storeService?.storeName || 'Unknown Store',
                        serviceName: [item.storeService?.serviceName || 'Unknown Service'],
                        employeeName: item.employee?.fullName || 'Unknown Employee',
                        startTime: item.startTime,
                        endTime: item.endTime,
                        status: item.status,
                        totalAmount: item.invoice?.totalAmount || 0,
                        createdAt: item.createdAt || new Date().toISOString(), // Thêm createdAt, fallback nếu BE không trả về
                    });
                }
            });

            // Sắp xếp appointments theo createdAt giảm dần
            const sortedAppointments = Array.from(appointmentMap.values()).sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            console.log('Sorted Appointments:', sortedAppointments);
            setAppointments(sortedAppointments);
            setLoading(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể tải lịch sử đặt lịch');
            setLoading(false);
        }
    };

    const cancelAppointment = async (appointmentId: number) => {
        if (!window.confirm('Bạn có chắc muốn hủy lịch hẹn này?')) return;

        try {
            await api.patch(url.APPOINTMENT.CANCEL.replace('{id}', appointmentId.toString()));
            setAppointments((prev) =>
                prev.map((appt) =>
                    appt.appointmentId === appointmentId ? { ...appt, status: 'CANCELLED' } : appt
                )
            );
            alert('Hủy lịch hẹn thành công');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể hủy lịch hẹn');
        }
    };

    useEffect(() => {
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
                            <p className="text-sm text-gray-600">
                                Mã đặt lịch: <strong>{appointment.slug}</strong>
                            </p>
                            <p className="text-sm text-gray-600">
                                Cửa hàng: <strong>{appointment.storeName}</strong>
                            </p>
                            <p className="text-sm text-gray-600">
                                Dịch vụ: <strong>{appointment.serviceName.join(', ')}</strong>
                            </p>
                            <p className="text-sm text-gray-600">
                                Stylist: <strong>{appointment.employeeName}</strong>
                            </p>
                            <p className="text-sm text-gray-600">
                                Thời gian:{' '}
                                <strong>{new Date(appointment.startTime).toLocaleString('vi-VN')}</strong>
                            </p>
                            <p className="text-sm text-gray-600">
                                Trạng thái: <strong>{appointment.status}</strong>
                            </p>
                            <p className="text-sm text-gray-600">
                                Tổng tiền:{' '}
                                <strong>
                                    {appointment.totalAmount > 0
                                        ? `${appointment.totalAmount.toLocaleString()} VND`
                                        : 'Chưa xác định'}
                                </strong>
                            </p>
                            <p className="text-sm text-gray-600">
                                Đặt lúc:{' '}
                                <strong>{new Date(appointment.createdAt).toLocaleString('vi-VN')}</strong>
                            </p>
                            {(appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') && (
                                <button
                                    onClick={() => cancelAppointment(appointment.appointmentId)}
                                    className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
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