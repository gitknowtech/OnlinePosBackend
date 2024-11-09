// routes/purchases.js

const express = require('express');
const db = require('../db'); // Your database connection
const multer = require("multer");
const path = require('path'); // For handling file paths
const fs = require('fs'); // For file system operations
const PDFDocument = require('pdfkit'); // For generating PDFs
const moment = require("moment"); // Ensure moment.js is installed


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
      refference VARCHAR(255),
      PRIMARY KEY (id)
    );
  `;

  const createSupplierPurchaseTable = `
    CREATE TABLE IF NOT EXISTS supplier_purchase (
      id INT NOT NULL AUTO_INCREMENT,
      generatedid VARCHAR(5) NOT NULL,
      InvoiceId VARCHAR(50) NOT NULL,
      ProCode VARCHAR(255) NOT NULL, 
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




const createSupplierPurchasePaymentTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS supplier_purchase_payment (
      id INT AUTO_INCREMENT PRIMARY KEY,
      generatedid VARCHAR(255) NOT NULL,
      payment DECIMAL(10, 2) NOT NULL, -- Payment difference
      refference VARCHAR(255),
      saved_time DATETIME NOT NULL,
      INDEX (generatedid)
    );
  `;

  try {
    await new Promise((resolve, reject) => {
      db.query(createTableQuery, (err, result) => {
        if (err) return reject(err);
        console.log("Table supplier_purchase_payment created successfully or already exists.");
        resolve(result);
      });
    });
  } catch (error) {
    console.error("Error creating supplier_purchase_payment table:", error);
  }
};

// Call the function to create the table
createSupplierPurchasePaymentTable();
createSupplierPurchaseTables();





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
      db.beginTransaction((err) => {
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
    const {
      grossTotal,
      totalQuantity,
      totalItems,
      cashAmount,
      creditAmount,
      invoiceDate,
      documentLink,
    } = summary;

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
          documentLink,
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
      (generatedid, InvoiceId, ProCode, ProName, UnitPrice, Quantity, Total, Supplier)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const purchase of purchases) {
      const { InvoiceId, ProCode, ProName, UnitPrice, Quantity, Total, Supplier } = purchase;
      await new Promise((resolve, reject) => {
        db.query(
          insertPurchaseQuery,
          [
            generatedid,
            InvoiceId,
            ProCode,       // Include product code in the insertion
            ProName,
            UnitPrice,
            Quantity,
            Total,
            Supplier,
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
      db.commit((err) => {
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




router.get("/get_purchase/:invoiceId", async (req, res) => {
  const { invoiceId } = req.params;

  try {
    // Fetch generatedid, Supplier ID using the InvoiceId from supplier_purchase table
    const generatedIdQuery = `
      SELECT generatedid, Supplier FROM supplier_purchase WHERE InvoiceId = ? LIMIT 1
    `;

    const [generatedIdResult] = await new Promise((resolve, reject) => {
      db.query(generatedIdQuery, [invoiceId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (!generatedIdResult) {
      return res.status(404).send({ error: "Invoice ID not found" });
    }

    const generatedid = generatedIdResult.generatedid;
    const supplierId = generatedIdResult.Supplier; // Assuming Supplier column contains Supplier ID

    // Fetch supplier name from suppliers table using supplierId
    const supplierQuery = `
      SELECT Supname FROM suppliers WHERE Supid = ?
    `;
    const [supplierResult] = await new Promise((resolve, reject) => {
      db.query(supplierQuery, [supplierId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    const supplierName = supplierResult ? supplierResult.Supname : "";

    // Fetch summary data from supplier_purchase_last using generatedid
    const summaryQuery = `
      SELECT * FROM supplier_purchase_last WHERE generatedid = ?
    `;
    const [summaryResult] = await new Promise((resolve, reject) => {
      db.query(summaryQuery, [generatedid], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (!summaryResult) {
      return res.status(404).send({ error: "Summary not found for the given generated ID" });
    }

    // Add supplier name to summaryResult
    summaryResult.SupplierName = supplierName;

    // Fetch purchase items from supplier_purchase using generatedid
    const purchasesQuery = `
      SELECT * FROM supplier_purchase WHERE generatedid = ?
    `;
    const purchasesResults = await new Promise((resolve, reject) => {
      db.query(purchasesQuery, [generatedid], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    // Send the data back to the client
    res.status(200).send({
      summary: summaryResult,
      purchases: purchasesResults
    });
  } catch (error) {
    console.error("Error fetching purchase data:", error);
    res.status(500).send({ error: "Failed to fetch purchase data" });
  }
});



router.put("/update_payment/:generatedid", async (req, res) => {
  const { generatedid } = req.params;
  const { cashAmount, creditAmount, referenceNumber } = req.body;

  try {
    // Fetch the current cash amount from supplier_purchase_last
    const fetchQuery = `
      SELECT cash_amount FROM supplier_purchase_last WHERE generatedid = ?
    `;
    const currentCashAmount = await new Promise((resolve, reject) => {
      db.query(fetchQuery, [generatedid], (err, result) => {
        if (err) return reject(err);
        if (result.length === 0) return reject(new Error("Generated ID not found."));
        resolve(result[0].cash_amount);
      });
    });

    // Calculate the payment difference
    const paymentDifference = parseFloat(cashAmount) - parseFloat(currentCashAmount);

    if (paymentDifference <= 0) {
      return res
        .status(400)
        .send({ error: "Cash amount must be greater than the current value to update." });
    }

    // Update the supplier_purchase_last table
    const updateQuery = `
      UPDATE supplier_purchase_last
      SET cash_amount = ?, credit_amount = ?, refference = ?
      WHERE generatedid = ?
    `;
    await new Promise((resolve, reject) => {
      db.query(
        updateQuery,
        [cashAmount, creditAmount, referenceNumber, generatedid],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });

    // Save the payment difference in supplier_purchase_payment table
    const saveQuery = `
      INSERT INTO supplier_purchase_payment (generatedid, payment, refference, saved_time)
      VALUES (?, ?, ?, ?)
    `;
    const savedTime = moment().format("YYYY-MM-DD HH:mm:ss");
    await new Promise((resolve, reject) => {
      db.query(
        saveQuery,
        [generatedid, paymentDifference, referenceNumber, savedTime],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });

    res.status(200).send({
      message: "Payment amounts and reference number updated and saved successfully.",
    });
  } catch (error) {
    console.error("Error updating and saving payment data:", error);
    res.status(500).send({ error: "Failed to update and save payment data." });
  }
});




// Serve static files from the 'uploads' directory
router.use("/uploads", express.static(path.join(__dirname, "uploads")));




/**
 * Endpoint: GET /get_purchase_summaries
 * Description: Retrieves all purchase summaries with supplier names.
 */
router.get("/get_purchase_summaries", async (req, res) => {
  try {
    const summariesQuery = `
      SELECT spl.*, s.Supname AS SupplierName
      FROM supplier_purchase_last spl
      LEFT JOIN (
        SELECT generatedid, Supplier
        FROM supplier_purchase
        GROUP BY generatedid, Supplier
      ) sp ON spl.generatedid = sp.generatedid
      LEFT JOIN suppliers s ON sp.Supplier = s.Supid
    `;

    const summaries = await new Promise((resolve, reject) => {
      db.query(summariesQuery, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    res.status(200).send(summaries);
  } catch (error) {
    console.error("Error fetching purchase summaries:", error);
    res.status(500).send({ error: "Failed to fetch purchase summaries" });
  }
});





// Get payment history for a given generatedid
router.get("/get_payment_history/:generatedid", async (req, res) => {
  const { generatedid } = req.params;

  try {
    const query = `
      SELECT id, payment, refference, saved_time 
      FROM supplier_purchase_payment 
      WHERE generatedid = ? 
      ORDER BY saved_time DESC
    `;

    const results = await new Promise((resolve, reject) => {
      db.query(query, [generatedid], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (results.length === 0) {
      return res.status(404).json({ message: "No payment history found for the given ID." });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({ error: "Failed to fetch payment history." });
  }
});


router.delete("/delete_payment/:id", async (req, res) => {
  const { id } = req.params; // Extract ID from params
  const { payment } = req.body; // Extract payment from body

  try {
    // Fetch the related `generatedid` before deleting the record
    const generatedIdQuery = `
      SELECT generatedid FROM supplier_purchase_payment WHERE id = ?
    `;
    const generatedIdResult = await new Promise((resolve, reject) => {
      db.query(generatedIdQuery, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    // Ensure the record exists
    if (generatedIdResult.length === 0) {
      return res.status(404).send({ error: "Payment record not found." });
    }

    const generatedId = generatedIdResult[0].generatedid;

    // Delete the specific payment record
    const deleteQuery = `
      DELETE FROM supplier_purchase_payment
      WHERE id = ?
    `;
    await new Promise((resolve, reject) => {
      db.query(deleteQuery, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    // Update the supplier_purchase_last table using the retrieved `generatedid`
    const updateQuery = `
      UPDATE supplier_purchase_last
      SET cash_amount = cash_amount - ?, credit_amount = credit_amount + ?
      WHERE generatedid = ?
    `;
    await new Promise((resolve, reject) => {
      db.query(updateQuery, [payment, payment, generatedId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    res.status(200).send({ message: "Payment record deleted and totals updated successfully." });
  } catch (error) {
    console.error("Error deleting payment record and updating totals:", error);
    res.status(500).send({ error: "Failed to delete payment record and update totals." });
  }
});




// Delete related data based on generatedid
router.delete("/delete_whole_data/:generatedid", async (req, res) => {
  const { generatedid } = req.params;

  try {
    // Start a transaction
    await new Promise((resolve, reject) => {
      db.beginTransaction((err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Step 1: Delete from supplier_purchase_payment
    const deletePaymentQuery = `DELETE FROM supplier_purchase_payment WHERE generatedid = ?`;
    await new Promise((resolve, reject) => {
      db.query(deletePaymentQuery, [generatedid], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    // Step 2: Delete from supplier_purchase
    const deletePurchaseQuery = `DELETE FROM supplier_purchase WHERE generatedid = ?`;
    await new Promise((resolve, reject) => {
      db.query(deletePurchaseQuery, [generatedid], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    // Step 3: Delete from supplier_purchase_last
    const deleteLastQuery = `DELETE FROM supplier_purchase_last WHERE generatedid = ?`;
    await new Promise((resolve, reject) => {
      db.query(deleteLastQuery, [generatedid], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    // Commit the transaction
    await new Promise((resolve, reject) => {
      db.commit((err) => {
        if (err) {
          return db.rollback(() => reject(err));
        }
        resolve();
      });
    });

    res.status(200).send({ message: "All related data deleted successfully." });
  } catch (error) {
    console.error("Error deleting related data:", error);

    // Rollback the transaction on error
    await new Promise((resolve, reject) => {
      db.rollback(() => reject(error));
    });

    res.status(500).send({ error: "Failed to delete related data." });
  }
});



module.exports = router;
