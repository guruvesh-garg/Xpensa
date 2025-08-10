"use client"
import { Box, Container, Paper, useTheme } from "@mui/material"
import ThemeToggle from "../common/ThemeToggle"

const AuthLayout = ({ children }) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.secondary.light}20)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
        }}
      >
        <ThemeToggle />
      </Box>

      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            backdropFilter: "blur(10px)",
          }}
        >
          {children}
        </Paper>
      </Container>
    </Box>
  )
}

export default AuthLayout
