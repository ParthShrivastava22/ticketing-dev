import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { buildServerClient } from "@/lib/server-client";
import Header from "@/components/Header"; // Assuming this is where you create it

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ticketing App",
  description: "Microservices Ticketing",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  let currentUser = null;

  try {
    const client = await buildServerClient();
    const response = await client.get("/api/users/currentuser");
    currentUser = response.data.currentUser;
  } catch (err) {
    // If the auth service is down, we just leave currentUser as null
    // so the app doesn't crash for the user.
    console.error("Failed to fetch user in layout");
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Pass the fetched data down as a prop */}
        <Header currentUser={currentUser} />

        {/* Wrap children in a main tag to take up remaining height */}
        <main className="flex-1">{children}</main>

        <Toaster />
      </body>
    </html>
  );
}
