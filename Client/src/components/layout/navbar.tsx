"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Menu, X, Github, LogOut, User, Home, PlusCircle } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";

import thapargo from "@/../public/thapargo.png";
import thapargodark from "@/../public/thapargo_white.png";

interface NavbarProps {
	onCreatePool?: () => void;
}

// Define the type for navigation links
interface NavLink {
	href: string;
	label: string;
	icon?: React.ReactNode;
	onClick?: () => void;
	isExternal?: boolean;
}

export function Navbar({ onCreatePool }: NavbarProps) {
	const router = useRouter();
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Determine if we're on the landing page
	const isLandingPage = pathname === "/landing";

	useEffect(() => {
		// Check if user is authenticated
		const accessToken = localStorage.getItem("access");
		setIsAuthenticated(!!accessToken);
	}, []);

	useEffect(() => {
		setMounted(true);
	}, []);

	const currentTheme = mounted ? resolvedTheme : undefined;
	const logoSrc = currentTheme === "dark" ? thapargodark : thapargo;

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

	const handleLogout = async () => {
		try {
			// Clear local storage
			localStorage.removeItem("access");
			localStorage.removeItem("refresh");

			// Redirect to login page
			router.push("/login");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	// Get user initials for avatar fallback
	const getInitials = () => {
		return "U";
	};

	// Logo component with theme awareness and improved visibility
	const Logo = () => {
		return (
			<Link
				href={isAuthenticated ? "/" : "/landing"}
				className="flex items-center justify-center"
			>
				<Image
					src={logoSrc}
					alt="ThaparGoLogo"
					width={110}
					height={110}
				/>
			</Link>
		);
	};

	// Landing page navigation links
	const landingPageLinks: NavLink[] = [
		{ href: "#features", label: "Features" },
		{ href: "#about", label: "About" },
		{ href: "#faq", label: "FAQ" },
		{
			href: "https://github.com/himanishpuri/Thapar-Go",
			label: "GitHub",
			icon: <Github size={16} />,
			isExternal: true,
		},
	];

	// App navigation links (when authenticated)
	const appLinks: NavLink[] = [
		{ href: "/", label: "Dashboard", icon: <Home size={16} /> },
	];

	// Determine which links to show based on current page and auth status
	const navLinks = isLandingPage ? landingPageLinks : appLinks;

	return (
		<motion.header
			className="sticky top-0 z-50 backdrop-blur-md border-b border-white/10 dark:border-white/5"
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="container mx-auto flex justify-between items-center p-4 py-0">
				<Logo />

				{/* Desktop Navigation */}
				<div className="hidden md:flex items-center gap-4">
					<nav className="flex items-center gap-6 mr-4">
						{navLinks.map((link, index) => {
							if (link.isExternal) {
								return (
									<Link
										key={link.label}
										href={link.href}
										target="_blank"
										rel="noopener noreferrer"
										className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
									>
										{link.icon}
										{link.label}
									</Link>
								);
							} else if (link.onClick) {
								return (
									<Button
										key={link.label}
										variant="ghost"
										onClick={link.onClick}
										className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
									>
										{link.icon}
										{link.label}
									</Button>
								);
							} else {
								return (
									<Link
										key={link.label}
										href={link.href}
										className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
									>
										{link.icon}
										{link.label}
									</Link>
								);
							}
						})}
					</nav>

					<ThemeToggle />

					{isAuthenticated ? (
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
								<DropdownMenuLabel>My Account</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem className="flex items-center gap-2 focus:bg-primary/10">
									<User className="h-4 w-4" />
									<span>Profile</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									className="flex items-center gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
									onClick={handleLogout}
								>
									<LogOut className="h-4 w-4" />
									<span>Log out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								onClick={() => router.push("/login")}
								className="bg-white/10 dark:bg-black/10"
							>
								Login
							</Button>
							<Button
								variant="default"
								className="bg-primary hover:bg-primary/90"
								onClick={() => router.push("/signup")}
							>
								Sign Up
							</Button>
						</div>
					)}
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
							{navLinks.map((link, index) => {
								if (link.isExternal) {
									return (
										<Link
											key={link.label}
											href={link.href}
											target="_blank"
											rel="noopener noreferrer"
											className="p-2 hover:bg-white/10 dark:hover:bg-black/10 rounded-md transition-colors flex items-center gap-2"
											onClick={toggleMenu}
										>
											{link.icon}
											{link.label}
										</Link>
									);
								} else if (link.onClick) {
									return (
										<Button
											key={link.label}
											variant="ghost"
											onClick={() => {
												link.onClick?.();
												toggleMenu();
											}}
											className="justify-start p-2 hover:bg-white/10 dark:hover:bg-black/10 rounded-md transition-colors flex items-center gap-2"
										>
											{link.icon}
											{link.label}
										</Button>
									);
								} else {
									return (
										<Link
											key={link.label}
											href={link.href}
											className="p-2 hover:bg-white/10 dark:hover:bg-black/10 rounded-md transition-colors flex items-center gap-2"
											onClick={toggleMenu}
										>
											{link.icon}
											{link.label}
										</Link>
									);
								}
							})}

							{isAuthenticated ? (
								<>
									<div className="border-t border-white/10 dark:border-white/5 my-2 pt-2"></div>
									<Button
										variant="outline"
										className="flex items-center gap-2 justify-start border-white/20 dark:border-white/10"
									>
										<User className="h-4 w-4" />
										<span>Profile</span>
									</Button>
									<Button
										variant="outline"
										className="flex items-center gap-2 justify-start text-destructive border-white/20 dark:border-white/10"
										onClick={handleLogout}
									>
										<LogOut className="h-4 w-4" />
										<span>Log out</span>
									</Button>
								</>
							) : (
								<>
									<div className="border-t border-white/10 dark:border-white/5 my-2 pt-2"></div>
									<Button
										variant="outline"
										className="w-full"
										onClick={() => router.push("/login")}
									>
										Login
									</Button>
									<Button
										variant="default"
										className="bg-primary hover:bg-primary/90 w-full"
										onClick={() => router.push("/signup")}
									>
										Sign Up
									</Button>
								</>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.header>
	);
}
