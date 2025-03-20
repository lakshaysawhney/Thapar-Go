"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { Car, LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
	const router = useRouter();
	const { data: session, status } = useSession();
	const searchParams = useSearchParams();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);

	// Check for error in URL
	const error = searchParams.get("error");

	useEffect(() => {
		// If already authenticated, redirect to home
		if (status === "authenticated") {
			router.push("/");
		}

		// Show error toast if there's an error
		if (error) {
			toast({
				title: "Authentication Error",
				description: "There was a problem signing in with Google.",
				variant: "destructive",
			});
		}
	}, [status, router, error, toast]);

	const handleGoogleSignIn = async () => {
		setIsLoading(true);
		try {
			await signIn("google", {
				callbackUrl: "/",
				redirect: true,
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to sign in with Google.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	// If loading session, show loading state
	if (status === "loading") {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-primary/5">
				<div className="animate-pulse text-primary text-center">
					<Car className="h-12 w-12 mx-auto mb-4" />
					<p>Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-primary/5">
			<header className="container flex justify-between items-center p-4">
				<div className="flex items-center gap-2">
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
				</div>
				<ThemeToggle />
			</header>

			<main className="flex-1 flex items-center justify-center p-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="w-full max-w-md"
				>
					<Card className="bg-background/60 backdrop-blur-lg border-primary/10 shadow-lg">
						<CardHeader className="space-y-1 text-center">
							<CardTitle className="text-2xl font-bold">
								Welcome Back
							</CardTitle>
							<CardDescription>
								Sign in to your account to continue
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<Button
								variant="outline"
								className="w-full flex items-center justify-center gap-2 h-12 border-2 border-primary/20 hover:bg-primary/5"
								onClick={handleGoogleSignIn}
								disabled={isLoading}
							>
								{isLoading ? (
									<div className="h-5 w-5 border-2 border-primary/50 border-t-transparent rounded-full animate-spin" />
								) : (
									<>
										<svg
											viewBox="0 0 24 24"
											className="h-5 w-5"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
												fill="#4285F4"
											/>
											<path
												d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
												fill="#34A853"
											/>
											<path
												d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
												fill="#FBBC05"
											/>
											<path
												d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
												fill="#EA4335"
											/>
										</svg>
										Sign in with Google
									</>
								)}
							</Button>
						</CardContent>
						<CardFooter className="flex flex-col items-center justify-center gap-2">
							<p className="text-sm text-muted-foreground">
								Don&apos;t have an account?
							</p>
							<Link
								href="/signup"
								className="flex items-center gap-1 text-sm text-primary hover:underline"
							>
								<LogIn className="h-4 w-4" />
								Sign up now
							</Link>
						</CardFooter>
					</Card>
				</motion.div>
			</main>

			<footer className="py-6 text-center text-sm text-muted-foreground">
				<p>© {new Date().getFullYear()} CarPool. All rights reserved.</p>
			</footer>
		</div>
	);
}
