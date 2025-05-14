import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function BookingPage() {
  const [step, setStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(true);
  const navigate = useNavigate();

  const handleSubmitPhone = () => {
    if (phoneNumber.length >= 10) {
      setShowLoginModal(false);
      setStep(1);
    }
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <div className="bg-shine-background-default min-h-[70vh]">
      <div className="booking-screen">
        <div className="body relative">
          <div className="navigator flex justify-between py-3 px-2.5 text-center text-shine-primary">
            <span className="mx-auto text-shine-primary">Đặt lịch giữ chỗ</span>
          </div>

          <div className="main-screen">
            {!showLoginModal && (
              <div className="container mx-auto max-w-md px-4 py-6">
                {/* Step 1: Choose salon */}
                {step === 1 && (
                  <div className="main-screen__block main-screen__block--active">
                    <div className="font-semibold text-lg mb-3 text-shine-primary">1. Chọn salon</div>
                    <div className="block__wrapper">
                      <div className="wrapper__swiper bg-white rounded-lg p-4 shadow-sm">
                        <div className="swiper-container">
                          <div className="swiper-wrapper">
                            <div className="swiper-slide swiper__salon buttonSalonNear" role="presentation">
                              <button
                                className="w-full flex items-center justify-center p-3 rounded-lg border border-shine-primary text-shine-primary font-medium"
                                onClick={() => setStep(2)}
                              >
                                <svg
                                  className="w-5 h-5 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                <span className="list-address__text">Tìm salon gần anh</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Choose Service */}
                {step === 2 && (
                  <div className="main-screen__block main-screen__block--active">
                    <div className="font-semibold text-lg mb-3 text-shine-primary">2. Chọn dịch vụ</div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="mb-3">
                        <div className="flex items-center p-3 border-b border-gray-100">
                          <input
                            type="checkbox"
                            id="service-1"
                            className="mr-3 h-5 w-5 accent-shine-primary"
                          />
                          <label htmlFor="service-1" className="flex-1">
                            <div className="font-medium">Combo cắt gội 1</div>
                            <div className="text-sm text-gray-500">45 phút - 100.000đ</div>
                          </label>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="flex items-center p-3 border-b border-gray-100">
                          <input
                            type="checkbox"
                            id="service-2"
                            className="mr-3 h-5 w-5 accent-shine-primary"
                          />
                          <label htmlFor="service-2" className="flex-1">
                            <div className="font-medium">Combo cắt gội 2</div>
                            <div className="text-sm text-gray-500">55 phút - 140.000đ</div>
                          </label>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="flex items-center p-3">
                          <input
                            type="checkbox"
                            id="service-3"
                            className="mr-3 h-5 w-5 accent-shine-primary"
                          />
                          <label htmlFor="service-3" className="flex-1">
                            <div className="font-medium">Uốn tóc</div>
                            <div className="text-sm text-gray-500">90 phút - 379.000đ</div>
                          </label>
                        </div>
                      </div>
                      <button
                        className="w-full bg-shine-primary text-white font-semibold py-3 rounded-lg mt-4"
                        onClick={() => setStep(3)}
                      >
                        Tiếp tục
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Choose date, time and stylist */}
                {step === 3 && (
                  <div className="main-screen__block main-screen__block--active">
                    <div className="font-semibold text-lg mb-3 text-shine-primary">3. Chọn ngày, giờ & stylist</div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="mb-4">
                        <div className="font-medium mb-2">Chọn ngày</div>
                        <div className="grid grid-cols-5 gap-2">
                          {[
                            { id: "today", label: "Hôm nay" },
                            { id: "tomorrow", label: "Ngày mai" },
                            { id: "wed", label: "T4" },
                            { id: "thu", label: "T5" },
                            { id: "fri", label: "T6" }
                          ].map((day, index) => (
                            <button
                              key={day.id}
                              className={`p-2 text-center rounded ${index === 0 ? 'bg-shine-primary text-white' : 'border border-gray-200'}`}
                            >
                              {day.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="font-medium mb-2">Chọn giờ</div>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { id: "time-9", label: "09:00" },
                            { id: "time-10", label: "10:00" },
                            { id: "time-11", label: "11:00" },
                            { id: "time-12", label: "12:00" },
                            { id: "time-13", label: "13:00" },
                            { id: "time-14", label: "14:00" },
                            { id: "time-15", label: "15:00" },
                            { id: "time-16", label: "16:00" }
                          ].map((time, index) => (
                            <button
                              key={time.id}
                              className={`p-2 text-center rounded ${index === 2 ? 'bg-shine-primary text-white' : 'border border-gray-200'}`}
                            >
                              {time.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button
                        className="w-full bg-shine-primary text-white font-semibold py-3 rounded-lg mt-4"
                      >
                        Chốt giờ cắt
                      </button>
                      <div className="text-center text-sm text-gray-500 mt-2">
                        Cắt xong trả tiền, huỷ lịch không sao
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[95%] max-w-sm rounded-lg overflow-hidden">
            <div className="p-5">
              <div className="modal-booking_title text-lg font-bold mb-2 text-center">
                Chào mừng anh đến với 30Shine
                <img src="https://ext.same-assets.com/4225085421/1646363759.png" alt="" className="inline ml-1 w-6 h-6" />
              </div>
              <div className="modal-booking_description text-center text-gray-600 mb-4">
                Anh vui lòng nhập Số Điện Thoại để tiếp tục đặt lịch
              </div>
              <input
                className="w-full border border-gray-300 rounded-lg p-3 mb-4"
                type="tel"
                placeholder="Ví dụ: 0912234xxx"
                maxLength={20}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <button
                type="button"
                className="w-full bg-shine-primary text-white font-bold py-3 rounded-lg"
                onClick={handleSubmitPhone}
              >
                TIẾP TỤC
              </button>
              <button
                type="button"
                className="w-full text-shine-primary text-center py-3 mt-2"
                onClick={handleReturnHome}
              >
                Quay lại trang chủ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
