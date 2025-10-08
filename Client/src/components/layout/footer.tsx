"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Github, Shield } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { siteConfig } from "@/lib/config";

export function Footer() {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Only show the correct logo after component has mounted to avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	// Use resolvedTheme which gives the actual theme currently shown to the user
	const { dark, light } = siteConfig.projectLogo;
	const currentTheme = mounted ? resolvedTheme : undefined;
	const logoSrc = currentTheme === "dark" ? dark : light;

	return (
		<footer className="bg-white/5 dark:bg-black/5 backdrop-blur-sm border-t border-white/10 dark:border-white/5 py-6">
			<div className="container mx-auto px-4">
				<div className="flex flex-col md:flex-row justify-between items-center gap-4">
					<div className="flex items-center gap-2">
						{mounted ? (
							<Image
								src={logoSrc}
								alt="ThaparGoLogo"
								width={160}
								height={160}
							/>
						) : (
							// Placeholder with same dimensions to prevent layout shift
							<div className="w-[160px] h-[160px]" />
						)}
					</div>

					<div className="flex flex-col md:flex-row items-center gap-4">
						<p className="text-md text-muted-foreground text-center md:text-right">
							Created by{" "}
							<Link
								href={siteConfig.creators.lakshaySawhney.linkedInUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="font-medium underline hover:no-underline"
							>
								{siteConfig.creators.lakshaySawhney.name}
							</Link>{" "}
							and{" "}
							<Link
								href={siteConfig.creators.himanishPuri.linkedInUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="font-medium underline hover:no-underline"
							>
								{siteConfig.creators.himanishPuri.name}
							</Link>
						</p>

						<div className="flex items-center">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Link
									href={siteConfig.projectSrc}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
								>
									<Github size={16} />
									<span className="text-sm font-medium">GitHub</span>
								</Link>
							</motion.div>
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Link
									href="/privacypolicy"
									className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
								>
									<Shield size={16} />
									<span className="text-sm font-medium">
										Privacy Policy
									</span>
								</Link>
							</motion.div>
						</div>
					</div>
				</div>

				<div className="mt-6 text-center">
					<p className="text-xs text-muted-foreground">
						© {new Date().getFullYear()} ThaparGo. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
