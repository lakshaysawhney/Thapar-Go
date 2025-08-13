import { siteConfig } from "@/lib/config";
import { redirect } from "next/navigation";

export async function GET() {
	redirect(siteConfig.projectSrc);
}
