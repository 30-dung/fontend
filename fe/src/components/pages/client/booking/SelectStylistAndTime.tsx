import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from "../../../../services/api";
import url from "../../../../services/url";

interface Employee {
    employeeId: number;
    fullName: string;
    email: string;
    phoneNumber: string;
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

export function SelectStylistAndTime() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const storeId = localStorage.getItem('storeId');
    const selectedServices = JSON.parse(localStorage.getItem('selectedServices') || '[]');
    const phone = searchParams.get('phone') || '';
    const [stylists, setStylists] = useState<Employee[]>([]);
    const [selectedStylist, setSelectedStylist] = useState<Employee | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]); // 27/05/2025
    const [availableSlots, setAvailableSlots] = useState<WorkingTimeSlot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<WorkingTimeSlot | null>(null);
    const [servicesDetails, setServicesDetails] = useState<StoreService[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStylists = async () => {
            if (!storeId) {
                setError('Vui lòng chọn salon trước');
                return;
            }
            setLoading(true);
            try {
                const response = await api.get(`${url.EMPLOYEE.BY_STORE}/${storeId}`);
                setStylists(response.data);
                setError(null);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Không thể tải danh sách stylist');
            } finally {
                setLoading(false);
            }
        };
        fetchStylists();

        const fetchServicesDetails = async () => {
            try {
                const response = await api.get(`${url.STORE_SERVICE.GET_BY_STORE}/${storeId}`);
                const services = response.data.filter((s: StoreService) =>
                    selectedServices.includes(s.storeServiceId)
                );
                setServicesDetails(services);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Không thể tải chi tiết dịch vụ');
            }
        };
        fetchServicesDetails();
    }, [storeId]);

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (!selectedStylist || !selectedDate) return;
            setLoading(true);
            try {
                const response = await api.get(url.EMPLOYEE.WORKING_TIME_SLOTS, {
                    params: {
                        employeeId: selectedStylist.employeeId,
                        date: selectedDate,
                    },
                });
                setAvailableSlots(response.data);
                setError(null);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Không thể tải khung giờ trống');
            } finally {
                setLoading(false);
            }
        };
        fetchAvailableSlots();
    }, [selectedStylist, selectedDate]);

    const formatDateTimeWithoutOffset = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    const handleConfirm = async () => {
        if (!selectedStylist || !selectedSlot || servicesDetails.length === 0) {
            setError('Vui lòng chọn stylist, thời gian và dịch vụ');
            return;
        }

        let currentStartTime = new Date(selectedSlot.startTime);
        const appointments = servicesDetails.map((service) => {
            const duration = service.service.durationMinutes;
            const startTime = formatDateTimeWithoutOffset(currentStartTime);
            const endTime = formatDateTimeWithoutOffset(new Date(currentStartTime.getTime() + duration * 60000));
            currentStartTime = new Date(endTime);
            return {
                storeServiceId: service.storeServiceId,
                timeSlotId: selectedSlot.timeSlotId,
                startTime: startTime,
                endTime: endTime,
                notes: "Khách hàng ưu tiên nhanh",
            };
        });

        try {
            const response = await api.post(url.APPOINTMENT.CREATE, appointments);
            const appointmentIds = Array.isArray(response.data) ? response.data.map((a: any) => a.appointmentId) : [response.data.appointmentId];
            localStorage.setItem('appointmentId', appointmentIds[0].toString());
            setSearchParams({
                phone,
                salonId: storeId || '0',
                step: '3',
            });
            navigate('/booking-confirmation');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể tạo cuộc hẹn');
        }
    };

    const currentTime = new Date().getTime(); // Current time in milliseconds

    return (
        <div className="w-full max-w-md mx-auto bg-gray-100 min-h-screen font-sans p-4">
            <h2 className="text-2xl font-bold text-center text-[#15397F] mb-4">Chọn stylist & thời gian</h2>

            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <h3 className="text-lg font-semibold text-[#15397F] mb-2">Chọn stylist</h3>
                {loading && <div className="text-center text-gray-500 py-4">Đang tải...</div>}
                {error && <div className="text-center text-red-500 py-4">{error}</div>}
                {!loading && !error && (
                    <select
                        className="w-full p-2 border rounded-lg"
                        onChange={(e) => {
                            const stylist = stylists.find(s => s.employeeId === parseInt(e.target.value));
                            setSelectedStylist(stylist || null);
                        }}
                    >
                        <option value="">Chọn stylist</option>
                        {stylists.map((stylist) => (
                            <option key={stylist.employeeId} value={stylist.employeeId}>
                                {stylist.fullName}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <h3 className="text-lg font-semibold text-[#15397F] mb-2">Chọn ngày</h3>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    min={new Date().toISOString().split('T')[0]}
                />
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <h3 className="text-lg font-semibold text-[#15397F] mb-2">Chọn khung giờ</h3>
                {loading && <div className="text-center text-gray-500 py-4">Đang tải...</div>}
                {error && <div className="text-center text-red-500 py-4">{error}</div>}
                {!loading && !error && availableSlots.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                        {availableSlots.map((slot) => {
                            const slotStartTime = new Date(slot.startTime).getTime();
                            const isPast = slotStartTime < currentTime;
                            return (
                                <button
                                    key={`${slot.timeSlotId}-${slot.startTime}`}
                                    className={`p-2 border rounded-lg ${isPast ? 'bg-gray-300 cursor-not-allowed' : selectedSlot?.startTime === slot.startTime ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                                    onClick={() => !isPast && setSelectedSlot(slot)}
                                    disabled={isPast}
                                >
                                    {new Date(slot.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) +
                                     ' - ' +
                                     new Date(slot.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </button>
                            );
                        })}
                    </div>
                )}
                {!loading && !error && availableSlots.length === 0 && (
                    <div className="text-center text-gray-500 py-4">Không có khung giờ trống</div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
                <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2"
                    onClick={handleConfirm}
                >
                    Chốt giờ cắt
                </button>
            </div>
        </div>
    );
}