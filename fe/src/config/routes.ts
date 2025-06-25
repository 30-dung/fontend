// src/config/routes.ts
const routes = {
    home: '/',
    about: '/about',
    booking: '/booking',
    bookingHistorey: '/booking_history',
    login: '/login',
    register: '/register',
    forgot: '/forgot_password',
    reset: '/reset_password',
    shop: '/shop',
    services_combo: '/services_combo/:id',
    combo_detail: '/combo_detail/:id',
    profile: {
        index: '/profile',
        updateProfile: '/profile/updateProfile',
    },
    location_page: '/location_page',
    // --- Bổ sung route cho trang đánh giá của cửa hàng ---
    store_reviews: '/stores/:storeId/reviews', // Trang đánh giá tổng thể của cửa hàng
    stylistAndTime: '/stylist-and-time',
    bookingConfirmation: '/booking-confirmation',
    contact_feedback: '/contact',
}

export default routes;