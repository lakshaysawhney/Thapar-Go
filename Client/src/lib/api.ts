import { toast } from "@/hooks/use-toast";
import type { Pool } from "@/types/pool";
import type { CreatePoolFormValues } from "@/schemas/schema";

const API_BASE_URL = "https://api.thapargo.com";
// const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Generic API request handler with error handling
 */
async function apiRequest<T>(
	endpoint: string,
	options: RequestInit = {},
	errorMessage = "An error occurred",
): Promise<T> {
	try {
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
			throw new Error(errorData.detail);
		}

		// Parse JSON response
		const data = await response.json();
		return data as T;
	} catch (error) {
		console.error("API Request Error:", error);

		// Show toast notification
		toast({
			title: "Error",
			description: error instanceof Error ? error.message : String(error),
			variant: "destructive",
		});

		throw error;
	}
}

/**
 * Pool API Service
 */
export const poolApi = {
	/**
	 * Get all pools
	 */
	getAllPools: async (): Promise<Pool[]> => {
		return apiRequest<Pool[]>("/pools/", {}, "Failed to fetch pools");
	},

	/**
	 * Get pool by ID
	 */
	getPoolById: async (id: string | number): Promise<Pool> => {
		return apiRequest<Pool>(
			`/pools/${id}/`,
			{},
			`Failed to fetch pool #${id}`,
		);
	},

	/**
	 * Create a new pool
	 */
	createPool: async (poolData: CreatePoolFormValues): Promise<Pool> => {
		return apiRequest<Pool>(
			"/pools/",
			{
				method: "POST",
				body: JSON.stringify(poolData),
			},
			"Failed to create pool",
		);
	},

	/**
	 * Update a pool (full update)
	 */
	updatePool: async (
		id: string | number,
		poolData: Partial<CreatePoolFormValues>,
	): Promise<Pool> => {
		return apiRequest<Pool>(
			`/pools/${id}/`,
			{
				method: "PUT",
				body: JSON.stringify(poolData),
			},
			"Failed to update pool",
		);
	},

	/**
	 * Partially update a pool
	 */
	patchPool: async (
		id: string | number,
		poolData: Partial<CreatePoolFormValues>,
	): Promise<Pool> => {
		return apiRequest<Pool>(
			`/pools/${id}/`,
			{
				method: "PATCH",
				body: JSON.stringify(poolData),
			},
			"Failed to update pool",
		);
	},

	/**
	 * Join a pool
	 */
	joinPool: async (id: string | number): Promise<{ message: string }> => {
		return apiRequest<{ message: string }>(
			`/pools/${id}/join/`,
			{
				method: "POST",
			},
			"Failed to join pool",
		);
	},
};
