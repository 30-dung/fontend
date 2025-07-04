import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { FaArrowLeft, FaPhoneAlt, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import routes from "@/config/routes";

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
const API_BASE_URL = "/mockData.json";

export function ServiceComBo() {
  const { id } = useParams<{ id: string }>();
  const [services, setServices] = useState<Service | null>(null);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(API_BASE_URL);
        const { services, combos } = response.data;

        const foundService = services.find((s: Service) => s.id === parseInt(id || "0"));
        if (!foundService) {
          setServices(null);
          setCombos([]);
          setError("Không tìm thấy dịch vụ!");
          return;
        }

        const relatedCombo = combos.filter((cb: Combo) => cb.serviceId === foundService.id);

        setServices(foundService);
        setCombos(relatedCombo);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        setError("Không thể tải dữ liệu dịch vụ. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-light-cream"> {/* Thêm bg-light-cream */}
        <p className="text-lg text-dark-brown">Đang tải...</p> {/* Thay text-shine-primary thành text-dark-brown */}
      </div>
    );
  }

  if (error || !services) {
    return (
      <div className="flex justify-center items-center h-screen bg-light-cream"> {/* Thêm bg-light-cream */}
        <p className="text-lg text-red-600">{error || "Không tìm thấy dịch vụ!"}</p>
      </div>
    );
  }

  return (
    <main className="relative bg-light-cream font-sans"> {/* Thay from-blue-{#F3F4F6} thành bg-light-cream, thêm font-sans */}
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
            <h1 className="text-2xl font-bold text-dark-brown mb-2 font-serif">{services.name}</h1> {/* Thay text-shine-primary thành text-dark-brown, thêm font-serif */}
            <p className="text-sm text-medium-gray mb-6">{services.description || "Không có mô tả"}</p> {/* Thay text-gray-600 thành text-medium-gray */}
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
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-soft-gray" 
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={cbs.image}
                        alt={cbs.name}
                        className="w-full h-48 object-cover object-top"
                      />
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-bold text-dark-brown mb-1 font-serif">{cbs.name}</h3> {/* Thay text-gray-800 thành text-dark-brown, thêm font-serif */}
                      <p className="text-sm text-medium-gray whitespace-pre-line mb-4">{cbs.description}</p> {/* Thay text-gray-600 thành text-medium-gray */}
                      <div className="flex justify-between items-center">
                        <span className="bg-dark-brown text-light-cream text-xs font-medium px-3 py-1 rounded-full"> {/* Thay bg-shine-primary text-white thành bg-dark-brown text-light-cream */}
                          {cbs.duration}
                        </span>
                        <Link
                          to={`${routes.combo_detail.replace(':id', cbs.id.toString())}`}
                          className="flex items-center text-accent-gold hover:text-dark-brown" 
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
                  className="bg-black-soft text-light-cream font-bold py-3 px-6 rounded-full hover:bg-dark-brown transition" 
                >
                  ĐẶT LỊCH NGAY
                </Link>
              </div>
            </motion.div>
          )}

          <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="fixed bottom-6 right-6 z-50"
            >
                <Link
                    to={routes.booking}
                    className="flex items-center bg-black-soft text-light-cream font-bold py-3 px-7 rounded-full shadow-xl hover:bg-dark-brown transition-all duration-300"
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