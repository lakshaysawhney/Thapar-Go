"use client";

import type React from "react";

import { useState, useCallback } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
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

// Define the pool type
// interface Pool {
//   id: string
//   startPoint: string
//   endPoint: string
//   departureTime: string
//   arrivalTime: string
//   transportMode: string
//   totalPersons: number
//   currentPersons: number
//   totalFare: number
//   createdBy: string
//   description: string
//   femaleOnly: boolean
// }

// Sample data
// const poolData: Pool[] = [
//   {
//     id: "1",
//     startPoint: "Downtown",
//     endPoint: "University Campus",
//     departureTime: "2025-03-20T08:00:00",
//     arrivalTime: "2025-03-20T08:30:00",
//     transportMode: "Car",
//     totalPersons: 4,
//     currentPersons: 2,
//     totalFare: 40,
//     createdBy: "John Doe",
//     description: "Daily commute to university. Air-conditioned car with music.",
//     femaleOnly: false,
//   },
//   {
//     id: "2",
//     startPoint: "Riverside",
//     endPoint: "Tech Park",
//     departureTime: "2025-03-20T09:15:00",
//     arrivalTime: "2025-03-20T10:00:00",
//     transportMode: "SUV",
//     totalPersons: 6,
//     currentPersons: 3,
//     totalFare: 60,
//     createdBy: "Sarah Johnson",
//     description: "Comfortable SUV with space for luggage. Coffee provided!",
//     femaleOnly: true,
//   },
//   {
//     id: "3",
//     startPoint: "Oakwood",
//     endPoint: "Shopping Mall",
//     departureTime: "2025-03-20T14:00:00",
//     arrivalTime: "2025-03-20T14:30:00",
//     transportMode: "Minivan",
//     totalPersons: 7,
//     currentPersons: 4,
//     totalFare: 70,
//     createdBy: "Mike Wilson",
//     description: "Weekend shopping trip. Can help with carrying bags.",
//     femaleOnly: false,
//   },
//   {
//     id: "4",
//     startPoint: "Central Station",
//     endPoint: "Airport",
//     departureTime: "2025-03-21T05:30:00",
//     arrivalTime: "2025-03-21T06:15:00",
//     transportMode: "Sedan",
//     totalPersons: 3,
//     currentPersons: 1,
//     totalFare: 45,
//     createdBy: "Emma Davis",
//     description: "Early morning airport drop. Quiet ride for those who want to sleep.",
//     femaleOnly: true,
//   },
//   {
//     id: "5",
//     startPoint: "Hillside",
//     endPoint: "Beach Resort",
//     departureTime: "2025-03-22T10:00:00",
//     arrivalTime: "2025-03-22T11:30:00",
//     transportMode: "Jeep",
//     totalPersons: 4,
//     currentPersons: 2,
//     totalFare: 80,
//     createdBy: "Alex Brown",
//     description: "Weekend beach trip. Bringing coolers and beach games!",
//     femaleOnly: false,
//   },
// ]

// Transport modes for filter options
// const transportModes = ["Car", "SUV", "Minivan", "Sedan", "Jeep"]

/**
 * Main page component for the car pooling application
 */
