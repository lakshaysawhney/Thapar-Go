"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Car, Menu, X, LogOut, User } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { authApi } from "@/lib/index";
import { useToast } from "@/hooks/use-toast";

interface AppHeaderProps {
	readonly onCreatePool: () => void;
}

export function AppHeader({ onCreatePool }: AppHeaderProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

	const handleLogout = async () => {
		try {
			await authApi.logout();
			toast({
				title: "Logged out",
				description: "You have been successfully logged out.",
			});
			router.push("/login");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	// Get user initials for avatar fallback
	const getInitials = () => {
		return "U";
	};

	return (
		<motion.header
			className="sticky top-0 z-50 backdrop-blur-md border-b border-white/10 dark:border-white/5"
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="container mx-auto flex justify-between items-center p-4">
				<Link
					href="/"
					className="flex items-center gap-2"
				>
					<motion.div
						initial={{ rotate: -10 }}
						animate={{ rotate: 10 }}
						transition={{
							repeat: Number.POSITIVE_INFINITY,
							repeatType: "reverse",
							duration: 1.5,
						}}
					>
						<Car className="h-6 w-6 text-primary" />
					</motion.div>
					<motion.span
						className="text-2xl font-bold text-primary"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2, duration: 0.5 }}
					>
						ThaparGo
					</motion.span>
				</Link>

				{/* Desktop Navigation */}
				<div className="hidden md:flex items-center gap-4">
					<ThemeToggle />
					<AnimatedButton
						variant="default"
						className="bg-primary hover:bg-primary/90"
						onClick={onCreatePool}
						glowColor="rgba(255, 0, 0, 0.3)"
					>
						Create Pool
					</AnimatedButton>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="relative h-10 w-10 rounded-full overflow-hidden p-0"
							>
								<motion.div
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.95 }}
								>
									<Avatar className="h-10 w-10 border-2 border-primary/20">
										<AvatarImage
											src={""}
											alt={"User"}
										/>
										<AvatarFallback className="bg-primary/10 text-primary">
											{getInitials()}
										</AvatarFallback>
									</Avatar>
								</motion.div>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-56 mt-1 backdrop-blur-md bg-white/80 dark:bg-black/80 border border-white/20 dark:border-white/10"
							align="end"
						>
							<DropdownMenuItem
								className="flex items-center gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
								onClick={handleLogout}
							>
								<LogOut className="h-4 w-4" />
								<span>Log out</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Mobile Menu Button */}
				<div className="md:hidden flex items-center gap-2">
					<ThemeToggle />
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleMenu}
						className="relative"
					>
						<AnimatePresence mode="wait">
							{isMenuOpen ? (
								<motion.div
									key="close"
									initial={{ opacity: 0, rotate: -90 }}
									animate={{ opacity: 1, rotate: 0 }}
									exit={{ opacity: 0, rotate: 90 }}
									transition={{ duration: 0.2 }}
								>
									<X className="h-6 w-6" />
								</motion.div>
							) : (
								<motion.div
									key="menu"
									initial={{ opacity: 0, rotate: 90 }}
									animate={{ opacity: 1, rotate: 0 }}
									exit={{ opacity: 0, rotate: -90 }}
									transition={{ duration: 0.2 }}
								>
									<Menu className="h-6 w-6" />
								</motion.div>
							)}
						</AnimatePresence>
					</Button>
				</div>
			</div>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
						className="md:hidden backdrop-blur-md border-b border-white/10 dark:border-white/5"
					>
						<div className="container mx-auto p-4 flex flex-col gap-3">
							<AnimatedButton
								variant="default"
								className="bg-primary hover:bg-primary/90 w-full"
								onClick={() => {
									onCreatePool();
									setIsMenuOpen(false);
								}}
								glowColor="rgba(255, 0, 0, 0.3)"
							>
								Create Pool
							</AnimatedButton>

							<GlassCard
								variant="default"
								className="p-2"
							>
								<div className="flex items-center gap-3">
									<Avatar className="h-10 w-10 border-2 border-primary/20">
										<AvatarImage
											src={""}
											alt={"User"}
										/>
										<AvatarFallback className="bg-primary/10 text-primary">
											{getInitials()}
										</AvatarFallback>
									</Avatar>
									<div className="flex flex-col">
										<span className="font-medium">User</span>
										<span className="text-sm text-muted-foreground">
											user@example.com
										</span>
									</div>
								</div>
							</GlassCard>
							<Button
								variant="outline"
								className="flex items-center gap-2 justify-start border-white/20 dark:border-white/10"
							>
								<User className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								className="flex items-center gap-2 justify-start text-destructive border-white/20 dark:border-white/10"
								onClick={handleLogout}
							>
								<LogOut className="h-4 w-4" />
								<span>Log out</span>
							</Button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.header>
	);
}
