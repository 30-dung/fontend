import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from "../../../../services/api";
import url from "../../../../services/url";

interface Store {
  storeId: number;
  storeName: string;
  phoneNumber: string;
  cityProvince: string;
  district: string;
  openingTime?: string;
  closingTime?: string;
  description?: string;
  averageRating?: number;
}

interface CityWithCountDTO {
  cityProvince: string;
  count: number;
}

interface SelectStoreProps {
  salonId: string;
  phone: string;
  setStep: (step: number) => void;
}

export function SelectStore({ salonId, phone, setStep }: SelectStoreProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [stores, setStores] = useState<Store[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showStoreList, setShowStoreList] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      try {
        const response = await api.get(url.STORE.CITIES);
        setCities(response.data.map((city: CityWithCountDTO) => city.cityProvince));
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải danh sách tỉnh/thành phố');
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchStores = async () => {
      if (!searchTerm.trim()) {
        setStores([]);
        setShowStoreList(false);
        return;
      }
      setLoading(true);
      try {
        const response = await api.get(url.STORE.LOCATE, {
          params: {
            cityProvince: searchTerm.includes(',') ? searchTerm.split(',')[0].trim() : searchTerm,
            district: searchTerm.includes(',') ? searchTerm.split(',')[1].trim() : '',
          },
        });
        setStores(response.data);
        setShowStoreList(true);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không tìm thấy salon');
        setStores([]);
        setShowStoreList(true);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(() => fetchStores(), 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleStoreSelect = (store: Store) => {
    localStorage.setItem('storeId', store.storeId.toString());
    localStorage.removeItem('selectedServices');
    localStorage.removeItem('appointmentId');
    setSearchParams({
      phone,
      salonId: store.storeId.toString(),
      step: '0',
    });
    setStep(0);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center text-[#15397F] mb-6">Chọn salon</h2>
      <div className="bg-white rounded-lg shadow-sm flex items-center px-4 py-3 mb-5">
        <img src="/static/media/search.4c2a166d.svg" alt="search" className="w-5 h-5 mr-2.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm salon theo tỉnh, thành phố, quận (VD: Hà Nội, Ba Đình)"
          className="text-black w-full border-none focus:outline-none text-sm placeholder-gray-500 bg-transparent"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')}>
            <span className="text-gray-400 text-lg">×</span>
          </button>
        )}
      </div>

      {loading && <div className="text-center text-gray-500 py-4">Đang tải...</div>}

      {error && !loading && <div className="text-center text-red-600 py-4">{error}</div>}

      {!showStoreList && !loading && (
        <div className="bg-white rounded-lg shadow-sm px-4 py-4">
          <div className="font-semibold mb-3 text-[15px]">
            Barbershop có mặt trên các tỉnh thành:
          </div>
          <div className="flex flex-wrap gap-2">
            {cities.length > 0 ? (
              cities.map((city) => (
                <div
                  key={city}
                  onClick={() => setSearchTerm(city)}
                  className="bg-[#9AA5CF] text-white text-sm px-3 py-1.5 rounded-md cursor-pointer hover:opacity-90"
                >
                  {city}
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm">Không có tỉnh/thành phố nào.</div>
            )}
          </div>
        </div>
      )}

      {showStoreList && !loading && (
        <div className="space-y-3">
          {stores.length > 0 ? (
            stores.map((store) => (
              <div
                key={store.storeId}
                className="bg-white rounded-lg shadow-sm p-3 flex items-center cursor-pointer hover:bg-gray-50 transition duration-200"
                onClick={() => handleStoreSelect(store)}
              >
                <img
                  src="https://via.placeholder.com/100x80?text=Salon"
                  alt={store.storeName}
                  className="w-24 h-20 object-cover rounded-md mr-4"
                />
                <div>
                  <div className="font-medium text-sm mb-1">{store.storeName}</div>
                  <div className="text-sm text-gray-500">
                    {store.description || 'Không có mô tả'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {store.district}, {store.cityProvince}
                  </div>
                  <div className="text-sm text-gray-500">
                    Giờ mở: {store.openingTime || 'N/A'} - {store.closingTime || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">SĐT: {store.phoneNumber}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-6">
              Không tìm thấy salon nào.
            </div>
          )}
        </div>
      )}
    </div>
  );
}