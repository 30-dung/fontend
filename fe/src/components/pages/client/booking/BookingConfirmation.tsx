import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../services/api';
import url from '../../../../services/url';
import routes from '../../../../config/routes';

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
            const appointmentId = localStorage.getItem('appointmentId');
            console.log('appointmentId:', appointmentId);
            if (!appointmentId) {
                setError('Không tìm thấy thông tin đặt lịch');
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`${url.APPOINTMENT.GET_BY_ID}/${appointmentId}`);
                console.log('API response:', response.data);
                if (Array.isArray(response.data)) {
                    setAppointments(response.data);
                } else if (response.data) {
                    setAppointments([response.data]);
                } else {
                    setError('Không tìm thấy thông tin cuộc hẹn');
                }
                setLoading(false);
            } catch (err: any) {
                console.error('API error:', err);
                setError(err.response?.data?.message || 'Không thể tải thông tin đặt lịch');
                setLoading(false);
            }
        };
        fetchAppointment();
    }, []);

    if (loading) return <div className="text-center py-4">Đang tải...</div>;
    if (error) return <div className="text-center text-red-500 py-4">{error}</div>;

    return (
        <div className="w-full max-w-md mx-auto bg-gray-100 min-h-screen font-sans p-4">
            <h2 className="text-2xl font-bold text-center text-[#15397F] mb-4">Xác nhận đặt lịch</h2>
            {appointments.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                    <p className="text-sm text-gray-600">
                        Mã đặt lịch: <strong>{appointments[0].slug}</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                        Cửa hàng: <strong>{appointments[0].storeService?.storeName || 'N/A'}</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                        Dịch vụ:{' '}
                        <strong>
                            {appointments.map((app, index) => (
                                <span key={index}>
                                    {app.storeService?.serviceName || 'N/A'}
                                    {index < appointments.length - 1 ? ', ' : ''}
                                </span>
                            ))}
                        </strong>
                    </p>
                    <p className="text-sm text-gray-600">
                        Stylist: <strong>{appointments[0].employee?.fullName || 'N/A'}</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                        Thời gian:{' '}
                        <strong>
                            {new Date(appointments[0].startTime).toLocaleString('vi-VN')} -{' '}
                            {new Date(appointments[0].endTime).toLocaleString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </strong>
                    </p>
                    <p className="text-sm text-gray-600">
                        Trạng thái: <strong>{appointments[0].status || 'N/A'}</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                        Tổng tiền:{' '}
                        <strong>
                            {(appointments.reduce((sum, app) => sum + (app.invoice?.totalAmount || 0), 0)).toLocaleString()} VND
                        </strong>
                    </p>
                </div>
            ) : (
                <div className="text-center text-gray-600 py-4">
                    Không có thông tin cuộc hẹn để hiển thị.
                </div>
            )}
            <button
                className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg py-2"
                onClick={() => navigate(routes.bookingHistorey)}
            >
                Xem lịch sử đặt lịch
            </button>
        </div>
    );
}