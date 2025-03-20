"use client";

import {
	MapPin,
	Clock,
	Users,
	Car,
	DollarSign,
	UserIcon as Female,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Pool } from "@/types/pool";
import { formatTime, formatDate } from "@/lib/utils/date-utils";
import { formatFarePerHead } from "@/lib/utils/pool-utils";

interface PoolDetailsProps {
	pool: Pool | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

/**
 * Pool details dialog component
 */
export function PoolDetails({
	pool,
	open,
	onOpenChange,
}: Readonly<PoolDetailsProps>) {
	if (!pool) return null;

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="sm:max-w-[500px] bg-white dark:bg-background">
				<DialogHeader>
					<DialogTitle className="text-xl text-red-800 dark:text-primary">
						Pool Details
					</DialogTitle>
					<DialogDescription>
						Created by{" "}
						<span className="font-medium">{pool.createdBy}</span>
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<h4 className="text-sm font-medium text-gray-500 dark:text-muted-foreground">
								Start Point
							</h4>
							<p className="flex items-center gap-1 mt-1">
								<MapPin
									size={16}
									className="text-red-500 dark:text-primary"
								/>
								{pool.startPoint}
							</p>
						</div>
						<div>
							<h4 className="text-sm font-medium text-gray-500 dark:text-muted-foreground">
								End Point
							</h4>
							<p className="flex items-center gap-1 mt-1">
								<MapPin
									size={16}
									className="text-red-500 dark:text-primary"
								/>
								{pool.endPoint}
							</p>
						</div>
					</div>

					<Separator />

					<div className="grid grid-cols-2 gap-4">
						<div>
							<h4 className="text-sm font-medium text-gray-500 dark:text-muted-foreground">
								Departure
							</h4>
							<p className="flex items-center gap-1 mt-1">
								<Clock
									size={16}
									className="text-red-500 dark:text-primary"
								/>
								{formatTime(pool.departureTime)}
							</p>
							<p className="text-xs text-gray-500 dark:text-muted-foreground mt-1">
								{formatDate(pool.departureTime)}
							</p>
						</div>
						<div>
							<h4 className="text-sm font-medium text-gray-500 dark:text-muted-foreground">
								Arrival
							</h4>
							<p className="flex items-center gap-1 mt-1">
								<Clock
									size={16}
									className="text-red-500 dark:text-primary"
								/>
								{formatTime(pool.arrivalTime)}
							</p>
							<p className="text-xs text-gray-500 dark:text-muted-foreground mt-1">
								{formatDate(pool.arrivalTime)}
							</p>
						</div>
					</div>

					<Separator />

					<div className="grid grid-cols-2 gap-4">
						<div>
							<h4 className="text-sm font-medium text-gray-500 dark:text-muted-foreground">
								Transport Mode
							</h4>
							<p className="flex items-center gap-1 mt-1">
								<Car
									size={16}
									className="text-red-500 dark:text-primary"
								/>
								{pool.transportMode}
							</p>
						</div>
						<div>
							<h4 className="text-sm font-medium text-gray-500 dark:text-muted-foreground">
								Persons
							</h4>
							<p className="flex items-center gap-1 mt-1">
								<Users
									size={16}
									className="text-red-500 dark:text-primary"
								/>
								{pool.currentPersons}/{pool.totalPersons}
							</p>
						</div>
					</div>

					<Separator />

					<div className="grid grid-cols-2 gap-4">
						<div>
							<h4 className="text-sm font-medium text-gray-500 dark:text-muted-foreground">
								Total Fare
							</h4>
							<p className="flex items-center gap-1 mt-1">
								<DollarSign
									size={16}
									className="text-red-500 dark:text-primary"
								/>
								${pool.totalFare}
							</p>
						</div>
						<div>
							<h4 className="text-sm font-medium text-gray-500 dark:text-muted-foreground">
								Fare per Person
							</h4>
							<p className="flex items-center gap-1 mt-1">
								<DollarSign
									size={16}
									className="text-red-500 dark:text-primary"
								/>
								{formatFarePerHead(pool)}
							</p>
						</div>
					</div>

					{pool.femaleOnly && (
						<div className="bg-pink-50 p-3 rounded-md flex items-center gap-2 mt-2 dark:bg-primary/10">
							<Female
								size={18}
								className="text-pink-500 dark:text-primary"
							/>
							<span className="text-pink-700 dark:text-primary font-medium">
								Female only pool
							</span>
						</div>
					)}

					<div>
						<h4 className="text-sm font-medium text-gray-500 dark:text-muted-foreground">
							Description
						</h4>
						<p className="mt-1 text-gray-700 dark:text-foreground">
							{pool.description}
						</p>
					</div>
				</div>

				<div className="flex justify-end gap-2 mt-4">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Close
					</Button>
					<Button className="bg-red-600 hover:bg-red-700 dark:bg-primary dark:hover:bg-primary/90">
						Join Pool
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
