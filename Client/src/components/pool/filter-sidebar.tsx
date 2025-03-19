"use client";

import { Filter, UserIcon as Female } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import type { FilterState } from "@/types/pool";

interface FilterSidebarProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	filters: FilterState;
	onUpdateFilter: <K extends keyof FilterState>(
		key: K,
		value: FilterState[K],
	) => void;
	onResetFilters: () => void;
	startPoints: string[];
	endPoints: string[];
	transportModes: string[];
	fareRange: {
		min: number;
		max: number;
	};
}

/**
 * Filter sidebar component for filtering pools
 */
export function FilterSidebar({
	open,
	onOpenChange,
	filters,
	onUpdateFilter,
	onResetFilters,
	startPoints,
	endPoints,
	transportModes,
	fareRange,
}: Readonly<FilterSidebarProps>) {
	return (
		<Sheet
			open={open}
			onOpenChange={onOpenChange}
		>
			<SheetTrigger asChild>
				<Button
					variant="outline"
					className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
				>
					<Filter size={18} />
					Filters
				</Button>
			</SheetTrigger>
			<SheetContent className="w-[300px] sm:w-[400px] bg-white overflow-y-auto">
				<SheetHeader>
					<SheetTitle>Filters</SheetTitle>
				</SheetHeader>
				<div className="py-4 space-y-6">
					<div className="space-y-2">
						<h3 className="text-sm font-medium">Pool Type</h3>
						<div className="flex items-center space-x-2">
							<Checkbox
								id="female-only"
								checked={filters.femaleOnlyFilter === true}
								onCheckedChange={(checked) => {
									if (checked) {
										onUpdateFilter("femaleOnlyFilter", true);
									} else {
										onUpdateFilter("femaleOnlyFilter", null);
									}
								}}
							/>
							<Label
								htmlFor="female-only"
								className="flex items-center gap-1"
							>
								<Female
									size={16}
									className="text-pink-500"
								/>
								Female only
							</Label>
						</div>
						<div className="flex items-center space-x-2 mt-1">
							<Checkbox
								id="mixed"
								checked={filters.femaleOnlyFilter === false}
								onCheckedChange={(checked) => {
									if (checked) {
										onUpdateFilter("femaleOnlyFilter", false);
									} else {
										onUpdateFilter("femaleOnlyFilter", null);
									}
								}}
							/>
							<Label htmlFor="mixed">Mixed</Label>
						</div>
					</div>

					<div className="space-y-2">
						<h3 className="text-sm font-medium">Start Point</h3>
						<Select
							value={filters.startPointFilter ?? ""}
							onValueChange={(value) =>
								onUpdateFilter(
									"startPointFilter",
									value === "any" ? null : value,
								)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select start point" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="any">Any</SelectItem>
								{startPoints.map((location) => (
									<SelectItem
										key={location}
										value={location}
									>
										{location}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<h3 className="text-sm font-medium">End Point</h3>
						<Select
							value={filters.endPointFilter ?? ""}
							onValueChange={(value) =>
								onUpdateFilter(
									"endPointFilter",
									value === "any" ? null : value,
								)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select end point" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="any">Any</SelectItem>
								{endPoints.map((location) => (
									<SelectItem
										key={location}
										value={location}
									>
										{location}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<h3 className="text-sm font-medium">Transport Mode</h3>
						<Select
							value={filters.transportModeFilter ?? ""}
							onValueChange={(value) =>
								onUpdateFilter(
									"transportModeFilter",
									value === "any" ? null : value,
								)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select transport mode" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="any">Any</SelectItem>
								{transportModes.map((mode) => (
									<SelectItem
										key={mode}
										value={mode}
									>
										{mode}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-4">
						<div className="flex justify-between">
							<h3 className="text-sm font-medium">Fare per head</h3>
							<span className="text-sm text-gray-500">
								${filters.fareRange[0]} - ${filters.fareRange[1]}
							</span>
						</div>
						<Slider
							min={fareRange.min}
							max={fareRange.max}
							step={1}
							value={filters.fareRange}
							onValueChange={(value) =>
								onUpdateFilter("fareRange", value as [number, number])
							}
							className="[&>span]:bg-red-500"
						/>
					</div>

					<div className="flex justify-between pt-4">
						<Button
							variant="outline"
							onClick={onResetFilters}
						>
							Reset
						</Button>
						<Button
							className="bg-red-600 hover:bg-red-700"
							onClick={() => onOpenChange(false)}
						>
							Apply
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
