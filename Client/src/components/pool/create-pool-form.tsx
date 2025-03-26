"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
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
	ArrowLeft,
	ArrowRight,
	Check,
	UserIcon as Female,
	AlertCircle,
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

type FormStep = "location" | "time" | "capacity" | "details" | "review";

/**
 * Multi-step create pool form component with animations and improved UX
 */
export function CreatePoolForm({
	onSubmit,
	startPoints,
	endPoints,
	transportModes,
	onCancel,
}: Readonly<CreatePoolFormProps>) {
	// Current step state
	const [currentStep, setCurrentStep] = useState<FormStep>("location");
	const [showErrorAnimation, setShowErrorAnimation] = useState(false);
	const { toast } = useToast();

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
	const startPoint = form.watch("startPoint");
	const endPoint = form.watch("endPoint");
	const transportMode = form.watch("transportMode");
	const description = form.watch("description");
	const femaleOnly = form.watch("femaleOnly");
	const currentPersons = form.watch("currentPersons");

	// Calculate fare per head
	const farePerHead = calculateFormattedFarePerHead(totalFare, totalPersons);

	// Validate arrival time is after departure time
	const isArrivalTimeValid =
		!arrivalTime ||
		!departureTime ||
		new Date(arrivalTime) > new Date(departureTime);

	// Form submission handler
	const handleSubmit = (data: CreatePoolFormValues) => {
		onSubmit(data);
	};

	// Reset error animation after it plays
	useEffect(() => {
		if (showErrorAnimation) {
			const timer = setTimeout(() => {
				setShowErrorAnimation(false);
			}, 500);
			return () => clearTimeout(timer);
		}
	}, [showErrorAnimation]);

	// Step navigation handlers with validation
	const goToNextStep = async () => {
		switch (currentStep) {
			case "location":
				const locationValid = await form.trigger([
					"startPoint",
					"endPoint",
				]);
				if (locationValid) {
					setCurrentStep("time");
				} else {
					setShowErrorAnimation(true);
					toast({
						title: "Missing Information",
						description: "Please select both start and end points",
						variant: "destructive",
					});
				}
				break;
			case "time":
				const timeValid = await form.trigger([
					"departureTime",
					"arrivalTime",
				]);
				if (timeValid && isArrivalTimeValid) {
					setCurrentStep("capacity");
				} else {
					setShowErrorAnimation(true);
					toast({
						title: "Invalid Time Selection",
						description: isArrivalTimeValid
							? "Please select both departure and arrival times"
							: "Arrival time must be after departure time",
						variant: "destructive",
					});
				}
				break;
			case "capacity":
				const capacityValid = await form.trigger([
					"transportMode",
					"totalPersons",
					"currentPersons",
					"totalFare",
				]);
				if (capacityValid) {
					setCurrentStep("details");
				} else {
					setShowErrorAnimation(true);
					toast({
						title: "Missing Information",
						description: "Please complete all capacity and fare details",
						variant: "destructive",
					});
				}
				break;
			case "details":
				const detailsValid = await form.trigger(["description"]);
				if (detailsValid) {
					setCurrentStep("review");
				} else {
					setShowErrorAnimation(true);
					toast({
						title: "Description Required",
						description:
							"Please provide a description of at least 10 characters",
						variant: "destructive",
					});
				}
				break;
			case "review":
				form.handleSubmit(handleSubmit)();
				break;
		}
	};

	const goToPreviousStep = () => {
		switch (currentStep) {
			case "time":
				setCurrentStep("location");
				break;
			case "capacity":
				setCurrentStep("time");
				break;
			case "details":
				setCurrentStep("capacity");
				break;
			case "review":
				setCurrentStep("details");
				break;
		}
	};

	// Progress indicator
	const steps = [
		{ id: "location", label: "Location" },
		{ id: "time", label: "Time" },
		{ id: "capacity", label: "Capacity" },
		{ id: "details", label: "Details" },
		{ id: "review", label: "Review" },
	];

	// Animation variants
	const slideVariants = {
		enter: (direction: number) => ({
			x: direction > 0 ? 500 : -500,
			opacity: 0,
		}),
		center: {
			x: 0,
			opacity: 1,
		},
		exit: (direction: number) => ({
			x: direction < 0 ? 500 : -500,
			opacity: 0,
		}),
	};

	// Error animation variants
	const errorVariants = {
		initial: { x: 0 },
		shake: {
			x: [-10, 10, -10, 10, -5, 5, -2, 2, 0],
			transition: { duration: 0.5 },
		},
	};

	// Direction for animations
	const getDirection = (newStep: FormStep): number => {
		const currentIndex = steps.findIndex((step) => step.id === currentStep);
		const newIndex = steps.findIndex((step) => step.id === newStep);
		return newIndex > currentIndex ? 1 : -1;
	};

	// Custom direction state for animations
	const [direction, setDirection] = useState(1);

	// Update direction when changing steps
	const changeStep = (newStep: FormStep) => {
		setDirection(getDirection(newStep));
		setCurrentStep(newStep);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="space-y-6"
			>
				{/* Progress indicator */}
				<div className="mb-8">
					<div className="flex justify-between items-center mb-2">
						{steps.map((step, index) => (
							<div
								key={step.id}
								className="flex flex-col items-center"
							>
								<motion.div
									className={cn(
										"w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
										currentStep === step.id
											? "bg-primary text-primary-foreground"
											: steps.findIndex(
													(s) => s.id === currentStep,
											  ) > index
											? "bg-primary/80 text-primary-foreground"
											: "bg-muted text-muted-foreground",
									)}
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => {
										// Only allow going back or to completed steps
										const currentIndex = steps.findIndex(
											(s) => s.id === currentStep,
										);
										const targetIndex = index;
										if (
											targetIndex < currentIndex ||
											(form.formState.isValid &&
												targetIndex <=
													steps.findIndex(
														(s) => s.id === "review",
													))
										) {
											changeStep(step.id as FormStep);
										}
									}}
								>
									{steps.findIndex((s) => s.id === currentStep) >
									index ? (
										<Check size={16} />
									) : (
										index + 1
									)}
								</motion.div>
								<span className="text-xs mt-1 hidden sm:block">
									{step.label}
								</span>
							</div>
						))}
					</div>
					<div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
						<motion.div
							className="absolute top-0 left-0 h-full bg-primary"
							initial={{ width: "0%" }}
							animate={{
								width: `${
									(steps.findIndex((step) => step.id === currentStep) /
										(steps.length - 1)) *
									100
								}%`,
							}}
							transition={{ duration: 0.3 }}
						/>
					</div>
				</div>

				{/* Form steps */}
				<motion.div
					variants={errorVariants}
					initial="initial"
					animate={showErrorAnimation ? "shake" : "initial"}
				>
					<AnimatePresence
						mode="wait"
						custom={direction}
					>
						{currentStep === "location" && (
							<motion.div
								key="location"
								custom={direction}
								variants={slideVariants}
								initial="enter"
								animate="center"
								exit="exit"
								transition={{
									type: "spring",
									stiffness: 300,
									damping: 30,
								}}
								className="space-y-4"
							>
								<h2 className="text-xl font-semibold text-primary">
									Where are you going?
								</h2>
								<p className="text-muted-foreground mb-4">
									Select your start and end points
								</p>

								<div className="space-y-4">
									<FormField
										control={form.control}
										name="startPoint"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="flex items-center gap-1">
													<MapPin
														size={16}
														className="text-primary"
													/>
													Start Point
												</FormLabel>
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
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="flex justify-center">
										<motion.div
											animate={{ y: [0, 5, 0] }}
											transition={{
												duration: 1.5,
												repeat: Number.POSITIVE_INFINITY,
											}}
										>
											<ArrowRight
												size={24}
												className="text-primary my-2"
											/>
										</motion.div>
									</div>

									<FormField
										control={form.control}
										name="endPoint"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="flex items-center gap-1">
													<MapPin
														size={16}
														className="text-primary"
													/>
													End Point
												</FormLabel>
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
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</motion.div>
						)}

						{currentStep === "time" && (
							<motion.div
								key="time"
								custom={direction}
								variants={slideVariants}
								initial="enter"
								animate="center"
								exit="exit"
								transition={{
									type: "spring",
									stiffness: 300,
									damping: 30,
								}}
								className="space-y-4"
							>
								<h2 className="text-xl font-semibold text-primary">
									When are you traveling?
								</h2>
								<p className="text-muted-foreground mb-4">
									Set your departure and arrival times
								</p>

								<div className="space-y-4">
									<FormField
										control={form.control}
										name="departureTime"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="flex items-center gap-1">
													<Clock
														size={16}
														className="text-primary"
													/>
													Departure Time
												</FormLabel>
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

									<div className="flex justify-center">
										<motion.div
											animate={{ y: [0, 5, 0] }}
											transition={{
												duration: 1.5,
												repeat: Number.POSITIVE_INFINITY,
											}}
										>
											<ArrowRight
												size={24}
												className="text-primary my-2"
											/>
										</motion.div>
									</div>

									<FormField
										control={form.control}
										name="arrivalTime"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="flex items-center gap-1">
													<Clock
														size={16}
														className="text-primary"
													/>
													Arrival Time
												</FormLabel>
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
														transition={{
															type: "spring",
															stiffness: 300,
															damping: 30,
														}}
													>
														<AlertCircle size={14} />
														Arrival time must be after departure
														time
													</motion.p>
												)}
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</motion.div>
						)}

						{currentStep === "capacity" && (
							<motion.div
								key="capacity"
								custom={direction}
								variants={slideVariants}
								initial="enter"
								animate="center"
								exit="exit"
								transition={{
									type: "spring",
									stiffness: 300,
									damping: 30,
								}}
								className="space-y-4"
							>
								<h2 className="text-xl font-semibold text-primary">
									Capacity & Fare
								</h2>
								<p className="text-muted-foreground mb-4">
									Set your transport mode, capacity, and fare
								</p>

								<div className="space-y-4">
									<FormField
										control={form.control}
										name="transportMode"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="flex items-center gap-1">
													<Car
														size={16}
														className="text-primary"
													/>
													Transport Mode
												</FormLabel>
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

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="totalPersons"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="flex items-center gap-1">
														<Users
															size={16}
															className="text-primary"
														/>
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
														<Users
															size={16}
															className="text-primary"
														/>
														Current Persons
													</FormLabel>
													<FormControl>
														<Input
															type="number"
															min={1}
															max={form.getValues(
																"totalPersons",
															)}
															{...field}
															className={cn(
																"bg-white/20 dark:bg-black/20 border-white/20 dark:border-white/10",
																field.value >
																	form.getValues(
																		"totalPersons",
																	) &&
																	"border-red-500 focus-visible:ring-red-500",
															)}
														/>
													</FormControl>
													{field.value >
														form.getValues("totalPersons") && (
														<motion.p
															className="text-sm font-medium text-red-500 flex items-center gap-1 mt-1"
															initial={{ opacity: 0, y: -10 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{
																type: "spring",
																stiffness: 300,
																damping: 30,
															}}
														>
															<AlertCircle size={14} />
															Cannot exceed total persons
														</motion.p>
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
															className="text-primary"
														/>
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

										<div>
											<Label className="flex items-center gap-1">
												<DollarSign
													size={16}
													className="text-primary"
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
													className="h-10 px-3 py-2 rounded-md border border-white/20 dark:border-white/10 bg-white/20 dark:bg-black/20 text-sm mt-2 flex items-center"
												>
													{farePerHead}
												</motion.div>
											</AnimatePresence>
											<p className="text-sm text-muted-foreground mt-1">
												Calculated automatically
											</p>
										</div>
									</div>
								</div>
							</motion.div>
						)}

						{currentStep === "details" && (
							<motion.div
								key="details"
								custom={direction}
								variants={slideVariants}
								initial="enter"
								animate="center"
								exit="exit"
								transition={{
									type: "spring",
									stiffness: 300,
									damping: 30,
								}}
								className="space-y-4"
							>
								<h2 className="text-xl font-semibold text-primary">
									Additional Details
								</h2>
								<p className="text-muted-foreground mb-4">
									Provide more information about your pool
								</p>

								<div className="space-y-4">
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
													Provide details about your pool to
													attract more participants.
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
													<FormLabel className="text-base">
														Female Only Pool
													</FormLabel>
													<FormDescription>
														Restrict this pool to female
														participants only.
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
							</motion.div>
						)}

						{currentStep === "review" && (
							<motion.div
								key="review"
								custom={direction}
								variants={slideVariants}
								initial="enter"
								animate="center"
								exit="exit"
								transition={{
									type: "spring",
									stiffness: 300,
									damping: 30,
								}}
								className="space-y-4"
							>
								<h2 className="text-xl font-semibold text-primary">
									Review Your Pool
								</h2>
								<p className="text-muted-foreground mb-4">
									Please review your pool details before creating
								</p>

								<div className="space-y-4 bg-white/20 dark:bg-black/20 rounded-lg p-4 border border-white/20 dark:border-white/10">
									<div className="grid grid-cols-2 gap-4">
										<div>
											<h3 className="text-sm font-medium text-muted-foreground">
												Route
											</h3>
											<p className="flex items-center gap-1 mt-1">
												<MapPin
													size={16}
													className="text-primary"
												/>
												{startPoint} → {endPoint}
											</p>
										</div>
										<div>
											<h3 className="text-sm font-medium text-muted-foreground">
												Transport
											</h3>
											<p className="flex items-center gap-1 mt-1">
												<Car
													size={16}
													className="text-primary"
												/>
												{transportMode}
											</p>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div>
											<h3 className="text-sm font-medium text-muted-foreground">
												Departure
											</h3>
											<p className="flex items-center gap-1 mt-1">
												<Clock
													size={16}
													className="text-primary"
												/>
												{departureTime
													? new Date(
															departureTime,
													  ).toLocaleString()
													: "Not set"}
											</p>
										</div>
										<div>
											<h3 className="text-sm font-medium text-muted-foreground">
												Arrival
											</h3>
											<p className="flex items-center gap-1 mt-1">
												<Clock
													size={16}
													className="text-primary"
												/>
												{arrivalTime
													? new Date(arrivalTime).toLocaleString()
													: "Not set"}
											</p>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div>
											<h3 className="text-sm font-medium text-muted-foreground">
												Capacity
											</h3>
											<p className="flex items-center gap-1 mt-1">
												<Users
													size={16}
													className="text-primary"
												/>
												{currentPersons}/{totalPersons} persons
											</p>
										</div>
										<div>
											<h3 className="text-sm font-medium text-muted-foreground">
												Fare
											</h3>
											<p className="flex items-center gap-1 mt-1">
												<DollarSign
													size={16}
													className="text-primary"
												/>
												${totalFare} total ({farePerHead}/person)
											</p>
										</div>
									</div>

									<div>
										<h3 className="text-sm font-medium text-muted-foreground">
											Description
										</h3>
										<p className="mt-1">{description}</p>
									</div>

									{femaleOnly && (
										<div className="bg-pink-50/30 dark:bg-pink-950/30 p-3 rounded-md flex items-center gap-2 mt-2 border border-pink-200/50 dark:border-pink-500/20">
											<Female
												size={18}
												className="text-pink-500"
											/>
											<span className="text-pink-700 dark:text-pink-300 font-medium">
												Female only pool
											</span>
										</div>
									)}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>

				{/* Navigation buttons */}
				<div className="flex justify-between mt-8">
					<Button
						type="button"
						variant="outline"
						onClick={
							currentStep === "location" ? onCancel : goToPreviousStep
						}
						className="border-white/20 dark:border-white/10"
					>
						{currentStep === "location" ? (
							"Cancel"
						) : (
							<div className="flex items-center gap-2">
								<ArrowLeft size={16} />
								Back
							</div>
						)}
					</Button>

					<AnimatedButton
						type={currentStep === "review" ? "submit" : "button"}
						onClick={currentStep === "review" ? undefined : goToNextStep}
						className="bg-primary hover:bg-primary/90"
						glowColor="rgba(255, 0, 0, 0.3)"
					>
						{currentStep === "review" ? (
							"Create Pool"
						) : (
							<div className="flex items-center gap-2">
								Next
								<ArrowRight size={16} />
							</div>
						)}
					</AnimatedButton>
				</div>
			</form>
		</Form>
	);
}
