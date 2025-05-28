import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { FaArrowLeft, FaPhoneAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";


// Định nghĩa interfaces cho dữ liệu
interface ComboDetail {
    id: number;
    comboId: number;
    name: string;
    image: string;
    description: string;
}

interface ComboStep {
    id: number;
    comboDetailId: number;
    stepsId: number;
    description: string;
}

interface Step {
    id: number;
    name: string;
    image: string;
    description: string;
}

// API base URL
const API_BASE_URL = "/mockData.json";

export function ComboDetail() {
    const { id } = useParams<{ id: string }>();
    const [comboDetail, setComboDetail] = useState<ComboDetail | null>(null);
    const [steps, setSteps] = useState<Step[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Gọi API bằng Axios
    useEffect(() => {
        const fetchComboDetail = async () => {
            try {
                setLoading(true);
                setError("");

                // Gọi API để lấy dữ liệu từ mockData.json
                const response = await axios.get(API_BASE_URL);
                const { comboDetails, comboSteps, stepAll } = response.data;

                // Tìm chi tiết combo theo comboId
                const foundComboDetail = comboDetails.find(
                    (cd: ComboDetail) => cd.id === parseInt(id || "0")
                );

                if (!foundComboDetail) {
                    setComboDetail(null);
                    setSteps([]);
                    setError("Không tìm thấy chi tiết combo!");
                    return;
                }

                // Lọc các bước liên quan từ comboSteps
                const relatedSteps = comboSteps
                    .filter((cs: ComboStep) => cs.comboDetailId === foundComboDetail.id)
                    .map((cs: ComboStep) => {
                        const stepInfo = stepAll.find((s: Step) => s.id === cs.stepsId);
                        return stepInfo ? { ...stepInfo } : null;
                    })
                    .filter(Boolean);

                setComboDetail(foundComboDetail);
                setSteps(relatedSteps as Step[]);
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu:", err);
                setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchComboDetail();
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

    // Hiển thị khi có lỗi hoặc không tìm thấy combo
    if (error || !comboDetail) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-red-600">{error || "Không tìm thấy chi tiết combo!"}</p>
                <Link to="/" className="text-shine-primary ml-4">
                    Quay lại trang chủ
                </Link>
            </div>
        );
    }

    return (
      

         
            <main>
                <section>
                    <div className="mt-4 mx-4 md:mx-48 mb-6 md:mb-12">


                        {/* Thông tin combo */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={sectionVariants}
                        >
                            <div className="inline-block bg-shine-primary text-white font-bold py-3 px-6 rounded-full border-2 border-shine-primary hover:bg-shine-primary/90 hover:border-shine-primary/90 transition-all duration-300 mb-10 mt-4">
                                <h1 className="text-lg whitespace-nowrap font-bold">{comboDetail.name}</h1>
                            </div>
                            <div className="w-full h-[410px] object-cover rounded-xl overflow-hidden">
                                <img
                                    src={comboDetail.image}
                                    alt={comboDetail.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>

                        {/* Các bước dịch vụ */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={sectionVariants}
                            className="mt-8"
                        >
                            <h2 className="text-3xl font-bold text-blue-900 mb-2">QUY TRÌNH DỊCH VỤ</h2>
                            <p className="text-blue-900 mb-6">{comboDetail.description}</p>

                            {steps.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                    {steps.map((step) => (
                                        <div key={step.id} className="flex flex-col items-center">
                                            <div className="w-full h-40 object-cover rounded-xl overflow-hidden">
                                                <img
                                                    src={step.image}
                                                    alt={step.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <p className="mt-2 text-center text-blue-900 font-medium">
                                                {step.name}
                                            </p>
                                            
                                        </div>
                                    ))}
                                </div>
                            )}

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
                       to="/booking"
                        className="flex items-center bg-shine-primary text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-shine-primary/90 transition animate-bounce"
                    >
                        <FaPhoneAlt className="mr-2" />
                        Đặt lịch ngay
                    </Link>
                </motion.div>
            </main>
       
    );
}