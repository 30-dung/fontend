const url = {
    BASE_URL: 'http://localhost:9090/api/',

    AUTH: {
        REGISTER: 'auth/register',
        LOGIN: 'auth/login',
        FORGOT_PASSWORD: 'auth/forgot-password',
        RESET_PASSWORD: 'auth/reset-password',
        // GUEST: 'auth/guest', // Removed as it doesn't exist in AuthController.java
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
        WORKING_TIME_SLOTS: 'employee/working-time-slots/available', // Matches /api/employee/working-time-slots/available/{employeeId}/{date}
    },

    APPOINTMENT: {
        CREATE: 'appointments',
        GET_ALL: 'appointments',
        GET_BY_ID: 'appointments', // Matches /api/appointments/{appointmentId}
    },
};

export default url;