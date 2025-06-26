// src/components/ReviewReplyItem.tsx
import React, { useState } from 'react';
import { ReviewReplyResponse } from '@/types/review';
import { FaReply } from 'react-icons/fa';

interface ReviewReplyItemProps {
    reply: ReviewReplyResponse;
    currentUserId: number | null;
    onReplyToReply: (parentReplyId: number, replyText: string) => void;
    indentationLevel: number;
}

const ReviewReplyItem: React.FC<ReviewReplyItemProps> = ({ reply, currentUserId, onReplyToReply, indentationLevel }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) {
            setError('Vui lòng nhập nội dung trả lời.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await onReplyToReply(reply.replyId, replyText);
            setReplyText('');
            setShowReplyForm(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể gửi trả lời.');
            console.error("Error submitting nested reply:", err);
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
        <div
            style={{ marginLeft: `${indentationLevel * 16}px` }}
            className={`relative pl-4`}
        >
            <div className="flex items-start gap-3">
                
                <div className="flex-grow">
                    <div className="flex items-baseline justify-between mb-1">
                        <div className="flex items-center">
                            <span className="text-sm font-semibold text-dark-brown mr-2">
                                {reply.replier.fullName}
                            </span>
                            {reply.isStoreReply && (
                                <span className="text-xs px-2 py-0.5 bg-accent-gold/20 text-accent-gold rounded-full font-medium">
                                    Cửa hàng
                                </span>
                            )}
                        </div>
                        <span className="text-xs text-medium-gray">
                            {formatDateTime(reply.createdAt)}
                        </span>
                    </div>
                    <p className="text-sm text-medium-gray leading-relaxed">{reply.comment}</p>

                    {currentUserId && (
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            // Đã sửa class cho nút "Trả lời"
                            className="text-dark-brown hover:text-light-cream mt-2 flex items-center transition-colors px-2 py-1 rounded-lg bg-soft-gray hover:bg-dark-brown" /* Thay đổi màu nền mặc định, màu chữ mặc định, và hiệu ứng hover */
                        >
                            <FaReply className="mr-1" size={10} />
                            {showReplyForm ? 'Hủy' : 'Trả lời'}
                        </button>
                    )}
                </div>
            </div>

            {showReplyForm && (
                <form onSubmit={handleReplySubmit} className="mt-3 ml-12 bg-soft-gray p-3 rounded-lg shadow-sm">
                    <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 text-sm border-soft-gray rounded-md focus:outline-none focus:ring-1 focus:ring-accent-gold resize-none text-dark-brown"
                        placeholder="Viết phản hồi của bạn..."
                        disabled={loading}
                    ></textarea>
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    <div className="flex justify-end gap-2 mt-3">
                        <button
                            type="button"
                            onClick={() => setShowReplyForm(false)}
                            className="px-3 py-1 text-sm text-dark-brown bg-soft-gray rounded-md hover:bg-medium-gray transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1 text-sm text-light-cream bg-black-soft rounded-md hover:bg-dark-brown transition-colors disabled:bg-soft-gray"
                            disabled={loading}
                        >
                            {loading ? 'Đang gửi...' : 'Gửi'}
                        </button>
                    </div>
                </form>
            )}

            {/* Display Children Replies */}
            {reply.childrenReplies && reply.childrenReplies.length > 0 && (
                <div className="mt-4 space-y-3">
                    {reply.childrenReplies.map((childReply) => (
                        <ReviewReplyItem
                            key={childReply.replyId}
                            reply={childReply}
                            currentUserId={currentUserId}
                            onReplyToReply={onReplyToReply}
                            indentationLevel={indentationLevel + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewReplyItem;