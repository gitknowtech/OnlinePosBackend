const express = require("express");
const db = require("../db");
const moment = require("moment");

const router = express.Router();

// Function to create the 'banks' table if it doesn't exist
const createBankTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS banks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      bankName VARCHAR(255) NOT NULL UNIQUE, -- Ensure unique bank names
      user VARCHAR(255) NOT NULL,
      store VARCHAR(255) NOT NULL,
      saveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP -- Default to current time
    )
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("Error creating banks table:", err);
    } else {
      console.log("Banks table exists or created successfully");
    }
  });
};

// Call the function to ensure the table is created when the server starts
createBankTable();

// **POST Route: Add a new bank**
router.post("/create_banks", (req, res) => {
  const { bankName, user, store, saveTime } = req.body;

  // Ensure required fields are provided
  if (!bankName || !user || !store) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const insertQuery = `
    INSERT INTO banks (bankName, user, store, saveTime)
    VALUES (?, ?, ?, ?)
  `;

  db.query(insertQuery, [bankName, user, store, saveTime], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          message: "Bank name already exists",
          error: err.message,
        });
      }
      return res.status(500).json({
        message: "Error saving bank. Please try again.",
        error: err.message,
      });
    }

    // Return success response with inserted bank ID
    return res.status(201).json({
      message: "Bank added successfully",
      id: result.insertId,
    });
  });
});

// **GET Route: Retrieve all banks**
router.get("/get_banks", (req, res) => {
  const query = "SELECT * FROM banks";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching banks" });
    }
    return res.status(200).json(results);
  });
});

// **DELETE Route: Delete a bank**
router.delete("/delete_bank", (req, res) => {
  const { bankName } = req.body;

  if (!bankName) {
    return res.status(400).json({ message: "Bank name is required" });
  }

  const deleteQuery = `
    DELETE FROM banks
    WHERE bankName = ?
  `;

  db.query(deleteQuery, [bankName], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting bank" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Bank not found" });
    }

    return res.status(200).json({ message: "Bank deleted successfully" });
  });
});

module.exports = router;
