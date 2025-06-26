// src/types/review.ts
export interface UserInfo {
    userId: number;
    fullName: string;
    email: string;
    profilePicUrl?: string;
}

export enum ReviewTargetType {
    STORE = "STORE",
    EMPLOYEE = "EMPLOYEE",
    SERVICE = "SERVICE",
    STORE_SERVICE = "STORE_SERVICE",
}

export interface ReviewRequest {
    userId: number;
    appointmentId: number;
    targetId: number;
    targetType: ReviewTargetType;
    rating: number;
    comment?: string;
}

export interface ReviewReplyRequest {
    reviewId: number;
    userId: number;
    comment: string;
    isStoreReply?: boolean;
    parentReplyId?: number | null; 
}

export interface ReviewReplyResponse {
    replyId: number;
    reviewId: number;
    replier: UserInfo;
    comment: string;
    createdAt: string;
    isStoreReply: boolean;
    parentReplyId?: number | null; 
    childrenReplies?: ReviewReplyResponse[]; 
}

export interface ReviewResponse { 
    reviewId: number;
    reviewer: UserInfo;
    appointmentId: number;
    targetId: number;
    targetType: ReviewTargetType;
    targetName: string;
    rating: number;
    comment?: string;
    createdAt: string;
    replies: ReviewReplyResponse[];
    storeName: string;
    storeId: number;
    employeeName?: string;
    serviceName?: string;
}

export interface EmployeeRatingSummary {
    employeeId: number;
    employeeName: string;
    averageRating: number; // Thêm trường này
    totalReviews: number; // Thêm trường này
    avatarUrl?: string;
}

export interface ServiceRatingSummary {
    serviceId: number;
    serviceName: string;
    averageRating: number; // Thêm trường này
    totalReviews: number; // Thêm trường này
    serviceImg?: string;
    description:string;
}

export interface OverallRating {
    storeId: number;
    storeName: string;
    storeImageUrl?: string; 
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
    employeeRatings: EmployeeRatingSummary[];
    serviceRatings: ServiceRatingSummary[];
}

// INTERFACE CHO DỮ LIỆU ĐÁNH GIÁ GOM NHÓM HIỂN THỊ TRÊN FRONTEND
export interface CombinedReviewDisplayDTO {
    mainReviewId: number; 
    reviewer: UserInfo;
    appointmentId: number;
    appointmentSlug: string;
    storeName: string;
    storeId: number;
    employeeName?: string;
    employeeId?: number;
    serviceName?: string;
    storeServiceId?: number;
    storeRating?: number; // Thêm trường này
    employeeRating?: number; // Thêm trường này
    serviceRating?: number; // Thêm trường này
    comment?: string;
    createdAt: string;
    replies: ReviewReplyResponse[];
}

export interface ApiResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}