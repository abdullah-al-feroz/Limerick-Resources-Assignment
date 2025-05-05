"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useDebounce } from "../../hooks/useDebounce"
import { FaArrowLeft, FaSave, FaSearch } from "react-icons/fa"

// Mock data
const mockProducts = [
  { id: 1, name: "Wireless Headphones", sku: "WH-001", price: 49.99, stockQty: 25 },
  { id: 2, name: "Smart Watch", sku: "SW-002", price: 299.99, stockQty: 15 },
  { id: 3, name: "Bluetooth Speaker", sku: "BS-003", price: 64.99, stockQty: 30 },
  { id: 4, name: "USB-C Cable", sku: "UC-004", price: 9.99, stockQty: 100 },
  { id: 5, name: "Power Bank", sku: "PB-005", price: 39.99, stockQty: 45 },
  { id: 6, name: "Wireless Mouse", sku: "WM-006", price: 24.99, stockQty: 35 },
  { id: 7, name: "Keyboard", sku: "KB-007", price: 59.99, stockQty: 20 },
  { id: 8, name: "Monitor", sku: "MN-008", price: 199.99, stockQty: 10 },
  { id: 9, name: "Laptop Stand", sku: "LS-009", price: 29.99, stockQty: 40 },
  { id: 10, name: "Webcam", sku: "WC-010", price: 79.99, stockQty: 15 },
]

const NewSalePage = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [totalPrice, setTotalPrice] = useState(0)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setProducts(mockProducts)
      setFilteredProducts(mockProducts)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Filter products based on search term
    if (debouncedSearchTerm) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [debouncedSearchTerm, products])

  useEffect(() => {
    // Calculate total price when product or quantity changes
    if (selectedProduct) {
      setTotalPrice(selectedProduct.price * quantity)
    } else {
      setTotalPrice(0)
    }
  }, [selectedProduct, quantity])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleProductSelect = (product) => {
    setSelectedProduct(product)
    setSearchTerm(product.name)
    setShowDropdown(false)

    // Clear error when product is selected
    if (errors.product) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.product
        return newErrors
      })
    }
  }

  const handleQuantityChange = (e) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value >= 1) {
      setQuantity(value)

      // Clear error when quantity is changed
      if (errors.quantity) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.quantity
          return newErrors
        })
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!selectedProduct) {
      newErrors.product = "Please select a product"
    }

    if (!quantity || quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0"
    }

    if (selectedProduct && quantity > selectedProduct.stockQty) {
      newErrors.quantity = `Cannot sell more than available stock (${selectedProduct.stockQty})`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful submission
      setTimeout(() => {
        navigate("/sales")
      }, 1000)
    } catch (err) {
      console.error("Error creating sale:", err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center mb-4">
        <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h1 className="h3 mb-0">New Sale</h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="card-header bg-white">
            <h5 className="card-title mb-0">Create New Sale</h5>
            <div className="text-muted">Record a new sales transaction</div>
          </div>
          <div className="card-body">
            <div className="mb-4">
              <label htmlFor="product" className="form-label">
                Select Product <span className="text-danger">*</span>
              </label>
              <div className="position-relative" ref={dropdownRef}>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaSearch />
                  </span>
                  <input
                    type="text"
                    className={`form-control ${errors.product ? "is-invalid" : ""}`}
                    id="product"
                    placeholder="Search for a product..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setShowDropdown(true)
                      if (!e.target.value) {
                        setSelectedProduct(null)
                      }
                    }}
                    onFocus={() => setShowDropdown(true)}
                  />
                </div>
                {errors.product && <div className="invalid-feedback d-block">{errors.product}</div>}

                {showDropdown && (
                  <div className="autocomplete-dropdown">
                    {loading ? (
                      <div className="p-3 text-center">
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <div className="p-3 text-center text-muted">No products found</div>
                    ) : (
                      filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="autocomplete-item"
                          onClick={() => handleProductSelect(product)}
                        >
                          <div className="fw-bold">{product.name}</div>
                          <div className="small text-muted">
                            SKU: {product.sku} | Price: ${product.price.toFixed(2)} | Stock: {product.stockQty}
                            {product.stockQty <= 10 && <span className="badge bg-danger ms-2">Low Stock</span>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {selectedProduct && (
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="quantity" className="form-label">
                    Quantity <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
                    id="quantity"
                    min="1"
                    max={selectedProduct.stockQty}
                    value={quantity}
                    onChange={handleQuantityChange}
                  />
                  {errors.quantity ? (
                    <div className="invalid-feedback">{errors.quantity}</div>
                  ) : (
                    <div className="form-text">Available stock: {selectedProduct.stockQty}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="totalPrice" className="form-label">
                    Total Price
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="text"
                      className="form-control bg-light"
                      id="totalPrice"
                      value={totalPrice.toFixed(2)}
                      readOnly
                    />
                  </div>
                  <div className="form-text">Unit price: ${selectedProduct.price.toFixed(2)}</div>
                </div>
              </div>
            )}
          </div>
          <div className="card-footer bg-white d-flex justify-content-between">
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-icon" disabled={submitting || !selectedProduct}>
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : (
                <>
                  <FaSave className="me-2" /> Complete Sale
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewSalePage
