"use client";

import { motion } from "framer-motion";
import {
	Clock,
	Users,
	Car,
	DollarSign,
	UserIcon as Female,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Pool } from "@/types/pool";
import { formatTime, formatDate } from "@/lib/utils/date-utils";
import { formatFarePerHead } from "@/lib/utils/pool-utils";

interface PoolCardProps {
	pool: Pool;
	onClick: () => void;
}

/**
 * Pool card component displaying pool information
 */
export function PoolCard({ pool, onClick }: Readonly<PoolCardProps>) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			whileHover={{ scale: 1.02 }}
			onClick={onClick}
			className="h-full"
		>
			<Card
				className={`cursor-pointer overflow-hidden h-full ${
					pool.femaleOnly
						? "bg-pink-50 border-pink-200"
						: "bg-white border-red-100"
				}`}
			>
				<CardContent className="p-0">
					<div className="p-4 flex flex-col h-full">
						<div className="flex justify-between items-start mb-3">
							<div>
								<h3 className="font-semibold text-lg text-red-800">
									{pool.startPoint} → {pool.endPoint}
								</h3>
								<p className="text-sm text-gray-600">
									by {pool.createdBy}
								</p>
							</div>
							{pool.femaleOnly && (
								<Badge className="bg-pink-500">
									<Female
										size={14}
										className="mr-1"
									/>
									Female Only
								</Badge>
							)}
						</div>

						<div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
							<Clock
								size={16}
								className="text-red-500 flex-shrink-0"
							/>
							<span className="truncate">
								{formatDate(pool.departureTime)} •{" "}
								{formatTime(pool.departureTime)} -{" "}
								{formatTime(pool.arrivalTime)}
							</span>
						</div>

						<div className="mt-auto">
							<div className="flex flex-wrap justify-between gap-2 mt-4">
								<div className="flex items-center gap-1">
									<Users
										size={16}
										className="text-red-500"
									/>
									<span className="text-sm">
										{pool.currentPersons}/{pool.totalPersons}
									</span>
								</div>
								<div className="flex items-center gap-1">
									<Car
										size={16}
										className="text-red-500"
									/>
									<span className="text-sm">{pool.transportMode}</span>
								</div>
								<div className="flex items-center gap-1">
									<DollarSign
										size={16}
										className="text-red-500"
									/>
									<span className="text-sm">
										{formatFarePerHead(pool)}/person
									</span>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
