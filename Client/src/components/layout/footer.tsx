"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { useTheme } from "next-themes";
import thapargoLogo from "@/../public/thapargo_black.png";
import thapargoLogoDark from "@/../public/thapargo_white.png";

export function Footer() {
	const { theme } = useTheme();

	return (
		<footer className="bg-white/5 dark:bg-black/5 backdrop-blur-sm border-t border-white/10 dark:border-white/5 py-6">
			<div className="container mx-auto px-4">
				<div className="flex flex-col md:flex-row justify-between items-center gap-4">
					<div className="flex items-center gap-2">
						<div className="relative h-8 w-8 overflow-hidden">
							{theme === "dark" ? (
								<Image
									src={thapargoLogoDark || "/placeholder.svg"}
									alt="ThaparGo Logo"
									width={32}
									height={32}
									className="object-contain"
								/>
							) : (
								<Image
									src={thapargoLogo || "/placeholder.svg"}
									alt="ThaparGo Logo"
									width={32}
									height={32}
									className="object-contain"
								/>
							)}
						</div>
						<span className="text-lg font-bold text-primary">
							CarPool
						</span>
					</div>

					<div className="flex flex-col md:flex-row items-center gap-4">
						<p className="text-sm text-muted-foreground text-center md:text-right">
							Created by{" "}
							<span className="font-medium">Himanish Puri</span> and{" "}
							<span className="font-medium">Lakshay Sawhney</span>
						</p>

						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<Link
								href="https://github.com/himanishpuri/Thapar-Go"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
							>
								<Github size={16} />
								<span className="text-sm font-medium">GitHub</span>
							</Link>
						</motion.div>
					</div>
				</div>

				<div className="mt-6 text-center">
					<p className="text-xs text-muted-foreground">
						© {new Date().getFullYear()} Thapar University CarPool. All
						rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
