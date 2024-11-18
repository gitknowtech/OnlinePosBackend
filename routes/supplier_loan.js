const express = require("express");
const db = require("../db"); // Your database connection
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads/supplier_loan");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage }); // Initialize multer

// Create the supplier_loan table if it doesn't exist
const createSupplierLoanTable = () => {
  const createTableQuery = `
     CREATE TABLE IF NOT EXISTS supplier_loan (
      id INT AUTO_INCREMENT PRIMARY KEY,
      supId VARCHAR(255) NOT NULL,
      supName VARCHAR(255) NOT NULL,
      loanAmount DECIMAL(10, 2) NOT NULL,
      billNumber VARCHAR(255) NOT NULL,
      description TEXT,
      filePath VARCHAR(255),
      saveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("Error creating supplier_loan table:", err);
    } else {
      console.log("supplier_loan table created or already exists.");
    }
  });
};

createSupplierLoanTable();

// API to add a supplier loan (file upload optional)
router.post("/add_loan", upload.single("file"), (req, res) => {
  const { supId, supName, loanAmount, billNumber, description } = req.body;
  const filePath = req.file ? `/uploads/supplier_loan/${req.file.filename}` : null;

  if (!supId || !supName || !loanAmount || !billNumber) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const query = `
      INSERT INTO supplier_loan (supId, supName, loanAmount, billNumber, description, filePath)
      VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [supId, supName, loanAmount, billNumber, description, filePath],
    (err, result) => {
      if (err) {
        console.error("Error saving supplier loan:", err);
        return res.status(500).json({ message: "Error saving loan details." });
      }

      res.status(201).json({
        message: "Supplier loan added successfully.",
        loanId: result.insertId,
      });
    }
  );
});

// API to update a supplier loan
router.put("/update_supplier_loan/:id", (req, res) => {
  const { id } = req.params;
  const { loanAmount, description, billNumber } = req.body;
  const query = `
    UPDATE supplier_loan 
    SET loanAmount = ?, description = ?, billNumber = ? 
    WHERE id = ?
  `;
  db.query(query, [loanAmount, description, billNumber, id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error updating loan." });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Loan not found." });
    }
    res.status(200).json({ message: "Loan updated successfully." });
  });
});

// API to delete a supplier loan
router.delete("/delete_supplier_loan/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM supplier_loan WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting loan." });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Loan not found." });
    }
    res.status(200).json({ message: "Loan deleted successfully." });
  });
});

// API to fetch loans for a supplier
router.get("/get_loans_supplier_loan/:supplierId", (req, res) => {
  const { supplierId } = req.params;
  const query = "SELECT * FROM supplier_loan WHERE supId = ?";
  db.query(query, [supplierId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching loans." });
    }
    res.status(200).json(results);
  });
});

// Serve static files from the uploads directory
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

module.exports = router;
