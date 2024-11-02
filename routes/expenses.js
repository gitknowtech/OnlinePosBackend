const express = require('express');
const db = require('../db'); // Your database connection
const moment = require('moment'); // For formatting dates

const router = express.Router();



const createExpensesTable = () => {
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

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating expenses table:', err);
    } else {
      console.log('Expenses table exists or created successfully');
    }
  });
};

createExpensesTable();

// POST endpoint to add an expense
router.post('/add_expenses', (req, res) => {
  const { user, store, remark, amount } = req.body;

  const insertQuery = `
    INSERT INTO expenses (user, store, remark, amount)
    VALUES (?, ?, ?, ?)
  `;

  db.query(insertQuery, [user, store, remark, amount], (err, result) => {
    if (err) {
      console.error('Error saving expense:', err);
      res.status(500).json({ message: 'Failed to save expense' });
    } else {
      res.status(201).json({ message: 'Expense saved successfully', expenseId: result.insertId });
    }
  });
});



router.put('/update_expense/:id', (req, res) => {
    const { id } = req.params;
    const { amount, remark } = req.body;
  
    const fields = [];
    const values = [];
  
    if (amount !== undefined) {
      fields.push('amount = ?');
      values.push(amount);
    }
    if (remark !== undefined) {
      fields.push('remark = ?');
      values.push(remark);
    }
    values.push(id);
  
    const updateQuery = `
      UPDATE expenses SET ${fields.join(', ')} WHERE id = ?
    `;
  
    db.query(updateQuery, values, (err, result) => {
      if (err) {
        console.error('Error updating expense:', err);
        res.status(500).json({ message: 'Failed to update expense' });
      } else {
        res.status(200).json({ message: 'Expense updated successfully' });
      }
    });
  });

  

  

  module.exports = router;