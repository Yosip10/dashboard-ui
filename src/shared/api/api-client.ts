import axios from "axios";

// Create a centralized axios instance
const apiClient = axios.create();

// Request interceptor to add the Authorization header
apiClient.interceptors.request.use(
    (config) => {
        try {
            // Get the auth storage from localStorage (Zustand persists it there)
            const storage = localStorage.getItem("auth-storage");
            if (storage) {
                const { state } = JSON.parse(storage);
                const token = state?.user?.access_token;

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch (error) {
            console.error("Error retrieving auth token from storage", error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
