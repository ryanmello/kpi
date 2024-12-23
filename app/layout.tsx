import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import AuthContext from "./context/AuthContext";
import { Toaster } from "@/components/ui/toaster";

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
            {children}
          </AuthContext>
        </ThemeProvider>
      </body>
    </html>
  );
}

{/* 
  
  Project Notes

  Create position
  Create department

  Update the user
    - add a positionId
    - add a departmentId
    - add a supervisorId
  
  Create projects
    - projects should have deliverables
    - deliverables should have tasks
  
  Create KPIs
    - connect the user and the projects
    - provide metrics

    */}
