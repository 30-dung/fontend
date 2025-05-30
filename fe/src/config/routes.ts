const routes = {
    home: '/',
    about: '/about',
    booking: '/booking',
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
    // store: '/store',
    // services: '/services',
    stylistAndTime: '/stylist-and-time',
    bookingConfirmation: '/booking-confirmation'
}

export default routes;