import axios, { AxiosError } from "axios";
import type { ApiError } from "./types";

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

                if (token && !config.headers.Authorization) {
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

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError<any>) => {
        const apiError: ApiError = {
            message: "Ha ocurrido un error inesperado",
            originalError: error
        };

        if (error.response) {
            // Server responded with a status code outside the 2xx range
            const status = error.response.status;
            const data = error.response.data;

            apiError.statusCode = status;
            apiError.code = data?.code || data?.statusCode;
            apiError.details = data;

            // Map standard HTTP status codes to user-friendly messages
            const httpMessages: Record<number, string> = {
                400: "Solicitud incorrecta. Por favor, verifica los datos.",
                401: "No autorizado. Su sesión puede haber expirado.",
                403: "No tienes permiso para realizar esta acción.",
                404: "El recurso solicitado no fue encontrado.",
                409: "Conflicto en la solicitud. El recurso ya podría existir.",
                500: "Error interno del servidor. Inténtalo más tarde.",
                502: "Puerta de enlace incorrecta.",
                503: "El servicio no está disponible temporalmente.",
                504: "Tiempo de espera agotado.",
            };

            // Priority: 1. Server message, 2. Standard HTTP message, 3. Default error message
            apiError.message = data?.message || data?.error || httpMessages[status] || error.message;

            // Special handling for common business codes
            if (apiError.code === "TOKEN_EXPIRED" || apiError.code === "40001") {
                apiError.message = "Su sesión ha expirado. Por favor, inicie sesión nuevamente.";
            } else if (status === 401) {
                // If it's a login request, 401 means invalid credentials
                const isLoginRequest = error.config?.url?.includes('/auth/token');
                if (isLoginRequest) {
                    apiError.message = "Credenciales inválidas. Por favor, verifica tu usuario y contraseña.";
                } else {
                    apiError.message = "Su sesión ha expirado. Por favor, inicie sesión nuevamente.";
                }
            }

        } else if (error.request) {
            // Request was made but no response received
            apiError.message = "No se pudo conectar con el servidor. Por favor, revisa tu conexión.";
            apiError.code = "NETWORK_ERROR";
        } else {
            // Something happened in setting up the request that triggered an Error
            apiError.message = error.message;
        }

        return Promise.reject(apiError);
    }
);


export default apiClient;

