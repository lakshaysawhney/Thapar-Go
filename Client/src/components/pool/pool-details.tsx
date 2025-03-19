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
			<DialogContent className="sm:max-w-[500px] bg-white">
				<DialogHeader>
					<DialogTitle className="text-xl text-red-800">
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
							<h4 className="text-sm font-medium text-gray-500">
								Start Point
							</h4>
							<p className="flex items-center gap-1 mt-1">
								<MapPin
									size={16}
									className="text-red-500"
								/>
								{pool.startPoint}
							</p>
						</div>
						<div>
							<h4 className="text-sm font-medium text-gray-500">
								End Point
							</h4>
							<p className="flex items-center gap-1 mt-1">
								<MapPin
									size={16}
									className="text-red-500"
								/>
								{pool.endPoint}
							</p>
						</div>
					</div>

					<Separator />

					<div className="grid grid-cols-2 gap-4">
						<div>
							<h4 className="text-sm font-medium text-gray-500">
								Departure
							</h4>
							<p className="flex items-center gap-1 mt-1">
								<Clock
									size={16}
									className="text-red-500"
								/>
								{formatTime(pool.departureTime)}
							</p>
							<p className="text-xs text-gray-500 mt-1">
								{formatDate(pool.departureTime)}
							</p>
						</div>
						<div>
							<h4 className="text-sm font-medium text-gray-500">
								Arrival
							</h4>
							<p className="flex items-center gap-1 mt-1">
								<Clock
									size={16}
									className="text-red-500"
								/>
								{formatTime(pool.arrivalTime)}
							</p>
							<p className="text-xs text-gray-500 mt-1">
								{formatDate(pool.arrivalTime)}
							</p>
						</div>
					</div>

					<Separator />

					<div className="grid grid-cols-2 gap-4">
						<div>
							<h4 className="text-sm font-medium text-gray-500">
								Transport Mode
							</h4>
							<p className="flex items-center gap-1 mt-1">
								<Car
									size={16}
									className="text-red-500"
								/>
								{pool.transportMode}
							</p>
						</div>
						<div>
							<h4 className="text-sm font-medium text-gray-500">
								Persons
							</h4>
							<p className="flex items-center gap-1 mt-1">
								<Users
									size={16}
									className="text-red-500"
								/>
								{pool.currentPersons}/{pool.totalPersons}
							</p>
						</div>
					</div>

					<Separator />

					<div className="grid grid-cols-2 gap-4">
						<div>
							<h4 className="text-sm font-medium text-gray-500">
								Total Fare
							</h4>
							<p className="flex items-center gap-1 mt-1">
								<DollarSign
									size={16}
									className="text-red-500"
								/>
								${pool.totalFare}
							</p>
						</div>
						<div>
							<h4 className="text-sm font-medium text-gray-500">
								Fare per Person
							</h4>
							<p className="flex items-center gap-1 mt-1">
								<DollarSign
									size={16}
									className="text-red-500"
								/>
								{formatFarePerHead(pool)}
							</p>
						</div>
					</div>

					{pool.femaleOnly && (
						<div className="bg-pink-50 p-3 rounded-md flex items-center gap-2 mt-2">
							<Female
								size={18}
								className="text-pink-500"
							/>
							<span className="text-pink-700 font-medium">
								Female only pool
							</span>
						</div>
					)}

					<div>
						<h4 className="text-sm font-medium text-gray-500">
							Description
						</h4>
						<p className="mt-1 text-gray-700">{pool.description}</p>
					</div>
				</div>

				<div className="flex justify-end gap-2 mt-4">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Close
					</Button>
					<Button className="bg-red-600 hover:bg-red-700">
						Join Pool
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
