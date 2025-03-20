import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
	],
	pages: {
		signIn: "/login",
		error: "/login",
	},
	callbacks: {
		async jwt({ token, account }) {
			// Persist the OAuth access_token to the token right after signin
			if (account) {
				token.accessToken = account.access_token;
			}
			return token;
		},
		async session({ session, token }) {
			// Send properties to the client, like an access_token from a provider
			session.accessToken = token.accessToken as string;
			return session;
		},
		// Fix the redirect callback to properly handle redirects
		async redirect({ url, baseUrl }) {
			// If the URL is relative, prepend the base URL
			if (url.startsWith("/")) {
				return `${baseUrl}${url}`;
			}
			// If the URL is on the same origin, allow it
			else if (new URL(url).origin === baseUrl) {
				return url;
			}
			// Default to the home page
			return baseUrl;
		},
	},
	// Ensure we're using JWT strategy for sessions
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	// Make sure the secret is properly set
	secret: process.env.NEXTAUTH_SECRET,
	// Add debug mode in development to help troubleshoot
	debug: process.env.NODE_ENV === "development",
};
