import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { FaArrowLeft, FaPhoneAlt, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import routes from "../../../config/routes";

// Định nghĩa interfaces cho dữ liệu
interface Service {
  id: number;
  categoryId: number;
  name: string;
  price: string;
  image: string;
  description: string;

}
interface Combo {
  id: number;
  serviceId: number;
  name: string;
  description: string;
  image: string;
  duration: string;
}

// API base URL
const API_BASE_URL = "/mockData.json"; // File mockData.json trong thư mục public

export function ServiceComBo() {
  const { id } = useParams<{ id: string }>();
  const [services, setServices] = useState<Service | null>(null);
  const [combos, setCombos] = useState<Combo[]>([]); // State riêng cho productAll
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Gọi API bằng Axios
  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError("");

        // Gọi API để lấy dữ liệu từ mockData.json
        const response = await axios.get(API_BASE_URL);
        const { services, combos } = response.data;

        // Tìm sản phẩm theo id
        const foundService = services.find((s: Service) => s.id === parseInt(id || "0"));
        if (!foundService) {
          setServices(null);
          setCombos([]);
          setError("Không tìm thấy dịch vụ!");
          return;
        }

        // Lọc các gói chi tiết liên quan từ combos
        const relatedCombo = combos.filter((cb: Combo) => cb.serviceId === foundService.id);

        setServices(foundService);
        setCombos(relatedCombo); // Cập nhật state cho combos
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        setError("Không thể tải dữ liệu dịch vụ. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  // Animation variants cho hiệu ứng fade-in
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  // Hiển thị khi đang tải
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-shine-primary">Đang tải...</p>
      </div>
    );
  }

  // Hiển thị khi có lỗi hoặc không tìm thấy sản phẩm
  if (error || !services) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-600">{error || "Không tìm thấy dịch vụ!"}</p>
      </div>
    );
  }

  return (



    <main className="relative bg-gray-50">
      <section>
        <div className="mx-4 md:mx-24 mb-6 md:mb-12">


          {/* Tiêu đề và mô tả */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            className="mx-4 md:mx-24 mt-6"
          >
            <h1 className="text-2xl font-bold text-shine-primary mb-2">{services.name}</h1>
            <p className="text-sm text-gray-600 mb-6">{services.description || "Không có mô tả"}</p>
          </motion.div>

          {/* Các gói dịch vụ */}
          {combos.length > 0 && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={sectionVariants}
              className="mx-4 md:mx-24 mt-10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {combos.map((cbs) => (
                  <div
                    key={cbs.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={cbs.image}
                        alt={cbs.name}
                        className="w-full h-48 object-cover object-top"
                      />
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{cbs.name}</h3>
                      <p className="text-sm text-gray-600 whitespace-pre-line mb-4">{cbs.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="bg-shine-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                          {cbs.duration}
                        </span>
                        <Link
                          to={`${routes.combo_detail.replace(':id', cbs.id.toString())}`}
                          className="flex items-center text-shine-primary hover:text-shine-primary/80"
                        >
                          <span className="text-sm font-medium">Tìm hiểu thêm</span>
                          <FaArrowRight className="ml-2" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Nút Đặt lịch */}
              <div className="flex justify-center mt-8">
                <Link
                  to="/booking"
                  className="bg-shine-primary text-white font-bold py-3 px-6 rounded-full hover:bg-shine-primary/90 transition"
                >
                  ĐẶT LỊCH NGAY
                </Link>
              </div>
            </motion.div>
          )}

          {/* Nút CTA cố định */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="fixed bottom-6 right-6"
          >
            <Link
              to="/booking"
              className="flex items-center bg-shine-primary text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-shine-primary/90 transition animate-bounce"
            >
              <FaPhoneAlt className="mr-2" />
              Đặt lịch ngay
            </Link>
          </motion.div>
        </div>
      </section>
    </main>

  );
}