"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Menu, X, Github, LogOut, User } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { authApi } from "@/lib";
import { siteConfig } from "@/lib/config";

interface NavLink {
	href: string;
	label: string;
	icon?: React.ReactNode;
	onClick?: () => void;
	isExternal?: boolean;
}

export function LandingNavbar() {
	const router = useRouter();
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	const isPoolPage = pathname === "/pools";
	const isAuthPage = pathname === "/login" || pathname === "/signup";

	useEffect(() => {
		setIsAuthenticated(!!localStorage.getItem("access"));
	}, []);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (isPoolPage) return null;

	const { dark, light } = siteConfig.projectLogo;
	const currentTheme = mounted ? resolvedTheme : undefined;
	const logoSrc = currentTheme === "dark" ? dark : light;

	const toggleMenu = () => setIsMenuOpen((prev) => !prev);

	const handleLogout = async () => {
		try {
			await authApi.logout();
			router.push("/login");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	const handleSectionNavigate = (hash: string) => {
		if (isAuthPage) {
			router.push(`/#${hash}`);
		} else {
			const el = document.getElementById(hash);
			if (el) el.scrollIntoView({ behavior: "smooth" });
			else router.push(`/#${hash}`);
		}
	};

	const Logo = () => (
		<Link
			href={isAuthenticated ? "/pools" : "/"}
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

	const navLinks: NavLink[] = [
		{ href: "features", label: "Features" },
		{ href: "about", label: "About" },
		{ href: "faq", label: "FAQ" },
		{
			href: siteConfig.projectSrc,
			label: "GitHub",
			icon: <Github size={16} />,
			isExternal: true,
		},
	];

	return (
		<motion.header
			className="sticky top-0 z-50 backdrop-blur-md border-b border-white/10 dark:border-white/5"
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="container mx-auto flex justify-between items-center p-4 py-0">
				<Logo />

				{/* Desktop Nav */}
				<div className="hidden md:flex items-center gap-4">
					<nav className="flex items-center gap-6 mr-4">
						{navLinks.map((link) =>
							link.isExternal ? (
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
							) : (
								<button
									key={link.label}
									onClick={() => handleSectionNavigate(link.href)}
									className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
								>
									{link.icon}
									{link.label}
								</button>
							),
						)}
					</nav>

					<ThemeToggle />

					{isAuthenticated ? (
						<Button
							variant="ghost"
							className="flex items-center gap-2"
							onClick={handleLogout}
						>
							<LogOut className="h-4 w-4" />
							<span>Log out</span>
						</Button>
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
							{navLinks.map((link) =>
								link.isExternal ? (
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
								) : (
									<button
										key={link.label}
										onClick={() => {
											handleSectionNavigate(link.href);
											toggleMenu();
										}}
										className="p-2 hover:bg-white/10 dark:hover:bg-black/10 rounded-md transition-colors flex items-center gap-2 text-left"
									>
										{link.icon}
										{link.label}
									</button>
								),
							)}

							<div className="border-t border-white/10 dark:border-white/5 my-2 pt-2" />

							{isAuthenticated ? (
								<>
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
