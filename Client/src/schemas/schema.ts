// @ts-nocheck

import * as z from "zod";

// Define the form schema with zod
export const createPoolSchema = z.object({
	start_point: z.string().min(1, "Start point is required"),
	end_point: z.string().min(1, "End point is required"),
	departure_time: z.string().min(1, "Departure time is required"),
	arrival_time: z
		.string()
		.min(1, "Arrival time is required")
		.refine(
			(arrivalTime, form) => {
				if (!arrivalTime || !form.data.departureTime) return true;
				return new Date(arrivalTime) > new Date(form.data.departureTime);
			},
			{
				message: "Arrival time must be after departure time",
				path: ["arrivalTime"],
			},
		),
	transport_mode: z.string().min(1, "Transport mode is required"),
	total_persons: z.coerce
		.number()
		.min(1, "Must have at least 1 person")
		.max(20, "Maximum 20 persons"),
	current_persons: z.coerce
		.number()
		.min(1, "Must have at least 1 person")
		.refine(
			(currentPersons, form) => {
				return currentPersons <= form?.data?.totalPersons;
			},
			{
				message: "Current persons cannot exceed total persons",
				path: ["currentPersons"],
			},
		),
	total_fare: z.coerce.number().min(1, "Total fare must be at least $1"),
	description: z
		.string()
		.min(10, "Description must be at least 10 characters"),
	is_female_only: z.boolean().default(false),
});

export type CreatePoolFormValues = z.infer<typeof createPoolSchema>;

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
