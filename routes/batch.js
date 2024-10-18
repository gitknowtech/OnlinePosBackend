const express = require('express');
const db = require('../db');
const moment = require('moment');

const router = express.Router();



// Create batches table
const createBatchesTable = () => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS batches (
        id INT AUTO_INCREMENT PRIMARY KEY,
        batchName VARCHAR(255) NOT NULL,
        user VARCHAR(255) NOT NULL,
        store VARCHAR(255) NOT NULL,
        saveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;
  
    db.query(createTableQuery, (err, result) => {
      if (err) {
        console.error('Error creating batches table:', err);
      } else {
        console.log('Batches table exists or created successfully');
      }
    });
  };
  
  
createBatchesTable();  



// Get batches API
router.get('/get_batches', (req, res) => {
    const query = 'SELECT * FROM batches';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching batches:', err);
        return res.status(500).json({ message: 'Error fetching batches' });
      }
      res.status(200).json(results);
    });
  });
  
  
  // Create batch API
router.post('/create_batches', (req, res) => {
    const { batchName, user, store } = req.body;
    
    // Validation
    if (!batchName || !user || !store) {
      return res.status(400).json({ message: 'Batch name, user, and store are required' });
    }
  
    const query = 'INSERT INTO batches (batchName, user, store) VALUES (?, ?, ?)';
    db.query(query, [batchName, user, store], (err, result) => {
      if (err) {
        console.error('Error creating batch:', err);
        return res.status(500).json({ message: 'Error creating batch' });
      }
      res.status(201).json({ id: result.insertId, batchName, user, store });
    });
  });
  
  
  // Delete batch API
router.delete('/delete_batch', (req, res) => {
    const { batchName } = req.body;
  
    // Validation
    if (!batchName) {
      return res.status(400).json({ message: 'Batch name is required' });
    }
  
    const query = 'DELETE FROM batches WHERE batchName = ?';
    db.query(query, [batchName], (err, result) => {
      if (err) {
        console.error('Error deleting batch:', err);
        return res.status(500).json({ message: 'Error deleting batch' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Batch not found' });
      }
  
      res.status(200).json({ message: `Batch "${batchName}" has been deleted successfully.` });
    });
  });
  
  
  // Update batch API
router.put('/update_batch/:id', (req, res) => {
    const batchId = req.params.id; // Get the batch ID from the URL parameters
    const { batchName } = req.body; // Extract new batch name from the request body
  
    // Validation
    if (!batchName) {
      return res.status(400).json({ message: 'Batch name is required' });
    }
  
    const query = 'UPDATE batches SET batchName = ? WHERE id = ?';
    db.query(query, [batchName, batchId], (err, result) => {
      if (err) {
        console.error('Error updating batch:', err);
        return res.status(500).json({ message: 'Error updating batch' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Batch not found' });
      }
  
      res.status(200).json({ message: `Batch has been updated successfully.` });
    });
  });
  
  
  


module.exports = router;