"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Search } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useDebounce } from "@/hooks/use-debounce"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "react-toastify"

interface Product {
  id: number
  name: string
  sku: string
  price: number
  stockQty: number
  description: string
  isDeleted: boolean
  createdAt: string
}

export default function NewSalePage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [open, setOpen] = useState(false)

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setApiError(null)
        
        const url = new URL('https://localhost:7226/api/Products')
        url.searchParams.append('PageNumber', '1')
        url.searchParams.append('PageSize', '100')
        if (debouncedSearchTerm) {
          url.searchParams.append('Name', debouncedSearchTerm)
        }

        const response = await fetch(url.toString())
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
        setApiError('Failed to load products. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [debouncedSearchTerm])

  useEffect(() => {
    if (selectedProduct) {
      setTotalPrice(selectedProduct.price * quantity)
    } else {
      setTotalPrice(0)
    }
  }, [selectedProduct, quantity])

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value >= 1) {
      setQuantity(value)
      if (errors.quantity) {
        setErrors(prev => ({ ...prev, quantity: '' }))
      }
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!selectedProduct) newErrors.product = "Please select a product"
    if (!quantity || quantity <= 0) newErrors.quantity = "Quantity must be greater than 0"
    if (selectedProduct && quantity > selectedProduct.stockQty) {
      newErrors.quantity = `Cannot sell more than available stock (${selectedProduct.stockQty})`
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    setApiError(null)

    try {
      debugger
      const response = await fetch('https://localhost:7226/api/Sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selectedProduct?.id,
          quantitySold: quantity,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        toast.error("Something went wrong.")
      }
      else{
        toast.success("Sales done successfully!")
      }

      router.push("/sales")
    } catch (err) {
      console.error("Error creating sale:", err)
      toast.error("Something went wrong.")
      setApiError(err instanceof Error ? err.message : 'Failed to create sale')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-xl font-semibold">New Sale</h1>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Create New Sale</CardTitle>
              <CardDescription>Record a new sales transaction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {apiError && (
                <div className="text-destructive text-sm p-2 border rounded-lg bg-destructive/10">
                  {apiError}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="product">
                  Select Product <span className="text-destructive">*</span>
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className={cn(
                        "w-full justify-between",
                        !selectedProduct && "text-muted-foreground",
                        errors.product && "border-destructive"
                      )}
                    >
                      {selectedProduct ? selectedProduct.name : "Select a product..."}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search products..." value={searchTerm} onValueChange={setSearchTerm} />
                      <CommandList>
                        {loading ? (
                          <CommandEmpty>Loading products...</CommandEmpty>
                        ) : (
                          <>
                            <CommandEmpty>No products found.</CommandEmpty>
                            <CommandGroup>
                              {products.map((product) => (
                                <CommandItem
                                  key={product.id}
                                  value={product.name}
                                  onSelect={() => {
                                    setSelectedProduct(product)
                                    setOpen(false)
                                    setErrors(prev => ({ ...prev, product: '' }))
                                  }}
                                >
                                  <div className="flex flex-col">
                                    <span>{product.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      SKU: {product.sku} | Price: ${product.price.toFixed(2)} | Stock: {product.stockQty}
                                    </span>
                                  </div>
                                  {product.stockQty <= 10 && (
                                    <Badge variant="destructive" className="ml-auto">
                                      Low Stock
                                    </Badge>
                                  )}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.product && <p className="text-sm text-destructive">{errors.product}</p>}
              </div>

              {selectedProduct && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">
                      Quantity <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={selectedProduct.stockQty}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className={errors.quantity ? "border-destructive" : ""}
                    />
                    {errors.quantity ? (
                      <p className="text-sm text-destructive">{errors.quantity}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Available stock: {selectedProduct.stockQty}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalPrice">Total Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                      <div className="pl-2">
                      <Input id="totalPrice" value={totalPrice.toFixed(2)} readOnly className="pl-7 bg-muted" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Unit price: ${selectedProduct.price.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || !selectedProduct}>
                {submitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="mr-2 h-4 w-4" /> Complete Sale
                  </span>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  )
}