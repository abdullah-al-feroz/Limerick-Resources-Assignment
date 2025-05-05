"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaPlus, FaSearch, FaSort, FaSortUp, FaSortDown, FaEye } from "react-icons/fa"

// Mock data
const mockSales = [
  {
    id: 1,
    productName: "Wireless Headphones",
    productId: 1,
    quantity: 3,
    totalPrice: 149.97,
    date: "2023-05-01T10:30:00",
  },
  { id: 2, productName: "Smart Watch", productId: 2, quantity: 1, totalPrice: 299.99, date: "2023-05-01T14:45:00" },
  {
    id: 3,
    productName: "Bluetooth Speaker",
    productId: 3,
    quantity: 2,
    totalPrice: 129.98,
    date: "2023-04-30T09:15:00",
  },
  { id: 4, productName: "USB-C Cable", productId: 4, quantity: 5, totalPrice: 49.95, date: "2023-04-30T16:20:00" },
  { id: 5, productName: "Power Bank", productId: 5, quantity: 2, totalPrice: 79.98, date: "2023-04-29T11:10:00" },
]

const SalesPage = () => {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  })

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setSales(mockSales)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Filter sales based on search term
    if (searchTerm) {
      const filteredSales = mockSales.filter((sale) =>
        sale.productName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setSales(filteredSales)
      setCurrentPage(1)
    } else {
      setSales(mockSales)
    }
  }, [searchTerm])

  const handleSort = (key) => {
    let direction = "ascending"

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }

    setSortConfig({ key, direction })

    const sortedSales = [...sales].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1
      }
      return 0
    })

    setSales(sortedSales)
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
  const currentItems = sales.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sales.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Sales</h1>
        <Link to="/sales/new" className="btn btn-primary d-flex align-items-center">
          <FaPlus className="me-2" /> New Sale
        </Link>
      </div>

      <div className="card">
        <div className="card-header bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="card-title mb-0">Sales History</h5>
              <div className="text-muted">View all sales transactions</div>
            </div>
            <div className="position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="Search sales..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="position-absolute top-50 translate-middle-y" style={{ left: "10px" }} />
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
                          onClick={() => handleSort("productName")}
                        >
                          Product {getSortIcon("productName")}
                        </button>
                      </th>
                      <th>
                        <button
                          className="btn btn-link text-dark p-0 text-decoration-none"
                          onClick={() => handleSort("quantity")}
                        >
                          Quantity {getSortIcon("quantity")}
                        </button>
                      </th>
                      <th>
                        <button
                          className="btn btn-link text-dark p-0 text-decoration-none"
                          onClick={() => handleSort("totalPrice")}
                        >
                          Total Price {getSortIcon("totalPrice")}
                        </button>
                      </th>
                      <th>
                        <button
                          className="btn btn-link text-dark p-0 text-decoration-none"
                          onClick={() => handleSort("date")}
                        >
                          Date {getSortIcon("date")}
                        </button>
                      </th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          No sales found.
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((sale) => (
                        <tr key={sale.id}>
                          <td>{sale.id}</td>
                          <td>{sale.productName}</td>
                          <td>{sale.quantity}</td>
                          <td>${sale.totalPrice.toFixed(2)}</td>
                          <td>{formatDate(sale.date)}</td>
                          <td className="text-end">
                            <Link to={`/sales/${sale.id}`} className="btn btn-sm btn-outline-primary">
                              <FaEye className="me-1" /> View
                            </Link>
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
                    <span className="fw-bold">{Math.min(indexOfLastItem, sales.length)}</span> of{" "}
                    <span className="fw-bold">{sales.length}</span> results
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

export default SalesPage
