"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedBackground } from "@/components/ui/animated-background";
import {
	Car,
	Users,
	Clock,
	DollarSign,
	MapPin,
	Menu,
	X,
	ChevronRight,
	Github,
} from "lucide-react";
import thapargoLogo from "@/../public/thapargo.png";

export default function LandingPage() {
	const router = useRouter();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const { scrollYProgress } = useScroll();
	const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

	useEffect(() => {
		// Check if user is authenticated
		const accessToken = localStorage.getItem("access");
		setIsAuthenticated(!!accessToken);
	}, []);

	const handleGetStarted = () => {
		if (isAuthenticated) {
			router.push("/");
		} else {
			router.push("/login");
		}
	};

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

	return (
		<AnimatedBackground
			variant="paths"
			intensity="subtle"
			className="min-h-screen"
		>
			{/* Navbar */}
			<header className="sticky top-0 z-50 backdrop-blur-md border-b border-white/10 dark:border-white/5">
				<div className="container mx-auto flex justify-between items-center p-4">
					<Link
						href="/landing"
						className="flex items-center"
					>
						<Image
							src={thapargoLogo}
							alt="ThaparGo Logo"
							width={40}
							height={40}
							className="h-16 w-auto bg-black/10 dark:bg-white/10 rounded-full p-1"
						/>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-6">
						<nav className="flex items-center gap-6">
							<Link
								href="#features"
								className="text-sm font-medium hover:text-primary transition-colors"
							>
								Features
							</Link>
							<Link
								href="#about"
								className="text-sm font-medium hover:text-primary transition-colors"
							>
								About
							</Link>
							<Link
								href="#faq"
								className="text-sm font-medium hover:text-primary transition-colors"
							>
								FAQ
							</Link>
							<Link
								href="https://github.com/himanishpuri/Thapar-Go"
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
							>
								<Github size={16} />
								GitHub
							</Link>
						</nav>
						<div className="flex items-center gap-2">
							<ThemeToggle />
							{isAuthenticated ? (
								<Button
									variant="default"
									className="bg-primary hover:bg-primary/90"
									onClick={() => router.push("/")}
								>
									Dashboard
								</Button>
							) : (
								<>
									<Button
										variant="ghost"
										onClick={() => router.push("/login")}
										className="bg-gray-50"
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
								</>
							)}
						</div>
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
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
						className="md:hidden backdrop-blur-md border-b border-white/10 dark:border-white/5"
					>
						<div className="container mx-auto p-4 flex flex-col gap-3">
							<Link
								href="#features"
								className="p-2 hover:bg-white/10 dark:hover:bg-black/10 rounded-md transition-colors"
								onClick={toggleMenu}
							>
								Features
							</Link>
							<Link
								href="#about"
								className="p-2 hover:bg-white/10 dark:hover:bg-black/10 rounded-md transition-colors"
								onClick={toggleMenu}
							>
								About
							</Link>
							<Link
								href="#faq"
								className="p-2 hover:bg-white/10 dark:hover:bg-black/10 rounded-md transition-colors"
								onClick={toggleMenu}
							>
								FAQ
							</Link>
							<Link
								href="https://github.com/himanishpuri/Thapar-Go"
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 hover:bg-white/10 dark:hover:bg-black/10 rounded-md transition-colors flex items-center gap-2"
								onClick={toggleMenu}
							>
								<Github size={16} />
								GitHub
							</Link>
							<div className="border-t border-white/10 dark:border-white/5 my-2 pt-2 flex flex-col gap-2">
								{isAuthenticated ? (
									<Button
										variant="default"
										className="bg-primary hover:bg-primary/90 w-full"
										onClick={() => router.push("/")}
									>
										Dashboard
									</Button>
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
						</div>
					</motion.div>
				)}
			</header>

			<main>
				{/* Hero Section */}
				<section className="relative py-20 md:py-32 overflow-hidden">
					<motion.div
						className="absolute inset-0 pointer-events-none"
						style={{ opacity }}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 1 }}
					>
						<div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
						<div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
					</motion.div>

					<div className="container mx-auto px-4 relative z-10">
						<div className="flex flex-col items-center text-center max-w-4xl mx-auto">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
								className="mb-6"
							>
								<span className="px-4 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary inline-block mb-4">
									Thapar University Student Portal
								</span>
								<h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
									Share Your Ride, <br />
									<motion.span
										className="text-primary"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.5, duration: 0.5 }}
									>
										Save Your Money
									</motion.span>
								</h1>
								<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
									Connect with fellow students for convenient and
									cost-effective transportation to and from campus,
									home, or anywhere else.
								</p>
							</motion.div>

							<motion.div
								className="flex flex-col sm:flex-row gap-4 mt-8"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3, duration: 0.5 }}
							>
								<AnimatedButton
									className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg"
									onClick={handleGetStarted}
									glowColor="rgba(255, 0, 0, 0.3)"
								>
									Get Started
								</AnimatedButton>
								<Button
									variant="outline"
									size="lg"
									className="bg-gray-50 px-8 py-6 text-lg border-white/20 dark:border-white/10"
									onClick={() => {
										const aboutSection =
											document.getElementById("about");
										aboutSection?.scrollIntoView({
											behavior: "smooth",
										});
									}}
								>
									Learn More
								</Button>
							</motion.div>

							<motion.div
								className="mt-16 relative w-full max-w-4xl"
								initial={{ opacity: 0, y: 40 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.6, duration: 0.8 }}
							>
								<div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl">
									<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
									<Image
										src="/placeholder.svg?height=720&width=1280"
										alt="Thapar University CarPool Dashboard"
										width={1280}
										height={720}
										className="w-full h-full object-cover"
									/>
									<div className="absolute inset-0 bg-black/40 flex items-center justify-center">
										<Button
											variant="default"
											size="lg"
											className="bg-primary/90 hover:bg-primary rounded-full w-16 h-16 flex items-center justify-center"
										>
											<motion.div
												animate={{
													scale: [1, 1.1, 1],
												}}
												transition={{
													duration: 2,
													repeat: Number.POSITIVE_INFINITY,
												}}
											>
												<ChevronRight size={24} />
											</motion.div>
										</Button>
									</div>
								</div>
							</motion.div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section
					id="features"
					className="py-20 bg-white/5 dark:bg-black/5 backdrop-blur-sm"
				>
					<div className="container mx-auto px-4">
						<div className="text-center mb-16">
							<motion.h2
								className="text-3xl md:text-4xl font-bold mb-4"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5 }}
							>
								Why Choose <span className="text-primary">CarPool</span>
								?
							</motion.h2>
							<motion.p
								className="text-lg text-muted-foreground max-w-2xl mx-auto"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.2 }}
							>
								Our platform makes it easy for Thapar University
								students to coordinate rides and save money on
								transportation.
							</motion.p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							{[
								{
									icon: <Car className="h-10 w-10 text-primary" />,
									title: "Create Pools",
									description:
										"Easily create ride pools for your trips to and from campus, home, or anywhere else.",
								},
								{
									icon: <Users className="h-10 w-10 text-primary" />,
									title: "Find Companions",
									description:
										"Connect with fellow students who are traveling in the same direction.",
								},
								{
									icon: (
										<DollarSign className="h-10 w-10 text-primary" />
									),
									title: "Save Money",
									description:
										"Split transportation costs and save money on your regular commutes.",
								},
								{
									icon: <Clock className="h-10 w-10 text-primary" />,
									title: "Flexible Scheduling",
									description:
										"Find rides that match your schedule or create your own at your convenience.",
								},
							].map((feature, index) => (
								<motion.div
									key={index}
									className="bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-xl p-6 border border-white/20 dark:border-white/10"
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: 0.1 * index }}
									whileHover={{
										y: -5,
										boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.3)",
									}}
								>
									<div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
										{feature.icon}
									</div>
									<h3 className="text-xl font-semibold mb-2">
										{feature.title}
									</h3>
									<p className="text-muted-foreground">
										{feature.description}
									</p>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				{/* About Section */}
				<section
					id="about"
					className="py-20"
				>
					<div className="container mx-auto px-4">
						<div className="flex flex-col lg:flex-row items-center gap-12">
							<motion.div
								className="flex-1"
								initial={{ opacity: 0, x: -50 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
							>
								<h2 className="text-3xl md:text-4xl font-bold mb-6">
									About{" "}
									<span className="text-primary">Thapar CarPool</span>
								</h2>
								<p className="text-lg mb-6 text-muted-foreground">
									Thapar CarPool is a student-led initiative designed
									to solve transportation challenges faced by students
									at Thapar University. Our platform connects students
									who are traveling in the same direction, allowing
									them to share rides and split costs.
								</p>
								<p className="text-lg mb-6 text-muted-foreground">
									Whether you're commuting to campus daily, heading
									home for the weekend, or planning a trip to the city,
									our platform makes it easy to find travel companions
									and save money.
								</p>
								<div className="space-y-4">
									{[
										{
											icon: <MapPin size={20} />,
											text: "Connect with students traveling the same route",
										},
										{
											icon: <Users size={20} />,
											text: "Female-only pools for enhanced safety and comfort",
										},
										{
											icon: <DollarSign size={20} />,
											text: "Transparent fare sharing system",
										},
									].map((item, index) => (
										<div
											key={index}
											className="flex items-center gap-3"
										>
											<div className="text-primary">{item.icon}</div>
											<span>{item.text}</span>
										</div>
									))}
								</div>
							</motion.div>

							<motion.div
								className="flex-1"
								initial={{ opacity: 0, x: 50 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
							>
								<div className="relative rounded-xl overflow-hidden border border-white/20 dark:border-white/10">
									<div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-10" />
									<Image
										src="/placeholder.svg?height=600&width=800"
										alt="Students carpooling"
										width={800}
										height={600}
										className="w-full h-auto"
									/>
								</div>
							</motion.div>
						</div>
					</div>
				</section>

				{/* FAQ Section */}
				<section
					id="faq"
					className="py-20 bg-white/5 dark:bg-black/5 backdrop-blur-sm"
				>
					<div className="container mx-auto px-4">
						<div className="text-center mb-16">
							<motion.h2
								className="text-3xl md:text-4xl font-bold mb-4"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5 }}
							>
								Frequently Asked Questions
							</motion.h2>
							<motion.p
								className="text-lg text-muted-foreground max-w-2xl mx-auto"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.2 }}
							>
								Get answers to common questions about using the Thapar
								CarPool platform.
							</motion.p>
						</div>

						<div className="max-w-3xl mx-auto space-y-6">
							{[
								{
									question: "How do I create a carpool?",
									answer:
										"After signing up, navigate to the dashboard and click on 'Create Pool'. Fill in details like start point, end point, date, time, and number of seats available.",
								},
								{
									question: "Is there a fee to use the platform?",
									answer:
										"No, the platform is completely free for all Thapar University students. You only pay for your share of the transportation costs as agreed with your carpool group.",
								},
								{
									question:
										"How does the female-only pool option work?",
									answer:
										"When creating a pool, you can select the 'Female Only' option. This ensures that only female students can join your pool, providing an additional layer of comfort and safety.",
								},
								{
									question: "Can I cancel my participation in a pool?",
									answer:
										"Yes, you can cancel your participation up to a certain time before the scheduled departure. Please be considerate and cancel as early as possible to allow others to make alternative arrangements.",
								},
							].map((faq, index) => (
								<motion.div
									key={index}
									className="bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-xl p-6 border border-white/20 dark:border-white/10"
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: 0.1 * index }}
								>
									<h3 className="text-xl font-semibold mb-2">
										{faq.question}
									</h3>
									<p className="text-muted-foreground">{faq.answer}</p>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-20">
					<div className="container mx-auto px-4">
						<motion.div
							className="bg-primary/10 backdrop-blur-md rounded-xl p-12 border border-primary/20 text-center"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
						>
							<h2 className="text-3xl md:text-4xl font-bold mb-4">
								Ready to Start Carpooling?
							</h2>
							<p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
								Join the Thapar University CarPool community today and
								start saving on your transportation costs while making
								new connections.
							</p>
							<div className="inline-block">
								<AnimatedButton
									className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg"
									onClick={handleGetStarted}
									glowColor="rgba(255, 0, 0, 0.3)"
								>
									Get Started Now
								</AnimatedButton>
							</div>
						</motion.div>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="bg-white/5 dark:bg-black/5 backdrop-blur-sm border-t border-white/10 dark:border-white/5 py-12">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div className="col-span-1 md:col-span-2">
							<div className="flex items-center gap-2 mb-4">
								<Car className="h-6 w-6 text-primary" />
								<span className="text-2xl font-bold text-primary">
									CarPool
								</span>
							</div>
							<p className="text-muted-foreground mb-4 max-w-md">
								Thapar University's student-led carpooling platform.
								Connect, share rides, and save money on your commutes.
							</p>
							<div className="flex space-x-4">
								{["Twitter", "Facebook", "Instagram", "LinkedIn"].map(
									(social, index) => (
										<Link
											key={index}
											href="#"
											className="text-sm text-muted-foreground hover:text-primary transition-colors"
										>
											{social}
										</Link>
									),
								)}
							</div>
						</div>

						<div>
							<h3 className="font-semibold mb-4">Quick Links</h3>
							<ul className="space-y-2">
								{["Home", "Features", "About", "FAQ", "Contact"].map(
									(link, index) => (
										<li key={index}>
											<Link
												href={`#${link.toLowerCase()}`}
												className="text-muted-foreground hover:text-primary transition-colors"
											>
												{link}
											</Link>
										</li>
									),
								)}
							</ul>
						</div>

						<div>
							<h3 className="font-semibold mb-4">Legal</h3>
							<ul className="space-y-2">
								{[
									"Terms of Service",
									"Privacy Policy",
									"Cookie Policy",
									"GDPR",
								].map((link, index) => (
									<li key={index}>
										<Link
											href="#"
											className="text-muted-foreground hover:text-primary transition-colors"
										>
											{link}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>

					<div className="border-t border-white/10 dark:border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
						<p className="text-sm text-muted-foreground">
							© {new Date().getFullYear()} Thapar University CarPool. All
							rights reserved.
						</p>
						<p className="text-sm text-muted-foreground mt-4 md:mt-0">
							Made with ❤️ by Thapar University Students
						</p>
					</div>
				</div>
			</footer>
		</AnimatedBackground>
	);
}
