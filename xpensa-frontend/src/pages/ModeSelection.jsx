"use client"
import { Box, Card, CardContent, Typography, Button, Grid, Container } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { Visibility, Add } from "@mui/icons-material"
import MainLayout from "../components/layout/MainLayout"

const ModeSelection = () => {
  const navigate = useNavigate()

  const modes = [
    {
      title: "View Past Data",
      description: "View and manage your previous expense records",
      icon: <Visibility sx={{ fontSize: 48, mb: 2 }} />,
      path: "/view-data",
      color: "primary",
    },
    {
      title: "Feed New Data",
      description: "Add new expense entries to your records",
      icon: <Add sx={{ fontSize: 48, mb: 2 }} />,
      path: "/feed-data",
      color: "secondary",
    },
  ]

  return (
    <MainLayout title="Expense Tracker - Mode Selection">
      <Container maxWidth="md">
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Choose Your Mode
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Select what you'd like to do with your expense data
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {modes.map((mode, index) => (
            <Grid item xs={12} sm={6} md={5} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    p: 4,
                  }}
                >
                  <Box color={`${mode.color}.main`}>{mode.icon}</Box>

                  <Typography variant="h5" component="h2" gutterBottom>
                    {mode.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" mb={3}>
                    {mode.description}
                  </Typography>

                  <Button
                    variant="contained"
                    color={mode.color}
                    size="large"
                    onClick={() => navigate(mode.path)}
                    sx={{ mt: "auto" }}
                  >
                    Select
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </MainLayout>
  )
}

export default ModeSelection
