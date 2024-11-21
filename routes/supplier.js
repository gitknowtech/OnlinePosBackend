const express = require('express');
const db = require('../db'); // Your database connection
const moment = require('moment'); // For formatting dates
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");


const router = express.Router();


// Create suppliers table if it doesn't exist
const createSuppliersTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS suppliers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      Supid VARCHAR(255) NOT NULL UNIQUE,
      Supname VARCHAR(255) NOT NULL,
      address1 VARCHAR(255),
      address2 VARCHAR(255),
      address3 VARCHAR(255),
      email VARCHAR(255),
      idno VARCHAR(255),
      mobile1 VARCHAR(10),
      mobile2 VARCHAR(10),
      mobile3 VARCHAR(10),
      company VARCHAR(255),
      faxnum VARCHAR(255),
      website VARCHAR(255),
      status ENUM('active', 'inactive') DEFAULT 'active',
      user VARCHAR(255) NOT NULL,
      store VARCHAR(255) NOT NULL,
      saveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating suppliers table:', err);
    } else {
      console.log('Suppliers table exists or created successfully.');
    }
  });
};

// Function to create the banksupplier table
const createBankSupplierTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS banksupplier (
      id INT AUTO_INCREMENT PRIMARY KEY,
      supId VARCHAR(255),
      supName VARCHAR(255),
      supBank VARCHAR(255),
      supBankNo VARCHAR(255),
      saveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating banksupplier table:', err);
    } else {
      console.log('Banksupplier table created or already exists.');
    }
  });
};



// Function to create the delete_suppliers table
const createDeleteSuppliersTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS delete_suppliers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      Supid VARCHAR(255) NOT NULL,
      Supname VARCHAR(255) NOT NULL,
      address1 VARCHAR(255),
      address2 VARCHAR(255),
      address3 VARCHAR(255),
      email VARCHAR(255),
      idno VARCHAR(255),
      mobile1 VARCHAR(255),
      mobile2 VARCHAR(255),
      mobile3 VARCHAR(255),
      company VARCHAR(255),
      faxnum VARCHAR(255),
      website VARCHAR(255),
      status VARCHAR(255),
      user VARCHAR(255),
      store VARCHAR(255),
      deleteTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating delete_suppliers table:', err);
    } else {
      console.log('Delete_suppliers table created or already exists.');
    }
  });
};

// Function to create the delete_bank_supplier table
const createDeleteBankSupplierTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS delete_bank_supplier (
      id INT AUTO_INCREMENT PRIMARY KEY,
      supId VARCHAR(255) NOT NULL,
      supName VARCHAR(255) NOT NULL,
      supBank VARCHAR(255) NOT NULL,
      supBankNo VARCHAR(255) NOT NULL,
      deleteTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating delete_bank_supplier table:', err);
    } else {
      console.log('Delete_bank_supplier table created or already exists.');
    }
  });
};



// Function to create the banksupplier table
const createSupplierLoanTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS supplier_loan (
      id INT AUTO_INCREMENT PRIMARY KEY,
      generatedId VARCHAR(255) UNIQUE NOT NULL,
      supId VARCHAR(255) NOT NULL,
      supName VARCHAR(255) NOT NULL,
      loanAmount DECIMAL(10, 2) NOT NULL,
      cashAmount DECIMAL(10, 2) DEFAULT 0.00,
      totalAmount DECIMAL(10, 2) AS (loanAmount + cashAmount) STORED, -- Generated column
      billNumber VARCHAR(255) NOT NULL,
      description TEXT,
      filePath VARCHAR(255),
      saveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("Error creating supplier_loan table:", err);
    } else {
      console.log("supplier_loan table created or already exists.");
    }
  });
};


// Function to create the banksupplier table
const createSupplierLoanPaymentTable = () => {
  const createTableQuery = `
   CREATE TABLE IF NOT EXISTS supplier_loan_payment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    generatedId VARCHAR(255) NOT NULL,
    paymentAmount DECIMAL(10, 2) NOT NULL,
    referenceNumber VARCHAR(255) NOT NULL,
    filePath VARCHAR(500),
    saveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    paymentType ENUM('Direct', 'Cheque') NOT NULL DEFAULT 'Direct', -- Added column for payment type
    chequeDate DATE DEFAULT NULL, -- Added column for cheque date
    FOREIGN KEY (generatedId) REFERENCES supplier_loan(generatedId)
  );
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("Error creating supplier_loan_payment table:", err);
    } else {
      console.log("supplier_loan_payment table created or already exists.");
    }
  });
};

// Call the function to ensure the table exists
createSupplierLoanPaymentTable();





// Initialize tables
createSuppliersTable();
createBankSupplierTable();
createDeleteSuppliersTable();
createDeleteBankSupplierTable();
createSupplierLoanTable();
createSupplierLoanPaymentTable();





// API to create a supplier and save bank details
router.post("/create_supplier", (req, res) => {
  const {
    Supid, Supname, address1, address2, address3, email, idno, mobile1,
    mobile2, mobile3, company, faxnum, website, status, user, store,
    bankName, accountNumber
  } = req.body;

  if (!Supid || !Supname) {
    return res.status(400).json({ message: "Supplier ID and Supplier Name are required." });
  }

  const insertSupplierQuery = `
    INSERT INTO suppliers 
    (Supid, Supname, address1, address2, address3, email, idno, mobile1, mobile2, mobile3, company, faxnum, website, status, user, store) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(insertSupplierQuery, [
    Supid, Supname, address1, address2, address3, email, idno, mobile1,
    mobile2, mobile3, company, faxnum, website, status, user, store
  ], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Duplicate Supplier ID" });
      }
      return res.status(500).json({ message: "Error saving supplier." });
    }

    if (accountNumber && bankName) {
      const insertBankSupplierQuery = `
        INSERT INTO banksupplier (supId, supName, supBank, supBankNo) 
        VALUES (?, ?, ?, ?)
      `;
      db.query(insertBankSupplierQuery, [Supid, Supname, bankName, accountNumber], (err) => {
        if (err) {
          return res.status(500).json({ message: "Error saving supplier bank details." });
        }
        res.status(201).json({ message: "Supplier and bank details added successfully." });
      });
    } else {
      res.status(201).json({ message: "Supplier added successfully without bank details." });
    }
  });
});




// API to check for duplicate Supplier ID or Name
router.post("/supplier_check_duplicate", (req, res) => {
  const { Supid, Supname } = req.body;

  const query = `
    SELECT * FROM suppliers WHERE Supid = ? OR Supname = ?
  `;
  db.query(query, [Supid, Supname], (err, results) => {
    if (err) {
      console.error('Error checking for duplicates:', err);
      return res.status(500).json({ message: 'Error checking for duplicates' });
    }
    if (results.length > 0) {
      return res.status(200).json({ exists: true });
    }
    res.status(200).json({ exists: false });
  });
});





// API to delete supplier from delete_suppliers and banksupplier tables
router.delete("/delete_supplier_removed/:supId", (req, res) => {
  const { supId } = req.params;

  const selectBankSupplierQuery = `SELECT * FROM delete_bank_supplier WHERE supId = ?`;
  db.query(selectBankSupplierQuery, [supId], (err, bankResult) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching bank details" });
    }

    if (bankResult.length > 0) {
      const deleteBankSupplierQuery = `DELETE FROM delete_bank_supplier WHERE supId = ?`;
      db.query(deleteBankSupplierQuery, [supId], (err) => {
        if (err) {
          return res.status(500).json({ message: "Error deleting bank details" });
        }

        const deleteSupplierQuery = `DELETE FROM delete_suppliers WHERE Supid = ?`;
        db.query(deleteSupplierQuery, [supId], (err) => {
          if (err) {
            return res.status(500).json({ message: "Error deleting supplier" });
          }
          res.status(200).json({ message: "Supplier and bank details deleted successfully" });
        });
      });
    } else {
      const deleteSupplierQuery = `DELETE FROM delete_suppliers WHERE Supid = ?`;
      db.query(deleteSupplierQuery, [supId], (err) => {
        if (err) {
          return res.status(500).json({ message: "Error deleting supplier" });
        }
        res.status(200).json({ message: "Supplier deleted successfully without bank details" });
      });
    }
  });
});




