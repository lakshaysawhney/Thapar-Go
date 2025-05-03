import { toast } from "@/hooks/use-toast";

const API_BASE_URL = "https://thapargo.com";

/**
 * Generic API request handler with error handling
 */
async function apiRequest<T>(
	endpoint: string,
	options: RequestInit = {},
	errorMessage = "An error occurred",
): Promise<T> {
	try {
		// Get access token from localStorage
		const accessToken =
			typeof window !== "undefined" ? localStorage.getItem("access") : null;

		// Set default headers
		const headers = {
			"Content-Type": "application/json",
			...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
			...options.headers,
		};

		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			...options,
			headers,
		});

		// Handle non-2xx responses
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			const message = errorData.detail ?? errorData.message ?? errorMessage;
			console.error(`API Error (${response.status}):`, message, errorData);
			throw new Error(message);
		}

		// Parse JSON response
		const data = await response.json();
		return data as T;
	} catch (error) {
		console.error("API Request Error:", error);

		// Show toast notification
		toast({
			title: "Error",
			description: error instanceof Error ? error.message : errorMessage,
			variant: "destructive",
		});

		throw error;
	}
}

interface GoogleAuthResponse {
	access: string;
	refresh: string;
	user?: {
		email: string;
		full_name: string;
		phone_number?: string;
		gender?: string;
	};
}

interface GoogleUserInfo {
	email: string;
	name: string;
	picture?: string;
}

interface SignupData {
	access_token: string;
	phone_number: string;
	gender: string;
}

/**
 * Authentication API Service
 */
export const authApi = {
	/**
	 * Login with Google
	 */
	googleLogin: async (accessToken: string): Promise<GoogleAuthResponse> => {
		return apiRequest<GoogleAuthResponse>(
			"/auth/google/login/callback/",
			{
				method: "POST",
				body: JSON.stringify({
					access_token: accessToken,
				}),
			},
			"Failed to login with Google",
		);
	},

	/**
	 * Get user info from Google token
	 */
	getGoogleUserInfo: async (accessToken: string): Promise<GoogleUserInfo> => {
		const response = await fetch(
			"https://www.googleapis.com/oauth2/v3/userinfo",
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);

		if (!response.ok) {
			throw new Error("Failed to get user info from Google");
		}

		return response.json();
	},

	/**
	 * Complete signup with additional user details
	 */
	completeSignup: async (data: SignupData): Promise<GoogleAuthResponse> => {
		return apiRequest<GoogleAuthResponse>(
			"/auth/google/signup/complete/",
			{
				method: "POST",
				body: JSON.stringify(data),
			},
			"Failed to complete signup",
		);
	},

	/**
	 * Logout user
	 */
	logout: async (): Promise<void> => {
		// Clear local storage
		localStorage.removeItem("access");
		localStorage.removeItem("refresh");
	},
};
