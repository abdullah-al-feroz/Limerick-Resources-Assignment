"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaArrowLeft, FaSave } from "react-icons/fa"

const NewProductPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    stockQty: "",
    description: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required"
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required"
    } else if (isNaN(Number.parseFloat(formData.price)) || Number.parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number"
    }

    if (!formData.stockQty.trim()) {
      newErrors.stockQty = "Stock quantity is required"
    } else if (isNaN(Number.parseInt(formData.stockQty)) || Number.parseInt(formData.stockQty) < 0) {
      newErrors.stockQty = "Stock quantity must be a non-negative number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful submission
      setTimeout(() => {
        navigate("/products")
      }, 1000)
    } catch (err) {
      console.error("Error creating product:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center mb-4">
        <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h1 className="h3 mb-0">Add New Product</h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="card-header bg-white">
            <h5 className="card-title mb-0">Product Information</h5>
            <div className="text-muted">Enter the details of the new product</div>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="name" className="form-label">
                  Product Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  id="name"
                  name="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="sku" className="form-label">
                  SKU Code
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="sku"
                  name="sku"
                  placeholder="Enter SKU code (optional)"
                  value={formData.sku}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="price" className="form-label">
                  Price <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`form-control ${errors.price ? "is-invalid" : ""}`}
                    id="price"
                    name="price"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                  />
                  {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                </div>
              </div>
              <div className="col-md-6">
                <label htmlFor="stockQty" className="form-label">
                  Stock Quantity <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  className={`form-control ${errors.stockQty ? "is-invalid" : ""}`}
                  id="stockQty"
                  name="stockQty"
                  placeholder="Enter initial stock quantity"
                  value={formData.stockQty}
                  onChange={handleChange}
                />
                {errors.stockQty && <div className="invalid-feedback">{errors.stockQty}</div>}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="4"
                placeholder="Enter product description (optional)"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <div className="card-footer bg-white d-flex justify-content-between">
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary d-flex align-items-center" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="me-2" /> Save Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewProductPage
