import React, { useState, useEffect } from 'react';
import api from "../../../../services/api";
import url from "../../../../services/url";

// Định nghĩa interface cho Store
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
  createdAt?: string;
}

// Định nghĩa interface cho CityWithCountDTO
interface CityWithCountDTO {
  cityProvince: string;
  count: number;
}

// Hàm gọi API tìm kiếm cửa hàng
const searchStoresByCityOrDistrict = async (cityProvince: string, district?: string): Promise<Store[]> => {
  try {
    console.log('Calling API:', `${url.STORE.LOCATE}?cityProvince=${cityProvince}${district ? `&district=${district}` : ''}`);
    const response = await api.get(url.STORE.LOCATE, {
      params: { cityProvince, district },
    });
    console.log('Stores response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching stores:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không tìm thấy cửa hàng');
  }
};

// Hàm lấy danh sách tỉnh/thành phố
const getCities = async (): Promise<string[]> => {
  try {
    console.log('Calling API:', url.STORE.CITIES);
    const response = await api.get(url.STORE.CITIES);
    console.log('Cities response:', response.data);
    return response.data.map((city: CityWithCountDTO) => city.cityProvince);
  } catch (error: any) {
    console.error('Error fetching cities:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể tải danh sách tỉnh/thành phố');
  }
};

export function SelectStore() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [stores, setStores] = useState<Store[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showStoreList, setShowStoreList] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Lấy danh sách tỉnh/thành phố khi component mount
  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      try {
        const cityList = await getCities();
        setCities(cityList);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  // Tìm kiếm cửa hàng khi searchTerm thay đổi
  useEffect(() => {
    const fetchStores = async () => {
      if (!searchTerm.trim()) {
        setStores([]);
        setShowStoreList(false);
        return;
      }
      setLoading(true);
      try {
        const storeList = await searchStoresByCityOrDistrict(searchTerm);
        setStores(storeList);
        setShowStoreList(true);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setStores([]);
        setShowStoreList(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, [searchTerm]);

  // Bọc render trong try-catch để tránh crash
  try {
    return (
      <div className="bg-[#f1f1f1] min-h-screen py-6 px-4">
        <div className="max-w-md mx-auto">
          {/* Ô tìm kiếm */}
          <div className="bg-white rounded-xl shadow-md flex items-center px-4 py-3 mb-5">
            <img
              src="/static/media/search.4c2a166d.svg"
              alt="search"
              className="w-5 h-5 mr-2"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm salon theo tỉnh, thành phố, quận"
              className="w-full border-none focus:outline-none text-sm placeholder-gray-400 bg-transparent"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')}>
                <span className="text-gray-400 text-lg">×</span>
              </button>
            )}
          </div>

          {/* Trạng thái loading */}
          {loading && (
            <div className="text-center text-gray-500 py-4">Đang tải...</div>
          )}

          {/* Hiển thị lỗi nếu có */}
          {error && !loading && (
            <div className="text-center text-red-500 py-4">{error}</div>
          )}

          {/* Hiển thị danh sách tỉnh/thành phố nếu không có searchTerm */}
          {!showStoreList && !loading && (
            <div className="bg-white rounded-md shadow-sm px-4 py-4">
              <div className="font-semibold mb-3 text-[15px]">
                30Shine có mặt trên các tỉnh thành:
              </div>
              <div className="flex flex-wrap gap-2">
                {cities.length > 0 ? (
                  cities.map((city) => (
                    <div
                      key={city}
                      onClick={() => setSearchTerm(city)}
                      className="bg-[#9AA5BF] text-white text-sm px-3 py-1.5 rounded-md cursor-pointer hover:opacity-90"
                    >
                      {city}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">Không có tỉnh/thành phố nào.</div>
                )}
              </div>
            </div>
          )}

          {/* Hiển thị danh sách cửa hàng nếu có searchTerm */}
          {showStoreList && !loading && (
            <div className="space-y-3">
              {stores.length > 0 ? (
                stores.map((store) => (
                  <div
                    key={store.storeId}
                    className="bg-white rounded-lg shadow-sm p-3 flex"
                  >
                    <img
                      src="https://via.placeholder.com/100x80?text=Store"
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
                        Giờ mở cửa: {store.openingTime || 'N/A'} - {store.closingTime || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        SĐT: {store.phoneNumber}
                      </div>
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
      </div>
    );
  } catch (error) {
    console.error('Render error:', error);
    return <div className="text-center text-red-500 py-4">Có lỗi xảy ra, vui lòng thử lại.</div>;
  }
}