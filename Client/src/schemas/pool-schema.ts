// @ts-nocheck

import * as z from "zod";

// Define the form schema with zod
export const createPoolSchema = z.object({
	startPoint: z.string().min(1, "Start point is required"),
	endPoint: z.string().min(1, "End point is required"),
	departureTime: z.string().min(1, "Departure time is required"),
	arrivalTime: z
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
	transportMode: z.string().min(1, "Transport mode is required"),
	totalPersons: z.coerce
		.number()
		.min(1, "Must have at least 1 person")
		.max(20, "Maximum 20 persons"),
	currentPersons: z.coerce
		.number()
		.min(1, "Must have at least 1 person")
		.refine(
			(currentPersons, form) => {
				return currentPersons <= form.data.totalPersons;
			},
			{
				message: "Current persons cannot exceed total persons",
				path: ["currentPersons"],
			},
		),
	totalFare: z.coerce.number().min(1, "Total fare must be at least $1"),
	description: z
		.string()
		.min(10, "Description must be at least 10 characters"),
	femaleOnly: z.boolean().default(false),
});

export type CreatePoolFormValues = z.infer<typeof createPoolSchema>;
