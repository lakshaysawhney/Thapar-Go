import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Mail, MapPin, Calendar } from "lucide-react";

export default function PrivacyPolicy() {
	return (
		<div className="min-h-screen bg-white">
			{/* Main Content */}
			<main className="container mx-auto px-4 py-12 max-w-4xl">
				{/* Hero Section */}
				<div className="text-center mb-12">
					<div className="flex items-center justify-center mb-4">
						<Shield className="h-12 w-12 text-red-600" />
					</div>
					<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
						Privacy <span className="text-red-600">Policy</span>
					</h1>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						Your privacy matters to us. Learn how we collect, use, and
						protect your personal information.
					</p>
				</div>

				{/* Effective Date */}
				<Card className="mb-8 border-red-100">
					<CardContent className="p-6">
						<div className="flex items-center space-x-3">
							<Calendar className="h-5 w-5 text-red-600" />
							<div>
								<p className="font-semibold text-gray-900">
									Effective Date
								</p>
								<p className="text-gray-600">July 21, 2025</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Content Sections */}
				<div className="space-y-12">
					{/* Introduction */}
					<section>
						<h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-red-600 pl-4">
							Introduction
						</h2>
						<div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
							<p>
								Welcome to <strong>thapargo.com</strong>.
								We are committed to protecting your privacy and ensuring
								that your personal information is handled in a safe and
								responsible manner. This Privacy Policy outlines the
								types of information we collect from you, how we use it,
								how we store it, and the steps we take to ensure it is
								protected in compliance with Google OAuth requirements.
							</p>
						</div>
					</section>

					<Separator />

					{/* Information We Collect */}
					<section>
						<h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-red-600 pl-4">
							Information We Collect
						</h2>
						<p className="text-gray-700 mb-6 leading-relaxed">
							When you use our Website and Google OAuth to sign in, we
							collect the following information:
						</p>
						<div className="grid md:grid-cols-3 gap-6">
							<Card className="border-gray-200 hover:border-red-200 transition-colors">
								<CardContent className="p-6">
									<div className="text-red-600 mb-3">
										<div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
											<span className="font-bold">N</span>
										</div>
									</div>
									<h3 className="font-semibold text-gray-900 mb-2">
										Name
									</h3>
									<p className="text-gray-600 text-sm">
										We collect your name as provided by your Google
										account.
									</p>
								</CardContent>
							</Card>
							<Card className="border-gray-200 hover:border-red-200 transition-colors">
								<CardContent className="p-6">
									<div className="text-red-600 mb-3">
										<div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
											<Mail className="h-5 w-5" />
										</div>
									</div>
									<h3 className="font-semibold text-gray-900 mb-2">
										Email Address
									</h3>
									<p className="text-gray-600 text-sm">
										We collect your email address as provided by your
										Google account.
									</p>
								</CardContent>
							</Card>
							<Card className="border-gray-200 hover:border-red-200 transition-colors">
								<CardContent className="p-6">
									<div className="text-red-600 mb-3">
										<div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
											<span className="font-bold">📷</span>
										</div>
									</div>
									<h3 className="font-semibold text-gray-900 mb-2">
										Profile Image
									</h3>
									<p className="text-gray-600 text-sm">
										We collect your profile image as provided by your
										Google account.
									</p>
								</CardContent>
							</Card>
						</div>
					</section>

					<Separator />

					{/* How We Use Your Information */}
					<section>
						<h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-red-600 pl-4">
							How We Use Your Information
						</h2>
						<p className="text-gray-700 mb-6 leading-relaxed">
							The information we collect is used for the following
							purposes:
						</p>
						<div className="space-y-4">
							<div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
								<div className="w-2 h-2 bg-red-600 rounded-full mt-3"></div>
								<div>
									<h3 className="font-semibold text-gray-900 mb-1">
										Authentication
									</h3>
									<p className="text-gray-700">
										To authenticate your identity and provide you with
										access to our services.
									</p>
								</div>
							</div>
							<div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
								<div className="w-2 h-2 bg-red-600 rounded-full mt-3"></div>
								<div>
									<h3 className="font-semibold text-gray-900 mb-1">
										Personalization
									</h3>
									<p className="text-gray-700">
										To personalize your experience on our Website.
									</p>
								</div>
							</div>
							<div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
								<div className="w-2 h-2 bg-red-600 rounded-full mt-3"></div>
								<div>
									<h3 className="font-semibold text-gray-900 mb-1">
										Communication
									</h3>
									<p className="text-gray-700">
										To send you updates, notifications, and other
										information related to our services.
									</p>
								</div>
							</div>
						</div>
					</section>

					<Separator />

					{/* Data Storage and Security */}
					<section>
						<h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-red-600 pl-4">
							Data Storage and Security
						</h2>
						<p className="text-gray-700 mb-6 leading-relaxed">
							We take the security of your personal information seriously
							and implement appropriate technical and organizational
							measures to protect it against unauthorized or unlawful
							processing and against accidental loss, destruction, or
							damage.
						</p>
						<div className="grid md:grid-cols-2 gap-6">
							<Card className="border-gray-200">
								<CardContent className="p-6">
									<h3 className="font-semibold text-gray-900 mb-3 flex items-center">
										<Shield className="h-5 w-5 text-red-600 mr-2" />
										Data Storage
									</h3>
									<p className="text-gray-700 text-sm">
										Your data is stored securely on our servers and is
										only accessible by authorized personnel.
									</p>
								</CardContent>
							</Card>
							<Card className="border-gray-200">
								<CardContent className="p-6">
									<h3 className="font-semibold text-gray-900 mb-3 flex items-center">
										<Shield className="h-5 w-5 text-red-600 mr-2" />
										Encryption
									</h3>
									<p className="text-gray-700 text-sm">
										We use industry-standard encryption to protect
										your data during transmission and storage.
									</p>
								</CardContent>
							</Card>
						</div>
					</section>

					<Separator />

					{/* Sharing Your Information */}
					<section>
						<h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-red-600 pl-4">
							Sharing Your Information
						</h2>
						<p className="text-gray-700 leading-relaxed">
							We do not share your personal information with third-party
							services except as necessary to provide our services or as
							required by law. Your information is shared with Google
							OAuth for authentication purposes.
						</p>
					</section>

					<Separator />

					{/* Your Rights */}
					<section>
						<h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-red-600 pl-4">
							Your Rights
						</h2>
						<p className="text-gray-700 mb-6 leading-relaxed">
							You have the following rights regarding your personal
							information:
						</p>
						<div className="space-y-4">
							<div className="p-4 border border-gray-200 rounded-lg">
								<h3 className="font-semibold text-gray-900 mb-2">
									Access
								</h3>
								<p className="text-gray-700">
									You have the right to access the personal information
									we hold about you.
								</p>
							</div>
							<div className="p-4 border border-gray-200 rounded-lg">
								<h3 className="font-semibold text-gray-900 mb-2">
									Correction
								</h3>
								<p className="text-gray-700">
									You have the right to correct any inaccuracies in
									your personal information.
								</p>
							</div>
							<div className="p-4 border border-gray-200 rounded-lg">
								<h3 className="font-semibold text-gray-900 mb-2">
									Deletion
								</h3>
								<p className="text-gray-700">
									You have the right to request the deletion of your
									personal information, subject to legal and
									contractual restrictions.
								</p>
							</div>
						</div>
						<p className="text-gray-700 mt-6 leading-relaxed">
							To exercise these rights, please contact us at{" "}
							<a
								href="mailto:lsawhney_be23@thapar.edu"
								className="text-red-600 hover:text-red-700 font-medium"
							>
								lsawhney_be23@thapar.edu
							</a>
							.
						</p>
					</section>

					<Separator />

					{/* Changes to This Privacy Policy */}
					<section>
						<h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-red-600 pl-4">
							Changes to This Privacy Policy
						</h2>
						<p className="text-gray-700 leading-relaxed">
							We may update this Privacy Policy from time to time to
							reflect changes in our practices or legal requirements. We
							will notify you of any significant changes by posting the
							new Privacy Policy on our Website and updating the
							effective date at the top of this page.
						</p>
					</section>

					<Separator />

					{/* Contact Us */}
					<section>
						<h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-red-600 pl-4">
							Contact Us
						</h2>
						<p className="text-gray-700 mb-6 leading-relaxed">
							If you have any questions or concerns about this Privacy
							Policy or our data practices, please contact us at:
						</p>
						<div className="grid md:grid-cols-2 gap-6">
							<Card className="border-red-200 bg-red-50">
								<CardContent className="p-6">
									<div className="flex items-center space-x-3 mb-4">
										<Mail className="h-6 w-6 text-red-600" />
										<h3 className="font-semibold text-gray-900">
											Email
										</h3>
									</div>
									<a
										href="mailto:lsawhney_be23@thapar.edu"
										className="text-red-600 hover:text-red-700 font-medium"
									>
										lsawhney_be23@thapar.edu
									</a>
								</CardContent>
							</Card>
							<Card className="border-red-200 bg-red-50">
								<CardContent className="p-6">
									<div className="flex items-center space-x-3 mb-4">
										<MapPin className="h-6 w-6 text-red-600" />
										<h3 className="font-semibold text-gray-900">
											Address
										</h3>
									</div>
									<p className="text-gray-700">TIET Patiala</p>
								</CardContent>
							</Card>
						</div>
					</section>

					<Separator />

					{/* Links
					<section>
						<h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-red-600 pl-4">
							Links
						</h2>
						<p className="text-gray-700 mb-4 leading-relaxed">
							Our Privacy Policy is available at the following locations:
						</p>
						<div className="space-y-2">
							<div className="flex items-center space-x-2">
								<div className="w-2 h-2 bg-red-600 rounded-full"></div>
								<span className="text-gray-700">App Home Page</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="w-2 h-2 bg-red-600 rounded-full"></div>
								<span className="text-gray-700">
									The privacy policy URL linked to the OAuth consent
									screen on the Google Cloud Console matches the
									privacy policy link on our app homepage.
								</span>
							</div>
						</div>
					</section> */}
				</div>

				{/* Footer CTA
				<div className="mt-16 text-center">
					<div className="bg-gray-50 rounded-2xl p-8">
						<h3 className="text-2xl font-bold text-gray-900 mb-4">
							Ready to Get Started?
						</h3>
						<p className="text-gray-600 mb-6 max-w-2xl mx-auto">
							Join ThaparGo today and connect with fellow students for
							convenient and cost-effective transportation.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">
								Get Started
							</Button>
							<Button
								variant="outline"
								className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 bg-transparent"
							>
								Learn More
							</Button>
						</div>
					</div>
				</div> */}
			</main>

		</div>
	);
}
