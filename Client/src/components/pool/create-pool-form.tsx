"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
import { DollarSign, Clock, MapPin, Users, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	createPoolSchema,
	type CreatePoolFormValues,
} from "@/schemas/pool-schema";
import { calculateFormattedFarePerHead } from "@/lib/utils/pool-utils";

interface CreatePoolFormProps {
	onSubmit: (data: CreatePoolFormValues) => void;
	startPoints: string[];
	endPoints: string[];
	transportModes: string[];
	onCancel: () => void;
}

/**
 * Create pool form component with real-time calculations and validation
 */
export function CreatePoolForm({
	onSubmit,
	startPoints,
	endPoints,
	transportModes,
	onCancel,
}: Readonly<CreatePoolFormProps>) {
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
	});

	// Watch values for live calculations
	const totalPersons = form.watch("totalPersons");
	const totalFare = form.watch("totalFare");
	const departureTime = form.watch("departureTime");
	const arrivalTime = form.watch("arrivalTime");

	// Calculate fare per head
	const farePerHead = calculateFormattedFarePerHead(totalFare, totalPersons);

	// Form submission handler
	const handleSubmit = (data: CreatePoolFormValues) => {
		onSubmit(data);
	};

	// Validate arrival time is after departure time
	const isArrivalTimeValid =
		!arrivalTime ||
		!departureTime ||
		new Date(arrivalTime) > new Date(departureTime);

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="space-y-6"
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="startPoint"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center gap-1">
									<MapPin
										size={16}
										className="text-red-500"
									/>
									Start Point
								</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select start point" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
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
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="endPoint"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center gap-1">
									<MapPin
										size={16}
										className="text-red-500"
									/>
									End Point
								</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select end point" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
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
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="departureTime"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center gap-1">
									<Clock
										size={16}
										className="text-red-500"
									/>
									Departure Time
								</FormLabel>
								<FormControl>
									<Input
										type="datetime-local"
										{...field}
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
								<FormLabel className="flex items-center gap-1">
									<Clock
										size={16}
										className="text-red-500"
									/>
									Arrival Time
								</FormLabel>
								<FormControl>
									<Input
										type="datetime-local"
										{...field}
										className={cn(
											!isArrivalTimeValid &&
												"border-red-500 focus-visible:ring-red-500",
										)}
									/>
								</FormControl>
								{!isArrivalTimeValid && (
									<p className="text-sm font-medium text-red-500">
										Arrival time must be after departure time
									</p>
								)}
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<FormField
						control={form.control}
						name="transportMode"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center gap-1">
									<Car
										size={16}
										className="text-red-500"
									/>
									Transport Mode
								</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select mode" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
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

					<FormField
						control={form.control}
						name="totalPersons"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center gap-1">
									<Users
										size={16}
										className="text-red-500"
									/>
									Total Persons
								</FormLabel>
								<FormControl>
									<Input
										type="number"
										min={1}
										max={20}
										{...field}
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
									<Users
										size={16}
										className="text-red-500"
									/>
									Current Persons
								</FormLabel>
								<FormControl>
									<Input
										type="number"
										min={1}
										max={form.getValues("totalPersons")}
										{...field}
										className={cn(
											field.value > form.getValues("totalPersons") &&
												"border-red-500 focus-visible:ring-red-500",
										)}
									/>
								</FormControl>
								{field.value > form.getValues("totalPersons") && (
									<p className="text-sm font-medium text-red-500">
										Cannot exceed total persons
									</p>
								)}
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="totalFare"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center gap-1">
									<DollarSign
										size={16}
										className="text-red-500"
									/>
									Total Fare
								</FormLabel>
								<FormControl>
									<Input
										type="number"
										min={0}
										step={0.01}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div>
						<Label className="flex items-center gap-1">
							<DollarSign
								size={16}
								className="text-red-500"
							/>
							Fare Per Head
						</Label>
						<AnimatePresence mode="wait">
							<motion.div
								key={farePerHead}
								initial={{ opacity: 0.8, y: -5 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 5 }}
								transition={{ duration: 0.2 }}
								className="h-10 px-3 py-2 rounded-md border border-input bg-gray-100 text-sm mt-2 flex items-center"
							>
								{farePerHead}
							</motion.div>
						</AnimatePresence>
						<p className="text-sm text-muted-foreground mt-1">
							Calculated automatically
						</p>
					</div>
				</div>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Describe your pool (e.g., amenities, rules, etc.)"
									className="resize-none min-h-[100px]"
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
						<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
							<div className="space-y-0.5">
								<FormLabel className="text-base">
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

				<div className="flex flex-col sm:flex-row justify-end gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={onCancel}
						className="order-1 sm:order-none"
					>
						Cancel
					</Button>
					<Button
						type="submit"
						className="bg-red-600 hover:bg-red-700"
					>
						Create Pool
					</Button>
				</div>
			</form>
		</Form>
	);
}
