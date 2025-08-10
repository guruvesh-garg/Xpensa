"use client"
import { IconButton, Tooltip } from "@mui/material"
import { Brightness4, Brightness7 } from "@mui/icons-material"
import { useTheme } from "../../context/ThemeContext"

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <Tooltip title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}>
      <IconButton onClick={toggleTheme} color="inherit">
        {isDarkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  )
}

export default ThemeToggle
