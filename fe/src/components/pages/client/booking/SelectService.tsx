import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from "../../../../services/api";
import url from "../../../../services/url";
import { Service } from './BookingForm';

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

interface SelectServiceProps {
  salonId: string;
  phone: string;
  setSelectedServices: React.Dispatch<React.SetStateAction<Service[]>>;
  setStep: (step: number) => void;
}

export function SelectService({ salonId, phone, setSelectedServices, setStep }: SelectServiceProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const storeId = localStorage.getItem('storeId') || salonId;
  const selectedServicesIds = JSON.parse(localStorage.getItem('selectedServices') || '[]');
  const [services, setServices] = useState<StoreService[]>([]);
  const [selectedServicesState, setSelectedServicesState] = useState<StoreService[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchServices = async () => {
      if (!storeId || storeId === '0') {
        setError('Vui lòng chọn salon trước');
        return;
      }
      setLoading(true);
      try {
        const response = await api.get(`${url.STORE_SERVICE.GET_BY_STORE}/${storeId}`);
        setServices(response.data);
        setError(null);

        const savedServices = response.data.filter((s: StoreService) =>
          selectedServicesIds.includes(s.storeServiceId)
        );
        setSelectedServicesState(savedServices);
        setSelectedServices(savedServices.map((s: StoreService) => ({
          storeServiceId: s.storeServiceId,
          service: {
            serviceName: s.service.serviceName,
            durationMinutes: s.service.durationMinutes,
          },
          price: s.price,
        })));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải danh sách dịch vụ');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [storeId, setSelectedServices]);

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
    setSelectedServices(selectedServicesState.map((s: StoreService) => ({
      storeServiceId: s.storeServiceId,
      service: {
        serviceName: s.service.serviceName,
        durationMinutes: s.service.durationMinutes,
      },
      price: s.price,
    })));
    setSearchParams({
      phone,
      salonId: storeId,
      step: '0',
    });
    setStep(0);
  };

  const filteredServices = services.filter((service) =>
    service.service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center text-[#15397F] mb-6">Chọn dịch vụ</h2>
      <div className="bg-white rounded-lg shadow-sm flex items-center px-4 py-3 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            const timeout = setTimeout(() => setSearchTerm(value), 300);
            return () => clearTimeout(timeout);
          }}
          placeholder="Tìm kiếm dịch vụ..."
          className="text-black w-full border-none focus:outline-none text-sm placeholder-gray-500 bg-transparent"
        />
        {searchTerm && (
          <button className="ml-2 text-gray-500" onClick={() => setSearchTerm('')}>
            <span className="text-lg">×</span>
          </button>
        )}
      </div>

      {loading && <div className="text-center text-gray-500 py-4">Đang tải...</div>}
      {error && <div className="text-center text-red-600 py-4">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.storeServiceId}
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
            >
              <img
                className="w-full h-40 object-cover"
                src={service.service.description.includes('Combo')
                  ? 'https://storage.30shine.com/service/combo_booking/1046.jpg'
                  : 'https://storage.30shine.com/Resource/bookingService/2022/10/12/thumb_600x400_comboservice_1665576728.jpg'}
                alt={service.service.serviceName}
              />
              <div className="p-4">
                <p className="text-sm text-gray-700 font-medium">{service.service.serviceName}</p>
                <p className="text-xs text-gray-500 mt-1">{service.service.description}</p>
                <p className="text-xs text-gray-500 mt-1">Thời gian: {service.service.durationMinutes} phút</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-base font-semibold text-gray-900">{service.price.toLocaleString()} VND</span>
                  <button
                    className={`text-white font-semibold text-sm px-4 py-1.5 rounded-lg ${
                      selectedServicesState.find(s => s.storeServiceId === service.storeServiceId)
                        ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    onClick={() => handleSelectService(service)}
                  >
                    {selectedServicesState.find(s => s.storeServiceId === service.storeServiceId)
                      ? 'Đã chọn' : 'Thêm dịch vụ'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <p className="text-sm text-gray-600 font-medium">Đã chọn {selectedServicesState.length} dịch vụ</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-base font-semibold text-gray-900">Tổng thanh toán</span>
          <span className="text-base font-semibold text-gray-900">
            {selectedServicesState
              .reduce((sum, s) => sum + s.price, 0)
              .toLocaleString()} VND
          </span>
        </div>
        <button
          className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-lg"
          onClick={handleConfirm}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
}