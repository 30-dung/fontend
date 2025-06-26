// src/pages/client/reviews/StoreReviewsPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '@/services/api';
import url from '@/services/url';
import {
    OverallRating,
    CombinedReviewDisplayDTO,
    ApiResponse,
    ReviewReplyResponse,
} from '@/types/review';
import CombinedReviewCard from '@/components/reviews/CombinedReviewCard';
import { FaStar, FaChevronLeft, FaChevronRight, FaFilter, FaComments, FaPhoneAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import routes from '@/config/routes';

const getCurrentUserId = (): number | null => {
    try {
        const storedUserString = localStorage.getItem('user');
        if (storedUserString) {
            const storedUser = JSON.parse(storedUserString);
            if (typeof storedUser.userId === 'number') {
                return storedUser.userId;
            }
        }
    } catch (e) {
        console.error("Error getting user ID from local storage:", e);
    }
    return null;
};

export const StoreReviewsPage: React.FC = () => {
    const { storeId } = useParams<{ storeId: string }>();
    const parsedStoreId = storeId ? parseInt(storeId) : null;

    const [overallRating, setOverallRating] = useState<OverallRating | null>(null);
    const [reviews, setReviews] = useState<CombinedReviewDisplayDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
    const [selectedService, setSelectedService] = useState<number | null>(null);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const currentUserId = getCurrentUserId();

    // State cho slideshow Stylist
    const [currentEmployeeSlide, setCurrentEmployeeSlide] = useState(0);
    const employeesPerPage = 6;

    // State cho slideshow Dịch vụ
    const [currentServiceSlide, setCurrentServiceSlide] = useState(0);
    const servicesPerPage = 3;

    const fetchReviewsAndSummary = async () => {
        if (!parsedStoreId) return;

        setLoading(true);
        setError(null);
        try {
            const params: any = {
                page: currentPage,
                size: 10,
                sortBy: 'createdAt',
                sortDir: 'desc',
            };

            if (selectedEmployee) {
                params.employeeId = selectedEmployee;
            }
            if (selectedService) {
                params.storeServiceId = selectedService;
            }
            if (selectedRating) {
                params.rating = selectedRating;
            }

            const reviewsResponse = await api.get<ApiResponse<CombinedReviewDisplayDTO>>(
                url.REVIEW.GET_BY_STORE_FILTERED.replace('{storeId}', parsedStoreId.toString()),
                { params }
            );
            setReviews(reviewsResponse.data.content);
            setTotalPages(reviewsResponse.data.totalPages);

            const summaryResponse = await api.get<OverallRating>(
                url.REVIEW.GET_STORE_SUMMARY.replace('{storeId}', parsedStoreId.toString())
            );
            setOverallRating(summaryResponse.data);


        } catch (err: any) {
            console.error('Error fetching reviews:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Không thể tải đánh giá.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviewsAndSummary();
    }, [parsedStoreId, currentPage, selectedEmployee, selectedService, selectedRating]);

    const handleReplySubmitted = (appointmentId: number, newReply: ReviewReplyResponse) => {
        fetchReviewsAndSummary();
    };

    const formatReviewCount = (count: number | undefined): string => {
        if (count === undefined) return '0';
        if (count >= 1000) {
            return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        }
        return count.toString();
    };

    const filteredEmployees = overallRating?.employeeRatings?.filter(emp => emp.totalReviews > 0) || [];
    const totalEmployeeSlides = Math.ceil(filteredEmployees.length / employeesPerPage);

    const nextEmployeeSlide = () => {
        setCurrentEmployeeSlide((prev) => Math.min(prev + 1, totalEmployeeSlides - 1));
    };

    const prevEmployeeSlide = () => {
        setCurrentEmployeeSlide((prev) => Math.max(prev - 1, 0));
    };

    const startIndexEmployee = currentEmployeeSlide * employeesPerPage;
    const endIndexEmployee = startIndexEmployee + employeesPerPage;
    const employeesToDisplay = filteredEmployees.slice(startIndexEmployee, endIndexEmployee);

    const filteredServices = overallRating?.serviceRatings?.filter(svc => svc.totalReviews > 0) || [];
    const totalServiceSlides = Math.ceil(filteredServices.length / servicesPerPage);

    const nextServiceSlide = () => {
        setCurrentServiceSlide((prev) => Math.min(prev + 1, totalServiceSlides - 1));
    };

    const prevServiceSlide = () => {
        setCurrentServiceSlide((prev) => Math.max(prev - 1, 0));
    };

    const startIndexService = currentServiceSlide * servicesPerPage;
    const endIndexService = startIndexService + servicesPerPage;
    const servicesToDisplay = filteredServices.slice(startIndexService, endIndexService);

    return (
        <div className="min-h-screen bg-light-cream font-sans">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                
                {/* Hero Section - Store Image & Overview */}
                {overallRating && (
                    <div className="bg-white rounded-lg p-6 lg:p-8 mb-8 shadow-md">
                        {/* Store Image with Overlay */}
                        {overallRating.storeImageUrl && (
                            <div className="relative w-full h-80 lg:h-96 overflow-hidden rounded-lg group mb-6">
                                <img
                                    src={`${url.BASE_IMAGES}${overallRating.storeImageUrl}`}
                                    alt={overallRating.storeName}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                                
                                {/* Store Info Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <h1 className="text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg font-serif">
                                        {overallRating.storeName}
                                    </h1>
                                    <div className="flex items-center gap-6 mb-4">
                                        <div className="flex items-center bg-dark-brown text-light-cream px-4 py-2 rounded-full font-bold text-lg">
                                            <FaStar className="mr-2 text-[#FFDA21]" />
                                            {overallRating.averageRating.toFixed(1)}
                                        </div>
                                        <div className="flex items-center bg-black-soft/30 backdrop-blur-sm px-4 py-2 rounded-full text-light-cream">
                                            <FaComments className="mr-2" />
                                            <span className="font-semibold">
                                                {formatReviewCount(overallRating.totalReviews)} Đánh Giá
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Rating Distribution Card */}
                        <div className="bg-white rounded-lg p-5">
                            <h3 className="text-lg font-semibold text-dark-brown mb-4 font-serif">Phân phối đánh giá</h3>
                            <div className="space-y-3">
                                {Array.from({ length: 5 }, (_, i) => 5 - i).map(starCount => (
                                    <div key={starCount} className="flex items-center">
                                        <div className="flex items-center w-16">
                                            <span className="text-sm font-medium text-medium-gray mr-1">{starCount}</span>
                                            <FaStar className="text-[#FFDA21]" size={14} />
                                        </div>
                                        <div className="flex-1 h-3 bg-soft-gray rounded-full mx-4 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#FFDA21] to-orange-400 rounded-full transition-all duration-500 ease-out"
                                                style={{
                                                    width: `${overallRating.totalReviews > 0
                                                        ? ((overallRating.ratingDistribution[starCount] || 0) / overallRating.totalReviews) * 100
                                                        : 0
                                                    }%`
                                                }}
                                            ></div>
                                        </div>
                                        <span className="w-12 text-right text-sm font-medium text-medium-gray">
                                            {overallRating.ratingDistribution[starCount] || 0}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Featured Reviews Section */}
                <div className="bg-white rounded-lg p-6 lg:p-8 mb-8 shadow-md">
                    
                    <div className="grid gap-6 lg:gap-8">
                        {/* Stylist Section */}
                        {filteredEmployees.length > 0 && (
                            <div className="bg-white rounded-lg p-6">
                                <div className="flex items-center mb-6">
                                    <h3 className="text-2xl font-bold text-dark-brown font-serif">Stylist Xuất Sắc</h3>
                                </div>
                                
                                <div className="relative">
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                        {employeesToDisplay.map(emp => (
                                            <div key={emp.employeeId} className="group cursor-pointer">
                                                <div className="relative overflow-hidden rounded-lg bg-white shadow-sm">
                                                    <div className="aspect-[3/4] overflow-hidden">
                                                        <img 
                                                            src={`${url.BASE_IMAGES}${emp.avatarUrl}` || "https://via.placeholder.com/150x200/f3f4f6?text=Stylist"} 
                                                            alt={emp.employeeName} 
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                                        />
                                                    </div>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black-soft/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                                    <div className="absolute bottom-0 left-0 right-0 p-3 text-light-cream transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                                        <h4 className="font-bold text-sm mb-1 truncate">{emp.employeeName}</h4>
                                                        <div className="flex items-center text-xs">
                                                            <div className="flex items-center bg-dark-brown text-light-cream px-2 py-1 rounded-full">
                                                                <FaStar size={10} className="mr-1 text-[#FFDA21]" />
                                                                <span className="font-semibold">{emp.averageRating.toFixed(1)}</span>
                                                            </div>
                                                            <span className="ml-2 text-white">({emp.totalReviews})</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {totalEmployeeSlides > 1 && (
                                        <>
                                            <button
                                                onClick={prevEmployeeSlide}
                                                disabled={currentEmployeeSlide === 0}
                                                className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-soft-gray shadow-md rounded-full flex items-center justify-center text-medium-gray hover:text-dark-brown hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                            >
                                                <FaChevronLeft size={16} />
                                            </button>
                                            <button
                                                onClick={nextEmployeeSlide}
                                                disabled={currentEmployeeSlide === totalEmployeeSlides - 1}
                                                className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-soft-gray shadow-md rounded-full flex items-center justify-center text-medium-gray hover:text-dark-brown hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                            >
                                                <FaChevronRight size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Services Section */}
                       {filteredServices.length > 0 && (
    <div className="bg-white rounded-lg p-6">
        <div className="flex items-center mb-6">
            <h3 className="text-2xl font-bold text-dark-brown font-serif">Dịch Vụ Hàng Đầu</h3>
        </div>
        
        <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {servicesToDisplay.map(svc => (
                    <div key={svc.serviceId} className="max-w-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-white">
                        <div className="relative w-full h-48 overflow-hidden">
                            <img
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                src={`${url.BASE_IMAGES}${svc.serviceImg}` || "https://via.placeholder.com/600x400/f3f4f6?text=Service"}
                                alt={svc.serviceName}
                            />
                            <div className="absolute inset-0 bg-black-soft bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        
                        <div className="px-6 py-4">
                            <div className="font-bold text-xl mb-2 text-dark-brown truncate font-serif">
                                {svc.serviceName}
                            </div>
                            <p className="text-medium-gray text-base mb-3 line-clamp-2">
                                Có {svc.totalReviews} đánh giá
                            </p>
                            <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <FaStar 
                                        key={i} 
                                        size={20} 
                                        className={i < Math.round(svc.averageRating) ? "text-[#FFDA21]" : "text-soft-gray"}
                                    />
                                ))}
                                <span className="ml-2 text-medium-gray text-sm">({svc.averageRating.toFixed(1)})</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {totalServiceSlides > 1 && (
                <>
                    <button
                        onClick={prevServiceSlide}
                        disabled={currentServiceSlide === 0}
                        className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-soft-gray shadow-md rounded-full flex items-center justify-center text-medium-gray hover:text-dark-brown hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 z-10"
                    >
                        <FaChevronLeft size={16} />
                    </button>
                    <button
                        onClick={nextServiceSlide}
                        disabled={currentServiceSlide === totalServiceSlides - 1}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-soft-gray shadow-md rounded-full flex items-center justify-center text-medium-gray hover:text-dark-brown hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 z-10"
                    >
                        <FaChevronRight size={16} />
                    </button>
                </>
            )}
        </div>
    </div>
)}
                    </div>
                </div>

                {/* Filters Section AND Reviews List (COMMON SHADOWED BLOCK) */}
                <div className="bg-white rounded-lg shadow-md p-6 lg:p-8 mb-8">
                    {/* Filters Section */}
                    <div className="mb-8">
                        <div className="flex items-center mb-4">
                            <FaFilter className="text-accent-gold mr-3" size={20} />
                            <h3 className="text-xl font-bold text-dark-brown font-serif">Lọc Đánh Giá</h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setSelectedRating(null)}
                                className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 ${
                                    selectedRating === null
                                        ? 'bg-black-soft text-light-cream'
                                        : 'bg-soft-gray text-medium-gray hover:bg-dark-brown hover:text-light-cream' /* Đã chỉnh hover */
                                }`}
                            >
                                Tất Cả
                            </button>
                            {[5, 4, 3, 2, 1].map(starCount => (
                                <button
                                    key={starCount}
                                    onClick={() => setSelectedRating(starCount)}
                                    className={`px-5 py-2 rounded-lg font-medium flex items-center transition-all duration-300 ${
                                        selectedRating === starCount
                                            ? 'bg-black-soft text-light-cream'
                                            : 'bg-soft-gray text-medium-gray hover:bg-dark-brown hover:text-light-cream' /* Đã chỉnh hover */
                                    }`}
                                >
                                    {starCount} <FaStar size={14} className="ml-2 text-[#FFDA21]" />
                                </button>
                            ))}
                           
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-6">
                        {reviews.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-lg">
                                <div className="text-medium-gray text-6xl mb-4">🔍</div>
                                <p className="text-xl text-medium-gray">Không có đánh giá nào phù hợp với bộ lọc.</p>
                            </div>
                        ) : (
                            reviews.map(combinedReview => (
                                <CombinedReviewCard
                                    key={combinedReview.appointmentId + "_" + combinedReview.reviewer.userId}
                                    combinedReview={combinedReview}
                                    currentUserId={currentUserId}
                                    onReplySubmitted={handleReplySubmitted}
                                />
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-12">
                            <div className="flex items-center space-x-2 bg-white rounded-lg p-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                    disabled={currentPage === 0}
                                    className="px-4 py-2 rounded-lg bg-soft-gray text-medium-gray hover:bg-dark-brown hover:text-light-cream disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                                >
                                    Trước
                                </button>
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPage(index)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                            currentPage === index
                                                ? 'bg-black-soft text-light-cream'
                                                : 'bg-soft-gray text-medium-gray hover:bg-dark-brown hover:text-light-cream' /* Đã chỉnh hover */
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                    disabled={currentPage === totalPages - 1}
                                    className="px-4 py-2 rounded-lg bg-soft-gray text-medium-gray hover:bg-dark-brown hover:text-light-cream disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
           
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="fixed bottom-6 right-6 z-50"
            >
                <Link
                    to={routes.booking}
                    className="flex items-center bg-black-soft text-light-cream font-bold py-3 px-7 rounded-full shadow-xl hover:bg-dark-brown transition-all duration-300"
                >
                    <FaPhoneAlt className="mr-2" />
                    Đặt lịch ngay
                </Link>
            </motion.div>
        </div>
    );
};