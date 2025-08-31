import { useState } from "react"
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  Tooltip
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import AuthLayout from "../components/layout/AuthLayout"
import GoogleIcon from "@mui/icons-material/Google"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:8080"}/oauth2/authorization/google`
  }

  return (
    <AuthLayout>
      <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ mt: 1 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Sign In
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Tooltip title="Under maintenance. Will be available soon" arrow>
          <Box>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              disabled
            />
          </Box>
        </Tooltip>

        <Tooltip title="Under maintenance. Will be available soon" arrow>
          <Box>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              disabled
            />
          </Box>
        </Tooltip>

        <Tooltip title="Email/Password login is currently unavailable" arrow>
          <Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled
            >
              Sign In
            </Button>
          </Box>
        </Tooltip>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          sx={{ mb: 2 }}
          onClick={handleGoogleLogin}
        >
          Sign in with Google
        </Button>

        <Box textAlign="center" mt={2}>
          <Link
            component="button"
            variant="body2"
            sx={{
              color: "gray",
              cursor: "not-allowed",
              pointerEvents: "none",
              textDecoration: "none",
            }}
            disabled
          >
            Sign Up (unavailable due to maintenance)
          </Link>
        </Box>
      </Box>
    </AuthLayout>
  )
}

export default Login
