"use client"

import { useEffect, useState } from "react"
import { ArrowUpDown, CalendarIcon, ChevronLeft, ChevronRight, Download, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDebounce } from "@/hooks/use-debounce"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"

export default function DateWiseReportPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof any
    direction: "ascending" | "descending"
  } | null>(null)

  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date | undefined
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!dateRange.from || !dateRange.to) return

      setLoading(true)
      try {
        const params = new URLSearchParams({
          from: dateRange.from.toISOString(),
          to: dateRange.to.toISOString(),
        })

        if (debouncedSearchTerm) {
          params.append("name", debouncedSearchTerm)
        }

        const response = await fetch(`https://localhost:7226/api/Reports/stock-summary?${params.toString()}`)

        if (!response.ok) throw new Error("Failed to fetch stock summary")

        const data = await response.json()

        const mapped = data.map((item: any, index: number) => ({
          id: index + 1,
          name: item.name,
          sku: item.sku ?? "-",
          openingStock: item.openingStock ?? 0,
          soldQty: item.soldQuantity ?? 0,
          closingStock: item.closingStock ?? 0,
        }))

        setProducts(mapped)
      } catch (error) {
        console.error("Fetch error:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dateRange, debouncedSearchTerm])

  const handleSort = (key: keyof any) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig?.key === key && sortConfig.direction === "ascending") direction = "descending"
    setSortConfig({ key, direction })

    const sorted = [...products].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1
      return 0
    })

    setProducts(sorted)
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(products.length / itemsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handleExport = () => alert("Export functionality would be implemented here")

  const handleDateRangeChange = (range: { from: Date; to: Date | undefined }) => {
    setDateRange(range)
    setCurrentPage(1)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="text-xl font-semibold">Date-wise Stock Report</h1>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Date-wise Inventory Report</CardTitle>
                <CardDescription>View stock changes within a specific date range</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal sm:w-[300px]",
                        !dateRange && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={(range) => {
                        if (range?.from && range?.to) {
                          handleDateRangeChange(range)
                        }
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <div className="pl-2">
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
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
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleSort("name")} className="flex items-center gap-1 p-0 font-medium">
                            Product Name
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleSort("openingStock")} className="flex items-center gap-1 p-0 font-medium">
                            Opening Stock
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleSort("soldQty")} className="flex items-center gap-1 p-0 font-medium">
                            Sold Quantity
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleSort("closingStock")} className="flex items-center gap-1 p-0 font-medium">
                            Closing Stock
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No products found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentItems.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.id}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.sku}</TableCell>
                            <TableCell>{product.openingStock}</TableCell>
                            <TableCell>{product.soldQty}</TableCell>
                            <TableCell>{product.closingStock}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="text-sm text-muted-foreground">
                      Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                      <span className="font-medium">{Math.min(indexOfLastItem, products.length)}</span> of{" "}
                      <span className="font-medium">{products.length}</span> results
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <Button
                          key={i + 1}
                          variant={currentPage === i + 1 ? "default" : "outline"}
                          size="sm"
                          onClick={() => paginate(i + 1)}
                          className="w-8 h-8"
                        >
                          {i + 1}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
