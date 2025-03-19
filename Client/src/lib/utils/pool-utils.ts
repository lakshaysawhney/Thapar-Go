import type { Pool } from "@/types/pool";

/**
 * Calculates fare per head for a pool
 * @param pool - Pool object
 * @returns Fare per head as a number
 */
export const calculateFarePerHead = (pool: Pool): number => {
	return pool.totalFare / pool.totalPersons;
};

/**
 * Formats fare per head for display
 * @param pool - Pool object
 * @returns Formatted fare per head string
 */
export const formatFarePerHead = (pool: Pool): string => {
	return `$${(pool.totalFare / pool.totalPersons).toFixed(2)}`;
};

/**
 * Calculates and formats fare per head from total fare and total persons
 * @param totalFare - Total fare
 * @param totalPersons - Total persons
 * @returns Formatted fare per head string
 */
export const calculateFormattedFarePerHead = (
	totalFare: number,
	totalPersons: number,
): string => {
	if (totalPersons <= 0) return "$0.00";
	return `$${(totalFare / totalPersons).toFixed(2)}`;
};
