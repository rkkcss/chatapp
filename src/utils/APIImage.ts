import axios from "axios";

const serverMode = import.meta.env.VITE_API_URL;

export const APIImage = axios.create({
    baseURL: serverMode,
});

APIImage.interceptors.request.use(
    async (config) => {
        config.withCredentials = true;
        config.headers["Accept"] = "application/json";
        config.headers["Content-Type"] = "multipart/form-data";
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

APIImage.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.log("err", error);
        if (error.response.status === 401) {
            window.location.href = "/logout";
        }
        return Promise.reject(error);
    }
);