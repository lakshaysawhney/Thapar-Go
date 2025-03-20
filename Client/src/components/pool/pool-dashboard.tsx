"use client";

import type React from "react";

import { useState, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Pool } from "@/types/pool";
import { PoolCard } from "@/components/pool/pool-card";
import { PoolDetails } from "@/components/pool/pool-details";
import { FilterSidebar } from "@/components/pool/filter-sidebar";
import { usePoolFilters } from "@/hooks/use-pool-filters";
import {
	transportModes,
	getUniqueStartPoints,
	getUniqueEndPoints,
} from "@/data/pool-data";
import type { CreatePoolFormValues } from "@/schemas/pool-schema";
import { CreatePoolForm } from "@/components/pool/create-pool-form";
import { AppHeader } from "@/components/layout/app-header";

/**
 * Main dashboard component for the car pooling application
 */
export default function PoolDashboard() {
	// Get unique locations from pool data
	const startPoints = getUniqueStartPoints();
	const endPoints = getUniqueEndPoints();

	// State for dialogs
	const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [isCreatePoolOpen, setIsCreatePoolOpen] = useState(false);

	// Use custom hook for filtering
	const { filters, updateFilter, resetFilters, filteredPools, fareRange } =
		usePoolFilters();

	// Handle search input
	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			updateFilter("searchQuery", e.target.value);
		},
		[updateFilter],
	);

	// Handle pool selection
	const handlePoolSelect = useCallback((pool: Pool) => {
		setSelectedPool(pool);
	}, []);

	// Handle form submission
	const handleCreatePool = (data: CreatePoolFormValues) => {
		console.log("New pool data:", data);
		// In a real app, you would send this data to your backend
		setIsCreatePoolOpen(false);
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<AppHeader onCreatePool={() => setIsCreatePoolOpen(true)} />

			{/* Search and Filter Section */}
			<div className="container mx-auto p-4">
				<div className="flex flex-col sm:flex-row gap-2 mb-6">
					<div className="relative flex-grow">
						<Search
							className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
							size={18}
						/>
						<Input
							placeholder="Search by creator..."
							className="pl-10 border-primary/20 focus-visible:ring-primary"
							value={filters.searchQuery}
							onChange={handleSearchChange}
						/>
					</div>
					<FilterSidebar
						open={isFilterOpen}
						onOpenChange={setIsFilterOpen}
						filters={filters}
						onUpdateFilter={updateFilter}
						onResetFilters={resetFilters}
						startPoints={startPoints}
						endPoints={endPoints}
						transportModes={transportModes}
						fareRange={fareRange}
					/>
				</div>

				{/* View Tabs */}
				<Tabs
					defaultValue="all"
					className="mb-6"
				>
					<TabsList className="bg-primary/5 w-full sm:w-auto">
						<TabsTrigger
							value="all"
							className="flex-1 sm:flex-initial data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
						>
							All Pools
						</TabsTrigger>
						<TabsTrigger
							value="my"
							className="flex-1 sm:flex-initial data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
						>
							My Pools
						</TabsTrigger>
					</TabsList>
					<TabsContent
						value="all"
						className="mt-4"
					>
						{/* Pool Cards */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
							{filteredPools.length > 0 ? (
								filteredPools.map((pool) => (
									<PoolCard
										key={pool.id}
										pool={pool}
										onClick={() => handlePoolSelect(pool)}
									/>
								))
							) : (
								<div className="col-span-full text-center py-10 text-muted-foreground">
									No pools match your search criteria
								</div>
							)}
						</div>
					</TabsContent>
					<TabsContent value="my">
						<div className="text-center py-10 text-muted-foreground">
							You haven't created any pools yet
						</div>
					</TabsContent>
				</Tabs>
			</div>

			{/* Pool Details Dialog */}
			<PoolDetails
				pool={selectedPool}
				open={!!selectedPool}
				onOpenChange={(open) => !open && setSelectedPool(null)}
			/>

			{/* Create Pool Dialog */}
			<Dialog
				open={isCreatePoolOpen}
				onOpenChange={setIsCreatePoolOpen}
			>
				<DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-sm max-h-[90vh] overflow-y-auto p-4 sm:p-6">
					<DialogHeader>
						<DialogTitle className="text-xl text-primary">
							Create New Pool
						</DialogTitle>
						<DialogDescription>
							Fill in the details to create a new car pool.
						</DialogDescription>
					</DialogHeader>

					<CreatePoolForm
						onSubmit={handleCreatePool}
						startPoints={startPoints}
						endPoints={endPoints}
						transportModes={transportModes}
						onCancel={() => setIsCreatePoolOpen(false)}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
