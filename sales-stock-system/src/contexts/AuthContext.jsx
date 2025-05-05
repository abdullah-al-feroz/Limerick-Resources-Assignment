"use client"

import { createContext, useState, useContext, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    if (token && user) {
      setCurrentUser(JSON.parse(user))
    }

    setLoading(false)
  }, [])

  const login = (username, password) => {
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        if (username === "admin" && password === "password") {
          const user = { username: "admin", role: "admin" }
          localStorage.setItem("token", "demo-token")
          localStorage.setItem("user", JSON.stringify(user))
          setCurrentUser(user)
          resolve(user)
        } else {
          reject(new Error("Invalid username or password"))
        }
      }, 1000)
    })
  }

  const register = (userData) => {
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        const user = { username: userData.username, role: "user" }
        localStorage.setItem("token", "demo-token")
        localStorage.setItem("user", JSON.stringify(user))
        setCurrentUser(user)
        resolve(user)
      }, 1000)
    })
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setCurrentUser(null)
  }

  const value = {
    currentUser,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
