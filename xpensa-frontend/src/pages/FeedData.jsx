import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
} from "@mui/material"
import { Add, Remove, ArrowBack } from "@mui/icons-material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { useNavigate } from "react-router-dom"
import MainLayout from "../components/layout/MainLayout"

const FeedData = () => {
  const navigate = useNavigate()
  const [rows, setRows] = useState([createEmptyRow()])
  const [confirmDialog, setConfirmDialog] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const expenseTypes = {
    Extra: ["Entertainment", "Shopping", "Miscellaneous"],
    "Veg & Rashan": ["Vegetables", "Fruits", "Groceries", "Spices"],
    "Flat Fixed": ["Rent", "Maintenance", "Society Charges"],
    "Flat Setup": ["Furniture", "Appliances", "Decoration"],
    "Bike Expense": ["Fuel", "Maintenance", "Insurance", "Accessories"],
    "Home Expense": ["Utilities", "Internet", "Cleaning", "Repairs"],
  }

  function createEmptyRow() {
    return {
      id: Date.now() + Math.random(),
      month: new Date().toISOString().slice(0, 7),
      date: new Date(),
      amount: "",
      type: "",
      subtype: "",
    }
  }

  const addRow = () => {
    setRows([...rows, createEmptyRow()])
  }

  const removeRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id))
    }
  }

  const updateRow = (id, field, value) => {
    setRows(
      rows.map((row) =>
        row.id === id ? { ...row, [field]: value, ...(field === "type" ? { subtype: "" } : {}) } : row,
      ),
    )
  }

  const validateRows = () => {
    return rows.every((row) => row.date && row.amount && row.type && row.subtype)
  }

  const handleSubmit = () => {
    if (validateRows()) {
      setConfirmDialog(true)
    }
  }

  const handleConfirmSubmit = async () => {
  const payload = rows.map((row) => ({
    date: row.date.toISOString().split("T")[0], // format: yyyy-MM-dd
    amount: Number(row.amount),
    type: row.type,
    subType: row.subtype,
  }));

  try {
    const response = await fetch("https://xpensaprod.onrender.com/expensa/addExpense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Failed to submit expenses");

    setConfirmDialog(false);
    setSubmitSuccess(true);
    setRows([createEmptyRow()]);

    setTimeout(() => setSubmitSuccess(false), 3000);
  } catch (error) {
    console.error("Submission error:", error);
    alert("Error submitting expenses: " + error.message);
  }
};


  const getTotalAmount = () => {
    return rows.reduce((total, row) => total + (Number.parseFloat(row.amount) || 0), 0)
  }

  return (
    <MainLayout title="Feed New Data">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box>
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton onClick={() => navigate("/mode-selection")} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" component="h1">
              Add New Expenses
            </Typography>
          </Box>

          {submitSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Expenses submitted successfully!
            </Alert>
          )}

          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Expense Entry Form</Typography>
                <Box>
                  <Button startIcon={<Add />} onClick={addRow} variant="outlined" sx={{ mr: 1 }}>
                    Add Row
                  </Button>
                  <Chip label={`Total: ₹${getTotalAmount()}`} color="primary" variant="outlined" />
                </Box>
              </Box>

              <TableContainer component={Paper}>
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
                    {rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                            {/* <DatePicker label="Select date" value={value} onChange={setValue} /> */}
                            <DatePicker
                              label="Select date"
                              value={row.date}
                              onChange={(newValue) => updateRow(row.id, "date", newValue)}
                              renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                            />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={row.amount}
                            onChange={(e) => updateRow(row.id, "amount", e.target.value)}
                            size="small"
                            fullWidth
                            placeholder="0"
                          />
                        </TableCell>
                        <TableCell>
                          <FormControl size="small" fullWidth>
                            <Select
                              value={row.type}
                              onChange={(e) => updateRow(row.id, "type", e.target.value)}
                              displayEmpty
                            >
                              <MenuItem value="">
                                <em>Select Type</em>
                              </MenuItem>
                              {Object.keys(expenseTypes).map((type) => (
                                <MenuItem key={type} value={type}>
                                  {type}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <FormControl size="small" fullWidth>
                            <Select
                              value={row.subtype}
                              onChange={(e) => updateRow(row.id, "subtype", e.target.value)}
                              displayEmpty
                              disabled={!row.type}
                            >
                              <MenuItem value="">
                                <em>Select Subtype</em>
                              </MenuItem>
                              {row.type &&
                                expenseTypes[row.type]?.map((subtype) => (
                                  <MenuItem key={subtype} value={subtype}>
                                    {subtype}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => removeRow(row.id)}
                            disabled={rows.length === 1}
                            color="error"
                            size="small"
                          >
                            <Remove />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box mt={3} display="flex" justifyContent="center">
                <Button variant="contained" size="large" onClick={handleSubmit} disabled={!validateRows()}>
                  Submit All Entries
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Confirmation Dialog */}
          <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogContent>
              <Typography gutterBottom>You are about to submit {rows.length} expense entries:</Typography>
              <Box mt={2}>
                {rows.map((row, index) => (
                  <Box key={row.id} mb={1}>
                    <Typography variant="body2">
                      {index + 1}. {row.date?.toLocaleDateString()} - ₹{row.amount} - {row.type} ({row.subtype})
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Typography variant="h6" mt={2}>
                Total Amount: ₹{getTotalAmount()}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
              <Button onClick={handleConfirmSubmit} variant="contained">
                Confirm Submit
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </LocalizationProvider>
    </MainLayout>
  )
}

export default FeedData
