"use client";

import type React from "react";

import {
	motion,
	useMotionValue,
	useTransform,
	AnimatePresence,
} from "framer-motion";
import {
	Clock,
	Users,
	Car,
	UserIcon as Female,
	MapPin,
	ArrowRight,
	Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import type { Pool } from "@/types/pool";
import { formatTime, formatDate } from "@/lib/utils/date-utils";
import { formatFarePerHead } from "@/lib/utils/pool-utils";
import { useState } from "react";

interface PoolCardProps {
	pool: Pool;
	onClick: () => void;
}

/**
 * Enhanced pool card component with advanced animations and glassmorphism
 */
export function PoolCard({ pool, onClick }: Readonly<PoolCardProps>) {
	const [isHovered, setIsHovered] = useState(false);
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const rotateX = useTransform(y, [-100, 100], [10, -10]);
	const rotateY = useTransform(x, [-100, 100], [-10, 10]);

	// Handle both naming conventions
	const startPoint = pool.start_point ?? pool.startPoint ?? "";
	const endPoint = pool.end_point ?? pool.endPoint ?? "";
	const departureTime = pool.departure_time ?? pool.departureTime ?? "";
	const arrivalTime = pool.arrival_time ?? pool.arrivalTime ?? "";
	const transportMode = pool.transport_mode ?? pool.transportMode ?? "";
	const totalPersons = pool.total_persons ?? pool.totalPersons ?? 0;
	const currentPersons = pool.current_persons ?? pool.currentPersons ?? 0;
	const isFemaleOnly = pool.is_female_only ?? pool.femaleOnly ?? false;
	const farePerHead =
		pool.fare_per_head ?? (pool.totalFare ? formatFarePerHead(pool) : "0.00");

	// Get creator name
	const creatorName =
		pool.created_by?.full_name ?? pool.createdBy ?? "Unknown";
	const creatorPhone = pool.created_by?.phone_number ?? "";
	const creatorGender = pool.created_by?.gender ?? "";

	// Calculate available seats
	const availableSeats = totalPersons - currentPersons;

	// Handle mouse move for 3D effect
	const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		const rect = event.currentTarget.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;
		const xPct = (mouseX / width - 0.5) * 2;
		const yPct = (mouseY / height - 0.5) * 2;
		x.set(xPct * 50);
		y.set(yPct * 50);
	};

	// Reset motion values on mouse leave
	const handleMouseLeave = () => {
		x.set(0);
		y.set(0);
		setIsHovered(false);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
			className="h-full"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={handleMouseLeave}
			onMouseMove={handleMouseMove}
			style={{
				perspective: 1000,
			}}
		>
			<motion.div
				style={{
					rotateX,
					rotateY,
					transformStyle: "preserve-3d",
				}}
				transition={{ type: "spring", stiffness: 400, damping: 30 }}
			>
				<GlassCard
					variant={isFemaleOnly ? "female" : "default"}
					onClick={onClick}
					className="h-full relative overflow-hidden"
					hoverEffect={false}
				>
					{/* Animated gradient background */}
					<div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
						<motion.div
							className={`w-full h-full bg-gradient-to-br ${
								isFemaleOnly
									? "from-pink-500/30 via-transparent to-pink-300/20"
									: "from-primary/30 via-transparent to-primary/20"
							}`}
							animate={{
								backgroundPosition: ["0% 0%", "100% 100%"],
							}}
							transition={{
								duration: 15,
								ease: "linear",
								repeat: Number.POSITIVE_INFINITY,
								repeatType: "reverse",
							}}
						/>
					</div>

					{/* Animated border effect */}
					<AnimatePresence>
						{isHovered && (
							<motion.div
								className="absolute inset-0 rounded-xl pointer-events-none"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								<motion.div
									className={`absolute inset-0 rounded-xl border-2 ${
										isFemaleOnly
											? "border-pink-500/50"
											: "border-primary/50"
									}`}
									animate={{
										boxShadow: [
											`0 0 0px ${
												isFemaleOnly
													? "rgba(236, 72, 153, 0.3)"
													: "rgba(220, 38, 38, 0.3)"
											}`,
											`0 0 8px ${
												isFemaleOnly
													? "rgba(236, 72, 153, 0.5)"
													: "rgba(220, 38, 38, 0.5)"
											}`,
											`0 0 0px ${
												isFemaleOnly
													? "rgba(236, 72, 153, 0.3)"
													: "rgba(220, 38, 38, 0.3)"
											}`,
										],
									}}
									transition={{
										duration: 2,
										repeat: Number.POSITIVE_INFINITY,
										repeatType: "reverse",
									}}
								/>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Glow effect on hover */}
					<AnimatePresence>
						{isHovered && (
							<motion.div
								className={`absolute inset-0 ${
									isFemaleOnly ? "bg-pink-500/10" : "bg-primary/10"
								}`}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}
							/>
						)}
					</AnimatePresence>

					<div className="p-5 flex flex-col h-full relative z-10">
						{/* Header with route and badge */}
						<div className="flex justify-between items-start mb-4">
							<div className="space-y-1">
								<div className="flex items-center gap-1">
									<MapPin
										size={16}
										className="text-primary"
									/>
									<h3 className="font-semibold text-lg text-primary flex items-center gap-1">
										<span className="truncate max-w-[80px] sm:max-w-[120px]">
											{startPoint}
										</span>
										<motion.div
											animate={{ x: [0, 5, 0] }}
											transition={{
												duration: 1.5,
												repeat: Number.POSITIVE_INFINITY,
												ease: "easeInOut",
											}}
										>
											<ArrowRight
												size={16}
												className="text-primary mx-1"
											/>
										</motion.div>
										<span className="truncate max-w-[80px] sm:max-w-[120px]">
											{endPoint}
										</span>
									</h3>
								</div>
								<p className="text-sm text-foreground/70 dark:text-foreground/60 flex items-center gap-1">
									<span>by</span>
									<span className="font-medium">{creatorName}</span>
									{creatorGender && (
										<Badge
											className={`ml-1 ${
												creatorGender.toLowerCase() === "female"
													? "bg-pink-500/80"
													: "bg-blue-500/80"
											}`}
											variant="outline"
										>
											{creatorGender}
										</Badge>
									)}
								</p>
								{creatorPhone && (
									<p className="text-xs text-foreground/60 flex items-center gap-1">
										<Phone
											size={12}
											className="text-primary"
										/>
										{creatorPhone}
									</p>
								)}
							</div>

							{isFemaleOnly && (
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Badge className="bg-pink-500/80 hover:bg-pink-500/70 dark:bg-pink-500/80 dark:hover:bg-pink-500/70">
										<Female
											size={14}
											className="mr-1"
										/>
										Female Only
									</Badge>
								</motion.div>
							)}
						</div>

						{/* Time information */}
						<div className="flex items-center gap-2 text-sm text-foreground/80 mb-4 bg-foreground/5 p-2 rounded-md">
							<Clock
								size={16}
								className="text-primary flex-shrink-0"
							/>
							<div className="flex flex-col">
								<span className="font-medium">
									{formatDate(departureTime)}
								</span>
								<span className="text-xs">
									{formatTime(departureTime)} -{" "}
									{formatTime(arrivalTime)}
								</span>
							</div>
						</div>

						{/* Stats grid */}
						<div className="grid grid-cols-3 gap-2 mt-auto">
							<motion.div
								className="flex flex-col items-center p-2 rounded-md bg-foreground/5"
								whileHover={{
									y: -5,
									backgroundColor: "rgba(var(--primary), 0.1)",
								}}
								transition={{
									type: "spring",
									stiffness: 300,
									damping: 20,
								}}
							>
								<Users
									size={18}
									className="text-primary mb-1"
								/>
								<span className="text-xs font-medium">
									{currentPersons}/{totalPersons}
								</span>
								<span className="text-[10px] text-foreground/60">
									Seats
								</span>
							</motion.div>

							<motion.div
								className="flex flex-col items-center p-2 rounded-md bg-foreground/5"
								whileHover={{
									y: -5,
									backgroundColor: "rgba(var(--primary), 0.1)",
								}}
								transition={{
									type: "spring",
									stiffness: 300,
									damping: 20,
								}}
							>
								<Car
									size={18}
									className="text-primary mb-1"
								/>
								<span className="text-xs font-medium">
									{transportMode}
								</span>
								<span className="text-[10px] text-foreground/60">
									Vehicle
								</span>
							</motion.div>

							<motion.div
								className="flex flex-col items-center p-2 rounded-md bg-foreground/5"
								whileHover={{
									y: -5,
									backgroundColor: "rgba(var(--primary), 0.1)",
								}}
								transition={{
									type: "spring",
									stiffness: 300,
									damping: 20,
								}}
							>
								<span
									className="text-primary mb-1"
									style={{ fontSize: "18px", fontWeight: "bold" }}
								>
									₹
								</span>
								<span className="text-xs font-medium">
									{farePerHead}
								</span>
								<span className="text-[10px] text-foreground/60">
									Per Person
								</span>
							</motion.div>
						</div>

						{/* Available seats indicator */}
						<motion.div
							className={`mt-4 p-2 rounded-md text-center text-sm font-medium ${
								availableSeats > 0
									? "bg-green-500/10 text-green-600 dark:text-green-400"
									: "bg-red-500/10 text-red-600 dark:text-red-400"
							}`}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							{availableSeats > 0
								? `${availableSeats} ${
										availableSeats === 1 ? "seat" : "seats"
								  } available`
								: "No seats available"}
						</motion.div>
					</div>

					{/* Interactive hover effect */}
					<AnimatePresence>
						{isHovered && (
							<motion.div
								className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
								initial={{ x: "-100%" }}
								animate={{ x: "100%" }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.8, ease: "easeInOut" }}
							/>
						)}
					</AnimatePresence>
				</GlassCard>
			</motion.div>
		</motion.div>
	);
}
