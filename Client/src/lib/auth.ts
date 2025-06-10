import { toast } from "@/hooks/use-toast";

// const API_BASE_URL = "http://127.0.0.1:8000";
const API_BASE_URL = "https://api.thapargo.com";

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

interface GoogleSignUp {
	message: string;
	email: string;
	name: string;
	temp_token: string;
}

interface SignupData {
	access_token: string;
	phone_number: string;
	gender: string;
}

export interface CurrentUserDetailsProps {
	email: string;
	full_name: string;
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
			"/auth/google/",
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
	getGoogleSignUp: async (accessToken: string): Promise<GoogleSignUp> => {
		return apiRequest<GoogleSignUp>(
			"/auth/google/",
			{
				method: "POST",
				body: JSON.stringify({
					access_token: accessToken,
				}),
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
			"Failed to get user info from Google",
		);
	},

	/**
	 * Complete signup with additional user details
	 */
	completeSignup: async (data: SignupData): Promise<GoogleAuthResponse> => {
		return apiRequest<GoogleAuthResponse>(
			"/auth/user/register-info/",
			{
				method: "PUT",
				body: JSON.stringify(data),
				headers: {
					Authorization: `Bearer ${data.access_token}`,
				},
			},
			"Failed to complete signup",
		);
	},

	/**
	 * Fetch current logged-in user details
	 */
	getCurrentUser: async (): Promise<CurrentUserDetailsProps> => {
		return apiRequest<CurrentUserDetailsProps>(
			"/auth/user/profile",
			{
				method: "GET",
			},
			"Failed to fetch current user details",
		);
	},

	/**
	 * Logout user
	 */
	logout: async (): Promise<void> => {
		try {
			// Get tokens from local storage
			const refreshToken = localStorage.getItem("refresh");

			if (!refreshToken) {
				throw new Error("No tokens found for logout");
			}

			// Make logout API request
			await apiRequest<void>(
				"/auth/logout/",
				{
					method: "POST",
					body: JSON.stringify({
						refresh_token: refreshToken,
					}),
				},
				"Failed to logout",
			);

			// Clear local storage
			localStorage.removeItem("access");
			localStorage.removeItem("refresh");
			localStorage.removeItem("user");
		} catch (error) {
			console.error("Logout Error:", error);
			throw error;
		}
	},
};
