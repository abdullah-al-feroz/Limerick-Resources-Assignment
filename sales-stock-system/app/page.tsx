"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page if not authenticated
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
    } else {
      router.push("/products")
    }
  }, [router])

  return null
}
