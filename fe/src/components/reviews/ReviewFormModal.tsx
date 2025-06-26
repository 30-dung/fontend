// src/components/ReviewFormModal.tsx
import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import { ReviewRequest, ReviewTargetType, UserInfo } from '@/types/review';
import api from '@/services/api';
import url from '@/services/url';
import { useNavigate } from 'react-router-dom';
import routes from '@/config/routes';
import { FaStore, FaUser, FaCut, FaRegCommentDots } from 'react-icons/fa';

import { toast } from 'react-toastify';

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
    const [error, setError] = useState<string | null>(null);
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
                    toast.error("Không thể tải thông tin người dùng. Vui lòng thử lại.");
                    onClose();
                }
            };
            fetchUserInfo();
        }
    }, [isOpen]);

    if (isOpen && !userInfo) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-sans"> {/* Thêm font-sans */}
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center">
                    <p className="text-medium-gray">Đang tải thông tin người dùng...</p> {/* Thay text-gray-700 thành text-medium-gray */}
                </div>
            </div>
        );
    }
    
    if (!isOpen || typeof userInfo?.userId !== 'number') {
        if (isOpen && userInfo && typeof userInfo.userId !== 'number') {
            console.error("ReviewFormModal: User ID is invalid or missing from profile API. Cannot submit review.");
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
        setError(null);

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

            toast.success("Gửi đánh giá thành công!");
            onReviewSubmitted(true);
            onClose();

        } catch (err: any) {
            console.error('Error submitting review:', err.response?.data || err.message);
            const errorMessage = err.response?.data?.message || 'Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại.';
            setError(errorMessage);
            toast.error(errorMessage);
            onReviewSubmitted(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-sans"> {/* Thêm font-sans */}
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg animate-fade-in-up relative border border-soft-gray"> {/* Thay border-gray-100 thành border-soft-gray */}
                <h2 className="text-3xl font-bold text-dark-brown mb-6 text-center font-serif">Đánh giá chất lượng</h2> {/* Thay text-[#15397F] thành text-dark-brown, thêm font-serif */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-medium-gray hover:text-dark-brown transition-colors text-3xl font-light" /* Thay text-gray-500 hover:text-[#15397F] thành màu theme */
                >
                    &times;
                </button>
                {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit}>
                    {/* Cửa hàng */}
                    <div className="mb-5 py-2 border-b border-soft-gray flex items-center justify-between"> {/* Thay border-gray-200 thành border-soft-gray */}
                        <div className="flex items-center text-dark-brown text-base font-semibold"> {/* Thay text-gray-700 thành text-dark-brown */}
                            <FaStore className="mr-2 text-dark-brown" /> {/* Thay text-[#15397F] thành text-dark-brown */}
                            Cửa hàng:<span className="ml-1 text-dark-brown font-medium">{storeName}</span> {/* Thay text-gray-900 thành text-dark-brown */}
                        </div>
                        <StarRating initialRating={storeRating} onChange={setStoreRating} starSize={26} />
                    </div>

                    {/* Stylist */}
                    <div className="mb-5 py-2 border-b border-soft-gray flex items-center justify-between"> {/* Thay border-gray-200 thành border-soft-gray */}
                        <div className="flex items-center text-dark-brown text-base font-semibold"> {/* Thay text-gray-700 thành text-dark-brown */}
                            <FaUser className="mr-2 text-dark-brown" /> {/* Thay text-[#15397F] thành text-dark-brown */}
                            Stylist:<span className="ml-1 text-dark-brown font-medium">{employeeName}</span> {/* Thay text-gray-900 thành text-dark-brown */}
                        </div>
                        <StarRating initialRating={stylistRating} onChange={setStylistRating} starSize={26} />
                    </div>

                    {/* Dịch vụ */}
                    <div className="mb-5 py-2 border-b border-soft-gray flex items-center justify-between"> {/* Thay border-gray-200 thành border-soft-gray */}
                        <div className="flex items-center text-dark-brown text-base font-semibold"> {/* Thay text-gray-700 thành text-dark-brown */}
                            <FaCut className="mr-2 text-dark-brown" /> {/* Thay text-[#15397F] thành text-dark-brown */}
                            Dịch vụ:{' '}
                            <div className="text-dark-brown font-medium text-base inline"> {/* Thay text-gray-900 thành text-dark-brown */}
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
                        <label htmlFor="comment" className="flex items-center text-dark-brown text-base font-semibold mb-3"> {/* Thay text-gray-700 thành text-dark-brown */}
                            <FaRegCommentDots className="mr-2 text-dark-brown" /> {/* Thay text-[#15397F] thành text-dark-brown */}
                            Bình luận (tùy chọn):
                        </label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border border-soft-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-gold resize-none text-dark-brown placeholder-medium-gray transition-colors duration-200" /* Thay đổi màu border, focus ring/border, text, placeholder */
                            placeholder="Chia sẻ trải nghiệm của bạn..."
                        ></textarea>
                    </div>

                    {/* Nút gửi đánh giá */}
                    <button
                        type="submit"
                        className="w-full bg-black-soft text-light-cream py-3 rounded-lg font-semibold text-lg hover:bg-dark-brown transition-colors duration-300 disabled:bg-soft-gray disabled:cursor-not-allowed shadow-md" /* Thay bg-[#15397F] hover:bg-[#1e4bb8] text-white thành màu theme */
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