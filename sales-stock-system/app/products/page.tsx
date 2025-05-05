"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowUpDown, ChevronLeft, ChevronRight, Edit, Plus, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useDebounce } from "@/hooks/use-debounce"

interface Product {
  id: number
  name: string
  sku: string
  price: number
  stockQty: number
  description: string
  isDeleted: boolean
  createdAt: string
  sales: any
}

interface ApiResponse {
  items: Product[]
  totalCount: number
  pageNumber: number
  pageSize: number
}

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([]) // Initialize as empty array
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product
    direction: "ascending" | "descending" } | null>(null)
  const [error, setError] = useState<string | null>(null)

  console.log("searchTerm", searchTerm)

  const fetchProducts = async (page: number, pageSize: number, productName?: string) => {
    setLoading(true)
    setError(null)
    try {
      let url = `https://localhost:7226/api/Products?PageNumber=${page}&PageSize=${pageSize}&Name=${searchTerm}`

      if (productName && productName.trim() !== "") {
        url += `&productName=${encodeURIComponent(productName.trim())}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // const response = await fetch(url, {
      //   headers: {
      //     "Authorization": `Bearer ${token}`,
      //     "Content-Type": "application/json"
      //   }
      // })

      const data: ApiResponse = await response.json()
      const items = Array.isArray(data) ? data : []
      const total = typeof data?.totalCount === 'number' ? data.totalCount : items.length

      setProducts(items)
      setTotalItems(total)

      if (productName && page !== 1) {
        setCurrentPage(1)
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to load products. Please try again later.')
      setProducts([])
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(currentPage, itemsPerPage, debouncedSearchTerm)
  }, [currentPage])

  useEffect(() => {
    fetchProducts(1, itemsPerPage, debouncedSearchTerm)
  }, [debouncedSearchTerm])

  const handleSort = (key: keyof Product) => {
    let direction: "ascending" | "descending" = "ascending"

    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }

    setSortConfig({ key, direction })

    const sortedProducts = [...products].sort((a, b) => {
      if (a[key] == null) return 1
      if (b[key] == null) return -1
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1
      return 0
    })

    setProducts(sortedProducts)
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handleEdit = (id: number) => {
    router.push(`/products/edit/${id}`)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`https://localhost:7226/api/Products/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      if (products.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      } else {
        fetchProducts(currentPage, itemsPerPage, debouncedSearchTerm)
      }
    } catch (err) {
      console.error('Error deleting product:', err)
      setError('Failed to delete product. Please try again.')
    }
  }

  // Safe check for products array
  const displayProducts = Array.isArray(products) ? products : []

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
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
          </div>
          <div className="flex items-center justify-between w-full">
            <h1 className="text-xl font-semibold">Products</h1>
            <div className="flex items-center gap-2">
              <Button asChild>
                <a href="/products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Manage your product inventory</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <div className="pl-2">
                  <Input
                    placeholder="Search by product name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-12"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                <span className="ml-3">Loading products...</span>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("name")}
                            className="flex items-center gap-1 p-0 font-medium"
                          >
                            Name
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("price")}
                            className="flex items-center gap-1 p-0 font-medium"
                          >
                            Price
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("stockQty")}
                            className="flex items-center gap-1 p-0 font-medium"
                          >
                            Stock
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            {debouncedSearchTerm ? "No products match your search." : "No products available."}
                          </TableCell>
                        </TableRow>
                      ) : (
                        products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.id}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.sku}</TableCell>
                            <TableCell>${product.price.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {product.stockQty}
                                {product.stockQty <= 10 && (
                                  <Badge variant="destructive" className="ml-2">
                                    Low
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
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
                                      <circle cx="12" cy="12" r="1" />
                                      <circle cx="12" cy="5" r="1" />
                                      <circle cx="12" cy="19" r="1" />
                                    </svg>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleEdit(product.id)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => handleDelete(product.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination - only show if we have more than one page */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="text-sm text-muted-foreground">
                      Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                      <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{" "}
                      <span className="font-medium">{totalItems}</span> products
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous Page</span>
                      </Button>

                      {/* Show limited page numbers */}
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        // Show pages around current page
                        let pageNum = i + 1
                        if (totalPages > 5) {
                          if (currentPage <= 3) {
                            pageNum = i + 1
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i
                          } else {
                            pageNum = currentPage - 2 + i
                          }
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className="w-8 h-8"
                          >
                            {pageNum}
                          </Button>
                        )
                      })}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next Page</span>
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