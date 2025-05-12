"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AnimatedButton } from "@/components/ui/animated-button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	DollarSign,
	Clock,
	MapPin,
	Users,
	Car,
	AlertCircle,
	UserIcon as Female,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createPoolSchema, type CreatePoolFormValues } from "@/schemas/schema";
import { calculateFormattedFarePerHead } from "@/lib/utils/pool-utils";
import { useToast } from "@/hooks/use-toast";

interface CreatePoolFormProps {
	onSubmit: (data: CreatePoolFormValues) => void;
	startPoints: string[];
	endPoints: string[];
	transportModes: string[];
	onCancel: () => void;
}

/**
 * Simplified create pool form component with improved UX
 */
export function CreatePoolForm({
	onSubmit,
	startPoints,
	endPoints,
	transportModes,
	onCancel,
}: Readonly<CreatePoolFormProps>) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();
	const [useCustomLocations, setUseCustomLocations] = useState(false);

	// Initialize the form
	const form = useForm<CreatePoolFormValues>({
		resolver: zodResolver(createPoolSchema),
		defaultValues: {
			startPoint: "",
			endPoint: "",
			departureTime: "",
			arrivalTime: "",
			transportMode: "",
			totalPersons: 1,
			currentPersons: 1,
			totalFare: 0,
			description: "",
			femaleOnly: false,
		},
		mode: "onChange",
	});

	// Watch values for live calculations and validation
	const totalPersons = form.watch("totalPersons");
	const totalFare = form.watch("totalFare");
	const departureTime = form.watch("departureTime");
	const arrivalTime = form.watch("arrivalTime");

	// Calculate fare per head
	const farePerHead = calculateFormattedFarePerHead(totalFare, totalPersons);

	// Validate arrival time is after departure time
	const isArrivalTimeValid =
		!arrivalTime ||
		!departureTime ||
		new Date(arrivalTime) > new Date(departureTime);

	// Form submission handler
	const handleSubmit = async (data: CreatePoolFormValues) => {
		try {
			setIsSubmitting(true);
			await onSubmit(data);

			form.reset();

			toast({
				title: "Success",
				description: "Pool created successfully!",
			});
		} catch (error) {
			console.error("Error creating pool:", error);
			// Error is already handled in the API service
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="space-y-6"
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Location Section */}
					<div className="space-y-4 md:col-span-2">
						<h3 className="text-lg font-medium text-primary flex items-center gap-2">
							<MapPin size={18} />
							Location
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="startPoint"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Start Point</FormLabel>
										{!useCustomLocations ? (
											<>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="bg-white/20 dark:bg-black/20 border-white/20 dark:border-white/10">
															<SelectValue placeholder="Select start point" />
														</SelectTrigger>
													</FormControl>
													<SelectContent className="bg-background/80 backdrop-blur-lg border-white/20 dark:border-white/10">
														{startPoints.map((point) => (
															<SelectItem
																key={point}
																value={point}
															>
																{point}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</>
										) : (
											<FormControl>
												<Input
													placeholder="Enter start point"
													{...field}
													className="bg-white/20 dark:bg-black/20 border-white/20 dark:border-white/10"
												/>
											</FormControl>
										)}
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="endPoint"
								render={({ field }) => (
									<FormItem>
										<FormLabel>End Point</FormLabel>
										{!useCustomLocations ? (
											<>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="bg-white/20 dark:bg-black/20 border-white/20 dark:border-white/10">
															<SelectValue placeholder="Select end point" />
														</SelectTrigger>
													</FormControl>
													<SelectContent className="bg-background/80 backdrop-blur-lg border-white/20 dark:border-white/10">
														{endPoints.map((point) => (
															<SelectItem
																key={point}
																value={point}
															>
																{point}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</>
										) : (
											<FormControl>
												<Input
													placeholder="Enter end point"
													{...field}
													className="bg-white/20 dark:bg-black/20 border-white/20 dark:border-white/10"
												/>
											</FormControl>
										)}
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex items-center justify-end mt-2">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() =>
									setUseCustomLocations(!useCustomLocations)
								}
								className="text-xs border-white/20 dark:border-white/10"
							>
								{useCustomLocations
									? "Use dropdown locations"
									: "Enter custom locations"}
							</Button>
						</div>
					</div>

					{/* Time Section */}
					<div className="space-y-4 md:col-span-2">
						<h3 className="text-lg font-medium text-primary flex items-center gap-2">
							<Clock size={18} />
							Schedule
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="departureTime"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Departure Time</FormLabel>
										<FormControl>
											<Input
												type="datetime-local"
												{...field}
												className="bg-white/20 dark:bg-black/20 border-white/20 dark:border-white/10"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="arrivalTime"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Arrival Time</FormLabel>
										<FormControl>
											<Input
												type="datetime-local"
												{...field}
												className={cn(
													"bg-white/20 dark:bg-black/20 border-white/20 dark:border-white/10",
													!isArrivalTimeValid &&
														"border-red-500 focus-visible:ring-red-500",
												)}
											/>
										</FormControl>
										{!isArrivalTimeValid && (
											<motion.p
												className="text-sm font-medium text-red-500 flex items-center gap-1 mt-1"
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
											>
												<AlertCircle size={14} />
												Arrival time must be after departure time
											</motion.p>
										)}
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>

					{/* Transport & Capacity Section */}
					<div className="space-y-4 md:col-span-2">
						<h3 className="text-lg font-medium text-primary flex items-center gap-2">
							<Car size={18} />
							Transport & Capacity
						</h3>

						<FormField
							control={form.control}
							name="transportMode"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Transport Mode</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger className="bg-white/20 dark:bg-black/20 border-white/20 dark:border-white/10">
												<SelectValue placeholder="Select mode" />
											</SelectTrigger>
										</FormControl>
										<SelectContent className="bg-background/80 backdrop-blur-lg border-white/20 dark:border-white/10">
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
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<FormField
								control={form.control}
								name="totalPersons"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-1">
											<Users size={16} />
											Total Persons
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												min={1}
												max={20}
												{...field}
												className="bg-white/20 dark:bg-black/20 border-white/20 dark:border-white/10"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="currentPersons"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-1">
											<Users size={16} />
											Current Persons
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												min={1}
												max={form.getValues("totalPersons")}
												{...field}
												className={cn(
													"bg-white/20 dark:bg-black/20 border-white/20 dark:border-white/10",
													field.value >
														form.getValues("totalPersons") &&
														"border-red-500 focus-visible:ring-red-500",
												)}
											/>
										</FormControl>
										{field.value > form.getValues("totalPersons") && (
											<motion.p
												className="text-sm font-medium text-red-500 flex items-center gap-1 mt-1"
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
											>
												<AlertCircle size={14} />
												Cannot exceed total persons
											</motion.p>
										)}
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="totalFare"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-1">
											<DollarSign size={16} />
											Total Fare
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												min={0}
												step={0.01}
												{...field}
												className="bg-white/20 dark:bg-black/20 border-white/20 dark:border-white/10"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="bg-white/10 dark:bg-black/10 p-3 rounded-md border border-white/10 dark:border-white/5">
							<div className="flex justify-between items-center">
								<Label className="flex items-center gap-1">
									<DollarSign
										size={16}
										className="text-primary"
									/>
									Fare Per Head
								</Label>
								<motion.div
									key={farePerHead}
									initial={{ opacity: 0.8, y: -5 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 5 }}
									transition={{ duration: 0.2 }}
									className="text-lg font-medium text-primary"
								>
									{farePerHead}
								</motion.div>
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								Calculated automatically based on total fare and persons
							</p>
						</div>
					</div>

					{/* Details Section */}
					<div className="space-y-4 md:col-span-2">
						<h3 className="text-lg font-medium text-primary">
							Additional Details
						</h3>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Describe your pool (e.g., amenities, rules, etc.)"
											className="resize-none min-h-[100px] bg-white/20 dark:bg-black/20 border-white/20 dark:border-white/10"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Provide details about your pool to attract more
										participants.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="femaleOnly"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/20 dark:border-white/10 p-4 bg-white/20 dark:bg-black/20">
									<div className="space-y-0.5">
										<FormLabel className="text-base flex items-center gap-2">
											<Female
												size={16}
												className="text-pink-500"
											/>
											Female Only Pool
										</FormLabel>
										<FormDescription>
											Restrict this pool to female participants only.
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
				</div>

				{/* Form Actions */}
				<div className="flex justify-end gap-2 mt-8">
					<Button
						type="button"
						variant="outline"
						onClick={onCancel}
						className="border-white/20 dark:border-white/10"
						disabled={isSubmitting}
					>
						Cancel
					</Button>
					<AnimatedButton
						type="submit"
						className="bg-primary hover:bg-primary/90"
						glowColor="rgba(255, 0, 0, 0.3)"
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<div className="h-5 w-5 border-2 border-primary-foreground/50 border-t-transparent rounded-full animate-spin" />
						) : (
							"Create Pool"
						)}
					</AnimatedButton>
				</div>
			</form>
		</Form>
	);
}
