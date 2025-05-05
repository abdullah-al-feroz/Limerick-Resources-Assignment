import type React from "react"
import { Inter } from "next/font/google"
import 'bootstrap/dist/css/bootstrap.min.css'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from "react-toastify"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop />
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
