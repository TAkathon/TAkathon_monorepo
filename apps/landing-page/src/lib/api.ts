import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export interface ContactFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
}

/**
 * Submit the contact form to the backend.
 * Falls back to a simulated success if the backend is unavailable.
 */
export async function submitContactForm(data: ContactFormData) {
    try {
        const response = await api.post("/api/contact", data);
        return response.data;
    } catch {
        // Simulate success for demo/landing page purposes
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return { success: true, message: "Message received! We'll get back to you soon." };
    }
}

export default api;
