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
// Delete batch API
router.delete('/delete_batch', (req, res) => {
  const { batchName } = req.body;

  // Validation
  if (!batchName) {
      return res.status(400).json({ message: 'Batch name is required' });
  }

  // Check if batch is associated with any products
  const checkBatchQuery = 'SELECT COUNT(*) AS productCount FROM products WHERE batchNumber = ?';

  db.query(checkBatchQuery, [batchName], (err, result) => {
      if (err) {
          console.error('Error checking batch association with products:', err);
          return res.status(500).json({ message: 'Error checking batch association' });
      }

      // If batch is associated with products, return an error
      if (result[0].productCount > 0) {
          return res.status(400).json({ 
              message: 'Cannot delete batch. It is associated with products in the products table.' 
          });
      }

      // Proceed to delete the batch if no association exists
      const deleteBatchQuery = 'DELETE FROM batches WHERE batchName = ?';

      db.query(deleteBatchQuery, [batchName], (err, result) => {
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
});




  
  router.put('/update_batch/:id', (req, res) => {
    const batchId = req.params.id;
    const { batchName } = req.body;

    if (!batchName) {
        return res.status(400).json({ message: 'Batch name is required' });
    }

    // Check for duplicate batch name
    const checkDuplicateQuery = 'SELECT id FROM batches WHERE batchName = ? AND id != ?';
    db.query(checkDuplicateQuery, [batchName, batchId], (err, result) => {
        if (err) {
            console.error('Error checking batch name:', err);
            return res.status(500).json({ message: 'Error checking batch name' });
        }

        if (result.length > 0) {
            return res.status(400).json({ message: 'Batch name already available' });
        }

        // Retrieve the old batch name before updating
        const getOldBatchNameQuery = 'SELECT batchName FROM batches WHERE id = ?';
        db.query(getOldBatchNameQuery, [batchId], (selectErr, selectResult) => {
            if (selectErr) {
                console.error('Error retrieving old batch name:', selectErr);
                return res.status(500).json({ message: 'Error retrieving old batch name' });
            }

            if (selectResult.length === 0) {
                return res.status(404).json({ message: 'Batch not found' });
            }

            const oldBatchName = selectResult[0].batchName;

            // Start transaction
            db.beginTransaction((transactionErr) => {
                if (transactionErr) {
                    console.error('Error starting transaction:', transactionErr);
                    return res.status(500).json({ message: 'Error starting transaction' });
                }

                // Update batch name in `batches` table
                const updateBatchQuery = 'UPDATE batches SET batchName = ? WHERE id = ?';
                db.query(updateBatchQuery, [batchName, batchId], (updateErr, updateResult) => {
                    if (updateErr) {
                        return db.rollback(() => {
                            console.error('Error updating batch:', updateErr);
                            return res.status(500).json({ message: 'Error updating batch' });
                        });
                    }

                    // Update related batchNumber in `products` table
                    const updateProductsQuery = 'UPDATE products SET batchNumber = ? WHERE batchNumber = ?';
                    db.query(updateProductsQuery, [batchName, oldBatchName], (productUpdateErr, productUpdateResult) => {
                        if (productUpdateErr) {
                            return db.rollback(() => {
                                console.error('Error updating products:', productUpdateErr);
                                return res.status(500).json({ message: 'Error updating products' });
                            });
                        }

                        // Commit transaction if both updates are successful
                        db.commit((commitErr) => {
                            if (commitErr) {
                                return db.rollback(() => {
                                    console.error('Error committing transaction:', commitErr);
                                    return res.status(500).json({ message: 'Error committing transaction' });
                                });
                            }

                            res.status(200).json({ message: `Batch and related products updated successfully.` });
                        });
                    });
                });
            });
        });
    });
});



  
  


module.exports = router;