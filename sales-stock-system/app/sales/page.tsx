"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowUpDown, ChevronLeft, ChevronRight, Eye, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDebounce } from "@/hooks/use-debounce"

type Sale = {
  id: number
  productId: number
  quantitySold: number
  totalPrice: number
  saleDate: string
  product: {
    name: string
  }
}

export default function SalesPage() {
  const router = useRouter()
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://localhost:7226/api/Sales?PageNumber=${currentPage}&PageSize=${itemsPerPage}&Name=${debouncedSearchTerm}`
        )
        const data: Sale[] = await response.json()
        setSales(data)
      } catch (error) {
        console.error("Failed to fetch sales:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSales()
  }, [currentPage, itemsPerPage, debouncedSearchTerm])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="text-xl font-semibold">Sales</h1>
          <Button asChild>
            <a href="/sales/new">
              <Plus className="mr-2 h-4 w-4" />
              New Sale
            </a>
          </Button>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Sales History</CardTitle>
                <CardDescription>View all sales transactions</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <div className="pl-2">
                  <Input
                    placeholder="Search sales..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total Price</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sales.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center h-24">
                            No sales found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        sales.map((sale) => (
                          <TableRow key={sale.id}>
                            <TableCell>{sale.id}</TableCell>
                            <TableCell>{sale.product?.name || "N/A"}</TableCell>
                            <TableCell>{sale.quantitySold}</TableCell>
                            <TableCell>${sale.totalPrice.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{formatDate(sale.saleDate)}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
