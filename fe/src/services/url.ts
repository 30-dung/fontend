const url = {
    BASE_URL: 'http://localhost:9090/api/',
    BASE_IMAGES:"http://localhost:9090",

    AUTH: {
        REGISTER: 'auth/register',
        LOGIN: 'auth/login',
        FORGOT_PASSWORD: 'auth/forgot-password',
        RESET_PASSWORD: 'auth/reset-password',
    },

    USER: {
        PROFILE: 'user/profile',
        UPDATE_PROFILE: 'user/update-profile',
        
    },

    STORE: {
        ADD: 'store/add',
        UPDATE: 'store/update',
        DELETE: 'store/delete',
        LOCATE: 'store/locate',
        ALL: 'store/all',
        CITIES: 'store/cities',
        DISTRICTS: 'store/districts',
        GET_BY_ID: 'store', // Matches /api/store/{id}
    },

    STORE_SERVICE: {
        GET_BY_STORE: 'services/store', // Matches /api/services/store/{storeId}
    },

    EMPLOYEE: {
        BY_STORE: 'employees/store', // Matches /api/employees/store/{storeId}
        // Matches /api/employee/working-time-slots/available/{employeeId}/{date}
    },

    SLOT: {
         WORKING_TIME_SLOTS: '/working-time-slots/available',
    },

    APPOINTMENT: {
        CREATE: 'appointments',
        GET_ALL: 'appointments',
        GET_BY_ID: 'appointments', // Matches /api/appointments/{appointmentId}
        GET_BY_USER: 'appointments/user/{email}', // Lấy lịch hẹn của người dùng
        CANCEL: 'appointments/{id}/cancel',
    },
     REVIEW: {
        CREATE: 'reviews', // POST /api/reviews
        ADD_REPLY: 'reviews/{reviewId}/replies', // POST /api/reviews/{reviewId}/replies
        GET_BY_STORE_FILTERED: 'reviews/store/{storeId}/filtered', // GET /api/reviews/store/{storeId}/filtered
        GET_STORE_SUMMARY: 'reviews/store/{storeId}/summary', // GET /api/reviews/store/{storeId}/summary
        EXISTS_BY_APPOINTMENT_ID: 'reviews/existsByAppointmentId', // GET /api/reviews/existsByAppointmentId?appointmentId={appointmentId}
    },
     FEEDBACK: {
        SUBMIT: 'feedback/submit', 
    }
};

export default url;