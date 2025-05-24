import { div } from "framer-motion/client";

export function SelectService() {
    return (
        <div className="w-full max-w-2xl mx-auto bg-gray-100 min-h-screen font-sans p-4">
            {/* Thanh tìm kiếm */}
            <div className="bg-white rounded-lg shadow-md flex items-center px-4 py-2 mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm dịch vụ, nhận dịch vụ..."
                    className="w-full border-none focus:outline-none text-sm placeholder-gray-500 bg-transparent"
                />
                <button className="ml-2 text-gray-500">
                    <span className="text-lg">×</span>
                </button>
            </div>

            {/* Danh sách dịch vụ */}
            <div className="grid grid-cols-2 gap-4">
                {/* Card 1 - ShineCombo 2 */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                    <img
                        className="w-full h-40 object-cover"
                        src="https://storage.30shine.com/service/combo_booking/1046.jpg"
                        alt="ShineCombo 2"
                    />
                    <div className="p-3">
                        <p className="text-sm text-gray-600">ShineCombo 2</p>
                        <p className="text-xs text-gray-500">Combo cạo kiểu, combo gội dưỡng sinh thư giãn cạo vai gáy, combo cạo mặt sáng</p>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-lg font-bold text-gray-900">188.000 VND</span>
                            <button className="text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm px-3 py-1">
                                Thêm dịch vụ
                            </button>
                        </div>
                        <span className="text-xs text-yellow-500 bg-yellow-100 px-2 py-1 rounded mt-1 inline-block">NEW</span>
                    </div>
                </div>

                {/* Card 2 - Cắt + Gội Combo 3 */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                    <img
                        className="w-full h-40 object-cover"
                        src="https://storage.30shine.com/Resource/bookingService/2022/10/12/thumb_600x400_comboservice_1665576728.jpg"
                        alt="Cắt + Gội Combo 3"
                    />
                    <div className="p-3">
                        <p className="text-sm text-gray-600">Cắt + Gội Combo 3</p>
                        <p className="text-xs text-gray-500">Chăm sóc da mặt, combo chăm sóc da bằng thiết bị công nghệ cao</p>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-lg font-bold text-gray-900">299.000 VND</span>
                            <button className="text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm px-3 py-1">
                                Thêm dịch vụ
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Đi kèm thư giãn cạo gáy</p>
                    </div>
                </div>

                {/* Card 3 - Cắt gội */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                    <img
                        className="w-full h-40 object-cover"
                        src="https://storage.30shine.com/Resource/bookingService/2022/10/12/thumb_600x400_comboservice_1665576728.jpg"
                        alt="Cắt gội"
                    />
                    <div className="p-3">
                        <p className="text-sm text-gray-600">Cắt gội</p>
                        <p className="text-xs text-gray-500">Combo Cắt kiểu với Combo Gội Thư giãn</p>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-lg font-bold text-gray-900">120.000 VND</span>
                            <button className="text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm px-3 py-1">
                                Thêm dịch vụ
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Đồng giá tất cả</p>
                    </div>
                </div>

                {/* Card 4 - Kid Combo */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                    <img
                        className="w-full h-40 object-cover"
                        src="https://storage.30shine.com/Resource/bookingService/2022/10/12/thumb_600x400_comboservice_1665576728.jpg"
                        alt="Kid Combo"
                    />
                    <div className="p-3">
                        <p className="text-sm text-gray-600">Kid Combo</p>
                        <p className="text-xs text-gray-500">Cắt tóc cho bé - Stylist tận tình với trẻ nhỏ, Shine Cut dành riêng cho trẻ em</p>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-lg font-bold text-gray-900">75.000 VND</span>
                            <button className="text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm px-3 py-1">
                                Thêm dịch vụ
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Phần tổng cộng */}
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-md">
                <p className="text-sm text-gray-600">Đã chọn 0 dịch vụ</p>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-gray-900">Tổng thanh toán</span>
                    <span className="text-lg font-bold text-gray-900">0 VND</span>
                </div>
                <button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2">
                    Xong
                </button>
            </div>
        </div>
    );
}