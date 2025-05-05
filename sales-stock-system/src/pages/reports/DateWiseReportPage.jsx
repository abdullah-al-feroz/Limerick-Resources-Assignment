"use client"

import { useState, useEffect } from "react"
import { useDebounce } from "../../hooks/useDebounce"
import { FaDownload, FaSearch, FaSort, FaSortUp, FaSortDown, FaCalendarAlt } from "react-icons/fa"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

// Mock data
const mockProducts = [
  { id: 1, name: "Wireless Headphones", sku: "WH-001", openingStock: 30, soldQty: 5, closingStock: 25 },
  { id: 2, name: "Smart Watch", sku: "SW-002", openingStock: 20, soldQty: 5, closingStock: 15 },
  { id: 3, name: "Bluetooth Speaker", sku: "BS-003", openingStock: 35, soldQty: 5, closingStock: 30 },
  { id: 4, name: "USB-C Cable", sku: "UC-004", openingStock: 120, soldQty: 20, closingStock: 100 },
  { id: 5, name: "Power Bank", sku: "PB-005", openingStock: 50, soldQty: 5, closingStock: 45 },
  { id: 6, name: "Wireless Mouse", sku: "WM-006", openingStock: 40, soldQty: 5, closingStock: 35 },
  { id: 7, name: "Keyboard", sku: "KB-007", openingStock: 25, soldQty: 5, closingStock: 20 },
  { id: 8, name: "Monitor", sku: "MN-008", openingStock: 15, soldQty: 5, closingStock: 10 },
  { id: 9, name: "Laptop Stand", sku: "LS-009", openingStock: 45, soldQty: 5, closingStock: 40 },
  { id: 10, name: "Webcam", sku: "WC-010", openingStock: 20, soldQty: 5, closingStock: 15 },
  { id: 11, name: "External SSD", sku: "ES-011", openingStock: 30, soldQty: 5, closingStock: 25 },
  { id: 12, name: "Graphics Card", sku: "GC-012", openingStock: 10, soldQty: 5, closingStock: 5 },
]

const DateWiseReportPage = () => {
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

  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(),
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

  const handleExport = () => {
    // In a real app, this would generate a CSV or PDF
    alert("Export functionality would be implemented here")
  }

  const handleDateChange = (dates) => {
    const [start, end] = dates
    setDateRange({
      startDate: start,
      endDate: end,
    })

    if (start && end) {
      // In a real app, this would trigger an API call with the new date range
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Date-wise Stock Report</h1>
        <button className="btn btn-outline-primary d-flex align-items-center" onClick={handleExport}>
          <FaDownload className="me-2" /> Export
        </button>
      </div>

      <div className="card">
        <div className="card-header bg-white">
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <h5 className="card-title mb-0">Date-wise Inventory Report</h5>
              <div className="text-muted">View stock changes within a specific date range</div>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-7 mb-2 mb-md-0">
                  <div className="input-group date-range-picker">
                    <span className="input-group-text">
                      <FaCalendarAlt />
                    </span>
                    <DatePicker
                      selectsRange={true}
                      startDate={dateRange.startDate}
                      endDate={dateRange.endDate}
                      onChange={handleDateChange}
                      className="form-control"
                      placeholderText="Select date range"
                      dateFormat="MMM dd, yyyy"
                    />
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="position-absolute top-50 translate-middle-y" style={{ left: "10px" }} />
                  </div>
                </div>
              </div>
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
                          Product Name {getSortIcon("name")}
                        </button>
                      </th>
                      <th>SKU</th>
                      <th>
                        <button
                          className="btn btn-link text-dark p-0 text-decoration-none"
                          onClick={() => handleSort("openingStock")}
                        >
                          Opening Stock {getSortIcon("openingStock")}
                        </button>
                      </th>
                      <th>
                        <button
                          className="btn btn-link text-dark p-0 text-decoration-none"
                          onClick={() => handleSort("soldQty")}
                        >
                          Sold Quantity {getSortIcon("soldQty")}
                        </button>
                      </th>
                      <th>
                        <button
                          className="btn btn-link text-dark p-0 text-decoration-none"
                          onClick={() => handleSort("closingStock")}
                        >
                          Closing Stock {getSortIcon("closingStock")}
                        </button>
                      </th>
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
                          <td>{product.openingStock}</td>
                          <td>{product.soldQty}</td>
                          <td>{product.closingStock}</td>
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

export default DateWiseReportPage
