"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaBox, FaShoppingCart, FaChartLine, FaExclamationTriangle, FaPlus } from "react-icons/fa"

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

const Dashboard = () => {
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
    <div className="container-fluid">
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-6 col-xl-3 mb-4">
          <div className="card h-100 border-start border-primary border-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fs-4 fw-bold">{stats.totalProducts}</div>
                  <div className="text-muted">Total Products</div>
                </div>
                <div className="fs-1 text-primary opacity-25">
                  <FaBox />
                </div>
              </div>
              <div className="small text-muted mt-2">{loading ? "Loading..." : "+2 added this week"}</div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3 mb-4">
          <div className="card h-100 border-start border-success border-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fs-4 fw-bold">{stats.totalSales}</div>
                  <div className="text-muted">Total Sales</div>
                </div>
                <div className="fs-1 text-success opacity-25">
                  <FaShoppingCart />
                </div>
              </div>
              <div className="small text-muted mt-2">{loading ? "Loading..." : "+24 from last month"}</div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3 mb-4">
          <div className="card h-100 border-start border-warning border-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fs-4 fw-bold">${stats.totalRevenue.toLocaleString()}</div>
                  <div className="text-muted">Total Revenue</div>
                </div>
                <div className="fs-1 text-warning opacity-25">
                  <FaChartLine />
                </div>
              </div>
              <div className="small text-muted mt-2">{loading ? "Loading..." : "+12.5% from last month"}</div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3 mb-4">
          <div className="card h-100 border-start border-danger border-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fs-4 fw-bold">{stats.lowStock}</div>
                  <div className="text-muted">Low Stock Items</div>
                </div>
                <div className="fs-1 text-danger opacity-25">
                  <FaExclamationTriangle />
                </div>
              </div>
              <div className="small text-muted mt-2">{loading ? "Loading..." : "Items need restocking"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="d-flex justify-content-end mb-4">
        <Link to="/sales/new" className="btn btn-primary d-flex align-items-center">
          <FaPlus className="me-2" /> New Sale
        </Link>
      </div>

      {/* Charts and Recent Sales */}
      <div className="row">
        <div className="col-lg-8 mb-4">
          <div className="card h-100">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Sales Overview</h5>
              <div className="text-muted">Monthly sales performance</div>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center bg-light rounded"
                  style={{ height: "300px" }}
                >
                  <div className="text-muted d-flex align-items-center">
                    <FaChartLine className="me-2" />
                    <span>Sales chart will appear here</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-4">
          <div className="card h-100">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Recent Sales</h5>
              <div className="text-muted">Latest transactions</div>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="d-flex justify-content-center align-items-center h-100 py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {recentSales.map((sale) => (
                    <div key={sale.id} className="list-group-item">
                      <div className="d-flex justify-content-between">
                        <div>
                          <div className="fw-bold">{sale.product}</div>
                          <div className="small text-muted">
                            {new Date(sale.date).toLocaleDateString()} · Qty: {sale.quantity}
                          </div>
                        </div>
                        <div className="fw-bold">${sale.total.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
