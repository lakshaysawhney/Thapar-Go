import * as z from "zod";

// Define the form schema with zod
export const createPoolSchema = z.object({
	start_point: z.string().min(1, "Start point is required"),
	end_point: z.string().min(1, "End point is required"),
	departure_time: z.string().min(1, "Departure time is required"),
	arrival_time: z.string().min(1, "Arrival time is required"),
	transport_mode: z.string().min(1, "Transport mode is required"),
	total_persons: z.coerce
		.number()
		.min(1, "Must have at least 1 person")
		.max(20, "Maximum 20 persons"),
	current_persons: z.coerce.number().min(1, "Must have at least 1 person"),
	total_fare: z.coerce.number().min(1, "Total fare must be at least $1"),
	description: z
		.string()
		.min(10, "Description must be at least 10 characters"),
	is_female_only: z.boolean().default(false),
	fare_per_head: z.number().optional(),
});

// Use refine at the schema level to access all fields
export const createPoolSchemaWithValidation = createPoolSchema
	.refine(
		(data) => {
			if (data.total_fare && data.current_persons) {
				return data.total_fare / data.current_persons > 0;
			}
			return true;
		},
		{
			message: "Fare per head must be a positive value",
			path: ["fare_per_head"],
		},
	)
	.refine(
		(data) => {
			if (data.current_persons && data.total_persons) {
				return data.current_persons <= data.total_persons;
			}
			return true;
		},
		{
			message: "Current persons cannot exceed total persons",
			path: ["current_persons"],
		},
	)
	.refine(
		(data) => {
			if (data.arrival_time && data.departure_time) {
				return new Date(data.arrival_time) > new Date(data.departure_time);
			}
			return true;
		},
		{
			message: "Arrival time must be after departure time",
			path: ["arrival_time"],
		},
	);

export type CreatePoolFormValues = z.infer<
	typeof createPoolSchemaWithValidation
>;

// Enhanced signup schema with phone number
export const signupSchema = z.object({
	name: z.string().min(2, { message: "Name must be at least 2 characters" }),
	email: z.string().email({ message: "Please enter a valid email address" }),
	gender: z.enum(["Male", "Female", "Others"], {
		required_error: "Please select a gender",
	}),
	phone: z
		.string()
		.min(10, { message: "Phone number must be at least 10 digits" }),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
