import { Link } from "react-router-dom";

export function ErrorPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
        Oops! Trang bạn tìm không tồn tại.
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Có thể bạn đã nhập sai đường dẫn hoặc trang đã bị xoá.
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition"
      >
        Quay về trang chủ
      </Link>
    </div>
    );
}