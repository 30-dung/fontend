import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from "../../../../services/api";
import url from "../../../../services/url";

interface StoreService {
    storeServiceId: number;
    service: {
        serviceId: number;
        serviceName: string;
        description: string;
        durationMinutes: number;
    };
    price: number;
}

export function SelectService() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const storeId = localStorage.getItem('storeId');
    const selectedServices = JSON.parse(localStorage.getItem('selectedServices') || '[]');
    const phone = searchParams.get('phone') || '';
    const [services, setServices] = useState<StoreService[]>([]);
    const [selectedServicesState, setSelectedServicesState] = useState<StoreService[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const fetchServices = async () => {
            if (!storeId) {
                setError('Vui lòng chọn cửa hàng trước');
                return;
            }
            setLoading(true);
            try {
                const response = await api.get(`${url.STORE_SERVICE.GET_BY_STORE}/${storeId}`);
                setServices(response.data);
                setError(null);

                const savedServices = response.data.filter((s: StoreService) =>
                    selectedServices.includes(s.storeServiceId)
                );
                setSelectedServicesState(savedServices);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Không thể tải danh sách dịch vụ');
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [storeId]);

    const handleSelectService = (service: StoreService) => {
        setSelectedServicesState((prev) =>
            prev.find((s) => s.storeServiceId === service.storeServiceId)
                ? prev.filter((s) => s.storeServiceId !== service.storeServiceId)
                : [...prev, service]
        );
    };

    const handleConfirm = () => {
        if (selectedServicesState.length === 0) {
            setError('Vui lòng chọn ít nhất một dịch vụ');
            return;
        }
        localStorage.setItem('selectedServices', JSON.stringify(selectedServicesState.map(s => s.storeServiceId)));
        setSearchParams({
            phone,
            salonId: storeId || '0',
            step: '2',
        });
        navigate('/booking');
    };

    const filteredServices = services.filter((service) =>
        service.service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full max-w-2xl mx-auto bg-gray-100 min-h-screen font-sans p-4">
            <h2 className="text-2xl font-bold text-center text-[#15397F] mb-4">Chọn dịch vụ</h2>
            <div className="bg-white rounded-lg shadow-md flex items-center px-4 py-2 mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm dịch vụ..."
                    className="w-full border-none focus:outline-none text-sm placeholder-gray-500 bg-transparent"
                />
                {searchTerm && (
                    <button className="ml-2 text-gray-500" onClick={() => setSearchTerm('')}>
                        <span className="text-lg">×</span>
                    </button>
                )}
            </div>

            {loading && <div className="text-center text-gray-500 py-4">Đang tải...</div>}
            {error && <div className="text-center text-red-500 py-4">{error}</div>}

            {!loading && !error && (
                <div className="grid grid-cols-2 gap-4">
                    {filteredServices.map((service) => (
                        <div
                            key={service.storeServiceId}
                            className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden"
                        >
                            <img
                                className="w-full h-40 object-cover"
                                src={service.service.description.includes('Combo') ? 'https://storage.30shine.com/service/combo_booking/1046.jpg' : 'https://storage.30shine.com/Resource/bookingService/2022/10/12/thumb_600x400_comboservice_1665576728.jpg'}
                                alt={service.service.serviceName}
                            />
                            <div className="p-3">
                                <p className="text-sm text-gray-600">{service.service.serviceName}</p>
                                <p className="text-xs text-gray-500">{service.service.description}</p>
                                <p className="text-xs text-gray-500">Thời gian: {service.service.durationMinutes} phút</p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-lg font-bold text-gray-900">{service.price.toLocaleString()} VND</span>
                                    <button
                                        className={`text-white rounded-lg text-sm px-3 py-1 ${selectedServicesState.find(s => s.storeServiceId === service.storeServiceId) ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'}`}
                                        onClick={() => handleSelectService(service)}
                                    >
                                        {selectedServicesState.find(s => s.storeServiceId === service.storeServiceId) ? 'Đã chọn' : 'Thêm dịch vụ'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-md">
                <p className="text-sm text-gray-600">Đã chọn {selectedServicesState.length} dịch vụ</p>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-gray-900">Tổng thanh toán</span>
                    <span className="text-lg font-bold text-gray-900">
                        {selectedServicesState
                            .reduce((sum, s) => sum + s.price, 0)
                            .toLocaleString()} VND
                    </span>
                </div>
                <button
                    className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2"
                    onClick={handleConfirm}
                >
                    Tiếp tục
                </button>
            </div>
        </div>
    );
}