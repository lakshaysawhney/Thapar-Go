"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PoolDashboard from "@/components/pool/pool-dashboard";

export default function Home() {
	const router = useRouter();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Check if user is authenticated
		const accessToken = localStorage.getItem("access");
		if (!accessToken) {
			router.push("/login");
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

	return isAuthenticated ? <PoolDashboard /> : null;
}
