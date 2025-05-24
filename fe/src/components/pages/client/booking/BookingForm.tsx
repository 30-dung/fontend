import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp, FaStore, FaCut, FaUser, FaCalendarAlt, FaChevronRight } from "react-icons/fa";

export function BookingForm() {
  const [stylistOpen, setStylistOpen] = useState(false);
  const [selectedStylist, setSelectedStylist] = useState("Chọn stylist");

  const [dateOpen, setDateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Hôm nay (13/05)");

  const [selectedTime, setSelectedTime] = useState("");

  const stylists = [
    {
      name: "Anh Tùng",
      description: "Chuyên fade, tóc layer nam, tư vấn tận tâm",
      avatar: "/images/stylist-tung.jpg",
    },
    {
      name: "Anh Phúc",
      description: "Tạo kiểu hiện đại, nhiều năm kinh nghiệm",
      avatar: "/images/stylist-phuc.jpg",
    },
    {
      name: "Anh Long",
      description: "Chuyên kiểu Undercut, Mohican",
      avatar: "/images/stylist-long.jpg",
    },
  ];

  const dates = ["Hôm nay (13/05)", "Ngày mai (14/05)", "Thứ tư (15/05)"];
  const times = Array.from({ length: 16 }, (_, i) => `${7 + i}h00`);

  return (
    <div className="w-full max-w-md mx-auto bg-gray-100 min-h-screen font-sans">
      {/* Title */}
      <div className="navigator flex justify-center py-4">
        <span className="text-2xl font-bold text-[#15397F] tracking-tight">Đặt lịch giữ chỗ</span>
      </div>

      <div className="bg-white p-4">
        <div className="body relative py-4">
          <div className="main-screen space-y-4">
            {/* Step 1 - Chọn salon */}
            <div className="main-screen__block bg-white rounded-xl p-5 transition-all">
              <div className="font-semibold text-lg text-[#15397F] mb-3">1. Chọn salon</div>

              <div className="flex items-center bg-gray-50 h-12 rounded-lg px-4 border border-red-400 cursor-pointer hover:bg-gray-100 transition relative">
                <FaStore className="mr-3 w-5 h-5 text-[#15397F] transition" />
                <span className="text-sm text-gray-600 truncate w-full">Xem tất cả salon</span>
                <FaChevronRight className="w-4 h-4 ml-2 text-gray-500 transition" />
                <div className="absolute top-2 right-3 flex items-center space-x-1">
                  <span className="h-2 w-2 bg-red-600 rounded-full animate-ping"></span>
                  <span className="h-2 w-2 bg-red-600 rounded-full"></span>
                </div>
              </div>
              <div className="text-xs text-red-500 mt-2">Anh vui lòng chọn salon trước để xem lịch còn trống ạ!</div>
            </div>

            {/* Step 2 - Chọn dịch vụ */}
            <div className="main-screen__block bg-white rounded-xl p-5 transition-all">
              <div className="font-semibold text-lg text-[#15397F] mb-3">2. Chọn dịch vụ</div>
              <div className="flex items-center bg-gray-50 h-12 rounded-lg px-4 cursor-pointer hover:bg-gray-100 transition">
                <FaCut className="mr-3 w-5 h-5 text-[#15397F] transition" />
                <span className="text-sm text-gray-600 truncate w-full">Xem tất cả dịch vụ hấp dẫn</span>
                <FaChevronRight className="w-4 h-4 ml-2 text-gray-500 transition" />
              </div>
            </div>

            {/* Step 3 - Chọn ngày giờ & stylist */}
            <div className="main-screen__block bg-white rounded-xl p-5 transition-all">
              <div className="font-semibold text-lg text-[#15397F] mb-3">3. Chọn ngày, giờ & stylist</div>

              {/* Stylist Dropdown */}
              <div className="mb-4">
                <div className="flex items-center bg-gray-50 h-12 rounded-lg px-4 cursor-pointer hover:bg-gray-100 transition" onClick={() => setStylistOpen(!stylistOpen)}>
                  <FaUser className="mr-3 w-5 h-5 text-[#15397F] transition" />
                  <span className="text-sm text-gray-700 flex-1">{selectedStylist}</span>
                  {stylistOpen ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
                </div>
                {stylistOpen && (
                  <div className="border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto bg-white shadow-lg">
                    {stylists.map((stylist, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition"
                        onClick={() => {
                          setSelectedStylist(stylist.name);
                          setStylistOpen(false);
                        }}
                      >
                        <img src={stylist.avatar} alt={stylist.name} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800">{stylist.name}</div>
                          <div className="text-xs text-gray-500">{stylist.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Dropdown */}
              <div className="mb-4">
                <div className="flex items-center bg-gray-50 h-12 rounded-lg px-4 cursor-pointer hover:bg-gray-100 transition" onClick={() => setDateOpen(!dateOpen)}>
                  <FaCalendarAlt className="mr-3 w-5 h-5 text-[#15397F] transition" />
                  <span className="text-sm text-gray-700 flex-1">{selectedDate}</span>
                  {dateOpen ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
                </div>
                {dateOpen && (
                  <div className="border border-gray-200 rounded-lg mt-1 bg-white shadow-lg">
                    {dates.map((date, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer transition"
                        onClick={() => {
                          setSelectedDate(date);
                          setDateOpen(false);
                        }}
                      >
                        {date}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Time Slots */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-4">
                {times.map((time, index) => (
                  <button
                    key={index}
                    className={`text-sm rounded-lg py-2 border transition-all ${
                      selectedTime === time
                        ? "bg-[#15397F] text-white border-[#15397F]"
                        : "bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Button chốt lịch */}
            <div className="button-affix sticky bottom-0 bg-white py-4 px-4">
              <div className="flex flex-col items-center space-y-2-">
                <button
                  className={`w-full max-w-xs rounded-lg px-6 py-3 text-white font-semibold transition-all ${
                    selectedTime ? "bg-[#15397F] hover:bg-[#1a4a9c]" : "bg-gray-300 cursor-not-allowed"
                  }`}
                  disabled={!selectedTime}
                >
                  Chốt giờ cắt
                </button>
                <span className="text-xs text-gray-500">Cắt xong trả tiền, huỷ lịch không sao</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}