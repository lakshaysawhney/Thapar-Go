// Define the pool type

interface PoolMembers {
	full_name: string;
	phone_number: number;
	gender: "Male" | "Female" | "Others";
	is_creator: boolean;
	pool: number;
}

export interface Pool {
	id: string | number;
	created_by?: {
		full_name: string;
		phone_number: string;
		gender: string;
	};
	createdBy?: string; // Keep for backward compatibility
	members?: PoolMembers[];
	start_point?: string;
	startPoint?: string; // Keep for backward compatibility
	end_point?: string;
	endPoint?: string; // Keep for backward compatibility
	departure_time?: string;
	departureTime?: string; // Keep for backward compatibility
	arrival_time?: string;
	arrivalTime?: string; // Keep for backward compatibility
	transport_mode?: string;
	transportMode?: string; // Keep for backward compatibility
	total_persons?: number;
	totalPersons?: number; // Keep for backward compatibility
	current_persons?: number;
	currentPersons?: number; // Keep for backward compatibility
	fare_per_head?: string;
	totalFare?: number; // Keep for backward compatibility
	description?: string;
	is_female_only?: boolean;
	femaleOnly?: boolean; // Keep for backward compatibility
}

export interface FilterState {
	searchQuery: string;
	femaleOnlyFilter: boolean | null;
	startPointFilter: string | null;
	endPointFilter: string | null;
	transportModeFilter: string | null;
	fareRange: [number, number];
}

export interface CreatePoolFormData {
	startPoint: string;
	endPoint: string;
	departureTime: string;
	arrivalTime: string;
	transportMode: string;
	totalPersons: number;
	currentPersons: number;
	totalFare: number;
	description: string;
	femaleOnly: boolean;
}

export interface UserProfile {
	id: string;
	name: string;
	email: string;
	image?: string;
	gender?: "Male" | "Female" | "Others";
}
