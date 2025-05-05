"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { FaArrowLeft, FaSave } from "react-icons/fa"
import { toast } from "react-toastify"

const EditProductPage = () => {
  const params = useParams()
  const router = useRouter()
  const id = params?.id

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    stockQty: "",
    description: "",
  })

  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://localhost:7226/api/Products/${id}`)
        if (!res.ok) throw new Error("Failed to fetch product")

        const data = await res.json()
        setFormData({
          name: data.name || "",
          sku: data.sku || "",
          price: data.price?.toString() || "",
          stockQty: data.stockQty?.toString() || "",
          description: data.description || "",
        })
      } catch (err) {
        toast.error("Something went wrong.")
      } finally {
        setInitialLoading(false)
      }
    }

    if (id) fetchProduct()
  }, [id])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev: any) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: any = {}

    if (!formData.name.trim()) newErrors.name = "Product name is required"

    if (!formData.price.trim()) {
      newErrors.price = "Price is required"
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number"
    }

    if (!formData.stockQty.trim()) {
      newErrors.stockQty = "Stock quantity is required"
    } else if (isNaN(parseInt(formData.stockQty)) || parseInt(formData.stockQty) < 0) {
      newErrors.stockQty = "Stock quantity must be a non-negative number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const res = await fetch(`https://localhost:7226/api/Products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          sku: formData.sku,
          price: parseFloat(formData.price),
          stockQty: parseInt(formData.stockQty),
          description: formData.description,
        }),
      })

      if (res.ok) {
        toast.success("Product update successfully!")
      }

      router.push("/products")
    } catch (err) {
      console.error("Update error:", err)
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) return <div className="text-center text-white mt-5">Loading product...</div>

  return (
    <div className="container mt-5 text-white">
      <div className="mb-4 d-flex align-items-center">
        <button className="btn btn-outline-light me-2" onClick={() => router.back()}>
          <FaArrowLeft className="me-1" />
        </button>
        <h2 className="mb-0">Update Product</h2>
      </div>

      <div className="bg-dark p-4 rounded shadow-sm border border-secondary">
        <h4 className="mb-2">Product Information</h4>
        <p className="text-secondary mb-4">Enter the details of the update product</p>

        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Product Name <span className="text-danger">*</span></label>
              <input
                type="text"
                className={`form-control bg-dark text-white border-secondary ${errors.name ? "is-invalid" : ""}`}
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label">SKU Code</label>
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Enter SKU code (optional)"
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Price <span className="text-danger">*</span></label>
              <div className="input-group">
                <span className="input-group-text bg-secondary text-white border-secondary">$</span>
                <input
                  type="number"
                  step="0.01"
                  className={`form-control bg-dark text-white border-secondary ${errors.price ? "is-invalid" : ""}`}
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                />
                {errors.price && <div className="invalid-feedback d-block">{errors.price}</div>}
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label">Stock Quantity <span className="text-danger">*</span></label>
              <input
                type="number"
                className={`form-control bg-dark text-white border-secondary ${errors.stockQty ? "is-invalid" : ""}`}
                name="stockQty"
                value={formData.stockQty}
                onChange={handleChange}
                placeholder="Enter initial stock quantity"
              />
              {errors.stockQty && <div className="invalid-feedback">{errors.stockQty}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control bg-dark text-white border-secondary"
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description (optional)"
            />
          </div>

          <div className="d-flex justify-content-between mt-4">
            <button type="button" className="btn btn-outline-light" onClick={() => router.back()}>
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
                  <FaSave className="me-2" /> Update Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProductPage
