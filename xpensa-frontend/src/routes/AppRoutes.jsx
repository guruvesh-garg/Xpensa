"use client"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { CircularProgress, Box } from "@mui/material"

// Pages
import Login from "../pages/Login"
import Signup from "../pages/Signup"
import ModeSelection from "../pages/ModeSelection"
import FeedData from "../pages/FeedData"
import ViewData from "../pages/ViewData"

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" />
}

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/mode-selection" /> : <Login />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/mode-selection" /> : <Signup />} />
      <Route
        path="/mode-selection"
        element={
          <ProtectedRoute>
            <ModeSelection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feed-data"
        element={
          <ProtectedRoute>
            <FeedData />
          </ProtectedRoute>
        }
      />
      <Route
        path="/view-data"
        element={
          <ProtectedRoute>
            <ViewData />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/mode-selection" />} />
      <Route path="*" element={<Navigate to="/mode-selection" />} />
    </Routes>
  )
}

export default AppRoutes