export default function Home() {
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

	// const [selectedPool, setSelectedPool] = useState<Pool | null>(null)
	// const [searchQuery, setSearchQuery] = useState("")
	// const [femaleOnlyFilter, setFemaleOnlyFilter] = useState<boolean | null>(null)
	// const [startPointFilter, setStartPointFilter] = useState<string | null>(null)
	// const [endPointFilter, setEndPointFilter] = useState<string | null>(null)
	// const [transportModeFilter, setTransportModeFilter] = useState<string | null>(null)
	// const [isFilterOpen, setIsFilterOpen] = useState(false)
	// const [isCreatePoolOpen, setIsCreatePoolOpen] = useState(false)

	// // Get unique locations from pool data
	// const startPoints = Array.from(new Set(poolData.map((pool) => pool.startPoint)))
	// const endPoints = Array.from(new Set(poolData.map((pool) => pool.endPoint)))

	// // Calculate min and max fare per head from pool data
	// const farePerHeadValues = poolData.map((pool) => pool.totalFare / pool.totalPersons)
	// const minFarePerHead = Math.floor(Math.min(...farePerHeadValues))
	// const maxFarePerHead = Math.ceil(Math.max(...farePerHeadValues))

	// // Initialize fare range state with calculated min/max values
	// const [fareRange, setFareRange] = useState([minFarePerHead, maxFarePerHead])

	// // Format date and time
	// const formatTime = (dateString: string) => {
	//   const date = new Date(dateString)
	//   return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
	// }

	// const formatDate = (dateString: string) => {
	//   const date = new Date(dateString)
	//   return date.toLocaleDateString([], { month: "short", day: "numeric" })
	// }

	// // Calculate fare per head
	// const calculateFarePerHead = (pool: Pool) => {
	//   return pool.totalFare / pool.totalPersons
	// }

	// // Filter pools based on search and filters
	// const filteredPools = poolData.filter((pool) => {
	//   // Search by creator
	//   if (searchQuery && !pool.createdBy.toLowerCase().includes(searchQuery.toLowerCase())) {
	//     return false
	//   }

	//   // Filter by female only
	//   if (femaleOnlyFilter !== null && pool.femaleOnly !== femaleOnlyFilter) {
	//     return false
	//   }

	//   // Filter by start point
	//   if (startPointFilter && pool.startPoint !== startPointFilter) {
	//     return false
	//   }

	//   // Filter by end point
	//   if (endPointFilter && pool.endPoint !== endPointFilter) {
	//     return false
	//   }

	//   // Filter by transport mode
	//   if (transportModeFilter && pool.transportMode !== transportModeFilter) {
	//     return false
	//   }

	//   // Filter by fare per head
	//   const farePerHead = calculateFarePerHead(pool)
	//   if (farePerHead < fareRange[0] || farePerHead > fareRange[1]) {
	//     return false
	//   }

	//   return true
	// })

	// // Handle form submission
	// const handleCreatePool = (data: any) => {
	//   console.log("New pool data:", data)
	//   // In a real app, you would send this data to your backend
	//   setIsCreatePoolOpen(false)
	// }

	return (
		<div className="min-h-screen bg-white">
			{/* Header */}
			<header className="bg-red-600 text-white p-4 shadow-md sticky top-0 z-10">
				<div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
					<h1 className="text-2xl font-bold">CarPool</h1>
					<Button
						variant="outline"
						className="text-black bg-white border-white hover:bg-red-700 hover:text-white w-full sm:w-auto"
						onClick={() => setIsCreatePoolOpen(true)}
					>
						Create Pool
					</Button>
				</div>
			</header>

			{/* Search and Filter Section */}
			<div className="container mx-auto p-4">
				<div className="flex flex-col md:flex-row gap-2 mb-6">
					<div className="relative flex-grow">
						<Search
							className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
							size={18}
						/>
						<Input
							placeholder="Search by creator..."
							className="pl-10 border-red-200 focus-visible:ring-red-500"
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
					<TabsList className="bg-red-50 w-full sm:w-auto">
						<TabsTrigger
							value="all"
							className="flex-1 sm:flex-initial data-[state=active]:bg-red-600 data-[state=active]:text-white"
						>
							All Pools
						</TabsTrigger>
						<TabsTrigger
							value="my"
							className="flex-1 sm:flex-initial data-[state=active]:bg-red-600 data-[state=active]:text-white"
						>
							My Pools
						</TabsTrigger>
					</TabsList>
					<TabsContent
						value="all"
						className="mt-4"
					>
						{/* Pool Cards */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{filteredPools.length > 0 ? (
								filteredPools.map((pool) => (
									<PoolCard
										key={pool.id}
										pool={pool}
										onClick={() => handlePoolSelect(pool)}
									/>
								))
							) : (
								<div className="col-span-full text-center py-10 text-gray-500">
									No pools match your search criteria
								</div>
							)}
						</div>
					</TabsContent>
					<TabsContent value="my">
						<div className="text-center py-10 text-gray-500">
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
				<DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="text-xl text-red-800">
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
