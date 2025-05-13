
const url = {
    BASE_URL: "http://localhost:9090/api/",

    AUTH: {
        REGISTER: "auth/register",
        LOGIN: "auth/login",
        FORGOT_PASSWORD: "/auth/forgot-password",
        RESET_PASSWORD: "/auth/reset-password",
    },
    USER: {
        PROFILE: "user/profile",
        UPDATE_PROFILE: "user/update-profile",
        
    },
    STORE:{
     ADD: "/store/add",
    UPDATE: "/store/update",
    DELETE: "/store/delete",
    LOCATE: "/store/locate",
    ALL: "/store/all",
    CITIES: "/store/cities",
    DISTRICTS: "/store/districts"
    }
};

export default url;