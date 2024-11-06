// routes/purchases.js

const express = require('express');
const db = require('../db'); // Your database connection
const multer = require("multer");
const path = require('path'); // For handling file paths
const fs = require('fs'); // For file system operations
const PDFDocument = require('pdfkit'); // For generating PDFs

const router = express.Router(); 

// Function to create both supplier_purchase and supplier_purchase_last tables
function createSupplierPurchaseTables() {
  const createSupplierPurchaseLastTable = `
    CREATE TABLE IF NOT EXISTS supplier_purchase_last (
      id INT NOT NULL AUTO_INCREMENT,
      generatedid VARCHAR(5) NOT NULL UNIQUE,
      gross_total DECIMAL(10, 2) NOT NULL,
      total_quantity DECIMAL(10, 4) NOT NULL,
      total_items INT NOT NULL,
      cash_amount DECIMAL(10, 2) NOT NULL,
      credit_amount DECIMAL(10, 2) NOT NULL,
      invoice_date DATE NOT NULL,
      document_link VARCHAR(255) NOT NULL,
      PRIMARY KEY (id)
    );
  `;

  const createSupplierPurchaseTable = `
    CREATE TABLE IF NOT EXISTS supplier_purchase (
      id INT NOT NULL AUTO_INCREMENT,
      generatedid VARCHAR(5) NOT NULL,
      InvoiceId VARCHAR(50) NOT NULL,
      ProName VARCHAR(255) NOT NULL,
      UnitPrice DECIMAL(10, 2) NOT NULL,
      Quantity DECIMAL(10, 4) NOT NULL,
      Total DECIMAL(10, 2) NOT NULL,
      Supplier VARCHAR(255) NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (generatedid) REFERENCES supplier_purchase_last(generatedid)
    );
  `;

  db.query(createSupplierPurchaseLastTable, (err, result) => {
    if (err) {
      console.error("Error creating supplier_purchase_last table:", err);
    } else {
      console.log("supplier_purchase_last table created or already exists.");
    }
  });

  db.query(createSupplierPurchaseTable, (err, result) => {
    if (err) {
      console.error("Error creating supplier_purchase table:", err);
    } else {
      console.log("supplier_purchase table created or already exists.");
    }
  });
}

// Invoke table creation on server start
createSupplierPurchaseTables();

/**
 * Helper Function: generateUniqueId
 * Generates a unique 5-digit ID ensuring it's not present in supplier_purchase_last table.
 */
const generateUniqueId = async () => {
  const generateId = () => Math.floor(10000 + Math.random() * 90000).toString();

  let unique = false;
  let newId = '';

  while (!unique) {
    newId = generateId();
    const query = `
      SELECT COUNT(*) AS count FROM supplier_purchase_last WHERE generatedid = ?
    `;
    const values = [newId];

    // Promisify db.query for async/await usage
    const results = await new Promise((resolve, reject) => {
      db.query(query, values, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    if (results[0].count === 0) {
      unique = true;
    }
  }

  return newId;
};

// Ensure the uploads directory exists
const uploadDirectory = path.join(__dirname, "../uploads/supplier_Perchases");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and PDF documents are allowed'));
    }
  },
});

/**
 * Endpoint: POST /upload_document
 * Description: Handles multiple image uploads, combines them into a PDF, saves the PDF, and returns the file link.
 */
router.post("/upload_document", upload.array("documents", 10), async (req, res) => { // Limit to 10 images
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  try {
    // Create a new PDF document
    const doc = new PDFDocument();
    const pdfFilename = `document-${Date.now()}.pdf`;
    const pdfPath = path.join(uploadDirectory, pdfFilename);
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // Add each image to the PDF
    req.files.forEach((file, index) => {
      if (index > 0) {
        doc.addPage();
      }
      doc.image(file.path, {
        fit: [500, 700],
        align: 'center',
        valign: 'center'
      });
    });

    doc.end();

    // Wait for the PDF to be fully written
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    // Optionally, delete the original image files after creating the PDF
    req.files.forEach((file) => {
      fs.unlinkSync(file.path);
    });

    // Assuming you serve static files from the 'uploads' directory
    const fileLink = `/uploads/supplier_Perchases/${pdfFilename}`;
    res.json({ fileLink });
  } catch (error) {
    console.error("Error processing documents:", error);
    res.status(500).json({ error: "Failed to process documents" });
  }
});

/**
 * Endpoint: POST /save_Purchase_Supplier
 * Description: Saves purchase data into supplier_purchase and supplier_purchase_last tables.
 */
router.post("/save_Purchase_Supplier", async (req, res) => {
  const { purchases, summary } = req.body;

  if (!Array.isArray(purchases) || purchases.length === 0 || !summary) {
    return res.status(400).send("Invalid purchase data or summary.");
  }

  try {
    // Generate a unique 5-digit ID for the invoice
    const generatedid = await generateUniqueId();

    // Begin transaction
    await new Promise((resolve, reject) => {
      db.beginTransaction(err => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Insert into supplier_purchase_last (summary table)
    const insertSummaryQuery = `
      INSERT INTO supplier_purchase_last 
      (generatedid, gross_total, total_quantity, total_items, cash_amount, credit_amount, invoice_date, document_link)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const { grossTotal, totalQuantity, totalItems, cashAmount, creditAmount, invoiceDate, documentLink } = summary;

    await new Promise((resolve, reject) => {
      db.query(
        insertSummaryQuery,
        [
          generatedid,
          grossTotal,
          totalQuantity,
          totalItems,
          cashAmount,
          creditAmount,
          invoiceDate,
          documentLink
        ],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    // Insert each purchase into supplier_purchase
    const insertPurchaseQuery = `
      INSERT INTO supplier_purchase 
      (generatedid, InvoiceId, ProName, UnitPrice, Quantity, Total, Supplier)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    for (const purchase of purchases) {
      const { InvoiceId, ProName, UnitPrice, Quantity, Total, Supplier } = purchase;
      await new Promise((resolve, reject) => {
        db.query(
          insertPurchaseQuery,
          [
            generatedid,
            InvoiceId,
            ProName,
            UnitPrice,
            Quantity,
            Total,
            Supplier
          ],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
    }

    // Commit transaction
    await new Promise((resolve, reject) => {
      db.commit(err => {
        if (err) return reject(err);
        resolve();
      });
    });

    res.status(200).send({ message: "Purchases saved successfully", generatedid });
  } catch (error) {
    // Rollback transaction in case of error
    db.rollback(() => {
      console.error("Error saving purchases:", error);
      res.status(500).send("Failed to save purchases");
    });
  }
});

module.exports = router;
