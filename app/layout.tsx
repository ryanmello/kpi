import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import AuthContext from "./context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { MainNav } from "./(site)/components/MainNav";
import { UserNav } from "./(site)/components/UserNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KPI",
  description: "KPI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" storageKey="kpi">
          <AuthContext>
            <Toaster />
            <div className="flex-col md:flex">
              <div className="border-b">
                <div className="flex h-16 items-center px-4">
                  <MainNav className="mx-6" />
                  <div className="ml-auto flex items-center space-x-4">
                    {/* <Search /> */}
                    {/* <UserNav user={user} /> */}
                  </div>
                </div>
              </div>
            </div>

            {children}
          </AuthContext>
        </ThemeProvider>
      </body>
    </html>
  );
}

{
  /* 
  
  Project Notes
  
  Create projects
    - projects should have deliverables
    - deliverables should have tasks
  
  Create KPIs
    - connect the user and the projects
    - provide metrics

    */
}
