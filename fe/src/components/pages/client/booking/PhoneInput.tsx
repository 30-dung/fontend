export function PhoneInput() {
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                {/* Tiêu đề */}
                <h2 className="text-xl font-medium text-gray-900 text-center mb-4">
                    Chào mừng bạn đến với 30Shine ✨
                </h2>

                {/* Nội dung */}
                <p className="text-sm text-gray-600 text-center mb-4">
                    Anh vui lòng nhập Số Điện Thoại để tiếp tục đặt lịch
                </p>

                {/* Ô nhập số điện thoại */}
                <input
                    type="text"
                    placeholder="Ví dụ: 09123456xx"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Nút TIẾP TỤC */}
                <button className="w-full mt-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-md px-6 py-2 text-center">
                    TIẾP TỤC
                </button>

                {/* Liên kết Quay lại trang chủ */}
                <a href="#" className="block mt-2 text-sm text-blue-700 text-center hover:underline">
                    Quay lại trang chủ
                </a>
            </div>
        </div>
    );
}