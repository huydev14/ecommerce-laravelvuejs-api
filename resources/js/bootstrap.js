import axios from "axios";

// Config axios
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// Request interceptor: tự động thêm token
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
            console.log(
                "Token added to request:",
                token.substring(0, 20) + "..."
            );
        } else {
            console.log("No token found in localStorage");
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: xử lý token hết hạn
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// Make axios available globally immediately
if (typeof window !== 'undefined') {
    window.axios = axios;
}

export default axios;
