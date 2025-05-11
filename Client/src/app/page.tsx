"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PoolDashboard from "@/components/pool/pool-dashboard";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function Home() {
	const router = useRouter();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isCreatePoolOpen, setIsCreatePoolOpen] = useState(false);

	useEffect(() => {
		// Check if user is authenticated
		const accessToken = localStorage.getItem("access");
		if (!accessToken) {
			router.push("/landing");
		} else {
			setIsAuthenticated(true);
		}
		setIsLoading(false);
	}, [router]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
			</div>
		);
	}

	return isAuthenticated ? (
		<div className="flex flex-col min-h-screen">
			<Navbar onCreatePool={() => setIsCreatePoolOpen(true)} />
			<main className="flex-1">
				<PoolDashboard />
			</main>
			<Footer />
		</div>
	) : null;
}
