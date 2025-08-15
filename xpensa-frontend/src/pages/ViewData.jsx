import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
} from "@mui/material";
import { Edit, Delete, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

const API_BASE_URL = "https://xpensaprod.onrender.com/expensa";

const ViewData = () => {
  const navigate = useNavigate();

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [filteredMonth, setFilteredMonth] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [editDialog, setEditDialog] = useState({ open: false, expense: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getTypeColor = (type) => {
    const colors = {
      Extra: "error",
      "Veg & Rashan": "success",
      "Flat Fixed": "primary",
      "Flat Setup": "secondary",
      "Bike Expense": "warning",
      "Home Expense": "info",
    };
    return colors[type] || "default";
  };

  const handleSubmit = async () => {
    if (!month || !year) {
      setExpenses([]);
      setFilteredMonth("");
      setError("Please select both month and year.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/getAllExpense/${month}/${year}`);
      if (!response.ok ) throw new Error("Failed to fetch expenses");
      if(response.status===204) throw new Error ("No content available for this given month.")
      else{
        const data = await response.json();
        setExpenses(data);
        setFilteredMonth(`${year}-${month}`);
      } 
    } catch (err) {
      setError(err.message || "Something went wrong");
      setExpenses([]);
      setFilteredMonth("");
    }
    setLoading(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/removeExpense/${deleteDialog.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete expense");

      setExpenses((prev) => prev.filter((exp) => exp.entryID !== deleteDialog.id));
      setDeleteDialog({ open: false, id: null });
    } catch (err) {
      console.error(err);
      alert("Failed to delete expense");
    }
  };

  const handleEditSave = async () => {
    try {
      const updatedExpense = editDialog.expense;
      const response = await fetch(`${API_BASE_URL}/updateExpense/${updatedExpense.entryID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: updatedExpense.amount,
          subType: updatedExpense.subType,
        }),
      });
      if (!response.ok) throw new Error("Failed to update expense");

      setExpenses((prev) =>
        prev.map((exp) => (exp.entryID === updatedExpense.entryID ? updatedExpense : exp))
      );
      setEditDialog({ open: false, expense: null });
    } catch (err) {
      console.error(err);
      alert("Failed to update expense");
    }
  };

  const handleEdit = (expense) => {
    setEditDialog({ open: true, expense: { ...expense } });
  };

  const handleDelete = (id) => {
    setDeleteDialog({ open: true, id });
  };

  // Utility function to calculate totals by type
const getTotalsByType = () => {
  const totals = {};
  for (const exp of expenses) {
    if (!totals[exp.type]) totals[exp.type] = 0;
    totals[exp.type] += exp.amount;
  }
  return totals;
};

const typeTotals = getTotalsByType();
const grandTotal = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
  <MainLayout title="View Past Data">
    <Box>
      {/* === Floating Left Summary (Type-wise) === */}
      <Box
        sx={{
          position: "fixed",
          top: 100,
          left: 20,
          width: 240,
          maxHeight: "75vh",
          overflowY: "auto",
          zIndex: 1100,
          display: { xs: "none", md: "block" },
        }}
      >
        <Paper elevation={4} sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Type-wise Summary
          </Typography>
          {Object.entries(typeTotals).map(([type, total]) => (
            <Box
              key={type}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Chip
                label={type}
                color={getTypeColor(type)}
                size="small"
                sx={{ fontSize: "0.75rem", mr: 1 }}
              />
              <Typography variant="body2" fontWeight="bold">
                ₹{total}
              </Typography>
            </Box>
          ))}
        </Paper>
      </Box>

      {/* === Floating Right Summary (Overview) === */}
      <Box
        sx={{
          position: "fixed",
          top: 100,
          right: 20,
          width: 240,
          zIndex: 1100,
          display: { xs: "none", md: "block" },
        }}
      >
        <Paper elevation={4} sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Overview
          </Typography>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Total Entries:</Typography>
            <Typography variant="body2" fontWeight="bold">
              {expenses.length}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2">Grand Total:</Typography>
            <Typography variant="body2" fontWeight="bold">
              ₹{grandTotal}
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* === Header === */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate("/mode-selection")} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5">View Past Expenses</Typography>
      </Box>

      {/* === Filter Form === */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Month</InputLabel>
              <Select value={month} label="Month" onChange={(e) => setMonth(e.target.value)}>
                {[
                  "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December",
                ].map((m, i) => (
                  <MenuItem key={m} value={String(i + 1).padStart(2, "0")}>
                    {m}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              sx={{ width: 120 }}
              inputProps={{ min: "1900", max: "2100", step: "1" }}
            />

            <Button variant="contained" onClick={handleSubmit} disabled={loading}>
              {loading ? "Loading..." : "Submit"}
            </Button>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* === Expense Table === */}
      {filteredMonth && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Expenses for {filteredMonth}
            </Typography>

            {expenses.length === 0 ? (
              <Alert severity="info">No expenses found for the selected month and year.</Alert>
            ) : (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount (₹)</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Subtype</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.entryID}>
                        <TableCell>{expense.date}</TableCell>
                        <TableCell>₹{expense.amount}</TableCell>
                        <TableCell>
                          <Chip
                            label={expense.type}
                            color={getTypeColor(expense.type)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{expense.subType}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEdit(expense)} color="primary" size="small">
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(expense.entryID)} color="error" size="small">
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* === Edit Dialog === */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, expense: null })}>
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={editDialog.expense?.amount || ""}
            onChange={(e) =>
              setEditDialog((prev) => ({
                ...prev,
                expense: { ...prev.expense, amount: parseInt(e.target.value) },
              }))
            }
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Subtype"
            value={editDialog.expense?.subType || ""}
            onChange={(e) =>
              setEditDialog((prev) => ({
                ...prev,
                expense: { ...prev.expense, subType: e.target.value },
              }))
            }
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, expense: null })}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* === Delete Dialog === */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this expense entry?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  </MainLayout>
);

};

export default ViewData;
