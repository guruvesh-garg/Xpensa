"use client"
import { Box, AppBar, Toolbar, Typography, Button, Container, useTheme } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import ThemeToggle from "../common/ThemeToggle"

const MainLayout = ({ children, title = "Expense Tracker" }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          <Typography variant="body2" sx={{ mr: 2 }}>
            Welcome, {user?.name || user?.email}
          </Typography>

          <ThemeToggle />

          <Button color="inherit" onClick={handleLogout} sx={{ ml: 1 }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
        {children}
      </Container>
    </Box>
  )
}

export default MainLayout
