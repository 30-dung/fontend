// src/components/ReviewReplyItem.tsx
import React, { useState } from 'react';
import { ReviewReplyResponse } from '../types/review';
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
                <div className="flex-shrink-0 mt-0.5">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
                        {reply.replier.profilePicUrl ? (
                            <img
                                src={reply.replier.profilePicUrl}
                                alt={reply.replier.fullName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-sm text-gray-500 font-medium">
                                {reply.replier.fullName.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex-grow">
                    <div className="flex items-baseline justify-between mb-1">
                        <div className="flex items-center">
                            <span className="text-sm font-semibold text-gray-800 mr-2">
                                {reply.replier.fullName}
                            </span>
                            {reply.isStoreReply && (
                                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-medium">
                                    Cửa hàng
                                </span>
                            )}
                        </div>
                        <span className="text-xs text-gray-500">
                            {formatDateTime(reply.createdAt)}
                        </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{reply.comment}</p>

                    {currentUserId && (
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="text-xs text-blue-700 hover:text-blue-800 mt-2 flex items-center transition-colors px-2 py-1 rounded-lg bg-blue-100 hover:bg-blue-200"
                        >
                            <FaReply className="mr-1" size={10} />
                            {showReplyForm ? 'Hủy' : 'Trả lời'}
                        </button>
                    )}
                </div>
            </div>

            {showReplyForm && (
                <form onSubmit={handleReplySubmit} className="mt-3 ml-12 bg-gray-50 p-3 rounded-lg shadow-sm"> {/* Added shadow-sm for the form */}
                    <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                        placeholder="Viết phản hồi của bạn..."
                        disabled={loading}
                    ></textarea>
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    <div className="flex justify-end gap-2 mt-3">
                        <button
                            type="button"
                            onClick={() => setShowReplyForm(false)}
                            className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1 text-sm text-white bg-blue-700 rounded-md hover:bg-blue-800 transition-colors disabled:bg-blue-400"
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