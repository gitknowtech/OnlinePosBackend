const express = require("express");
const db = require("../db"); // Your database connection
const router = express.Router();
const moment = require("moment");

// Create `sales` table if it doesn't exist
const createSalesTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS sales (
      id INT AUTO_INCREMENT PRIMARY KEY,
      invoiceId VARCHAR(100) NOT NULL UNIQUE,
      GrossTotal DECIMAL(10,2) NOT NULL,
      CustomerId VARCHAR(255) NOT NULL DEFAULT 'Unknown',
      discountPercent DECIMAL(10,2),
      discountAmount DECIMAL(10,2),
      netAmount DECIMAL(10,2) NOT NULL,
      CashPay DECIMAL(10,2),
      CardPay DECIMAL(10,2),
      PaymentType VARCHAR(50) NOT NULL,
      Balance DECIMAL(10,2),
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error("Error creating sales table:", err.message);
      console.error(err.stack); // Log detailed stack trace
    } else {
      console.log("Sales table exists or created successfully");
    }
  });
};

// Call the function to create the table on server start
createSalesTable();

// Generate unique invoice ID
const generateInvoiceId = () => {
  const datePart = moment().format("YYMMDD");
  return new Promise((resolve, reject) => {
    const query = `
      SELECT COUNT(*) AS count FROM sales WHERE DATE(createdAt) = CURDATE()
    `;
    db.query(query, (err, results) => {
      if (err) return reject(err);
      const count = results[0].count + 1;
      const paddedCount = count.toString().padStart(4, "0");
      resolve(`${datePart}${paddedCount}`);
    });
  });
};

// API to add a new sales record
router.post("/add_sales", async (req, res) => {
  console.log("Received request to add a new sales record:", req.body);
  const {
    GrossTotal,
    CustomerId,
    discountPercent,
    discountAmount,
    netAmount,
    CashPay,
    CardPay,
    PaymentType,
    Balance,
  } = req.body;

  // Validate required fields
  if (!GrossTotal || !CustomerId || !netAmount || !PaymentType) {
    console.warn("Validation failed: Missing required fields");
    return res
      .status(400)
      .json({ message: "GrossTotal, NetAmount, and PaymentType are required." });
  }

  try {
    // Generate unique invoice ID
    const invoiceId = await generateInvoiceId();

    // Insert the new sales record into the sales table
    const insertSalesQuery = `
      INSERT INTO sales (
        invoiceId, GrossTotal, CustomerId, discountPercent, discountAmount,
        netAmount, CashPay, CardPay, PaymentType, Balance
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const salesValues = [
      invoiceId,
      GrossTotal,
      CustomerId,
      discountPercent || 0,
      discountAmount || 0,
      netAmount,
      CashPay || 0,
      CardPay || 0,
      PaymentType,
      Balance || 0,
    ];

    db.query(insertSalesQuery, salesValues, (err, result) => {
      if (err) {
        console.error("Error adding sales record:", err.message);
        console.error(err.stack); // Log detailed stack trace
        return res.status(500).json({ message: "Error adding sales record", error: err.message });
      }

      console.log("Sales record added successfully with ID:", result.insertId);
      res.status(201).json({ message: "Sales record added successfully!", invoiceId });
    });
  } catch (err) {
    console.error("Error generating invoice ID or adding sales record:", err.message);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// Route to fetch all sales records
router.get("/fetch_sales", (req, res) => {
  const fetchQuery = "SELECT * FROM sales";
  db.query(fetchQuery, (err, results) => {
    if (err) {
      console.error("Error fetching sales records:", err.message);
      return res.status(500).json({ message: "Error fetching sales records", error: err.message });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