// API to delete supplier and save deleted details
router.delete("/delete_supplier/:supId", (req, res) => {
  const { supId } = req.params;

  const selectSupplierQuery = `SELECT * FROM suppliers WHERE Supid = ?`;
  db.query(selectSupplierQuery, [supId], (err, supplierResult) => {
    if (err || supplierResult.length === 0) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    const supplierData = supplierResult[0];

    const insertDeleteSupplierQuery = `
      INSERT INTO delete_suppliers 
      (Supid, Supname, address1, address2, address3, email, idno, mobile1, mobile2, mobile3, company, faxnum, website, status, user, store) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(insertDeleteSupplierQuery, [
      supplierData.Supid, supplierData.Supname, supplierData.address1,
      supplierData.address2, supplierData.address3, supplierData.email,
      supplierData.idno, supplierData.mobile1, supplierData.mobile2,
      supplierData.mobile3, supplierData.company, supplierData.faxnum,
      supplierData.website, supplierData.status, supplierData.user, supplierData.store
    ], (err) => {
      if (err) {
        return res.status(500).json({ message: "Error saving deleted supplier data" });
      }

      const selectBankSupplierQuery = `SELECT * FROM banksupplier WHERE supId = ?`;
      db.query(selectBankSupplierQuery, [supId], (err, bankResult) => {
        if (err) {
          return res.status(500).json({ message: "Error fetching bank details" });
        }

        if (bankResult.length > 0) {
          const bankData = bankResult[0];
          const insertDeleteBankSupplierQuery = `
            INSERT INTO delete_bank_supplier (supId, supName, supBank, supBankNo) 
            VALUES (?, ?, ?, ?)
          `;
          db.query(insertDeleteBankSupplierQuery, [bankData.supId, bankData.supName, bankData.supBank, bankData.supBankNo], (err) => {
            if (err) {
              return res.status(500).json({ message: "Error saving deleted bank details" });
            }

            const deleteSupplierQuery = `DELETE FROM suppliers WHERE Supid = ?`;
            db.query(deleteSupplierQuery, [supId], (err) => {
              if (err) {
                return res.status(500).json({ message: "Error deleting supplier" });
              }

              const deleteBankSupplierQuery = `DELETE FROM banksupplier WHERE supId = ?`;
              db.query(deleteBankSupplierQuery, [supId], (err) => {
                if (err) {
                  return res.status(500).json({ message: "Error deleting bank details" });
                }
                res.status(200).json({ message: "Supplier and bank details deleted successfully" });
              });
            });
          });
        } else {
          const deleteSupplierQuery = `DELETE FROM suppliers WHERE Supid = ?`;
          db.query(deleteSupplierQuery, [supId], (err) => {
            if (err) {
              return res.status(500).json({ message: "Error deleting supplier" });
            }
            res.status(200).json({ message: "Supplier deleted successfully without bank details" });
          });
        }
      });
    });
  });
});




// API to get all suppliers
router.get("/get_suppliers", (req, res) => {
  const query = "SELECT Supid, Supname, address1, email, mobile1, company, status, store FROM suppliers";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching suppliers" });
    }
    res.status(200).json(results);
  });
});


// Route to get a single supplier by ID
router.get("/get_supplier/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM suppliers WHERE Supid = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching supplier details:", err);
      return res.status(500).json({ message: "Error fetching supplier details." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Supplier not found." });
    }

    res.status(200).json(results[0]); // Send the first result as the supplier details
  });
});


// API to get all removed suppliers
router.get("/get_suppliers_removed", (req, res) => {
  const query = "SELECT Supid, Supname, address1, email, mobile1, company, status, store FROM delete_suppliers";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching suppliers" });
    }
    res.status(200).json(results);
  });
});





// Route to get all bank details for a specific supplier ID
router.get("/get_supplier_bank_details/:supId", (req, res) => {
  const { supId } = req.params;

  const getBankDetailsQuery = `
    SELECT supBank, supBankNo, saveTime 
    FROM banksupplier 
    WHERE supId = ?
  `;

  db.query(getBankDetailsQuery, [supId], (err, results) => {
    if (err) {
      console.error("Error fetching bank details:", err);
      return res.status(500).json({ message: "Error fetching bank details." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No bank details found for this supplier." });
    }

    res.status(200).json(results);
  });
});



// Route to delete a bank detail by bank ID or supId and bank name
router.delete("/delete_supplier_bank/:id", (req, res) => {
  const { id } = req.params;

  const deleteBankQuery = `
    DELETE FROM banksupplier
    WHERE id = ?
  `;

  db.query(deleteBankQuery, [id], (err, results) => {
    if (err) {
      console.error("Error deleting bank details:", err);
      return res.status(500).json({ message: "Error deleting bank details." });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Bank detail not found." });
    }

    res.status(200).json({ message: "Bank detail deleted successfully." });
  });
});




// API to get bank details for a specific supplier
router.get("/get_supplier_address_details/:Supid", (req, res) => {
  const { Supid } = req.params;
  const selectAddressQuery = `SELECT address1, address2, address3 FROM suppliers WHERE Supid = ?`;

  db.query(selectAddressQuery, [Supid], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching address details" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "No address details found for this supplier" });
    }
    return res.status(200).json(results[0]);
  });
});



// API to get website details for a specific supplier
router.get("/get_supplier_website_details/:Supid", (req, res) => {
  const { Supid } = req.params;
  const selectAddressQuery = `SELECT email, website FROM suppliers WHERE Supid = ?`;

  db.query(selectAddressQuery, [Supid], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching website details" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "No web address details found for this supplier" });
    }
    return res.status(200).json(results[0]);
  });
});



// API to get mobile details for a specific supplier
router.get("/get_supplier_mobile_details/:Supid", (req, res) => {
  const { Supid } = req.params;
  const selectAddressQuery = `SELECT mobile1, mobile2, mobile3 FROM suppliers WHERE Supid = ?`;

  db.query(selectAddressQuery, [Supid], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching mobile details" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "No mobile details found for this supplier" });
    }
    return res.status(200).json(results[0]);
  });
});






// API to get removed bank details for a specific supplier
router.get("/get_supplier_bank_details_removed/:supId", (req, res) => {
  const { supId } = req.params;
  const selectBankQuery = `SELECT supBank, supBankNo FROM delete_bank_supplier WHERE supId = ?`;

  db.query(selectBankQuery, [supId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching bank details" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "No bank details found for this supplier" });
    }
    return res.status(200).json(results[0]);
  });
});




// Update supplier status
router.put('/update_status/:supid', (req, res) => {
  const { supid } = req.params;
  const { status } = req.body;

  console.log(`Received request to update status for supid: ${supid} to ${status}`);

  // Validate if the status is either "active" or "inactive"
  if (status !== 'active' && status !== 'inactive') {
    return res.status(400).json({ message: 'Invalid status value. Must be "active" or "inactive".' });
  }

  const updateStatusQuery = `UPDATE suppliers SET status = ? WHERE supid = ?`;

  db.query(updateStatusQuery, [status, supid], (err, result) => {
    if (err) {
      console.error('Error updating supplier status:', err);
      return res.status(500).json({ message: 'Failed to update supplier status', error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.status(200).json({ message: 'Supplier status updated successfully' });
  });
});



// API to search suppliers based on various fields
router.get("/get_suppliers_stock", (req, res) => {
  const searchTerm = req.query.searchTerm || ""; // Get the search term from the query

  const query = `
    SELECT Supid, Supname, address1, email, mobile1, company, status, store 
    FROM suppliers
    WHERE 
      Supname LIKE ? OR
      mobile1 LIKE ? OR
      Supid LIKE ? OR
      company LIKE ?
  `;

  const searchValue = `%${searchTerm}%`; // Wrap the term in wildcards for partial matching
  db.query(query, [searchValue, searchValue, searchValue, searchValue], (err, results) => {
    if (err) {
      console.error("Error fetching suppliers:", err);
      return res.status(500).json({ message: "Error fetching suppliers" });
    }
    res.status(200).json(results); // Return matched suppliers
  });
});


// Route to update a supplier by ID
router.put("/update_supplier/:id", (req, res) => {
  const { id } = req.params;
  const {
    Supname,
    address1,
    address2,
    address3,
    email,
    idno,
    mobile1,
    mobile2,
    mobile3,
    company,
    faxnum,
    website,
    bankName,
    accountNumber,
  } = req.body;

  // Validate required fields
  if (!Supname) {
    return res.status(400).json({ message: "Supplier Name is required." });
  }

  // SQL query to update the supplier information
  const updateSupplierQuery = `
    UPDATE suppliers
    SET
      Supname = ?,
      address1 = ?,
      address2 = ?,
      address3 = ?,
      email = ?,
      idno = ?,
      mobile1 = ?,
      mobile2 = ?,
      mobile3 = ?,
      company = ?,
      faxnum = ?,
      website = ?
    WHERE Supid = ?
  `;

  // Parameters for the supplier query
  const supplierValues = [
    Supname,
    address1,
    address2,
    address3,
    email,
    idno,
    mobile1,
    mobile2,
    mobile3,
    company,
    faxnum,
    website,
    id,
  ];

  // Execute the supplier update query
  db.query(updateSupplierQuery, supplierValues, (err, results) => {
    if (err) {
      console.error("Error updating supplier:", err);
      return res.status(500).json({ message: "Error updating supplier." });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Supplier not found." });
    }

    // Check if bank details are provided before processing them
    if (bankName && accountNumber) {
      // Check if the new bank details are different from the existing ones
      const checkBankQuery = `
        SELECT * FROM banksupplier
        WHERE supId = ? AND supBank = ?
        ORDER BY saveTime DESC LIMIT 1
      `;

      db.query(checkBankQuery, [id, bankName], (err, bankResults) => {
        if (err) {
          console.error("Error checking bank details:", err);
          return res.status(500).json({ message: "Error checking bank details." });
        }

        // Log for debugging
        console.log("Bank check results:", bankResults);

        // If bank exists and account number differs, insert a new record
        if (bankResults.length > 0) {
          if (bankResults[0].supBankNo !== accountNumber) {
            console.log("Different account number detected. Inserting new bank details.");

            const insertBankQuery = `
              INSERT INTO banksupplier (supId, supName, supBank, supBankNo)
              VALUES (?, ?, ?, ?)
            `;

            const bankValues = [id, Supname, bankName, accountNumber];
            db.query(insertBankQuery, bankValues, (err) => {
              if (err) {
                console.error("Error inserting new bank details:", err);
                return res.status(500).json({ message: "Error inserting new bank details." });
              }

              return res.status(200).json({ message: "Supplier updated and new bank details added successfully." });
            });
          } else {
            console.log("Bank details are the same. No new data inserted.");
            return res.status(200).json({ message: "Supplier updated successfully. Bank details unchanged." });
          }
        } else {
          console.log("No existing bank record found. Adding new bank details.");

          const insertBankQuery = `
            INSERT INTO banksupplier (supId, supName, supBank, supBankNo)
            VALUES (?, ?, ?, ?)
          `;

          const bankValues = [id, Supname, bankName, accountNumber];
          db.query(insertBankQuery, bankValues, (err) => {
            if (err) {
              console.error("Error inserting new bank details:", err);
              return res.status(500).json({ message: "Error inserting new bank details." });
            }

            return res.status(200).json({ message: "Supplier updated and bank details added successfully." });
          });
        }
      });
    } else {
      // Skip inserting bank details if any value is null or empty
      console.log("Bank details are not provided or incomplete. Skipping bank data insertion.");
      return res.status(200).json({ message: "Supplier updated successfully. No bank details were added." });
    }
  });
});



// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/supplier_loan");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });



// Add Supplier Loan with File Upload
router.post("/add_loan", upload.single("file"), (req, res) => {
  const { supId, supName, loanAmount, billNumber, description, cashAmount } = req.body;
  const filePath = req.file ? req.file.path : null; // Save absolute path

  // Validation: Allow loanAmount = 0 but reject undefined or null
  if (!supId || !supName || loanAmount === undefined || loanAmount === null || !billNumber) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  // Generate a unique 5-character alphanumeric ID
  const generatedId = crypto.randomBytes(3).toString("hex").toUpperCase();

  const query = `
    INSERT INTO supplier_loan (generatedId, supId, supName, loanAmount, cashAmount, billNumber, description, filePath)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [generatedId, supId, supName, loanAmount, cashAmount || 0, billNumber, description, filePath],
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




// Serve Uploaded Files
router.get("/view_file", (req, res) => {
  const filePath = req.query.filePath;

  if (!filePath) {
    return res.status(400).json({ message: "File path is required." });
  }

  const absolutePath = path.resolve(filePath); // Resolve the path to an absolute path

  fs.access(absolutePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("Error accessing file:", err);
      return res.status(404).json({ message: "File not found." });
    }

    res.sendFile(absolutePath, (sendErr) => {
      if (sendErr) {
        console.error("Error sending file:", sendErr);
        return res.status(500).json({ message: "Error serving file." });
      }
    });
  });
});


router.get("/view_file_new", (req, res) => {
  const filePath = req.query.filePath;

  if (!filePath) {
    return res.status(400).json({ message: "File path is required." });
  }

  // Resolve path to the uploads directory
  const absolutePath = path.join(__dirname, "../", filePath);

  fs.access(absolutePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("Error accessing file:", err);
      return res.status(404).json({ message: "File not found." });
    }

    res.sendFile(absolutePath, (sendErr) => {
      if (sendErr) {
        console.error("Error sending file:", sendErr);
        return res.status(500).json({ message: "Error serving file." });
      }
    });
  });
});




