"use client";

import { useMemo, useState, useCallback } from "react";
import type { FilterState } from "@/types/pool";
import { calculateFarePerHead } from "@/lib/utils/pool-utils";
import { poolData, getFarePerHeadRange } from "@/data/pool-data";

/**
 * Custom hook for filtering pools
 * @returns Filter state, handlers, and filtered pools
 */
export const usePoolFilters = () => {
	// Get fare range from data
	const { min: minFare, max: maxFare } = getFarePerHeadRange();

	// Initialize filter state
	const [filters, setFilters] = useState<FilterState>({
		searchQuery: "",
		femaleOnlyFilter: null,
		startPointFilter: null,
		endPointFilter: null,
		transportModeFilter: null,
		fareRange: [minFare, maxFare],
	});

	// Update individual filter
	const updateFilter = useCallback(
		<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
			setFilters((prev) => ({ ...prev, [key]: value }));
		},
		[],
	);

	// Reset all filters
	const resetFilters = useCallback(() => {
		setFilters({
			searchQuery: "",
			femaleOnlyFilter: null,
			startPointFilter: null,
			endPointFilter: null,
			transportModeFilter: null,
			fareRange: [minFare, maxFare],
		});
	}, [minFare, maxFare]);

	// Apply filters to pool data
	const filteredPools = useMemo(() => {
		return poolData.filter((pool) => {
			// Search by creator
			if (
				filters.searchQuery &&
				!pool.createdBy
					.toLowerCase()
					.includes(filters.searchQuery.toLowerCase())
			) {
				return false;
			}

			// Filter by female only
			if (
				filters.femaleOnlyFilter !== null &&
				pool.femaleOnly !== filters.femaleOnlyFilter
			) {
				return false;
			}

			// Filter by start point
			if (
				filters.startPointFilter &&
				pool.startPoint !== filters.startPointFilter
			) {
				return false;
			}

			// Filter by end point
			if (
				filters.endPointFilter &&
				pool.endPoint !== filters.endPointFilter
			) {
				return false;
			}

			// Filter by transport mode
			if (
				filters.transportModeFilter &&
				pool.transportMode !== filters.transportModeFilter
			) {
				return false;
			}

			// Filter by fare per head
			const farePerHead = calculateFarePerHead(pool);
			if (
				farePerHead < filters.fareRange[0] ||
				farePerHead > filters.fareRange[1]
			) {
				return false;
			}

			return true;
		});
	}, [filters]);

	return {
		filters,
		updateFilter,
		resetFilters,
		filteredPools,
		fareRange: {
			min: minFare,
			max: maxFare,
		},
	};
};
