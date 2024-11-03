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
      remark VARCHAR(2500),
      amount DECIMAL(10, 4) NOT NULL,
      saveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      insertAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
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

// Route to get expenses for a specific user on the current date
router.get('/fecth_expenses', async (req, res) => {
  const { user } = req.query;
  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

  const query = `
    SELECT id, user, store, remark AS reason, amount, saveTime AS date
    FROM expenses
    WHERE user = ? AND DATE(saveTime) = ?
    ORDER BY saveTime DESC
  `;

  try {
    const results = await db.query(query, [user, today]);

    // Log the entire response structure
    console.log('Database query results:', results);

    if (Array.isArray(results) || Array.isArray(results[0])) {
      const data = Array.isArray(results[0]) ? results[0] : results;
      res.status(200).json(data);
    } else {
      throw new Error('Unexpected response format from database');
    }
  } catch (err) {
    console.error('Error fetching expenses:', err); // Log actual error details
    res.status(500).json({ message: 'Failed to fetch expenses', error: err.message });
  }
});



// Route to add a new expense
router.post('/addExpenses', async (req, res) => {
  const { user, store, amount, reason } = req.body;

  if (!user || !store || !amount || !reason) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = `
    INSERT INTO expenses (user, store, amount, remark, saveTime, insertAt)
    VALUES (?, ?, ?, ?, NOW(), NOW())
  `;

  try {
    await db.query(query, [user, store, parseFloat(amount), reason]);
    res.status(201).json({ message: 'Expense added successfully' });
  } catch (err) {
    console.error('Error adding expense:', err);
    res.status(500).json({ message: 'Failed to add expense' });
  }
});

// Route to update an existing expense
router.put('/updateExpense', async (req, res) => {
  const { id, amount, reason } = req.body;

  if (!id || !amount || !reason) {
    return res.status(400).json({ message: 'ID, amount, and reason are required' });
  }

  const query = `
    UPDATE expenses
    SET amount = ?, remark = ?
    WHERE id = ?
  `;

  try {
    await db.query(query, [parseFloat(amount), reason, id]);
    res.status(200).json({ message: 'Expense updated successfully' });
  } catch (err) {
    console.error('Error updating expense:', err);
    res.status(500).json({ message: 'Failed to update expense' });
  }
});

module.exports = router;
