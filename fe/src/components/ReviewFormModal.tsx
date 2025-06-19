// src/components/ReviewFormModal.tsx
import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import { ReviewRequest, ReviewTargetType, UserInfo } from '../types/review';
import api from '../services/api';
import url from '../services/url';
import { useNavigate } from 'react-router-dom';
import routes from '../config/routes';
import { FaStore, FaUser, FaCut, FaRegCommentDots } from 'react-icons/fa';

import { toast } from 'react-toastify'; // Import toast function

interface ReviewFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: {
        appointmentId: number;
        storeId: number;
        storeName: string;
        employeeId: number;
        employeeName: string;
        storeServiceId: number;
        serviceName: string[];
    };
    onReviewSubmitted: (success: boolean) => void;
}

const ReviewFormModal: React.FC<ReviewFormModalProps> = ({
    isOpen,
    onClose,
    appointment: { appointmentId, storeId, storeName, employeeId, employeeName, storeServiceId, serviceName },
    onReviewSubmitted,
}) => {
    const [storeRating, setStoreRating] = useState(0);
    const [stylistRating, setStylistRating] = useState(0);
    const [serviceRating, setServiceRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); // Giữ lại error state để hiển thị lỗi validation form
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            setStoreRating(0);
            setStylistRating(0);
            setServiceRating(0);
            setComment('');
            setError(null);

            const fetchUserInfo = async () => {
                try {
                    const response = await api.get(url.USER.PROFILE);
                    setUserInfo(response.data);
                } catch (err) {
                    console.error('Failed to fetch user info', err);
                    // Dùng toast cho lỗi fetch user info nếu cần, hoặc giữ nguyên setError
                    toast.error("Không thể tải thông tin người dùng. Vui lòng thử lại.");
                    onClose(); // Đóng modal nếu không tải được user info
                }
            };
            fetchUserInfo();
        }
    }, [isOpen]);

    // Hiển thị loading hoặc null nếu user info chưa sẵn sàng và modal đang mở
    if (isOpen && !userInfo) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center">
                    <p className="text-gray-700">Đang tải thông tin người dùng...</p>
                </div>
            </div>
        );
    }
    
    // Nếu modal không mở hoặc user ID không hợp lệ, không render gì cả
    if (!isOpen || typeof userInfo?.userId !== 'number') {
        if (isOpen && userInfo && typeof userInfo.userId !== 'number') {
            console.error("ReviewFormModal: User ID is invalid or missing from profile API. Cannot submit review.");
            // Dùng toast cho lỗi user ID không hợp lệ
            toast.error("Lỗi: Không tìm thấy ID người dùng hợp lệ. Vui lòng thử lại hoặc đăng nhập lại.");
        }
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (storeRating === 0 && stylistRating === 0 && serviceRating === 0) {
            setError('Vui lòng chọn ít nhất một số sao đánh giá cho Cửa hàng, Stylist hoặc Dịch vụ.');
            return;
        }

        setLoading(true);
        setError(null); // Clear previous error

        try {
            const reviewsToSend: ReviewRequest[] = [];
            const baseReviewData = {
                userId: userInfo.userId,
                appointmentId: appointmentId,
                comment: comment,
            };

            if (storeRating > 0) {
                reviewsToSend.push({
                    ...baseReviewData,
                    targetId: storeId,
                    targetType: ReviewTargetType.STORE,
                    rating: storeRating,
                });
            }

            if (employeeId && stylistRating > 0) {
                reviewsToSend.push({
                    ...baseReviewData,
                    targetId: employeeId,
                    targetType: ReviewTargetType.EMPLOYEE,
                    rating: stylistRating,
                });
            }

            if (serviceName && serviceName.length > 0 && serviceRating > 0 && storeServiceId) {
                 reviewsToSend.push({
                    ...baseReviewData,
                    targetId: storeServiceId,
                    targetType: ReviewTargetType.STORE_SERVICE,
                    rating: serviceRating,
                });
            }


            for (const reviewReq of reviewsToSend) {
                await api.post(url.REVIEW.CREATE, reviewReq);
            }

            // Hiển thị thông báo thành công bằng react-toastify
            toast.success("Gửi đánh giá thành công!"); 
            onReviewSubmitted(true); // Vẫn gọi prop để cha component có thể cập nhật UI
            onClose(); // Đóng modal

        } catch (err: any) {
            console.error('Error submitting review:', err.response?.data || err.message);
            const errorMessage = err.response?.data?.message || 'Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại.';
            setError(errorMessage); // Vẫn set error nội bộ cho form validation
            // Hiển thị thông báo lỗi bằng react-toastify
            toast.error(errorMessage);
            onReviewSubmitted(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg animate-fade-in-up relative border border-gray-100">
                <h2 className="text-3xl font-bold text-[#15397F] mb-6 text-center">Đánh giá chất lượng</h2>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-[#15397F] transition-colors text-3xl font-light"
                >
                    &times;
                </button>
                {/* Chỉ hiển thị error nếu nó đến từ validation form, không phải từ API toast */}
                {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit}>
                    {/* Cửa hàng */}
                    <div className="mb-5 py-2 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center text-gray-700 text-base font-semibold">
                            <FaStore className="mr-2 text-[#15397F]" />
                            Cửa hàng:<span className="ml-1 text-gray-900 font-medium">{storeName}</span>
                        </div>
                        <StarRating initialRating={storeRating} onChange={setStoreRating} starSize={26} />
                    </div>

                    {/* Stylist */}
                    <div className="mb-5 py-2 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center text-gray-700 text-base font-semibold">
                            <FaUser className="mr-2 text-[#15397F]" />
                            Stylist:<span className="ml-1 text-gray-900 font-medium">{employeeName}</span>
                        </div>
                        <StarRating initialRating={stylistRating} onChange={setStylistRating} starSize={26} />
                    </div>

                    {/* Dịch vụ */}
                    <div className="mb-5 py-2 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center text-gray-700 text-base font-semibold">
                            <FaCut className="mr-2 text-[#15397F]" />
                            Dịch vụ:{' '}
                            <div className="text-gray-900 font-medium text-base inline">
                                {serviceName.map((name, idx) => (
                                    <span key={idx}>
                                        {name}{idx < serviceName.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <StarRating initialRating={serviceRating} onChange={setServiceRating} starSize={26} />
                    </div>


                    {/* Bình luận */}
                    <div className="mb-6 py-2">
                        <label htmlFor="comment" className="flex items-center text-gray-700 text-base font-semibold mb-3">
                            <FaRegCommentDots className="mr-2 text-[#15397F]" />
                            Bình luận (tùy chọn):
                        </label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15397F] resize-none text-gray-800 placeholder-gray-500 transition-colors duration-200"
                            placeholder="Chia sẻ trải nghiệm của bạn..."
                        ></textarea>
                    </div>

                    {/* Nút gửi đánh giá */}
                    <button
                        type="submit"
                        className="w-full bg-[#15397F] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[#1e4bb8] transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
                        disabled={loading}
                    >
                        {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewFormModal;