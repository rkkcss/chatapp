import axios from "axios";

export const APILogin = axios.create();

APILogin.interceptors.request.use(
    async (config) => {
        const serverMode = import.meta.env.VITE_API_URL;
        console.log(serverMode);
        config.baseURL = serverMode;
        config.withCredentials = true;
        config.headers["Content-Type"] = "application/x-www-form-urlencoded";
        config.headers["Accept"] = "application/json";
        const csrfToken = getCookie("XSRF-TOKEN");

        if (csrfToken) {
            config.headers["X-XSRF-TOKEN"] = csrfToken;
        }
        return config;
    },
    (error) => {
        console.error(error);
        return Promise.reject(error);
    }
);
function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookieValue = parts.pop();
        if (cookieValue) {
            return cookieValue.split(";").shift();
        }
    }
}

APILogin.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error.response.data);
    }
);