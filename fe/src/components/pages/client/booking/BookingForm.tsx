import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaStore, FaCut, FaUser, FaCalendarAlt, FaChevronRight } from 'react-icons/fa';
import api from "../../../../services/api";
import url from "../../../../services/url";

interface Store {
    storeId: number;
    storeName: string;
}

interface Service {
    storeServiceId: number;
    service: {
        serviceName: string;
    };
    price: number;
}

export function Booking() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [step, setStep] = useState<number>(parseInt(searchParams.get('step') || '0'));
    const [phone, setPhone] = useState<string>('');
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Load user profile
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                if (!localStorage.getItem('token')) {
                    setError('Vui lòng đăng nhập để tiếp tục');
                    navigate('/login');
                    return;
                }
                const response = await api.get(url.USER.PROFILE);
                setPhone(response.data.phoneNumber || '');
            } catch (err: any) {
                setError('Không thể tải thông tin người dùng');
            }
        };
        fetchUserProfile();
    }, [navigate]);

    // Load salon nếu có salonId
    useEffect(() => {
        const salonId = searchParams.get('salonId') || localStorage.getItem('storeId');
        if (salonId && salonId !== '0') {
            api.get(`${url.STORE.GET_BY_ID}/${salonId}`)
                .then((res) => {
                    setSelectedStore(res.data);
                    localStorage.setItem('storeId', salonId);
                })
                .catch((err) => {
                    setError('Không thể tải thông tin salon: ' + (err.response?.data?.message || err.message));
                });
        }
    }, [searchParams]);

    // Load services đã chọn
    useEffect(() => {
        const salonId = searchParams.get('salonId') || localStorage.getItem('storeId');
        const services = JSON.parse(localStorage.getItem('selectedServices') || '[]');

        if (services.length > 0 && salonId) {
            Promise.all(
                services.map((serviceId: number) =>
                    api.get(`${url.STORE_SERVICE.GET_BY_STORE}/${salonId}`)
                        .then((res) => res.data.find((s: Service) => s.storeServiceId === serviceId))
                )
            ).then((fetchedServices) => {
                setSelectedServices(fetchedServices.filter((s: Service | undefined): s is Service => !!s));
            }).catch(() => {
                setError('Không thể tải chi tiết dịch vụ');
            });
        }
    }, [searchParams]);

    // Cập nhật URL với searchParams khi phone hoặc step thay đổi
    useEffect(() => {
        const currentSalonId = selectedStore?.storeId?.toString() || searchParams.get('salonId') || localStorage.getItem('storeId') || '0';
        const currentPhone = phone || searchParams.get('phone') || '';

        setSearchParams({
            phone: currentPhone,
            salonId: currentSalonId,
            step: step.toString(),
        });
    }, [phone, step, selectedStore, setSearchParams]);

    const handleStepChange = (newStep: number) => {
        setStep(newStep);
    };

    return (
        <div className="w-full max-w-md mx-auto bg-gray-100 min-h-screen font-sans">
            <div className="navigator flex justify-center py-4">
                <span className="text-2xl font-bold text-[#15397F] tracking-tight">Đặt lịch giữ chỗ</span>
            </div>

            <div className="bg-white p-4">
                <div className="body relative py-4">
                    <div className="main-screen space-y-4">
                        {/* Chọn Salon */}
                        <div className="main-screen__block bg-white rounded-xl p-5 transition-all">
                            <div className="font-semibold text-lg text-[#15397F] mb-3">1. Chọn salon</div>
                            <div
                                className="flex items-center bg-gray-50 h-12 rounded-lg px-4 border cursor-pointer hover:bg-gray-100 transition"
                                onClick={() => {
                                    handleStepChange(1);
                                    navigate('/store');
                                }}
                            >
                                <FaStore className="mr-3 w-5 h-5 text-[#15397F] transition" />
                                <span className="text-sm text-gray-600 truncate w-full">
                                    {selectedStore ? selectedStore.storeName : 'Chọn salon'}
                                </span>
                                <FaChevronRight className="w-4 h-4 ml-2 text-gray-500 transition" />
                            </div>
                        </div>

                        {/* Chọn dịch vụ */}
                        <div className="main-screen__block bg-white rounded-xl p-5 transition-all">
                            <div className="font-semibold text-lg text-[#15397F] mb-3">2. Chọn dịch vụ</div>
                            <div
                                className="flex items-center bg-gray-50 h-12 rounded-lg px-4 cursor-pointer hover:bg-gray-100 transition"
                                onClick={() => {
                                    if (!selectedStore) {
                                        setError('Vui lòng chọn salon trước');
                                        return;
                                    }
                                    handleStepChange(2);
                                    navigate('/services');
                                }}
                            >
                                <FaCut className="mr-3 w-5 h-5 text-[#15397F] transition" />
                                <span className="text-sm text-gray-600 truncate w-full">
                                    Đã chọn {selectedServices.length} dịch vụ (Tổng: {selectedServices
                                        .reduce((sum, s) => sum + s.price, 0)
                                        .toLocaleString()} VND)
                                </span>
                                <FaChevronRight className="w-4 h-4 ml-2 text-gray-500 transition" />
                            </div>
                        </div>

                        {/* Chọn stylist và thời gian */}
                        <div className="main-screen__block bg-white rounded-xl p-5 transition-all">
                            <div className="font-semibold text-lg text-[#15397F] mb-3">3. Chọn stylist & thời gian</div>
                            <div
                                className="flex items-center bg-gray-50 h-12 rounded-lg px-4 cursor-pointer hover:bg-gray-100 transition"
                                onClick={() => {
                                    if (!selectedStore || selectedServices.length === 0) {
                                        setError('Vui lòng chọn salon và ít nhất một dịch vụ trước');
                                        return;
                                    }
                                    handleStepChange(3);
                                    navigate('/stylist-and-time');
                                }}
                            >
                                <FaUser className="mr-3 w-5 h-5 text-[#15397F] transition" />
                                <span className="text-sm text-gray-600 truncate w-full">Chọn stylist & thời gian</span>
                                <FaChevronRight className="w-4 h-4 ml-2 text-gray-500 transition" />
                            </div>
                        </div>

                        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
