import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaArrowRight, FaArrowLeft, FaStar, FaCut, FaSpa, FaPhoneAlt } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion"; // Thêm framer-motion để tạo animation
import axios from "axios";
import  routes from "../../../../config/routes"; // Đường dẫn đến file config
// định dạng interface data 
interface Category {
  id: number;
  name: string;
}

interface Service {
  id: number;
  categoryId: number;
  name: string;
  price: string;
  image: string;
  description: string;

}

//API giả lập
const API_BASE_URL = "/mockData.json"; //sau thay api thật vào đây

export function HomePage() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const images: string[] = [
    'https://i.pinimg.com/originals/0a/bd/24/0abd24d18060a97095c90d6afa948860.png',
    'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474104mgc/hinh-anh-mat-troi-your-name_082100134.jpg',
    'https://i.pinimg.com/originals/f4/91/be/f491be409b7f2101b73bc44d84eca03f.jpg'
  ];

  // Tự động chuyển slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // State cho PhoneInput
  const [phone, setPhone] = useState<string>('');
  const [error, setError] = useState<string>('');

  // State cho hiệu ứng ngôi sao
  const [highlightedStars, setHighlightedStars] = useState<number[]>([]);


  // Dữ liệu giả lập cho Testimonials
  const testimonials = [
    { name: "Nguyễn Văn A", comment: "Dịch vụ rất chuyên nghiệp, tôi rất hài lòng!", rating: 5, image: "https://via.placeholder.com/50" },
    { name: "Trần Thị B", comment: "Không gian thư giãn, nhân viên thân thiện!", rating: 4, image: "https://via.placeholder.com/50" },
    { name: "Lê Minh C", comment: "Cắt tóc đẹp, giá cả hợp lý!", rating: 5, image: "https://via.placeholder.com/50" }
  ];

  // Dữ liệu giả lập cho "Tại sao chọn chúng tôi"
  const whyChooseUs = [
    { icon: <FaCut />, title: "Đội ngũ chuyên nghiệp", description: "Các stylist giàu kinh nghiệm, được đào tạo bài bản." },
    { icon: <FaSpa />, title: "Không gian sang trọng", description: "Môi trường thư giãn, sạch sẽ và hiện đại." },
    { icon: <FaStar />, title: "Dịch vụ chất lượng", description: "Cam kết mang lại trải nghiệm tốt nhất cho khách hàng." }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setPhone(value);
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validPrefixes = [
      '032', '033', '034', '035', '036', '037', '038', '039',
      '070', '076', '077', '078', '079',
      '081', '082', '083', '084', '085', '086',
      '056', '058',
      '059',
      '088', '089',
      '090', '091', '092', '093', '094', '095', '096', '097', '098', '099'
    ];

    if (phone.length !== 10) {
      setError('Anh vui lòng nhập số điện thoại hợp lệ giúp em nhé!');
    } else {
      const prefix = phone.substring(0, 3);
      if (!validPrefixes.includes(prefix)) {
        setError('Anh vui lòng nhập số điện thoại hợp lệ giúp em nhé!');
      } else {
        setError('');
        alert('Số điện thoại hợp lệ: ' + phone);
        setPhone('');
      }
    }
  };

  // Tự động ẩn thông báo sau 5 giây
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Tự động sáng các ngôi sao lần lượt và reset khi đủ 5 sao
  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightedStars((prev) => {
        if (prev.length === 5) {
          return [];
        }
        return [...prev, prev.length];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Animation variants cho hiệu ứng fade-in
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }

  };


  //hooks State data API
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorAPI, setErrorAPI] = useState<string>('');
  //API call bằng Axios giả lập
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_BASE_URL);
        setCategories(res.data.categories);
        setServices(res.data.services);
        setErrorAPI('');
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorAPI('Không thể tải dữ liệu từ API');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  return (
    <main className="relative bg-gray-50"> {/* Thêm background nhẹ */}
      {/* Thông báo lỗi ở đầu trang */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-200 text-red-800 text-sm p-3 rounded-md flex justify-between items-center w-11/12 max-w-md z-50">
          <p>{error}</p>
          <button
            onClick={() => setError("")}
            className="text-red-800 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      <section>
        <div className="mt-4 mx-4 md:mx-20">
          {/* Slide Show */}
          <div className="slideshow">
            <div className="relative w-full flex items-center justify-center">
              <img
                className="w-full h-[410px] object-cover rounded-xl"
                src={images[currentIndex]}
                alt="Slide"
              />
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white/30 text-4xl p-4"
              >
                <FaArrowLeft />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white/30 text-4xl p-4"
              >
                <FaArrowRight />
              </button>
            </div>
          </div>

         

          {/* Services - Đặt lịch và đánh giá */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            className="service mx-4 md:mx-24"
          >
            <div className="pt-10">
              <div className="flex justify-center p-6">
                <div className="flex flex-col md:flex-row gap-4 w-full max-w-5xl">
                  {/* Box Đặt lịch */}
                  <div className="bg-blue-900 text-white rounded-xl p-6 flex flex-col justify-between w-full md:w-2/3 shadow-lg">
                    <div>
                      <h2 className="text-lg font-bold mb-2">ĐẶT LỊCH GIỮ CHỖ CHỈ 30 GIÂY</h2>
                      <p className="text-sm mb-4">Cắt xong trả tiền, hủy lịch không sao</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={phone}
                          onChange={handleChange}
                          placeholder="Nhập SĐT Để Đặt Lịch"
                          className="flex-1 p-2 rounded-md text-black focus:outline-none focus:ring-0 focus:border-transparent"
                        />
                        <button
                          type="submit"
                          className="bg-white text-blue-900 font-bold py-2 px-4 rounded-md hover:bg-gray-200 transition"
                        >
                          ĐẶT LỊCH NGAY
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Box Đánh giá */}
                  <div className="bg-white rounded-xl p-6 w-full md:w-1/3 shadow-lg">
                    <h3 className="text-sm font-bold text-blue-900 mb-2">MỜI BẠN ĐÁNH GIÁ CHẤT LƯỢNG PHỤC VỤ</h3>
                    <p className="text-xs text-gray-600 mb-4">Phản hồi của bạn sẽ giúp chúng tôi cải thiện chất lượng dịch vụ tốt hơn</p>
                    <Link to={routes.about}>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, index) => (
                          <svg
                            key={index}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`w-6 h-6 transition-colors duration-300 ease-in-out ${highlightedStars.includes(index) ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.946a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.946c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.197-1.54-1.118l1.287-3.946a1 1 0 00-.364-1.118l-3.36-2.44c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.287-3.946z" />
                          </svg>
                        ))}
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hiển thị loading hoặc dữ liệu */}
          {loading ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-600">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <>
              {/* Tự động render các section dựa trên categories */}
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                  className="services-section mx-4 md:mx-24 mt-8~"
                >
                  <h2 className="text-xl font-bold text-blue-900 mb-6">{category.name}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {services
                      .filter(service => service.categoryId === category.id)
                      .map((service) => (
                        <div
                          key={service.id}
                          className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                          <div className="relative overflow-hidden">
                            <img
                              src={service.image}
                              alt={service.name}
                              className="w-full h-48 object-cover object-top transform transition-transform duration-300 hover:scale-110"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className=" text-lg font-semibold text-blue-900 mb-2">{service.name}</h3>
                            <p className="text-sm text-gray-600 mb-3">{service.price}</p>
                            <Link to={`${routes.services_combo.replace(':id', service.id.toString())}`} className="flex items-center text-blue-600 hover:text-blue-800">
                              <span className="text-sm font-medium text-blue-900" >Tìm hiểu thêm</span>
                              <FiArrowRight className="ml-2 text-blue-900" />
                            </Link>
                          </div>
                        </div>
                      ))}
                  </div>
                </motion.div>
              ))}
            </>
          )}

          {/* Section Đánh giá khách hàng (Testimonials) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            className="testimonials mx-4 md:mx-24 mt-10 py-10 bg-white rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-bold text-blue-900 mb-6 text-center">KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mb-3" />
                  <h3 className="text-base font-semibold text-gray-800">{testimonial.name}</h3>
                  <div className="flex my-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 text-center">{testimonial.comment}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Section Tại sao chọn chúng tôi (Why Choose Us) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            className="why-choose-us mx-4 md:mx-24 mt-10 py-10 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl"
          >
            <h2 className="text-xl font-bold text-blue-900 mb-6 text-center">TẠI SAO CHỌN CHÚNG TÔI</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {whyChooseUs.map((reason, index) => (
                <div key={index} className="flex flex-col items-center p-4">
                  <div className="text-4xl text-blue-600 mb-3">{reason.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{reason.title}</h3>
                  <p className="text-sm text-gray-600 text-center">{reason.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Nút CTA cố định */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="fixed bottom-6 right-6"
      >
        <Link
          to="/book-now"
          className="flex items-center bg-shine-primary text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 transition animate-bounce"
        >
          <FaPhoneAlt className="mr-2" />
          Đặt lịch ngay
        </Link>
      </motion.div>
    </main>
  );
}