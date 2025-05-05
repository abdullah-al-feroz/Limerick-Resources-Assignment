"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { FaArrowLeft, FaPrint } from "react-icons/fa"

// Mock data
const mockSales = [
  {
    id: 1,
    productName: "Wireless Headphones",
    productId: 1,
    quantity: 3,
    unitPrice: 49.99,
    totalPrice: 149.97,
    date: "2023-05-01T10:30:00",
    customer: "Walk-in Customer",
  },
  {
    id: 2,
    productName: "Smart Watch",
    productId: 2,
    quantity: 1,
    unitPrice: 299.99,
    totalPrice: 299.99,
    date: "2023-05-01T14:45:00",
    customer: "John Smith",
  },
  // Add more sales as needed
]

const SaleDetailsPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [sale, setSale] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to get sale details
    const timer = setTimeout(() => {
      const saleData = mockSales.find((s) => s.id === Number.parseInt(id))

      if (saleData) {
        setSale(saleData)
      } else {
        // Sale not found, redirect to sales page
        navigate("/sales")
      }

      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [id, navigate])

  const handlePrint = () => {
    window.print()
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center mb-4">
        <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h1 className="h3 mb-0">Sale Details</h1>
        <button className="btn btn-outline-primary ms-auto btn-icon" onClick={handlePrint}>
          <FaPrint className="me-2" /> Print
        </button>
      </div>

      <div className="card">
        <div className="card-header bg-white">
          <h5 className="card-title mb-0">Sale #{sale.id}</h5>
          <div className="text-muted">Transaction details</div>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-6">
              <h6 className="fw-bold">Transaction Information</h6>
              <table className="table table-borderless table-sm">
                <tbody>
                  <tr>
                    <td className="text-muted" style={{ width: "150px" }}>
                      Sale ID:
                    </td>
                    <td>{sale.id}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Date:</td>
                    <td>{formatDate(sale.date)}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Customer:</td>
                    <td>{sale.customer}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <h6 className="fw-bold">Product Information</h6>
              <table className="table table-borderless table-sm">
                <tbody>
                  <tr>
                    <td className="text-muted" style={{ width: "150px" }}>
                      Product:
                    </td>
                    <td>{sale.productName}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Quantity:</td>
                    <td>{sale.quantity}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Unit Price:</td>
                    <td>${sale.unitPrice.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card bg-light">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Total Amount</h5>
                <h3 className="mb-0">${sale.totalPrice.toFixed(2)}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SaleDetailsPage
