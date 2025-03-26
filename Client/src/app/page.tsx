import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import PoolDashboard from "@/components/pool/pool-dashboard";

export default async function Home() {
	const session = await getServerSession(authOptions);

	// If not authenticated, redirect to login
	if (!session) {
		// redirect("/login");
	}

	return <PoolDashboard />;
}
