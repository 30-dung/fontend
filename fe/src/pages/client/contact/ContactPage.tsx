// src/pages/client/contact/ContactPage.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '@/services/api';
import url from '@/services/url';
import MapEmbed from '@/components/contact/MapEmbed'; // SỬA ĐỔI DÒNG NÀY
// import backgroundImage from '@/assets/images/contact-header-bg.jpg';

// Định nghĩa interface cho user profile được lưu trong localStorage
interface UserProfile {
    userId: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    membershipType: string;
    loyaltyPoints: number;
}

const ContactPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const userProfileString = localStorage.getItem('user_profile');

        if (token && userProfileString) {
            try {
                const userProfile: UserProfile = JSON.parse(userProfileString);
                setName(userProfile.fullName || '');
                setEmail(userProfile.email || '');
                setIsAuthenticated(true);
            } catch (e) {
                console.error("Failed to parse user data from localStorage", e);
                localStorage.removeItem('user_profile');
                setIsAuthenticated(false);
            }
        } else {
            setName('');
            setEmail('');
            setIsAuthenticated(false);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!name.trim() || !email.trim() || !comment.trim()) {
            toast.error('Vui lòng điền đầy đủ thông tin vào các trường.');
            setLoading(false);
            return;
        }

        try {
            await api.post(url.FEEDBACK.SUBMIT, { name, email, comment });
            toast.success('Cảm ơn bạn đã gửi góp ý! Chúng tôi sẽ xem xét sớm nhất.');
            setComment('');
            if (!isAuthenticated) {
                setName('');
                setEmail('');
            }
        } catch (error) {
            console.error('Lỗi khi gửi góp ý:', error);
            toast.error('Đã có lỗi xảy ra khi gửi góp ý. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            {/* Phần Banner/Header ảnh lớn */}
            <div
                className="w-full h-96 bg-cover bg-center flex items-center justify-center relative"
                style={{ backgroundImage: `url('https://img.freepik.com/premium-photo/barber-sitting-front-mirror-looking-reflection-his-client_376548-1527.jpg')` }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <h1 className="text-5xl font-bold text-white z-10 text-shadow-lg">LIÊN HỆ VỚI CHÚNG TÔI</h1>
            </div>

            {/* Phần nội dung chính: Tiêu đề và 2 cột */}
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-12 relative">
                    GỬI GÓP Ý HOẶC THẮC MẮC
                    <span className="block w-24 h-1 bg-indigo-600 mx-auto mt-4 rounded"></span>
                </h2>

                <div className="flex flex-col lg:flex-row gap-10 items-start">
                    {/* Cột trái: Form Góp ý */}
                    <div className="w-full lg:w-1/2 bg-white p-8 rounded-xl shadow-lg z-10 border border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                            Biểu mẫu Góp ý
                        </h3>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên của bạn</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300 ease-in-out"
                                    placeholder="Nguyễn Văn A"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isAuthenticated}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email của bạn</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300 ease-in-out"
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isAuthenticated}
                                />
                            </div>
                            <div>
                                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Nội dung góp ý</label>
                                <textarea
                                    id="comment"
                                    name="comment"
                                    rows={6}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300 ease-in-out"
                                    placeholder="Chia sẻ góp ý hoặc thắc mắc của bạn..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                ></textarea>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : null}
                                    {loading ? 'Đang gửi...' : 'Gửi Góp ý'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Cột phải: Bản đồ */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
                        <MapEmbed address="99 Xuân Thủy, Cầu Giấy, Hà Nội" />
                        <p className="text-center text-gray-700 text-lg mt-4 font-medium">
                           Trụ sở chính - 99 Xuân Thủy, Làng vòng, Cầu Giấy, Hà Nội
                        </p>
                        <p className="text-center text-gray-600 text-sm mt-1">
                            Hotline: 0379999999
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;