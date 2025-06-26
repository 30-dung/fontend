// src/components/CombinedReviewCard.tsx
import React, { useState } from 'react';
import StarRating from './StarRating';
import { CombinedReviewDisplayDTO, ReviewReplyRequest, ReviewReplyResponse } from '@/types/review';
import api from '@/services/api';
import url from '@/services/url';
import ReviewReplyItem from './ReviewReplyItem';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface CombinedReviewCardProps {
    combinedReview: CombinedReviewDisplayDTO;
    currentUserId: number | null;
    onReplySubmitted: (appointmentId: number, newReply: ReviewReplyResponse) => void;
}

const CombinedReviewCard: React.FC<CombinedReviewCardProps> = ({ combinedReview, currentUserId, onReplySubmitted }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyComment, setReplyComment] = useState('');
    const [replyLoading, setLoading] = useState(false);
    const [replyError, setError] = useState<string | null>(null);

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUserId) {
            toast.error('Bạn cần đăng nhập để trả lời đánh giá.');
            return;
        }
        if (!replyComment.trim()) {
            toast.error('Vui lòng nhập nội dung trả lời.');
            return;
        }

        if (combinedReview.mainReviewId === undefined || combinedReview.mainReviewId === null) {
            toast.error('Lỗi: Không tìm thấy ID đánh giá chính để trả lời.');
            console.error("CombinedReviewCard: mainReviewId is null/undefined for reply:", combinedReview);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const replyRequest: ReviewReplyRequest = {
                reviewId: combinedReview.mainReviewId,
                userId: currentUserId,
                comment: replyComment,
                parentReplyId: null, // Đây là reply cho bài đánh giá chính
            };
            const response = await api.post<ReviewReplyResponse>(
                url.REVIEW.ADD_REPLY.replace('{reviewId}', combinedReview.mainReviewId.toString()),
                replyRequest
            );
            onReplySubmitted(combinedReview.appointmentId, response.data);
            setReplyComment('');
            setShowReplyForm(false);
        } catch (err: any) {
            console.error('Error submitting reply:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Đã xảy ra lỗi khi gửi trả lời.');
        } finally {
            setLoading(false);
        }
    };

    const handleReplyToReply = async (parentReplyId: number, replyText: string) => {
        if (!currentUserId) {
            toast.error('Bạn cần đăng nhập để trả lời.');
            return;
        }
        if (!replyText.trim()) {
            toast.error('Vui lòng nhập nội dung trả lời.');
            return;
        }
        if (combinedReview.mainReviewId === undefined || combinedReview.mainReviewId === null) {
            toast.error('Lỗi: Không tìm thấy ID đánh giá chính để trả lời.');
            return;
        }

        setLoading(true);
        try {
            const replyRequest: ReviewReplyRequest = {
                reviewId: combinedReview.mainReviewId,
                userId: currentUserId,
                comment: replyText,
                parentReplyId: parentReplyId,
            };
            const response = await api.post<ReviewReplyResponse>(
                url.REVIEW.ADD_REPLY.replace('{reviewId}', combinedReview.mainReviewId.toString()),
                replyRequest
            );
            onReplySubmitted(combinedReview.appointmentId, response.data);
        } catch (err: any) {
            console.error('Error submitting reply to reply:', err.response?.data || err.message);
            toast.error(err.response?.data?.message || 'Không thể gửi trả lời.');
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (isoString: string) => {
        return new Date(isoString).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg border border-soft-gray">
            <div className="p-5">
                <div className="flex items-start gap-4">
                   
                    <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                            <p className="font-semibold text-dark-brown text-lg">{combinedReview.reviewer.fullName}</p>
                            <span className="text-sm text-medium-gray mt-1 sm:mt-0">{formatDateTime(combinedReview.createdAt)}</span>
                        </div>

                        {/* Store Rating */}
                        {combinedReview.storeRating !== undefined && (
                            <div className="flex items-center mt-2">
                                <StarRating initialRating={combinedReview.storeRating} readOnly starSize={18} />
                                <span className="text-sm text-medium-gray ml-2 font-medium">Đánh giá cửa hàng</span>
                            </div>
                        )}

                        {/* Stylist and Service Info */}
                        <div className="mt-3 space-y-2 text-sm text-medium-gray">
                            {combinedReview.employeeName && combinedReview.employeeRating !== undefined && (
                                <div className="flex items-center">
                                    <span className="text-medium-gray mr-2">Stylist:</span>
                                    <span className="font-medium text-dark-brown mr-2">{combinedReview.employeeName}</span>
                                    <StarRating initialRating={combinedReview.employeeRating} readOnly starSize={14} />
                                </div>
                            )}
                            {combinedReview.serviceName && combinedReview.serviceRating !== undefined && (
                                <div className="flex items-center">
                                    <span className="text-medium-gray mr-2">Dịch vụ:</span>
                                    <span className="font-medium text-dark-brown mr-2">{combinedReview.serviceName}</span>
                                    <StarRating initialRating={combinedReview.serviceRating} readOnly starSize={14} />
                                </div>
                            )}
                        </div>

                        {combinedReview.comment && (
                            <p className="text-dark-brown mt-4 text-base leading-relaxed bg-soft-gray p-3 rounded-md">
                                {combinedReview.comment}
                            </p>
                        )}
                    </div>
                </div>

                {/* Display Replies */}
                {combinedReview.replies && combinedReview.replies.length > 0 && (
                    <div className="mt-5 ml-14 space-y-3">
                        {combinedReview.replies.map((reply) => (
                            <ReviewReplyItem
                                key={reply.replyId}
                                reply={reply}
                                currentUserId={currentUserId}
                                onReplyToReply={handleReplyToReply}
                                indentationLevel={0}
                            />
                        ))}
                    </div>
                )}

                {/* Reply Button and Form */}
                {currentUserId && (
                    <div className="mt-4 ml-14">
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            // Đã sửa class cho nút "Trả lời"
                            className="text-dark-brown hover:text-light-cream text-sm font-medium flex items-center transition-colors px-3 py-1 rounded-lg bg-soft-gray hover:bg-dark-brown" /* Thay đổi màu nền mặc định, màu chữ mặc định, và hiệu ứng hover */
                        >
                            {showReplyForm ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                    Hủy trả lời
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Trả lời
                                </>
                            )}
                        </button>
                        {showReplyForm && (
                            <form onSubmit={handleReplySubmit} className="mt-3 bg-soft-gray p-4 rounded-lg shadow-sm">
                                <textarea
                                    value={replyComment}
                                    onChange={(e) => setReplyComment(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 text-sm border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent resize-none text-dark-brown"
                                    placeholder="Viết phản hồi của bạn..."
                                    disabled={replyLoading}
                                ></textarea>
                                {replyError && <p className="text-red-500 text-xs mt-1">{replyError}</p>}
                                <div className="flex justify-end gap-2 mt-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowReplyForm(false)}
                                        className="px-4 py-2 text-sm text-dark-brown bg-soft-gray rounded-md hover:bg-medium-gray transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm text-light-cream bg-black-soft rounded-md hover:bg-dark-brown transition-colors disabled:bg-soft-gray"
                                        disabled={replyLoading}
                                    >
                                        {replyLoading ? 'Đang gửi...' : 'Gửi phản hồi'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CombinedReviewCard;