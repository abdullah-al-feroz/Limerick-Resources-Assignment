"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import Dashboard from "./pages/Dashboard"
import ProductsPage from "./pages/ProductsPage"
import NewProductPage from "./pages/NewProductPage"
import SalesPage from "./pages/SalesPage"
import NewSalePage from "./pages/NewSalePage"
import StockReportPage from "./pages/StockReportPage"
import DateWiseReportPage from "./pages/DateWiseReportPage"
import Layout from "./components/Layout"
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  const login = () => {
    localStorage.setItem("token", "demo-token")
    localStorage.setItem("user", JSON.stringify({ username: "admin", role: "admin" }))
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsAuthenticated(false)
  }

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? <Layout logout={logout}>{children}</Layout> : <Navigate to="/login" />
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage login={login} isAuthenticated={isAuthenticated} />} />
        <Route path="/register" element={<RegisterPage login={login} isAuthenticated={isAuthenticated} />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/new"
          element={
            <ProtectedRoute>
              <NewProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <SalesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/new"
          element={
            <ProtectedRoute>
              <NewSalePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/stock"
          element={
            <ProtectedRoute>
              <StockReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/date-wise"
          element={
            <ProtectedRoute>
              <DateWiseReportPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
