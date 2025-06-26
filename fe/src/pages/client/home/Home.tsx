import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
    FaArrowRight,
    FaArrowLeft,
    FaStar,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaSearch,
    FaLocationArrow,
    FaGem,
} from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";
import url from "@/services/url";
import api from "@/services/api";

import StarRating from "@/components/reviews/StarRating";
import routes from "@/config/routes";


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

interface Store {
    storeId: number;
    storeImages: string;
    storeName: string;
    phoneNumber: string;
    cityProvince: string;
    district: string;
    openingTime: string;
    closingTime: string;
    description: string;
    averageRating: number | string;
    createdAt: string;
}

const MOCK_API_BASE_URL = "/mockData.json";

export function HomePage() {
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState<number>(0);
    // Các ảnh này là URL cố định bên ngoài, không cần url.BASE_IMAGES
    const images: string[] = [
        "https://kings-barber.co.uk/wp-content/uploads/2021/09/IMG_7032.jpg",
        "https://wallpapers.com/images/hd/silver-barber-pole-w7wzw5y557gtnoh8.jpg",
        "https://wallpapercave.com/wp/wp1946275.jpg",
        "https://www.hairbutlers.com/wp-content/uploads/2017/06/barber.jpg",
        "https://thebarberylurgan.com/wp-content/uploads/2020/09/barber-background.jpg",
        "https://wallpapers.com/images/hd/barber-shop-background-fdzbrcqzti71st72.jpg",
        "https://static.vecteezy.com/system/resources/previews/035/449/083/non_2x/ai-generated-barbershop-table-with-barber-tools-barbershop-interior-background-free-photo.jpg",
        "https://png.pngtree.com/background/20230612/original/pngtree-barbershop-with-chairs-in-traditional-styles-and-mirrors-in-front-picture-image_3372710.jpg",
        "https://static.vecteezy.com/system/resources/thumbnails/046/840/400/small_2x/busy-barber-shop-with-brick-wall-and-chairs-ai-generated-photo.jpeg",
        "https://static.vecteezy.com/system/resources/thumbnails/037/236/476/small_2x/ai-generated-barbershop-advertisment-background-with-copy-space-free-photo.jpg"
    ];

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
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + images.length) % images.length
        );
    };

    const [highlightedStars, setHighlightedStars] = useState<number[]>([]);

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
    }, [highlightedStars]);

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [displayedStores, setDisplayedStores] = useState<Store[]>([]);
    const [allStores, setAllStores] = useState<Store[]>([]);
    const [storeSearchError, setStoreSearchError] = useState<string>("");
    const [storesLoading, setStoresLoading] = useState<boolean>(true);

    // New state for store slideshow
    const [currentStoreSlideIndex, setCurrentStoreSlideIndex] = useState<number>(0);

    const getRandomStores = (storesList: Store[], count: number) => {
        if (!storesList || storesList.length === 0) return [];
        const shuffled = [...storesList].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    useEffect(() => {
        const fetchAllStores = async () => {
            setStoresLoading(true);
            try {
                const response = await api.get<Store[]>(url.STORE.ALL);
                if (response.data && Array.isArray(response.data)) {
                    setAllStores(response.data);
                    setDisplayedStores(getRandomStores(response.data, 3));
                    setStoreSearchError("");
                } else {
                    setAllStores([]);
                    setDisplayedStores([]);
                    setStoreSearchError("Không tìm thấy dữ liệu salon.");
                }
            } catch (err) {
                console.error("Error fetching all stores:", err);
                setAllStores([]);
                setDisplayedStores([]);
                setStoreSearchError("Không thể tải danh sách salon. Vui lòng thử lại sau.");
            } finally {
                setStoresLoading(false);
            }
        };
        fetchAllStores();
    }, []);

    const handleStoreSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setStoresLoading(true);
        setCurrentStoreSlideIndex(0); // Reset slide index on new search

        if (!searchTerm.trim()) {
            setDisplayedStores(getRandomStores(allStores, 3));
            setStoreSearchError("");
            setStoresLoading(false);
            return;
        }

        const lowerCaseSearchTerm = searchTerm.trim().toLowerCase();
        const filtered = allStores.filter(store =>
            store.storeName.toLowerCase().includes(lowerCaseSearchTerm) ||
            store.cityProvince.toLowerCase().includes(lowerCaseSearchTerm) ||
            store.district.toLowerCase().includes(lowerCaseSearchTerm) ||
            (store.description && store.description.toLowerCase().includes(lowerCaseSearchTerm))
        );

        if (filtered.length > 0) {
            setDisplayedStores(filtered);
            setStoreSearchError("");
        } else {
            setDisplayedStores([]);
            setStoreSearchError(`Không tìm thấy salon nào cho "${searchTerm}". Vui lòng thử từ khóa khác.`);
        }
        setStoresLoading(false);
    };

    // Store slideshow navigation
    const nextStoreSlide = () => {
        setCurrentStoreSlideIndex((prevIndex) => (prevIndex + 1) % displayedStores.length);
    };

    const prevStoreSlide = () => {
        setCurrentStoreSlideIndex((prevIndex) => (prevIndex - 1 + displayedStores.length) % displayedStores.length);
    };

    const [categories, setCategories] = useState<Category[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorAPI, setErrorAPI] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await axios.get(MOCK_API_BASE_URL);
                setCategories(res.data.categories);
                setServices(res.data.services);
                setErrorAPI("");
            } catch (error) {
                console.error("Error fetching mock data for services:", error);
                setErrorAPI("Không thể tải dữ liệu dịch vụ. Vui lòng kiểm tra file mockData.json.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    };

    const galleryRef = useRef<HTMLDivElement>(null);

    // Các ảnh này là URL cố định bên ngoài, không cần url.BASE_IMAGES
    const galleryImages: string[] = [
        "https://www.gento.vn/wp-content/uploads/2023/05/toc-layer-nam-dep-9.jpg",
        "https://cdn.24h.com.vn/upload/1-2021/images/2021-01-14/25-Kieu-toc-nam-Han-Quoc-2021-dep-chuan-soai-ca-phu-hop-voi-moi-guong-mat-toc-nam-han-quoc-6-1610590636-715-width600height601.jpg",
        "https://cdn.vuahanghieu.com/unsafe/0x0/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/news/content/2023/10/30-kieu-toc-nam-ngan-dep-tre-trung-hop-voi-nhieu-dang-mat-30-jpg-1696494186-05102023152306.jpg",
        "https://menhairstylist.com/wp-content/uploads/2017/06/top-knot-men-undercut.jpg",
        "https://i.pinimg.com/736x/28/3d/11/283d114d386380f0cf90828eb3788bdc.jpg",
        "https://th.bing.com/th/id/OIP.gpbapqQ4bCNLjLIzTrXM3AHaHa?rs=1&pid=ImgDetMain&cb=idpwebp2&o=7&rm=3",
        "https://tiki.vn/blog/wp-content/uploads/2023/01/1WJxMmYJqHsrfvnOJjD_3aaqAhnQFYgM3DI7C6MKlw8TzltVsjzRlfs3Z_IvD2IGZIHv1iz83b3gVydhfmlDiFCR-hkcIOHTMc6_tXxhYEcLRJY84ejt2UWj4tImXgQykJLiWR56fSzyuztcqE4owWI.png",
        "https://th.bing.com/th/id/R.0e539ee45fef995042e8aa5ff5de6d19?rik=GbaHhe4%2fI5nJHw&pid=ImgRaw&r=0",
    ];

    useEffect(() => {
        const galleryElement = galleryRef.current;
        if (!galleryElement) return;

        let scrollInterval: NodeJS.Timeout;
        const scrollStep = 1; // Số pixel cuộn mỗi bước nhỏ
        const scrollSpeedMs = 50; // Tốc độ cuộn (ms giữa các bước)

        const startScrolling = () => {
            scrollInterval = setInterval(() => {
                // Kiểm tra xem đã cuộn đến cuối chưa
                if (galleryElement.scrollLeft + galleryElement.clientWidth >= galleryElement.scrollWidth) {
                    // Nếu đã đến cuối, reset về đầu một cách mượt mà
                    galleryElement.scrollTo({
                        left: 0,
                        behavior: 'smooth'
                    });
                } else {
                    // Cuộn về phía trước
                    galleryElement.scrollLeft += scrollStep;
                }
            }, scrollSpeedMs);
        };

        const stopScrolling = () => {
            clearInterval(scrollInterval);
        };

        startScrolling();
        // Removed the mouse wheel event listeners to simplify and ensure auto-scroll
        return () => {
            stopScrolling();
        };
    }, [galleryImages]);


    return (
        <main className="relative bg-light-cream font-sans min-h-screen"> {/* Adjusted background and added font-sans */}
            <section>
                <div className="mt-4 mx-auto max-w-7xl px-2 md:px-8">
                    {/* Slide Show (Giữ nguyên src vì là ảnh cố định bên ngoài) */}
                    <div className="slideshow mb-10">
                        <div className="relative w-full flex items-center justify-center rounded-2xl shadow-lg overflow-hidden">
                            <img
                                className="w-full h-[340px] md:h-[410px] object-cover rounded-2xl transition-all duration-500"
                                src={images[currentIndex]}
                                alt="Slide"
                            />

                            {/* Clickable areas for prev/next slide */}
                            <div
                                className="absolute top-0 left-0 w-1/2 h-full cursor-pointer z-10"
                                onClick={prevSlide}
                                aria-label="Previous slide"
                            ></div>
                            <div
                                className="absolute top-0 right-0 w-1/2 h-full cursor-pointer z-10"
                                onClick={nextSlide}
                                aria-label="Next slide"
                            ></div>

                        </div>
                    </div>

                    {/* START OF REVERTED & MODIFIED SECTION: "Đặt lịch & Đánh giá" */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={sectionVariants}
                        className="flex flex-col md:flex-row gap-6 w-full max-w-5xl mx-auto mb-12"
                    >
                        {/* Box Đặt lịch (Chỉ còn nút) */}
                        <div className="bg-black-soft text-light-cream rounded-2xl p-8 flex flex-col justify-between w-full md:w-2/3 shadow-xl"> {/* Changed bg-blue-900 to bg-black-soft, text-white to text-light-cream */}
                            <div>
                                <h2 className="text-xl font-bold mb-2 font-serif"> {/* Added font-serif */}
                                    ĐẶT LỊCH GIỮ CHỖ CHỈ 30 GIÂY
                                </h2>
                                <p className="text-base mb-6">
                                    Cắt xong trả tiền, hủy lịch không sao. Tiện lợi, nhanh chóng, không chờ đợi!
                                </p>
                            </div>
                            <Link
                                to={routes.booking}
                                className="w-full bg-light-cream text-dark-brown font-bold py-3 px-6 rounded-md hover:bg-soft-gray transition text-center text-lg" // Changed bg-white, text-blue-900, hover:bg-blue-100
                            >
                                ĐẶT LỊCH NGAY
                            </Link>
                        </div>

                        {/* Box Đánh giá (Giữ nguyên hiển thị, đổi Link) */}
                        <div className="bg-white rounded-2xl p-8 w-full md:w-1/3 shadow-xl flex flex-col justify-between">
                            <h3 className="text-base font-bold text-dark-brown mb-2 font-serif"> {/* Changed text-blue-900 to text-dark-brown, added font-serif */}
                                MỜI BẠN ĐÁNH GIÁ CHẤT LƯỢNG PHỤC VỤ
                            </h3>
                            <p className="text-xs text-medium-gray mb-4"> {/* Changed text-gray-600 to text-medium-gray */}
                                Phản hồi chân thành của bạn sẽ giúp chúng tôi không ngừng cải thiện và mang lại trải nghiệm tốt hơn nữa.
                            </p>
                            <Link to={routes.bookingHistorey} className="block hover:underline">
                                <div className="flex space-x-1">
                                    {[...Array(5)].map((_, index) => (
                                        <FaStar
                                            key={index}
                                            className={`w-7 h-7 transition-colors duration-300 ${highlightedStars.includes(index) ? "text-yellow-400" : "text-gray-300"}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-accent-gold mt-2">Xem thêm đánh giá</p> {/* Đổi từ accent-green sang accent-gold để đồng bộ theme */}
                            </Link>
                        </div>
                    </motion.div>
                    {/* END OF REVERTED & MODIFIED SECTION */}

                    {/* Hiển thị loading hoặc dữ liệu Services (từ mockData) (Giữ nguyên src vì là ảnh từ mockData) */}
                    {loading ? (
                        <div className="text-center py-10">
                            <p className="text-lg text-medium-gray animate-pulse"> {/* Changed text-gray-600 to text-medium-gray */}
                                Đang tải dữ liệu dịch vụ...
                            </p>
                        </div>
                    ) : (
                        <>
                            {errorAPI && (
                                <div className="text-center py-10 text-red-600">
                                    <p>{errorAPI}</p>
                                </div>
                            )}
                            {/* Render các section dựa trên categories */}
                            {categories.map((category) => (
                                <motion.div
                                    key={category.id}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={sectionVariants}
                                    className="mx-auto max-w-6xl mt-12"
                                >
                                    <h2 className="text-2xl font-bold text-dark-brown mb-6 text-center md:text-left font-serif"> {/* Changed text-blue-900 to text-dark-brown, added font-serif */}
                                        {category.name.toUpperCase()}
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                                        {services
                                            .filter(
                                                (service) =>
                                                    service.categoryId ===
                                                    category.id
                                            )
                                            .map((service) => (
                                                <div
                                                    key={service.id}
                                                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col"
                                                >
                                                    <div className="relative overflow-hidden">
                                                        <img
                                                            src={service.image}
                                                            alt={service.name}
                                                            className="w-full h-48 object-cover object-top transform transition-transform duration-300 hover:scale-105"
                                                        />
                                                    </div>
                                                    <div className="p-5 flex-1 flex flex-col">
                                                        <h3 className="text-xl font-semibold text-dark-brown mb-2 font-serif"> {/* Changed text-blue-900 to text-dark-brown, added font-serif */}
                                                            {service.name}
                                                        </h3>
                                                        <p className="text-lg text-dark-brown font-bold mb-1"> {/* Changed text-gray-700 to text-dark-brown */}
                                                            {service.price}
                                                        </p>
                                                        <p className="text-sm text-medium-gray mb-3 line-clamp-3"> {/* Changed text-gray-500 to text-medium-gray */}
                                                            {service.description || "Dịch vụ được thực hiện bởi đội ngũ chuyên gia, mang lại vẻ ngoài hoàn hảo và tự tin cho bạn."}
                                                        </p>
                                                        <Link
                                                           to={`${routes.services_combo.replace(":id", service.id.toString())}`}
                                                            className="flex items-center text-accent-gold hover:text-accent-terracotta mt-auto group" // Đổi từ text-accent-green sang text-accent-gold
                                                        >
                                                            <span className="text-sm font-medium text-dark-brown group-hover:underline"> {/* Changed text-blue-900 to text-dark-brown */}
                                                                Tìm hiểu thêm
                                                            </span>
                                                            <FiArrowRight className="ml-2 text-dark-brown group-hover:translate-x-1 transition-transform" /> {/* Changed text-blue-900 to text-dark-brown */}
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </motion.div>
                            ))}
                        </>
                    )}

                    {/* SECTION: VỀ CHUỖI SALON CỦA CHÚNG TÔI (Giữ nguyên src vì là ảnh cố định bên ngoài) */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={sectionVariants}
                        className="mx-auto max-w-6xl mt-20 py-12 bg-white rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-10 px-6"
                    >
                        <div className="md:w-1/2">
                            <motion.img
                                src="https://kings-barber.co.uk/wp-content/uploads/2021/09/IMG_7032.jpg"
                                alt="Hệ thống salon"
                                className="rounded-2xl shadow-lg w-full h-auto object-cover md:h-[400px]"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                            />
                        </div>
                        <div className="md:w-1/2 text-center md:text-left">
                            <h2 className="text-3xl font-bold text-dark-brown mb-4 leading-tight font-serif"> {/* Changed text-blue-900 to text-dark-brown, added font-serif */}
                                Hệ Thống Salon Tóc Chuyên Nghiệp Hàng Đầu
                            </h2>
                            <p className="text-base text-medium-gray mb-6 leading-relaxed"> {/* Changed text-gray-700 to text-medium-gray */}
                                Với nhiều năm kinh nghiệm và nhiều chi nhánh trên toàn quốc, Four Shine tự hào là điểm đến tin cậy cho hàng triệu khách hàng tìm kiếm sự hoàn hảo trong phong cách tóc. Chúng tôi cam kết mang đến chất lượng dịch vụ đồng bộ, không gian đẳng cấp và trải nghiệm làm đẹp vượt trội tại mọi cửa hàng.
                            </p>
                            <ul className="text-medium-gray mb-6 space-y-2"> {/* Changed text-gray-600 to text-medium-gray */}
                                <li className="flex items-center">
                                    <FaGem className="text-accent-gold mr-2" /> {/* Đổi từ text-accent-green sang text-accent-gold */}
                                    Chất lượng dịch vụ đồng bộ tại mọi chi nhánh.
                                </li>
                                <li className="flex items-center">
                                    <FaGem className="text-accent-gold mr-2" /> {/* Đổi từ text-accent-green sang text-accent-gold */}
                                    Đội ngũ stylist được đào tạo chuyên sâu và bài bản.
                                </li>
                                <li className="flex items-center">
                                    <FaGem className="text-accent-gold mr-2" /> {/* Đổi từ text-accent-green sang text-accent-gold */}
                                    Không gian sang trọng, hiện đại và thân thiện.
                                </li>
                            </ul>
                            <Link
                                to={routes.about}
                                className="inline-flex items-center bg-black-soft text-light-cream font-bold py-3 px-6 rounded-full shadow-lg hover:bg-dark-brown transition-colors" // Changed bg-blue-600, text-white, hover:bg-blue-700
                            >
                                Tìm hiểu thêm về hệ thống
                                <FiArrowRight className="ml-2" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* SECTION: MẠNG LƯỚI CỬA HÀNG (Sửa đường dẫn ảnh) */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={sectionVariants}
                        className="mx-auto max-w-6xl mt-20 py-12 bg-white rounded-2xl shadow-xl px-6 text-center"
                    >
                        <h2 className="text-3xl font-bold text-dark-brown mb-4 font-serif"> {/* Changed text-blue-900 to text-dark-brown, added font-serif */}
                            Mạng Lưới Cửa Hàng Toàn Quốc
                        </h2>
                        <p className="text-base text-medium-gray mb-8 max-w-3xl mx-auto"> {/* Changed text-gray-700 to text-medium-gray */}
                            Dù bạn ở đâu,Four Shine luôn sẵn sàng phục vụ. Hãy tìm chi nhánh gần nhất để trải nghiệm dịch vụ đẳng cấp!
                        </p>

                        {/* Thanh tìm kiếm đơn giản */}
                        <form onSubmit={handleStoreSearch} className="flex justify-center mb-10">
                            <div className="relative w-full max-w-md">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Tìm kiếm salon theo tên, thành phố, hoặc quận..."
                                    className="w-full p-3 pl-10 rounded-full border border-soft-gray focus:ring-2 focus:ring-accent-gold focus:border-transparent transition-all shadow-sm focus:outline-none text-dark-brown" // Đổi focus:ring-accent-green sang accent-gold
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium-gray" /> {/* Changed text-gray-400 to text-medium-gray */}
                                <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black-soft text-light-cream p-2 rounded-full hover:bg-dark-brown transition"> {/* Changed bg-blue-600, text-white, hover:bg-blue-700 */}
                                    <FaLocationArrow />
                                </button>
                            </div>
                        </form>

                        {storeSearchError && <p className="text-sm text-red-500 mb-6">{storeSearchError}</p>}

                        {/* Store Listings (sẽ hiển thị random 3 hoặc kết quả tìm kiếm) */}
                        {storesLoading ? (
                            <div className="text-center text-medium-gray py-8"> {/* Changed text-gray-500 to text-medium-gray */}
                                <p className="text-lg text-medium-gray animate-pulse">Đang tải danh sách salon...</p> {/* Changed text-gray-600 to text-medium-gray */}
                            </div>
                        ) : displayedStores.length > 0 ? (
                            <>
                                {displayedStores.length > 3 ? (
                                    <div className="relative">
                                        <div className="flex justify-center items-center overflow-hidden">
                                            {/* Only show one store at a time for slideshow */}
                                            <div className="w-full max-w-md">
                                                {displayedStores[currentStoreSlideIndex] && (
                                                    <div key={displayedStores[currentStoreSlideIndex].storeId} className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col mx-auto">
                                                        <img
                                                            // SỬA: Dùng url.BASE_IMAGES
                                                            src={displayedStores[currentStoreSlideIndex].storeImages ? (displayedStores[currentStoreSlideIndex].storeImages.startsWith('http') ? displayedStores[currentStoreSlideIndex].storeImages : `${url.BASE_IMAGES}${displayedStores[currentStoreSlideIndex].storeImages}`) : "https://via.placeholder.com/150"}
                                                            alt={displayedStores[currentStoreSlideIndex].storeName}
                                                            className="w-full h-48 object-cover"
                                                        />
                                                        <div className="p-5 text-left flex-grow flex flex-col">
                                                            <h3 className="text-xl font-semibold text-dark-brown mb-2 font-serif"> {/* Changed text-blue-900 to text-dark-brown, added font-serif */}
                                                                {displayedStores[currentStoreSlideIndex].storeName}
                                                            </h3>
                                                            <p className="text-sm text-medium-gray mb-2 flex items-center"> {/* Changed text-gray-600 to text-medium-gray */}
                                                                <FaMapMarkerAlt className="mr-2 text-accent-gold" /> {displayedStores[currentStoreSlideIndex].district}, {displayedStores[currentStoreSlideIndex].cityProvince} {/* Đổi từ text-accent-green sang text-accent-gold */}
                                                            </p>
                                                            <p className="text-sm text-medium-gray mb-3 flex items-center"> {/* Changed text-gray-600 to text-medium-gray */}
                                                                <FaPhoneAlt className="mr-2 text-accent-gold" /> {displayedStores[currentStoreSlideIndex].phoneNumber} {/* Đổi từ text-accent-green sang text-accent-gold */}
                                                            </p>
                                                            {displayedStores[currentStoreSlideIndex].averageRating !== undefined && (
                                                                <div className="flex items-center mb-3">
                                                                    <StarRating
                                                                        initialRating={
                                                                            typeof displayedStores[currentStoreSlideIndex].averageRating === 'string'
                                                                                ? Math.round(parseFloat(displayedStores[currentStoreSlideIndex].averageRating))
                                                                                : Math.round(Number(displayedStores[currentStoreSlideIndex].averageRating))
                                                                        }
                                                                        readOnly
                                                                        starSize={18}
                                                                    />
                                                                    <span className="text-sm text-dark-brown ml-2 font-semibold"> {/* Changed text-gray-700 to text-dark-brown */}
                                                                        ({
                                                                            typeof displayedStores[currentStoreSlideIndex].averageRating === 'string'
                                                                                ? parseFloat(displayedStores[currentStoreSlideIndex].averageRating).toFixed(1)
                                                                                : Number(displayedStores[currentStoreSlideIndex].averageRating).toFixed(1)
                                                                        })
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <p className="text-sm text-medium-gray line-clamp-2 mb-4 flex-grow"> {/* Changed text-gray-500 to text-medium-gray */}
                                                                {displayedStores[currentStoreSlideIndex].description}
                                                            </p>
                                                            <div className="mt-auto pt-4 border-t border-soft-gray flex justify-center gap-2"> {/* Changed border-gray-100 to border-soft-gray */}
                                                                {/* Đặt lịch button - màu nền và chữ mặc định */}
                                                                <button
                                                                    onClick={() => navigate(`/booking?salonId=${displayedStores[currentStoreSlideIndex].storeId}`)}
                                                                    className="inline-flex justify-center items-center bg-accent-gold text-text-on-accent font-bold py-2 px-4 rounded-md shadow hover:bg-accent-terracotta transition-colors text-sm" // Đổi màu nền mặc định thành accent-gold, chữ thành text-on-accent
                                                                >
                                                                    <FaPhoneAlt className="mr-2" /> Đặt lịch
                                                                </button>
                                                                {/* Xem ĐG button - màu nền và chữ mặc định */}
                                                                <button
                                                                    onClick={() => navigate(routes.store_reviews.replace(':storeId', displayedStores[currentStoreSlideIndex].storeId.toString()))}
                                                                    className="inline-flex justify-center items-center bg-black-soft text-light-cream font-bold py-2 px-4 rounded-md shadow hover:bg-dark-brown transition-colors text-sm" // Đảm bảo màu nền và chữ mặc định
                                                                >
                                                                    <FaStar className="mr-2" /> Xem ĐG
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Navigation buttons for store slideshow */}
                                        <button
                                            onClick={prevStoreSlide}
                                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-dark-brown text-light-cream p-2 rounded-full shadow-lg hover:bg-black-soft focus:outline-none z-10 ml-4" // Changed bg-gray-800, text-white, hover:bg-gray-700
                                            aria-label="Previous store"
                                        >
                                            <FaArrowLeft />
                                        </button>
                                        <button
                                            onClick={nextStoreSlide}
                                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-dark-brown text-light-cream p-2 rounded-full shadow-lg hover:bg-black-soft focus:outline-none z-10 mr-4" // Changed bg-gray-800, text-white, hover:bg-gray-700
                                            aria-label="Next store"
                                        >
                                            <FaArrowRight />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                                        {displayedStores.map((store) => (
                                            <div
                                                key={store.storeId}
                                                className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col"
                                            >
                                                <img
                                                    src={store.storeImages ? (store.storeImages.startsWith('http') ? store.storeImages : `${url.BASE_IMAGES}${store.storeImages}`) : "https://via.placeholder.com/150"}
                                                    alt={store.storeName}
                                                    className="w-full h-48 object-cover"
                                                />
                                                <div className="p-5 text-left flex-grow flex flex-col">
                                                    <h3 className="text-xl font-semibold text-dark-brown mb-2 font-serif"> {/* Changed text-blue-900 to text-dark-brown, added font-serif */}
                                                        {store.storeName}
                                                    </h3>
                                                    <p className="text-sm text-medium-gray mb-2 flex items-center"> {/* Changed text-gray-600 to text-medium-gray */}
                                                        <FaMapMarkerAlt className="mr-2 text-accent-gold" /> {store.district}, {store.cityProvince} {/* Đổi từ text-accent-green sang text-accent-gold */}
                                                    </p>
                                                    <p className="text-sm text-medium-gray mb-3 flex items-center"> {/* Changed text-gray-600 to text-medium-gray */}
                                                        <FaPhoneAlt className="mr-2 text-accent-gold" /> {store.phoneNumber} {/* Đổi từ text-accent-green sang text-accent-gold */}
                                                    </p>
                                                    {store.averageRating !== undefined && (
                                                        <div className="flex items-center mb-3">
                                                            <StarRating
                                                                initialRating={
                                                                    typeof store.averageRating === 'string'
                                                                        ? Math.round(parseFloat(store.averageRating))
                                                                        : Math.round(Number(store.averageRating))
                                                                }
                                                                readOnly
                                                                starSize={18}
                                                            />
                                                            <span className="text-sm text-dark-brown ml-2 font-semibold"> {/* Changed text-gray-700 to text-dark-brown */}
                                                                ({
                                                                    typeof store.averageRating === 'string'
                                                                        ? parseFloat(store.averageRating).toFixed(1)
                                                                        : Number(store.averageRating).toFixed(1)
                                                                })
                                                            </span>
                                                        </div>
                                                    )}
                                                    <p className="text-sm text-medium-gray line-clamp-2 mb-4 flex-grow"> {/* Changed text-gray-500 to text-medium-gray */}
                                                        {store.description}
                                                    </p>
                                                    <div className="mt-auto pt-4 border-t border-soft-gray flex justify-center gap-2"> {/* Changed border-gray-100 to border-soft-gray */}
                                                        {/* Đặt lịch button - màu nền và chữ mặc định */}
                                                        <button
                                                            onClick={() => navigate(`/booking?salonId=${store.storeId}`)}
                                                            className="inline-flex justify-center items-center bg-accent-gold text-text-on-accent font-bold py-2 px-4 rounded-md shadow hover:bg-accent-terracotta transition-colors text-sm" // Đổi màu nền mặc định thành accent-gold, chữ thành text-on-accent
                                                        >
                                                            <FaPhoneAlt className="mr-2" /> Đặt lịch
                                                        </button>
                                                        {/* Xem ĐG button - màu nền và chữ mặc định */}
                                                        <button
                                                            onClick={() => navigate(routes.store_reviews.replace(':storeId', store.storeId.toString()))}
                                                            className="inline-flex justify-center items-center bg-black-soft text-light-cream font-bold py-2 px-4 rounded-md shadow hover:bg-dark-brown transition-colors text-sm" // Đảm bảo màu nền và chữ mặc định
                                                        >
                                                            <FaStar className="mr-2" /> Xem ĐG
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center text-medium-gray py-8"> {/* Changed text-gray-500 to text-medium-gray */}
                                Hiện chưa có salon nào trong khu vực này.
                            </div>
                        )}


                    </motion.div>

                    {/* NEW SECTION: Image Gallery - Auto-scrolling carousel */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={sectionVariants}
                        className="mx-auto max-w-7xl mt-20 mb-10 py-10 bg-white rounded-2xl shadow-xl overflow-hidden"
                    >
                        <h2 className="text-3xl font-bold text-dark-brown mb-8 text-center font-serif"> {/* Changed text-blue-900 to text-dark-brown, added font-serif */}
                            Thư Viện Ảnh Của Chúng Tôi
                        </h2>
                        {/* Modified gallery container */}
                        <div
                            ref={galleryRef}
                            className="flex overflow-x-hidden space-x-6 pb-4 px-4 scroll-smooth"
                        >
                            {/* Duplicate images to create an infinite loop effect */}
                            {[...galleryImages, ...galleryImages].map((imageUrl, index) => (
                                <div
                                    key={index}
                                    className="flex-shrink-0 w-80 h-96 bg-soft-gray rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300" // Changed bg-gray-200 to bg-soft-gray
                                >
                                    <img
                                        src={imageUrl}
                                        alt={`Gallery image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="fixed bottom-6 right-6 z-50"
            >
                <Link
                    to={routes.booking}
                    className="flex items-center bg-black-soft text-light-cream font-bold py-3 px-7 rounded-full shadow-xl hover:bg-dark-brown transition-all duration-300" /* Đổi màu sắc nút CTA */
                >
                    <FaPhoneAlt className="mr-2" />
                    Đặt lịch ngay
                </Link>
            </motion.div>
        </main>
    );
}