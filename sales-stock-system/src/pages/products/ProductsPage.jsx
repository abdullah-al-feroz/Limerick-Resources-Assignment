"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useDebounce } from "../../hooks/useDebounce"
import { FaPlus, FaSearch, FaSort, FaSortUp, FaSortDown, FaEdit, FaTrashAlt, FaEllipsisV } from "react-icons/fa"

// Mock data
const mockProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    sku: "WH-001",
    price: 49.99,
    stockQty: 25,
    description: "High-quality wireless headphones with noise cancellation",
  },
  {
    id: 2,
    name: "Smart Watch",
    sku: "SW-002",
    price: 299.99,
    stockQty: 15,
    description: "Smart watch with health monitoring features",
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    sku: "BS-003",
    price: 64.99,
    stockQty: 30,
    description: "Portable Bluetooth speaker with 20-hour battery life",
  },
  {
    id: 4,
    name: "USB-C Cable",
    sku: "UC-004",
    price: 9.99,
    stockQty: 100,
    description: "Durable USB-C charging cable",
  },
  {
    id: 5,
    name: "Power Bank",
    sku: "PB-005",
    price: 39.99,
    stockQty: 45,
    description: "10000mAh power bank for mobile devices",
  },
  {
    id: 6,
    name: "Wireless Mouse",
    sku: "WM-006",
    price: 24.99,
    stockQty: 35,
    description: "Ergonomic wireless mouse",
  },
  {
    id: 7,
    name: "Keyboard",
    sku: "KB-007",
    price: 59.99,
    stockQty: 20,
    description: "Mechanical keyboard with RGB lighting",
  },
  {
    id: 8,
    name: "Monitor",
    sku: "MN-008",
    price: 199.99,
    stockQty: 10,
    description: "24-inch Full HD monitor",
  },
  {
    id: 9,
    name: "Laptop Stand",
    sku: "LS-009",
    price: 29.99,
    stockQty: 40,
    description: "Adjustable laptop stand",
  },
  {
    id: 10,
    name: "Webcam",
    sku: "WC-010",
    price: 79.99,
    stockQty: 15,
    description: "1080p webcam with microphone",
  },
  {
    id: 11,
    name: "External SSD",
    sku: "ES-011",
    price: 119.99,
    stockQty: 25,
    description: "500GB external SSD",
  },
  {
    id: 12,
    name: "Graphics Card",
    sku: "GC-012",
    price: 399.99,
    stockQty: 5,
    description: "High-performance graphics card",
  },
]

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  })

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Filter products based on search term
    if (debouncedSearchTerm) {
      const filteredProducts = mockProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
      )
      setProducts(filteredProducts)
      setCurrentPage(1)
    } else {
      setProducts(mockProducts)
    }
  }, [debouncedSearchTerm])

  const handleSort = (key) => {
    let direction = "ascending"

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }

    setSortConfig({ key, direction })

    const sortedProducts = [...products].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1
      }
      return 0
    })

    setProducts(sortedProducts)
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort />
    }

    return sortConfig.direction === "ascending" ? <FaSortUp /> : <FaSortDown />
  }

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(products.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const handleDelete = (id) => {
    // In a real app, this would be an API call
    setProducts(products.filter((product) => product.id !== id))
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Products</h1>
        <Link to="/products/new" className="btn btn-primary btn-icon">
          <FaPlus className="me-2" /> Add Product
        </Link>
      </div>

      <div className="card">
        <div className="card-header bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="card-title mb-0">Product Management</h5>
              <div className="text-muted">Manage your product inventory</div>
            </div>
            <div className="search-input">
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="search-icon" />
            </div>
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th style={{ width: "60px" }}>ID</th>
                      <th>
                        <button
                          className="btn btn-link text-dark p-0 text-decoration-none"
                          onClick={() => handleSort("name")}
                        >
                          Name {getSortIcon("name")}
                        </button>
                      </th>
                      <th>SKU</th>
                      <th>
                        <button
                          className="btn btn-link text-dark p-0 text-decoration-none"
                          onClick={() => handleSort("price")}
                        >
                          Price {getSortIcon("price")}
                        </button>
                      </th>
                      <th>
                        <button
                          className="btn btn-link text-dark p-0 text-decoration-none"
                          onClick={() => handleSort("stockQty")}
                        >
                          Stock {getSortIcon("stockQty")}
                        </button>
                      </th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          No products found.
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((product) => (
                        <tr key={product.id}>
                          <td>{product.id}</td>
                          <td>{product.name}</td>
                          <td>{product.sku}</td>
                          <td>${product.price.toFixed(2)}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              {product.stockQty}
                              {product.stockQty <= 10 && <span className="badge bg-danger ms-2">Low</span>}
                            </div>
                          </td>
                          <td className="text-end">
                            <div className="dropdown">
                              <button
                                className="btn btn-sm btn-light"
                                type="button"
                                id={`dropdown-${product.id}`}
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <FaEllipsisV />
                              </button>
                              <ul
                                className="dropdown-menu dropdown-menu-end"
                                aria-labelledby={`dropdown-${product.id}`}
                              >
                                <li>
                                  <Link to={`/products/edit/${product.id}`} className="dropdown-item">
                                    <FaEdit className="me-2" /> Edit
                                  </Link>
                                </li>
                                <li>
                                  <hr className="dropdown-divider" />
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item text-danger"
                                    onClick={() => handleDelete(product.id)}
                                  >
                                    <FaTrashAlt className="me-2" /> Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div className="text-muted">
                    Showing <span className="fw-bold">{indexOfFirstItem + 1}</span> to{" "}
                    <span className="fw-bold">{Math.min(indexOfLastItem, products.length)}</span> of{" "}
                    <span className="fw-bold">{products.length}</span> results
                  </div>
                  <nav>
                    <ul className="pagination">
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                      </li>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                          <button className="page-link" onClick={() => paginate(i + 1)}>
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
