"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, Package, ShoppingCart, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Mock data
const mockStats = {
  totalProducts: 124,
  totalSales: 1842,
  totalRevenue: 28465.75,
  lowStock: 8,
}

const mockRecentSales = [
  { id: 1, product: "Wireless Headphones", quantity: 3, total: 149.97, date: "2023-05-01" },
  { id: 2, product: "Smart Watch", quantity: 1, total: 299.99, date: "2023-05-01" },
  { id: 3, product: "Bluetooth Speaker", quantity: 2, total: 129.98, date: "2023-04-30" },
  { id: 4, product: "USB-C Cable", quantity: 5, total: 49.95, date: "2023-04-30" },
  { id: 5, product: "Power Bank", quantity: 2, total: 79.98, date: "2023-04-29" },
]

export default function Dashboard() {
  const [stats, setStats] = useState(mockStats)
  const [recentSales, setRecentSales] = useState(mockRecentSales)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <SidebarTrigger />
          </div>
          <div className="flex items-center justify-between w-full">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className="flex items-center gap-2">
              <Button asChild>
                <Link href="/sales/new">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  New Sale
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">{loading ? "Loading..." : "+2 added this week"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSales}</div>
              <p className="text-xs text-muted-foreground">{loading ? "Loading..." : "+24 from last month"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{loading ? "Loading..." : "+12.5% from last month"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.lowStock}</div>
              <p className="text-xs text-muted-foreground">{loading ? "Loading..." : "Items need restocking"}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Monthly sales performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                <LineChart className="h-8 w-8 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Sales chart will appear here</span>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>Latest transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  recentSales.map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{sale.product}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(sale.date).toLocaleDateString()} · Qty: {sale.quantity}
                        </p>
                      </div>
                      <div className="font-medium">${sale.total.toFixed(2)}</div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function SidebarTrigger() {
  return (
    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
      <span className="sr-only">Toggle sidebar</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <line x1="9" x2="9" y1="3" y2="21" />
      </svg>
    </Button>
  )
}