// Update Supplier Loan
router.put("/update_supplier_loan/:id", (req, res) => {
  const { id } = req.params;
  const { loanAmount, description, billNumber, cashAmount } = req.body;

  const query = `
    UPDATE supplier_loan 
    SET loanAmount = ?, description = ?, billNumber = ?, cashAmount = ?
    WHERE id = ?
  `;
  db.query(query, [loanAmount, description, billNumber, cashAmount, id], (err, results) => {
    if (err) {
      console.error("Error updating supplier loan:", err);
      return res.status(500).json({ message: "Error updating loan." });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Loan not found." });
    }
    res.status(200).json({ message: "Loan updated successfully." });
  });
});





// Delete Supplier Loan and Associated File
// DELETE: Remove Supplier Loan if no related payments exist
router.delete("/delete_supplier_loan/:id", (req, res) => {
  const { id } = req.params;

  // Query to fetch all file paths associated with the generatedId
  const selectQuery = `
    SELECT 
      sl.filePath AS loanFilePath, 
      slp.filePath AS paymentFilePath,
      sl.generatedId AS generatedId
    FROM 
      supplier_loan sl
    LEFT JOIN 
      supplier_loan_payment slp 
    ON 
      sl.generatedId = slp.generatedId
    WHERE 
      sl.id = ?
  `;

  db.query(selectQuery, [id], async (err, results) => {
    if (err) {
      console.error("Error fetching loan details:", err);
      return res.status(500).json({ message: "Error fetching loan details." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Loan not found." });
    }

    // Check if any related payments exist
    const generatedId = results[0]?.generatedId;
    const paymentCheckQuery = "SELECT COUNT(*) AS paymentCount FROM supplier_loan_payment WHERE generatedId = ?";

    db.query(paymentCheckQuery, [generatedId], async (checkErr, checkResults) => {
      if (checkErr) {
        console.error("Error checking related payments:", checkErr);
        return res.status(500).json({ message: "Error checking related payments." });
      }

      const paymentCount = checkResults[0]?.paymentCount || 0;

      if (paymentCount > 0) {
        return res.status(400).json({
          message: "Cannot delete loan. Please delete payment history associated with this loan first.",
        });
      }

      // Collect unique file paths
      const filePaths = [...new Set(results.map((row) => row.loanFilePath || row.paymentFilePath))]
        .filter(Boolean); // Remove null or undefined file paths

      // Function to delete files
      const deleteFiles = async (paths) => {
        for (const filePath of paths) {
          const absolutePath = path.isAbsolute(filePath)
            ? filePath // Use as-is if already absolute
            : path.join(__dirname, "../", filePath); // Prepend base path if relative

          try {
            await fs.promises.unlink(absolutePath);
            console.log(`Deleted file: ${absolutePath}`);
          } catch (error) {
            if (error.code === "ENOENT") {
              console.warn(`File not found, skipping: ${absolutePath}`);
            } else if (error.code === "EPERM") {
              console.error(`Permission denied for file: ${absolutePath}`);
            } else {
              console.error("Error deleting file:", error);
            }
          }
        }
      };

      // Function to delete loan record
      const deleteLoan = () => {
        return new Promise((resolve, reject) => {
          const deleteLoanQuery = "DELETE FROM supplier_loan WHERE id = ?";
          db.query(deleteLoanQuery, [id], (deleteErr, deleteResults) => {
            if (deleteErr) {
              console.error("Error deleting loan:", deleteErr);
              return reject("Error deleting loan.");
            }
            if (deleteResults.affectedRows === 0) {
              return reject("Loan not found.");
            }
            resolve();
          });
        });
      };

      try {
        await deleteFiles(filePaths); // Step 1: Delete all files
        await deleteLoan(); // Step 2: Delete the loan

        res.status(200).json({
          message: "Loan and associated files deleted successfully.",
        });
      } catch (error) {
        console.error("Error deleting loan and related records:", error);
        res.status(500).json({ message: error });
      }
    });
  });
});



// Get Supplier Loans
router.get("/get_loans_supplier_loan/:supplierId", (req, res) => {
  const { supplierId } = req.params;
  const query = `
    SELECT id, generatedId, supId, supName, loanAmount, cashAmount,totalAmount, billNumber, description, filePath, saveTime
    FROM supplier_loan
    WHERE supId = ?
  `;

  db.query(query, [supplierId], (err, results) => {
    if (err) {
      console.error("Error fetching loans:", err);
      return res.status(500).json({ message: "Error fetching loans." });
    }

    const formattedResults = results.map((loan) => ({
      ...loan,
      saveTime: loan.saveTime
        ? moment(loan.saveTime).format("YYYY-MM-DD HH:mm:ss")
        : "N/A",
    }));

    res.status(200).json(formattedResults);
  });
});




//loan by date
router.get("/get_loans_by_date/:supplierId", (req, res) => {
  const { supplierId } = req.params;
  const { startDate, endDate, settlementStatus } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Start and end dates are required." });
  }

  let query = `
    SELECT * FROM supplier_loan
    WHERE supId = ?
    AND saveTime BETWEEN ? AND ?
  `;

  // Apply settlement filter if specified
  if (settlementStatus === "Settled") {
    query += " AND loanAmount = 0";
  } else if (settlementStatus === "Unsettled") {
    query += " AND loanAmount > 0";
  }

  db.query(query, [supplierId, startDate, endDate], (err, results) => {
    if (err) {
      console.error("Error fetching loans by date:", err);
      return res.status(500).json({ message: "Error fetching loans by date." });
    }

    const formattedResults = results.map((loan) => ({
      ...loan,
      saveTime: loan.saveTime ? moment(loan.saveTime).format("YYYY-MM-DD HH:mm:ss") : "N/A",
    }));

    res.status(200).json(formattedResults);
  });
});




//add supplier loan payment
router.post("/add_supplier_loan_payment", upload.single("file"), async (req, res) => {
  const { generatedId, paymentAmount, referenceNumber, paymentType, chequeDate } = req.body;
  const filePath = req.file ? `/uploads/supplier_loan/${req.file.filename}` : null;

  if (!generatedId || !paymentAmount || !referenceNumber || !paymentType) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  if (!["Direct", "Cheque"].includes(paymentType)) {
    return res.status(400).json({ message: "Invalid payment type." });
  }

  try {
    const query = `
      INSERT INTO supplier_loan_payment (generatedId, paymentAmount, referenceNumber, filePath, paymentType, chequeDate)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await db.query(query, [
      generatedId,
      paymentAmount,
      referenceNumber,
      filePath,
      paymentType,
      chequeDate || null,
    ]);

    res.json({ message: "Payment record added successfully." });
  } catch (error) {
    console.error("Error adding supplier_loan_payment:", error);
    res.status(500).json({ message: "Failed to add payment record." });
  }
});





// Route to fetch payment history for a specific generatedId
router.get("/get_loan_payment_history/:generatedId", (req, res) => {
  const { generatedId } = req.params;

  const query = `
    SELECT id, paymentAmount, referenceNumber, saveTime, filePath
    FROM supplier_loan_payment
    WHERE generatedId = ?
    ORDER BY saveTime DESC
  `;

  db.query(query, [generatedId], (err, results) => {
    if (err) {
      console.error("Error fetching payment history:", err);
      return res.status(500).json({ message: "Error fetching payment history." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No payment history found for the specified ID." });
    }

    res.status(200).json(results);
  });
});



router.delete("/delete_loan_with_related/:generatedId", async (req, res) => {
  const { generatedId } = req.params;

  if (!generatedId) {
    return res.status(400).json({ message: "Missing required parameter: generatedId" });
  }

  let connection;

  try {
    // Get a connection from the pool
    connection = await db.getConnection();

    // Start a transaction
    await connection.beginTransaction();

    // Delete related records from `supplier_loan_payment`
    await connection.query(
      "DELETE FROM supplier_loan_payment WHERE generatedId = ?",
      [generatedId]
    );

    // Delete the record from `supplier_loan`
    await connection.query(
      "DELETE FROM supplier_loan WHERE generatedId = ?",
      [generatedId]
    );

    // Commit the transaction
    await connection.commit();

    res.status(200).json({ message: "Records deleted successfully." });
  } catch (error) {
    console.error("Error deleting records:", error);

    // Rollback the transaction in case of error
    if (connection) {
      await connection.rollback();
    }

    res.status(500).json({ message: "Failed to delete records." });
  } finally {
    // Release the connection
    if (connection) {
      connection.release();
    }
  }
});




// DELETE: Remove payment and update supplier_loan
router.delete("/delete_supplier_payment/:paymentId", (req, res) => {
  const { paymentId } = req.params;

  const selectQuery = "SELECT filePath, generatedId FROM supplier_loan_payment WHERE id = ?";
  const deleteQuery = "DELETE FROM supplier_loan_payment WHERE id = ?";
  const updateLoanQuery = `
    UPDATE supplier_loan 
    SET loanAmount = loanAmount + ?, cashAmount = cashAmount - ?
    WHERE generatedId = ?
  `;

  db.query(selectQuery, [paymentId], async (selectErr, selectResults) => {
    if (selectErr) {
      console.error("Error fetching payment details:", selectErr);
      return res.status(500).json({ message: "Error fetching payment details." });
    }

    if (selectResults.length === 0) {
      return res.status(404).json({ message: "Payment not found." });
    }

    const { filePath, generatedId } = selectResults[0];
    console.log("File path to delete:", filePath);
    console.log("Generated ID:", generatedId);

    // Attempt to delete the file if filePath exists
    if (filePath) {
      const absolutePath = path.isAbsolute(filePath)
        ? filePath
        : path.join(__dirname, "../", filePath);

      console.log("Attempting to delete file at:", absolutePath);

      try {
        await fs.promises.unlink(absolutePath);
        console.log("File deleted successfully:", absolutePath);
      } catch (fileErr) {
        if (fileErr.code === "ENOENT") {
          console.warn(`File not found, skipping deletion: ${absolutePath}`);
        } else {
          console.error("Error deleting file:", fileErr);
        }
      }
    }

    // Delete the payment record
    db.query(deleteQuery, [paymentId], (deleteErr) => {
      if (deleteErr) {
        console.error("Error deleting payment record:", deleteErr);
        return res.status(500).json({ message: "Error deleting payment record." });
      }

      // Update supplier_loan table
      const paymentAmount = parseFloat(req.body.paymentAmount || 0); // Ensure paymentAmount is a valid number
      db.query(updateLoanQuery, [paymentAmount, paymentAmount, generatedId], (updateErr) => {
        if (updateErr) {
          console.error("Error updating supplier_loan table:", updateErr);
          return res.status(500).json({ message: "Error updating loan details." });
        }

        console.log("Loan updated successfully for generatedId:", generatedId);
        res.status(200).json({ message: "Payment and related file deleted successfully." });
      });
    });
  });
});


// Export Router
module.exports = router;
