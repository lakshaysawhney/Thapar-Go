"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Car, Menu, X, LogOut, User } from "lucide-react";

interface AppHeaderProps {
	readonly onCreatePool: () => void;
}

export function AppHeader({ onCreatePool }: AppHeaderProps) {
	const { data: session } = useSession();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

	// Get user initials for avatar fallback
	const getInitials = () => {
		if (!session?.user?.name) return "U";
		return session.user.name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase();
	};

	return (
		<header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
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
					<span className="text-2xl font-bold text-primary">CarPool</span>
				</Link>

				{/* Desktop Navigation */}
				<div className="hidden md:flex items-center gap-4">
					<ThemeToggle />
					<Button
						variant="default"
						className="bg-primary hover:bg-primary/90"
						onClick={onCreatePool}
					>
						Create Pool
					</Button>

					{session?.user && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative h-10 w-10 rounded-full"
								>
									<Avatar className="h-10 w-10 border-2 border-primary/20">
										<AvatarImage
											src={session.user.image ?? ""}
											alt={session.user.name ?? "User"}
										/>
										<AvatarFallback className="bg-primary/10 text-primary">
											{getInitials()}
										</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-56"
								align="end"
							>
								<DropdownMenuLabel>My Account</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem className="flex items-center gap-2">
									<User className="h-4 w-4" />
									<span>Profile</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									className="flex items-center gap-2 text-destructive focus:text-destructive"
									onClick={() =>
										signOut({ callbackUrl: "/login" })
									}
								>
									<LogOut className="h-4 w-4" />
									<span>Log out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>

				{/* Mobile Menu Button */}
				<div className="md:hidden flex items-center gap-2">
					<ThemeToggle />
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleMenu}
					>
						{isMenuOpen ? (
							<X className="h-6 w-6" />
						) : (
							<Menu className="h-6 w-6" />
						)}
					</Button>
				</div>
			</div>

			{/* Mobile Menu */}
			{isMenuOpen && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					className="md:hidden bg-background/95 backdrop-blur-sm border-b border-border"
				>
					<div className="container mx-auto p-4 flex flex-col gap-4">
						<Button
							variant="default"
							className="bg-primary hover:bg-primary/90 w-full"
							onClick={() => {
								onCreatePool();
								setIsMenuOpen(false);
							}}
						>
							Create Pool
						</Button>

						{session?.user && (
							<>
								<div className="flex items-center gap-3 p-2">
									<Avatar className="h-10 w-10 border-2 border-primary/20">
										<AvatarImage
											src={session.user.image ?? ""}
											alt={session.user.name ?? "User"}
										/>
										<AvatarFallback className="bg-primary/10 text-primary">
											{getInitials()}
										</AvatarFallback>
									</Avatar>
									<div className="flex flex-col">
										<span className="font-medium">
											{session.user.name}
										</span>
										<span className="text-sm text-muted-foreground">
											{session.user.email}
										</span>
									</div>
								</div>
								<Button
									variant="outline"
									className="flex items-center gap-2 justify-start"
								>
									<User className="h-4 w-4" />
									<span>Profile</span>
								</Button>
								<Button
									variant="outline"
									className="flex items-center gap-2 justify-start text-destructive"
									onClick={() =>
										signOut({ callbackUrl: "/login" })
									}
								>
									<LogOut className="h-4 w-4" />
									<span>Log out</span>
								</Button>
							</>
						)}
					</div>
				</motion.div>
			)}
		</header>
	);
}
