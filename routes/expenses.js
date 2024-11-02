// backend/routes/expenses.js
const express = require('express');
const moment = require('moment'); // For formatting dates
const router = express.Router();
const db = require('../db'); // Your database connection

// Create Expenses Table if it doesn't exist
const createExpensesTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS expenses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user VARCHAR(255) NOT NULL,
      store VARCHAR(255) NOT NULL,
      remark TEXT,
      amount DECIMAL(10, 2) NOT NULL,
      saveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    await db.query(createTableQuery);
    console.log('Expenses table exists or created successfully');
  } catch (err) {
    console.error('Error creating expenses table:', err);
  }
};

// Initialize the table
createExpensesTable();

// GET endpoint to fetch today's expenses for a specific user
router.get('/today/:user', async (req, res) => {
  const { user } = req.params;
  const today = moment().format('YYYY-MM-DD');

  const query = `
    SELECT * FROM expenses 
    WHERE user = ? AND DATE(saveTime) = ?
    ORDER BY saveTime DESC
  `;

  try {
    const results = await db.query(query, [user, today]);
    res.status(200).json(results); // Always return an array
  } catch (err) {
    console.error('Error fetching today’s expenses:', err);
    res.status(500).json({ message: 'Failed to fetch expenses', error: err.message });
  }
});

// POST endpoint to add a new expense
router.post('/add', async (req, res) => {
  const { user, store, remark, amount } = req.body;

  // Validate required fields
  if (!user || !store || amount === undefined) { // `remark` is optional
    return res.status(400).json({ message: 'User, store, and amount are required' });
  }

  // Validate amount
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ message: 'Amount must be a positive number' });
  }

  const insertQuery = `
    INSERT INTO expenses (user, store, remark, amount)
    VALUES (?, ?, ?, ?)
  `;

  try {
    const result = await db.query(insertQuery, [user, store, remark || '', parsedAmount]);
    res.status(201).json({
      message: 'Expense saved successfully',
      expenseId: result.insertId,
      saveTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
  } catch (err) {
    console.error('Error saving expense:', err);
    res.status(500).json({ message: 'Failed to save expense', error: err.message });
  }
});

// PUT endpoint to update an existing expense
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { amount, remark } = req.body;

  // Ensure at least one field is provided
  if (amount === undefined && remark === undefined) {
    return res.status(400).json({ message: 'Please provide at least one field to update' });
  }

  const fields = [];
  const values = [];

  if (amount !== undefined) {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }
    fields.push('amount = ?');
    values.push(parsedAmount);
  }

  if (remark !== undefined) {
    fields.push('remark = ?');
    values.push(remark);
  }

  values.push(id); // For WHERE clause

  const updateQuery = `
    UPDATE expenses SET ${fields.join(', ')} WHERE id = ?
  `;

  try {
    const result = await db.query(updateQuery, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json({ message: 'Expense updated successfully' });
  } catch (err) {
    console.error('Error updating expense:', err);
    res.status(500).json({ message: 'Failed to update expense', error: err.message });
  }
});

module.exports = router;
