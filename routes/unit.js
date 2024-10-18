const express = require('express')
const moment = require('moment')
const db = require('../db')
const router = express.Router();






const createUnitsTable = () => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS units (
        id INT AUTO_INCREMENT PRIMARY KEY,
        unitName VARCHAR(255) NOT NULL,
        user VARCHAR(255) NOT NULL,
        store VARCHAR(255) NOT NULL,
        saveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;

    db.query(createTableQuery, (err, result) => {
        if (err) {
            console.error('Error creating units table:', err);
        } else {
            console.log('Units table exists or created successfully');
        }
    });
};

createUnitsTable();




router.delete("/delete_unit", (req, res) => {
    const { unitName } = req.body;

    const deleteQuery = "DELETE FROM units WHERE unitName = ?";

    db.query(deleteQuery, [unitName], (err, result) => {
        if (err) {
            console.error('Error deleting unit from database:', err);
            return res.status(500).json({ message: "Error deleting unit" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Unit not found" });
        }

        return res.status(200).json({ message: "Unit deleted successfully" });
    });
});






router.put('/update_unit/:unitId', (req, res) => {
    const { unitId } = req.params;
    const { unitName } = req.body;

    if (!unitName || unitName.trim() === '') {
        return res.status(400).json({ message: 'Unit name cannot be empty' });
    }

    // Check for duplicate unit name
    const checkDuplicateQuery = `SELECT * FROM units WHERE LOWER(unitName) = LOWER(?) AND id != ?`;
    db.query(checkDuplicateQuery, [unitName, unitId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error checking for duplicate unit' });
        }

        if (result.length > 0) {
            return res.status(400).json({ message: 'Unit name already exists' });
        }

        // Update the unit in the database
        const updateUnitQuery = `UPDATE units SET unitName = ? WHERE id = ?`;
        db.query(updateUnitQuery, [unitName, unitId], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating unit' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Unit not found' });
            }

            res.status(200).json({ message: 'Unit updated successfully' });
        });
    });
});






router.get("/get_units", (req, res) => {
    const query = "SELECT * FROM units";
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching units:', err);
            return res.status(500).json({ message: "Error fetching units" });
        }
        return res.status(200).json(results);
    });
});











router.post("/create_units", (req, res) => {
    const { id, unitName, user, store, saveTime } = req.body;

    const insertQuery = "INSERT INTO units (id, unitName, user, store, saveTime) VALUES (?, ?, ?, ?, ?)";

    db.query(insertQuery, [id, unitName, user, store, saveTime], (err, result) => {
        if (err) {
            // Handle duplicate entry error (MySQL error code 1062)
            if (err.code === 'ER_DUP_ENTRY') {
                console.error('Duplicate ID detected:', err);
                return res.status(400).json({
                    message: "Duplicate ID",
                    error: err.message || 'Duplicate ID error',
                    code: err.code || 'No code',
                    errno: err.errno || 'No errno'
                });
            }

            // Log other MySQL errors
            console.error('Error saving unit to database:', err);
            return res.status(500).json({
                message: "Error saving unit. Please try again.",
                error: err.message || 'Unknown error',
                sqlMessage: err.sqlMessage || 'No SQL message',
                code: err.code || 'No code',
                errno: err.errno || 'No errno'
            });
        }

        return res.status(201).json({ message: "Unit added successfully" });
    });
});


module.exports = router;