const express = require("express");
const db = require("../db");
const moment = require("moment");

const router = express.Router();

// Function to create the 'categories' table if it doesn't exist
const createBankTable = () => {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS banks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bankName VARCHAR(255) NOT NULL,
        user VARCHAR(255) NOT NULL,
        store VARCHAR(255) NOT NULL,
        saveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error("Error creating categories table:", err);
    } else {
      console.log("Categories table exists or created successfully");
    }
  });
};

createBankTable();

//bank databse data codes
router.delete("/delete_bank", (req, res) => {
  const { bankName } = req.body;

  const deleteQuery = "DELETE FROM banks WHERE bankName = ?";

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



router.get("/get_banks", (req, res) => {
  const query = "SELECT * FROM banks";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching banks" });
    }
    return res.status(200).json(results);
  });
}); 



router.post("/create_banks", (req, res) => {
  const { id, bankName, user, store, saveTime } = req.body;

  const insertQuery =
    "INSERT INTO banks (id, bankName, user, store, saveTime) VALUES (?, ?, ?, ?, ?)";

  db.query(
    insertQuery,
    [id, bankName, user, store, saveTime],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            message: "Duplicate ID",
            error: err.message,
            code: err.code,
          });
        }
        return res.status(500).json({
          message: "Error saving bank. Please try again.",
          error: err.message,
        });
      }
      return res.status(201).json({ message: "Bank added successfully" });
    }
  );
});


module.exports = router;
